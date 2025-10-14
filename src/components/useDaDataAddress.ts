import { ref } from 'vue'
import type { DaDataAddress, DaDataSuggestion } from 'react-dadata'
import { fetchDaDataSuggestionsAddress } from './DadataApi'

const DEFAULT_ADDRESS_DELAY = 1000
const DEFAULT_MIN_CHARS = 3

/**
 * Возвращает логику получения подсказок адреса DaData
 *
 * :param minChars: минимальная длина поисковой строки
 * :return: функции и значения для интеграции с SelectElement
 */
export function useDaDataAddress(minChars: number = DEFAULT_MIN_CHARS) {
  // Использует AbortController для отмены предыдущих запросов при новом вводе
  const abortControllerRef = ref<AbortController | null>(null)

  /**
   * Получает элементы подсказок адреса для SelectElement
   *
   * :param searchQuery: строка поиска, вводимая пользователем
   * :return: массив элементов с полями value/label
   */
  async function getAddressItems(searchQuery: string) {
    console.log('[DaData] getAddressItems called', { searchQuery })

    if (abortControllerRef.value) {
      console.log('[DaData] Aborting previous request')
      abortControllerRef.value.abort()
    }

    const controller = new AbortController()
    abortControllerRef.value = controller
    console.log('[DaData] New AbortController created')

    if (!searchQuery || searchQuery.trim().length < minChars) {
      console.log('[DaData] Query too short, skip fetch', { length: searchQuery?.trim().length || 0 })
      return []
    }

    try {
      console.log('[DaData] Fetching suggestions...', { query: searchQuery })
      const { suggestions } = await fetchDaDataSuggestionsAddress(controller.signal, { query: searchQuery })
      const count = suggestions?.length ?? 0
      console.log('[DaData] Suggestions received', { count })
      console.log(suggestions)
      return (suggestions ?? []).map((s: DaDataSuggestion<DaDataAddress>) => ({
        value: s.data,
        label: s.value,
      }))
    } catch (err) {
      if (controller.signal.aborted) {
        console.log('[DaData] Request aborted')
        return []
      }
      console.error('[DaData] Error while fetching suggestions', err)
      return []
    }
  }

  return {
    getAddressItems,
    ADDRESS_DELAY: DEFAULT_ADDRESS_DELAY,
  }
}


