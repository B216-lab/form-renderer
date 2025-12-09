import { describe, it, expect } from 'vitest';
import { validateAddressHasHouse } from '../validators';
import type { DaDataAddressSuggestion } from 'react-dadata';

describe('validators', () => {
  describe('validateAddressHasHouse', () => {
    it('should return true for address with house number', () => {
      const address: DaDataAddressSuggestion = {
        value: 'г. Москва, ул. Ленина, д. 10',
        data: {
          house: '10',
        },
      } as DaDataAddressSuggestion;

      const result = validateAddressHasHouse(address);
      expect(result).toBe(true);
    });

    it('should return false for address without house number', () => {
      const address: DaDataAddressSuggestion = {
        value: 'г. Москва, ул. Ленина',
        data: {
          house: null,
        },
      } as DaDataAddressSuggestion;

      const result = validateAddressHasHouse(address);
      expect(result).toBe(false);
    });

    it('should return false for address with empty house number', () => {
      const address: DaDataAddressSuggestion = {
        value: 'г. Москва, ул. Ленина',
        data: {
          house: '',
        },
      } as DaDataAddressSuggestion;

      const result = validateAddressHasHouse(address);
      expect(result).toBe(false);
    });

    it('should return false for null address', () => {
      const result = validateAddressHasHouse(null);
      expect(result).toBe(false);
    });

    it('should return false when data is missing', () => {
      const address: DaDataAddressSuggestion = {
        value: 'г. Москва, ул. Ленина',
        data: undefined,
      } as unknown as DaDataAddressSuggestion;

      const result = validateAddressHasHouse(address);
      expect(result).toBe(false);
    });

    it('should return false when data is not an object', () => {
      const address: DaDataAddressSuggestion = {
        value: 'г. Москва, ул. Ленина',
        data: 'not an object',
      } as unknown as DaDataAddressSuggestion;

      const result = validateAddressHasHouse(address);
      expect(result).toBe(false);
    });
  });
});
