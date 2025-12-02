import type { MessageApi } from 'naive-ui';
import { ApiNetworkError, ApiHttpError } from '../api';

/**
 * Глобальный экземпляр message API для показа уведомлений.
 * Устанавливается при инициализации приложения.
 */
let globalMessageApi: MessageApi | null = null;

/**
 * Очередь ошибок, которые нужно показать после инициализации message API.
 */
const errorQueue: unknown[] = [];

/**
 * Устанавливает глобальный экземпляр message API.
 *
 * @param messageApi экземпляр message API из useMessage()
 */
export function setGlobalMessageApi(messageApi: MessageApi): void {
  globalMessageApi = messageApi;
  
  // Показываем все накопленные ошибки
  while (errorQueue.length > 0) {
    const error = errorQueue.shift();
    if (error) {
      handleApiError(error);
    }
  }
}

/**
 * Обрабатывает ошибки API и показывает уведомления пользователю.
 *
 * @param error ошибка, которую нужно обработать
 * @param defaultMessage сообщение по умолчанию, если не удалось определить тип ошибки
 */
export function handleApiError(
  error: unknown,
  defaultMessage = 'Произошла ошибка при выполнении запроса',
): void {
  if (!globalMessageApi) {
    // Если message API ещё не инициализирован, добавляем ошибку в очередь
    errorQueue.push(error);
    return;
  }

  if (error instanceof ApiNetworkError) {
    globalMessageApi.error(error.message, {
      duration: 5000,
      closable: true,
    });
  } else if (error instanceof ApiHttpError) {
    globalMessageApi.error(error.message, {
      duration: 5000,
      closable: true,
    });
  } else if (error instanceof Error) {
    globalMessageApi.error(error.message || defaultMessage, {
      duration: 5000,
      closable: true,
    });
  } else {
    globalMessageApi.error(defaultMessage, {
      duration: 5000,
      closable: true,
    });
  }
}

