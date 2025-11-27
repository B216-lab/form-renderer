/**
 * Базовый URL API бэкенда.
 * Может быть переопределён через переменную окружения.
 */
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

/**
 * Выполняет запрос к API с автоматическим добавлением credentials для сессий.
 * Все запросы отправляют cookies (JSESSIONID) для поддержки сессий Spring Boot.
 *
 * @param path путь к эндпоинту (например, '/api/v1/auth/login')
 * @param options опции запроса (метод, заголовки, тело и т.д.)
 * @returns Promise с Response объектом
 */
export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;

  const headers = new Headers(options.headers || {});

  // Устанавливаем Content-Type для JSON, если не указан и есть тело
  if (
    options.body &&
    !headers.has('Content-Type') &&
    typeof options.body === 'string'
  ) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Критично: отправляет и получает cookies (JSESSIONID)
  });

  // Если получили 401, пользователь не авторизован
  if (response.status === 401) {
    const authStore = await import('./stores/authStore').then((m) =>
      m.useAuthStore(),
    );
    authStore.isAuthenticated = false;
    authStore.user = null;
  }

  return response;
}

