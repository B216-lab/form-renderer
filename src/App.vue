<template>
<Vueform ref="form$">
  <SelectElement name="address" :search="true" :delay="1000" :filter-results="false"
  :items="getAddressItems"
  />
</Vueform>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { DaDataAddress, DaDataSuggestion } from 'react-dadata'
import { fetchDaDataSuggestionsAddress } from './components/DadataApi'

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
  // Отменить предыдущий незавершённый запрос
  if (abortControllerRef.value) {
    console.log('[DaData] Aborting previous request')
    abortControllerRef.value.abort()
  }

  const controller = new AbortController()
  abortControllerRef.value = controller
  console.log('[DaData] New AbortController created')

  // Минимальная длина запроса для снижения шума
  if (!searchQuery || searchQuery.trim().length < 3) {
    console.log('[DaData] Query too short, skip fetch', { length: searchQuery?.trim().length || 0 })
    return []
  }

  try {
    console.log('[DaData] Fetching suggestions...', { query: searchQuery })
    const { suggestions } = await fetchDaDataSuggestionsAddress(controller.signal, { query: searchQuery })
    const count = suggestions?.length ?? 0
    console.log('[DaData] Suggestions received', { count })
    return (suggestions ?? []).map((s: DaDataSuggestion<DaDataAddress>) => ({
      value: s.value,
      label: s.value,
    }))
  } catch (err) {
    if (controller.signal.aborted) {
      console.log('[DaData] Request aborted')
      return []
    }
    // В случае ошибки возвращать пустой список без выбрасывания исключения
    console.error('[DaData] Error while fetching suggestions', err)
    return []
  }
}
</script>

