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
  address:
    | DaDataAddressSuggestion
    | { value: string; latitude?: number; longitude?: number }
    | null
    | undefined
): SimplifiedAddress | null {
  if (!address) return null;

  // Если адрес уже в упрощённом формате, возвращаем как есть
  if (
    typeof address === 'object' &&
    'latitude' in address &&
    'longitude' in address
  ) {
    if (address.latitude != null && address.longitude != null) {
      return {
        value: address.value || '',
        latitude: address.latitude,
        longitude: address.longitude,
      };
    }
    return null;
  }

  // Обрабатываем формат DaData
  if (typeof address === 'object' && 'value' in address && 'data' in address) {
    const daDataAddress = address as DaDataAddressSuggestion;
    const data = daDataAddress.data as
      | { geo_lat?: string; geo_lon?: string }
      | undefined;

    if (data?.geo_lat && data?.geo_lon) {
      const lat = parseFloat(data.geo_lat);
      const lon = parseFloat(data.geo_lon);

      if (!isNaN(lat) && !isNaN(lon)) {
        return {
          value: daDataAddress.value || '',
          latitude: lat,
          longitude: lon,
        };
      }
    }
  }

  return null;
}

/**
 * Подготавливает данные формы для отправки на сервер.
 * Упрощает адреса и преобразует структуру данных.
 *
 * @param rawData - сырые данные формы
 * @returns подготовленные данные
 */
export function prepareFormData(
  rawData: Record<string, unknown>
): Record<string, unknown> {
  const prepared = { ...rawData };

  // Упрощаем homeAddress
  if (prepared.homeAddress) {
    prepared.homeAddress = simplifyAddress(
      prepared.homeAddress as DaDataAddressSuggestion
    );
  }

  // Также обрабатываем coordinatesAddress (если используется)
  if (prepared.coordinatesAddress) {
    prepared.homeAddress = simplifyAddress(
      prepared.coordinatesAddress as DaDataAddressSuggestion
    );
    delete prepared.coordinatesAddress;
  }

  // Упрощаем адреса в movements
  if (Array.isArray(prepared.movements)) {
    prepared.movements = prepared.movements.map((movement: unknown) => {
      if (typeof movement !== 'object' || movement === null) return movement;

      const mov = movement as Record<string, unknown>;
      const container = mov.container as Record<string, unknown> | undefined;

      if (!container) return movement;

      const preparedMovement: Record<string, unknown> = { ...mov };
      const preparedContainer: Record<string, unknown> = { ...container };

      // Упрощаем departureAddress
      if (container.departureAddress) {
        preparedContainer.departureAddress = simplifyAddress(
          container.departureAddress as DaDataAddressSuggestion
        );
      }

      // Упрощаем arrivalAddress
      if (container.arrivalAddress) {
        preparedContainer.arrivalAddress = simplifyAddress(
          container.arrivalAddress as DaDataAddressSuggestion
        );
      }

      preparedMovement.container = preparedContainer;
      return preparedMovement;
    });
  }

  return prepared;
}

