import { describe, it, expect } from 'vitest';
import { simplifyAddress } from '../addressUtils';
import type { DaDataAddressSuggestion } from 'react-dadata';

describe('addressUtils', () => {
  describe('simplifyAddress', () => {
    it('should return null when value is null', () => {
      const result = simplifyAddress('testAddress', null);
      expect(result).toEqual({ testAddress: null });
    });

    it('should return null when value is undefined', () => {
      const result = simplifyAddress('testAddress', undefined);
      expect(result).toEqual({ testAddress: null });
    });

    it('should simplify valid DaData address with coordinates', () => {
      const daDataAddress: DaDataAddressSuggestion = {
        value: 'г. Москва, ул. Ленина, д. 10',
        unrestricted_value: 'г. Москва, ул. Ленина, д. 10',
        data: {
          geo_lat: '55.7558',
          geo_lon: '37.6173',
        },
      } as DaDataAddressSuggestion;

      const result = simplifyAddress('departureAddress', daDataAddress);

      expect(result).toEqual({
        departureAddress: {
          value: 'г. Москва, ул. Ленина, д. 10',
          latitude: 55.7558,
          longitude: 37.6173,
        },
      });
    });

    it('should return null when coordinates are missing', () => {
      const daDataAddress: DaDataAddressSuggestion = {
        value: 'г. Москва, ул. Ленина',
        unrestricted_value: 'г. Москва, ул. Ленина',
        data: {},
      } as DaDataAddressSuggestion;

      const result = simplifyAddress('departureAddress', daDataAddress);

      expect(result).toEqual({
        departureAddress: null,
      });
    });

    it('should return null when coordinates are invalid', () => {
      const daDataAddress: DaDataAddressSuggestion = {
        value: 'г. Москва, ул. Ленина',
        unrestricted_value: 'г. Москва, ул. Ленина',
        data: {
          geo_lat: 'invalid',
          geo_lon: 'invalid',
        },
      } as DaDataAddressSuggestion;

      const result = simplifyAddress('departureAddress', daDataAddress);

      expect(result).toEqual({
        departureAddress: null,
      });
    });

    it('should handle empty value string', () => {
      const daDataAddress: DaDataAddressSuggestion = {
        value: '',
        unrestricted_value: '',
        data: {
          geo_lat: '55.7558',
          geo_lon: '37.6173',
        },
      } as DaDataAddressSuggestion;

      const result = simplifyAddress('arrivalAddress', daDataAddress);

      expect(result).toEqual({
        arrivalAddress: {
          value: '',
          latitude: 55.7558,
          longitude: 37.6173,
        },
      });
    });

    it('should parse coordinates correctly', () => {
      const daDataAddress: DaDataAddressSuggestion = {
        value: 'г. Санкт-Петербург, Невский проспект, д. 50',
        unrestricted_value: 'г. Санкт-Петербург, Невский проспект, д. 50',
        data: {
          geo_lat: '59.9343',
          geo_lon: '30.3351',
        },
      } as DaDataAddressSuggestion;

      const result = simplifyAddress('homeAddress', daDataAddress);

      expect(result.homeAddress).not.toBeNull();
      expect(result.homeAddress?.latitude).toBe(59.9343);
      expect(result.homeAddress?.longitude).toBe(30.3351);
      expect(result.homeAddress?.value).toBe(
        'г. Санкт-Петербург, Невский проспект, д. 50'
      );
    });
  });
});
