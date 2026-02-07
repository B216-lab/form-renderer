/**
 * Интерфейс для глобального объекта конфигурации приложения.
 * Заполняется из env.js, который генерируется в контейнере при старте.
 */
interface AppConfig {
  VITE_API_BASE_URL?: string;
}

declare global {
  interface Window {
    __APP_CONFIG__?: AppConfig;
  }
}

/**
 * Получает базовый URL API из runtime конфигурации или fallback к build-time значению.
 * Runtime конфигурация имеет приоритет, что позволяет переопределять значения
 * через переменные окружения Docker без пересборки образа.
 *
 * @returns Базовый URL API (без завершающего слеша)
 */
export function getApiBaseUrl(): string {
  // Сначала проверяем runtime конфигурацию из env.js
  const runtimeUrl = window.__APP_CONFIG__?.VITE_API_BASE_URL;
  if (runtimeUrl && runtimeUrl.trim() !== '') {
    // Убираем завершающий слеш, если есть
    return runtimeUrl.trim().replace(/\/+$/, '');
  }

  // Fallback к build-time значению из import.meta.env
  const buildTimeUrl =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
  return buildTimeUrl.toString().trim().replace(/\/+$/, '');
}
