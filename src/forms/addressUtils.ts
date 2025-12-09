import type { DaDataAddressSuggestion } from 'react-dadata';

/**
 * Упрощённый формат адреса для отправки на бэкенд.
 */
export interface SimplifiedAddress {
  value: string;
  latitude: number;
  longitude: number;
}

/**
 * Упрощает адрес DaData до формата, ожидаемого бэкендом (value, latitude, longitude).
 *
 * @param address - адрес из DaData или уже упрощённый адрес
 * @returns упрощённый адрес или null
 */
export function simplifyAddress(
  name: string,
  value: DaDataAddressSuggestion | null | undefined
): Record<string, SimplifiedAddress | null> {
  if (!value) return { [name]: null };

  const daDataAddress = value as DaDataAddressSuggestion;
  const data = daDataAddress.data as
    | { geo_lat?: string; geo_lon?: string }
    | undefined;

  if (data?.geo_lat && data?.geo_lon) {
    const lat = parseFloat(data.geo_lat);
    const lon = parseFloat(data.geo_lon);

    if (!isNaN(lat) && !isNaN(lon)) {
      return {
        [name]: {
          value: daDataAddress.value || '',
          latitude: lat,
          longitude: lon,
        },
      };
    }
  }

  return {
    [name]: null,
  };
}
