import { defineStore } from 'pinia';
import { apiFetch } from '../api';

interface UserInfo {
  username: string;
  authorities: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  isLoading: boolean;
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

        if (!response.ok) {
          const error = await response
            .json()
            .catch(() => ({ error: 'Login failed' }));
          throw new Error(error.error || 'Неверные логин или пароль');
        }

        const data = await response.json();
        this.isAuthenticated = true;
        this.user = {
          username: data.username,
          authorities: data.authorities || [],
        };
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
        const response = await apiFetch('/api/v1/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const message =
            (await response.text().catch(() => '')) ||
            'Не удалось создать аккаунт';
          throw new Error(message);
        }
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Проверяет текущую сессию и загружает информацию о пользователе.
     */
    async checkAuth(): Promise<void> {
      this.isLoading = true;
      try {
        const response = await apiFetch('/api/v1/auth/me', {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          this.isAuthenticated = true;
          this.user = {
            username: data.username,
            authorities: data.authorities || [],
          };
        } else {
          this.isAuthenticated = false;
          this.user = null;
        }
      } catch {
        this.isAuthenticated = false;
        this.user = null;
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
        // Игнорируем ошибки при выходе
      } finally {
        this.isAuthenticated = false;
        this.user = null;
        this.isLoading = false;
      }
    },
  },
});
