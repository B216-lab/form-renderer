/**
 * Базовый URL API бэкенда.
 * Может быть переопределён через переменную окружения.
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

/**
 * Сбрасывает кеш CSRF-токена, чтобы при следующем запросе
 * он был заново получен с сервера.
 */
export function resetCsrfTokenCache(): void {
  // CSRF может быть отключён на сервере (публичный режим). Функция оставлена для обратной совместимости.
}

/**
 * Класс ошибки для сетевых ошибок API.
 */
export class ApiNetworkError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiNetworkError';
  }
}

/**
 * Внутренняя сетевая ошибка API
 */
export class ApiInternalNetworkError extends ApiNetworkError {
  constructor(message: string, originalError?: unknown) {
    super(message, originalError);
    this.name = 'ApiInternalNetworkError';
  }
}

/**
 * Класс ошибки для HTTP ошибок API.
 */
export class ApiHttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly statusText: string
  ) {
    super(message);
    this.name = 'ApiHttpError';
  }
}

/**
 * Внутренняя HTTP-ошибка API
 */
export class ApiInternalHttpError extends ApiHttpError {
  constructor(message: string, status: number, statusText: string) {
    super(message, status, statusText);
    this.name = 'ApiInternalHttpError';
  }
}

/**
 * Выполняет запрос к API с автоматическим добавлением credentials для сессий.
 * Все запросы отправляют cookies (JSESSIONID) для поддержки сессий Spring Boot.
 *
 * @param path путь к эндпоинту (например, '/api/v1/auth/login')
 * @param options опции запроса (метод, заголовки, тело и т.д.)
 * @returns Promise с Response объектом
 * @throws ApiNetworkError если произошла сетевая ошибка (сервер недоступен)
 * @throws ApiHttpError если получен HTTP статус ошибки (4xx, 5xx)
 */
export async function apiFetch(
  path: string,
  options: RequestInit = {}
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

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });
  } catch (error) {
    // Сетевая ошибка (сервер недоступен, таймаут и т.д.)
    // fetch выбрасывает TypeError для NS_ERROR_CONNECTION_REFUSED и подобных ошибок
    const errorMessage =
      error instanceof TypeError
        ? 'Не удалось подключиться к серверу. Проверьте, что сервер запущен.'
        : 'Ошибка сети при подключении к серверу. Проверьте, что сервер запущен.';
    throw new ApiNetworkError(errorMessage, error);
  }

  // Если получили ошибку HTTP (4xx, 5xx), выбрасываем исключение
  if (!response.ok) {
    let errorMessage = `Ошибка сервера: ${response.status} ${response.statusText}`;

    if (response.status === 404) {
      errorMessage =
        'Сервер недоступен или эндпоинт не найден. Проверьте, что сервер запущен.';
    } else if (response.status >= 500) {
      errorMessage = 'Внутренняя ошибка сервера. Попробуйте позже.';
    }

    throw new ApiHttpError(errorMessage, response.status, response.statusText);
  }

  return response;
}
