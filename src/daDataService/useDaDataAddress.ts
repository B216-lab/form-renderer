import { ref } from 'vue'
import type { DaDataAddress, DaDataSuggestion } from 'react-dadata'
import { fetchDaDataSuggestionsAddress } from '@/daDataService/DadataApi'
import { logger } from '@/logger'

const DEFAULT_ADDRESS_DELAY = 1000
const DEFAULT_MIN_CHARS = 3

/**
 * Возвращает логику получения подсказок адреса DaData
 *
 * @param minChars - Минимальная длина поисковой строки
 * @returns Функции и значения для интеграции с SelectElement
 */
export function useDaDataAddress(minChars: number = DEFAULT_MIN_CHARS) {
  // Использует AbortController для отмены предыдущих запросов при новом вводе
  const abortControllerRef = ref<AbortController | null>(null)

  /**
   * Получает элементы подсказок адреса для SelectElement
   *
   * @param searchQuery - Строка поиска, вводимая пользователем
   * @returns Массив элементов с полями value/label
   */
  async function getAddressItems(searchQuery: string) {
    logger.debug('[DaData] getAddressItems called', { searchQuery })

    if (abortControllerRef.value) {
      logger.debug('[DaData] Aborting previous request')
      abortControllerRef.value.abort()
    }

    const controller = new AbortController()
    abortControllerRef.value = controller
    logger.verbose('[DaData] New AbortController created')

    if (!searchQuery || searchQuery.trim().length < minChars) {
      logger.info('[DaData] Query too short, skip fetch', { length: searchQuery?.trim().length || 0 })
      return []
    }

    try {
      logger.debug('[DaData] Fetching suggestions...', { query: searchQuery })
      const { suggestions } = await fetchDaDataSuggestionsAddress(controller.signal, { query: searchQuery })
      const count = suggestions?.length ?? 0
      logger.info('[DaData] Suggestions received', { count })
      logger.verbose('[DaData] Suggestions payload', suggestions)
      return (suggestions ?? []).map((s: DaDataSuggestion<DaDataAddress>) => ({
        value: s.data,
        label: s.value,
      }))
    } catch (err) {
      if (controller.signal.aborted) {
        logger.warn('[DaData] Request aborted')
        return []
      }
      logger.error('[DaData] Error while fetching suggestions', err)
      return []
    }
  }

  return {
    getAddressItems,
    ADDRESS_DELAY: DEFAULT_ADDRESS_DELAY,
  }
}


