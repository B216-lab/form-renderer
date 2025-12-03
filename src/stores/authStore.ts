import { defineStore } from 'pinia';
import { apiFetch, ApiNetworkError, ApiHttpError } from '../api';
import { handleApiError } from '../utils/errorHandler';

interface UserInfo {
  username: string;
  authorities: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  isLoading: boolean;
  lastNetworkError: Error | null;
}

/**
 * Store для управления состоянием аутентификации пользователя.
 * Использует HTTP-сессии Spring Boot (JSESSIONID cookie).
 */
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    user: null,
    isLoading: false,
    lastNetworkError: null,
  }),

  getters: {
    hasRole: (state) => (role: string) => {
      if (!state.user) return false;
      return state.user.authorities.some(
        (auth) => auth === `ROLE_${role}` || auth === role
      );
    },
  },

  actions: {
    /**
     * Выполняет вход пользователя и создаёт сессию на сервере.
     *
     * @param email email пользователя
     * @param password пароль пользователя
     * @throws Error если вход не удался
     */
    async login(email: string, password: string): Promise<void> {
      this.isLoading = true;
      try {
        const response = await apiFetch('/api/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        this.isAuthenticated = true;
        this.user = {
          username: data.username,
          authorities: data.authorities || [],
        };
      } catch (error) {
        // Если это ошибка сети или HTTP, показываем уведомление
        if (error instanceof ApiNetworkError || error instanceof ApiHttpError) {
          handleApiError(error);
          // Для ошибок сети/HTTP пробрасываем дальше с понятным сообщением
          throw error;
        }
        // Для других ошибок (например, неверные учетные данные) пробрасываем как есть
        const errorData =
          error instanceof Error ? error : { error: 'Login failed' };
        throw new Error(
          errorData instanceof Error && errorData.message
            ? errorData.message
            : 'Неверные логин или пароль'
        );
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Создаёт нового пользователя на сервере.
     *
     * @param email email пользователя
     * @param password пароль пользователя
     * @throws Error если регистрация не удалась
     */
    async register(email: string, password: string): Promise<void> {
      this.isLoading = true;
      try {
        await apiFetch('/api/v1/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
      } catch (error) {
        // Если это ошибка сети или HTTP, показываем уведомление
        if (error instanceof ApiNetworkError || error instanceof ApiHttpError) {
          handleApiError(error);
          throw error;
        }
        // Для других ошибок пробрасываем как есть
        const message =
          error instanceof Error ? error.message : 'Не удалось создать аккаунт';
        throw new Error(message);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Проверяет текущую сессию и загружает информацию о пользователе.
     */
    async checkAuth(): Promise<void> {
      this.isLoading = true;
      this.lastNetworkError = null;
      try {
        const response = await apiFetch('/api/v1/auth/me', {
          method: 'GET',
        });

        const data = await response.json();
        this.isAuthenticated = true;
        this.user = {
          username: data.username,
          authorities: data.authorities || [],
        };
      } catch (error) {
        this.isAuthenticated = false;
        this.user = null;

        // Сохраняем сетевые ошибки для показа после инициализации приложения
        if (error instanceof ApiNetworkError || error instanceof ApiHttpError) {
          this.lastNetworkError = error;
        }
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Выполняет выход пользователя и инвалидирует сессию.
     */
    async logout(): Promise<void> {
      this.isLoading = true;
      try {
        await apiFetch('/api/v1/auth/logout', {
          method: 'POST',
        });
      } catch {
        // При выходе не показываем ошибки, даже если сервер недоступен
        // Пользователь все равно должен иметь возможность выйти локально
      } finally {
        this.isAuthenticated = false;
        this.user = null;
        this.isLoading = false;
      }
    },

    /**
     * Запрашивает одноразовый токен входа для указанного email.
     * В ответе возвращает только время его истечения.
     */
    async requestOneTimeToken(email: string): Promise<{ expiresAt: string }> {
      this.isLoading = true;
      try {
        const response = await apiFetch('/api/v1/auth/ott', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        return {
          expiresAt: data.expiresAt as string,
        };
      } catch (error) {
        if (error instanceof ApiNetworkError || error instanceof ApiHttpError) {
          handleApiError(error);
          throw error;
        }
        const message =
          error instanceof Error
            ? error.message
            : 'Не удалось запросить одноразовый токен';
        throw new Error(message);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Выполняет вход по одноразовому токену.
     *
     * @param token одноразовый токен входа
     * @throws Error если вход не удался
     */
    async loginWithOneTimeToken(token: string): Promise<void> {
      this.isLoading = true;
      try {
        const response = await apiFetch('/api/v1/auth/submit-ott', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        this.isAuthenticated = true;
        this.user = {
          username: data.username,
          authorities: data.authorities || [],
        };
      } catch (error) {
        if (error instanceof ApiNetworkError || error instanceof ApiHttpError) {
          handleApiError(error);
          throw error;
        }
        const message =
          error instanceof Error
            ? error.message
            : 'Не удалось выполнить вход по одноразовому токену';
        throw new Error(message);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
