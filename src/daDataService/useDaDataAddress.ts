import { ref } from 'vue';
import type { DaDataAddress, DaDataSuggestion } from 'react-dadata';
import { fetchDaDataSuggestionsAddress } from '@/daDataService/DadataApi';

const DEFAULT_ADDRESS_DELAY = 1000;
const DEFAULT_MIN_CHARS = 3;

/**
 * Возвращает логику получения подсказок адреса DaData
 *
 * @param minChars - Минимальная длина поисковой строки
 * @returns Функции и значения для интеграции с SelectElement
 */
export function useDaDataAddress(minChars: number = DEFAULT_MIN_CHARS) {
  // Использует AbortController для отмены предыдущих запросов при новом вводе
  const abortControllerRef = ref<AbortController | null>(null);
  // Отслеживает текущий запрос для предотвращения race condition
  const currentQueryRef = ref<string | null>(null);

  /**
   * Получает элементы подсказок адреса для SelectElement
   *
   * @param searchQuery - Строка поиска, вводимая пользователем
   * @returns Массив элементов с полями value/label
   */
  async function getAddressItems(searchQuery: string) {
    if (abortControllerRef.value) {
      abortControllerRef.value.abort();
    }

    const controller = new AbortController();
    abortControllerRef.value = controller;
    currentQueryRef.value = searchQuery;

    if (!searchQuery || searchQuery.trim().length < minChars) {
      return [];
    }

    try {
      const { suggestions } = await fetchDaDataSuggestionsAddress(
        controller.signal,
        { query: searchQuery }
      );

      // Проверяет, что запрос не был отменен и это все еще актуальный запрос
      if (controller.signal.aborted || currentQueryRef.value !== searchQuery) {
        return [];
      }

      return (suggestions ?? []).map((s: DaDataSuggestion<DaDataAddress>) => ({
        value: s.data,
        label: s.value,
      }));
    } catch (err) {
      if (controller.signal.aborted || currentQueryRef.value !== searchQuery) {
        return [];
      }
      console.error('[DaData] Error while fetching suggestions', err);
      return [];
    }
  }

  return {
    getAddressItems,
    ADDRESS_DELAY: DEFAULT_ADDRESS_DELAY,
  };
}
