import { z } from 'zod';
import { ru } from 'zod/locales';

/**
 * Настраивает русскую локализацию для Zod.
 * Все сообщения об ошибках валидации будут отображаться на русском языке.
 */
export function setupZodRussianLocale(): void {
  z.setErrorMap(ru());
}
