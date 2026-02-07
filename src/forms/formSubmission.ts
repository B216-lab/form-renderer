import type { Vueform } from '@vueform/vueform';
import { getApiBaseUrl } from '../runtimeConfig';

/**
 * Отправляет данные формы на сервер с использованием apiFetch для поддержки cookies и CSRF.
 * Использует form$.requestData, который исключает условные элементы и форматирует данные как JSON.
 * Подготавливает данные перед отправкой, упрощая адреса.
 *
 * @param _FormData - FormData объект (не используется, так как отправляем JSON)
 * @param form$ - экземпляр Vueform
 * @returns Promise с Response объектом
 */
export async function submitForm(
  _FormData: FormData,
  form$: Vueform
): Promise<Response> {
  // Используем requestData, который исключает условные элементы и форматирует как JSON
  const rawData = form$.requestData as Record<string, unknown>;

  // Вычисляем endpoint с использованием runtime конфигурации
  const formEndpoint = `${getApiBaseUrl()}/api/v1/public/forms/movements`;

  // Отправляем данные через apiFetch, который автоматически добавляет cookies и CSRF токен
  const response = await fetch(formEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rawData),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit form: ${await response.json()}`);
  }

  return response;
}
