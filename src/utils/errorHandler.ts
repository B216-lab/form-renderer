import {
  ApiNetworkError,
  ApiHttpError,
  ApiInternalNetworkError,
  ApiInternalHttpError,
} from '../api';

interface MessageApiLike {
  error: (
    message: string,
    options?: {
      duration?: number;
      closable?: boolean;
    }
  ) => void;
}

/**
 * Глобальный экземпляр message API для показа уведомлений.
 * Устанавливается при инициализации приложения.
 */
let globalMessageApi: MessageApiLike | null = null;

/**
 * Очередь ошибок, которые нужно показать после инициализации message API.
 */
const errorQueue: unknown[] = [];

/**
 * Устанавливает глобальный экземпляр message API.
 *
 * @param messageApi экземпляр message API
 */
export function setGlobalMessageApi(messageApi: MessageApiLike): void {
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
  defaultMessage = 'Произошла ошибка при выполнении запроса'
): void {
  // Внутренние (сервисные) ошибки: не показываем пользователю и не логируем,
  // так как они не влияют на текущий UX
  if (
    error instanceof ApiInternalNetworkError ||
    error instanceof ApiInternalHttpError
  ) {
    return;
  }

  if (!globalMessageApi) {
    // Если message API ещё не инициализирован, добавляем ошибку в очередь
    errorQueue.push(error);
    return;
  }

  const defaultDuration = 5000;

  if (error instanceof ApiNetworkError) {
    globalMessageApi.error(error.message, {
      duration: defaultDuration,
      closable: true,
    });
  } else if (error instanceof ApiHttpError) {
    globalMessageApi.error(error.message, {
      duration: defaultDuration,
      closable: true,
    });
  } else if (error instanceof Error) {
    globalMessageApi.error(error.message || defaultMessage, {
      duration: defaultDuration,
      closable: true,
    });
  } else {
    globalMessageApi.error(defaultMessage, {
      duration: defaultDuration,
      closable: true,
    });
  }
}
