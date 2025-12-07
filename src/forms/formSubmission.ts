import type { Vueform } from '@vueform/vueform';
import { apiFetch } from '@/api';
import { prepareFormData } from './addressUtils';

const FORM_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL}/api/v1/forms/movements`;

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

  // Подготавливаем данные: упрощаем адреса
  const preparedData = prepareFormData(rawData);

  // Отправляем данные через apiFetch, который автоматически добавляет cookies и CSRF токен
  const response = await apiFetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preparedData),
  });

  return response;
}

