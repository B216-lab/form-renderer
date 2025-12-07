import { nextTick } from 'vue';
import type { Vueform } from '@vueform/vueform';
import { useFormsStore } from './formDataStore';

/**
 * Загружает сохранённую форму из localStorage, включая все шаги (включая movements).
 *
 * @param form$ - экземпляр Vueform
 * @returns true, если форма была успешно загружена, false в противном случае
 */
export async function loadStoredForm(form$: {
  value: Vueform | null;
}): Promise<boolean> {
  const storedForm: string | null = localStorage.getItem('form');
  if (!storedForm) return false;

  try {
    const parsedData = JSON.parse(storedForm) as Record<string, unknown>;

    // Ждём, пока форма полностью инициализируется
    await nextTick();

    if (!form$.value) {
      console.warn('[DayMovements] Form not ready after nextTick, waiting...');
      await new Promise((resolve) => setTimeout(resolve, 200));
      if (!form$.value) {
        console.error('[DayMovements] Form still not ready');
        return false;
      }
    }

    // Сначала устанавливаем данные в store (для синхронизации с v-model)
    // Store должен быть доступен только внутри функции, вызываемой из компонента
    const store = useFormsStore();
    store.dayMovements = { ...store.dayMovements, ...parsedData };

    // Затем загружаем через метод load() для полной инициализации формы
    // @ts-expect-error - parsedData is a valid object (no idea why it's working against docs)
    await form$.value.load(parsedData);

    // Проверяем, что данные загрузились
    await nextTick();

    return true;
  } catch (error) {
    console.error('[DayMovements] Error loading stored form:', error);
    localStorage.removeItem('form');
    return false;
  }
}

/**
 * Настраивает слушатель изменений формы для сохранения в localStorage.
 *
 * @param form$ - экземпляр Vueform
 */
export function setupFormChangeListener(form$: {
  value: Vueform | null;
}): void {
  if (!form$.value) return;

  form$.value.on('change', () => {
    if (form$.value) {
      localStorage.setItem('form', JSON.stringify(form$.value.data));
    }
  });
}
