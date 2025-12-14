import type { Vueform } from '@vueform/vueform';

/**
 * Предзаполняет форму данными из профиля пользователя.
 *
 * Публичный режим: профиль пользователя не используется, вход не требуется.
 *
 * @param form$ экземпляр Vueform
 */
export async function prefillFromProfile(
  form$: { value: Vueform | null },
  _data: { value: Record<string, unknown> },
  _getAddressItems: (query: string) => Promise<unknown[]>
): Promise<void> {
  if (!form$.value) return;
}
