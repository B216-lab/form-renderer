import { Validator } from '@vueform/vueform';
import type { DaDataAddressSuggestion } from 'react-dadata';

export function validateAddressHasHouse(
  suggestion: DaDataAddressSuggestion | null
): boolean {
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

export const precise = class extends Validator {
  check(suggestion: DaDataAddressSuggestion | null) {
    return validateAddressHasHouse(suggestion);
  }
  get msg() {
    return 'Адрес должен содержать номер дома';
  }
};
