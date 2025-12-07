import { Validator } from '@vueform/vueform';
import type { DaDataAddressSuggestion } from 'react-dadata';

/**
 * Валидатор для проверки, что адрес содержит номер дома.
 */
export const precise = class extends Validator {
  check(suggestion: DaDataAddressSuggestion | null) {
    const address = suggestion?.data;
    if (
      !address ||
      typeof address !== 'object' ||
      !('house' in address) ||
      !address.house
    ) {
      return false;
    }
    return true;
  }
  get msg() {
    return 'Адрес должен содержать номер дома';
  }
};

