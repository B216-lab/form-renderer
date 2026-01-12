import type { Vueform } from '@vueform/vueform';
import type { DaDataAddressSuggestion } from 'react-dadata';
import { apiFetch, ApiHttpError, ApiNetworkError } from '@/api';

/**
 * Предзаполняет форму данными из профиля пользователя (только первая страница).
 *
 * @param form$ - экземпляр Vueform
 * @param data - computed ref для данных формы
 * @param getAddressItems - функция для получения адресов из DaData
 */
export async function prefillFromProfile(
  form$: { value: Vueform | null },
  data: { value: Record<string, unknown> },
  getAddressItems: (query: string) => Promise<unknown[]>
): Promise<void> {
  if (!form$.value) return;

  try {
    const response = await apiFetch('/api/v1/auth/me', { method: 'GET' });
    const profile = await response.json();

    if (profile.error) {
      return; // Неавторизованный пользователь
    }

    const current = (data.value || {}) as Record<string, unknown>;

    // День рождения
    if (profile.birthday) {
      current.birthday = profile.birthday;
    }

    // Пол
    if (profile.gender) {
      current.gender = profile.gender;
    }

    // Социальное положение
    if (profile.socialStatus) {
      current.socialStatus = profile.socialStatus;
    }

    // Расходы на транспорт
    if (typeof profile.transportationCostMin === 'number') {
      current.transportCostMin = profile.transportationCostMin;
    }
    if (typeof profile.transportationCostMax === 'number') {
      current.transportCostMax = profile.transportationCostMax;
    }

    // Доход: min/maxSalary -> incomeMin/Max
    if (typeof profile.minSalary === 'number') {
      current.incomeMin = profile.minSalary;
    }
    if (typeof profile.maxSalary === 'number') {
      current.incomeMax = profile.maxSalary;
    }

    // Адрес: сопоставление подсказки DaData по homeReadablePlace и координатам
    await prefillAddressFromProfile(current, profile, getAddressItems);

    data.value = current;
  } catch (err) {
    if (err instanceof ApiHttpError || err instanceof ApiNetworkError) {
      console.warn('[DayMovements] Unable to prefill from user profile', err);
    }
  }
}

/**
 * Предзаполняет поле coordinatesAddress из профиля пользователя.
 * Поддерживает GeoJSON Point формат: {"type": "Point", "coordinates": [lon, lat]}
 *
 * @param current - текущие данные формы
 * @param profile - данные профиля пользователя
 * @param getAddressItems - функция для получения адресов из DaData
 */
async function prefillAddressFromProfile(
  current: Record<string, unknown>,
  profile: Record<string, unknown>,
  getAddressItems: (query: string) => Promise<unknown[]>
): Promise<void> {
  if (!profile.homeReadablePlace || !profile.homePlace) {
    return;
  }

  const homeReadablePlace = profile.homeReadablePlace as string;
  const homePlace = profile.homePlace as {
    type?: string;
    coordinates?: [number, number];
    data?: { geo_lat?: string; geo_lon?: string };
    [key: string]: unknown;
  };

  try {
    const suggestions = await getAddressItems(homeReadablePlace);

    // Извлекает координаты из GeoJSON Point или DaData формата
    let storedLat: string | undefined;
    let storedLon: string | undefined;

    if (homePlace.type === 'Point' && Array.isArray(homePlace.coordinates)) {
      // GeoJSON Point: coordinates = [longitude, latitude]
      storedLon = homePlace.coordinates[0]?.toString();
      storedLat = homePlace.coordinates[1]?.toString();
    } else if (homePlace.data) {
      // DaData формат (для обратной совместимости)
      storedLat = homePlace.data.geo_lat;
      storedLon = homePlace.data.geo_lon;
    }

    if (!storedLat || !storedLon) {
      return;
    }

    const matchedSuggestion = (suggestions as DaDataAddressSuggestion[]).find(
      (s) => {
        const d = s.data as { geo_lat?: string; geo_lon?: string };
        return d?.geo_lat === storedLat && d?.geo_lon === storedLon;
      }
    );

    if (matchedSuggestion) {
      current.coordinatesAddress = matchedSuggestion;
    } else {
      console.warn(
        '[DaData] Stored homePlace coordinates not found among suggestions for homeReadablePlace',
        { homeReadablePlace, homePlace }
      );
    }
  } catch (err) {
    if (!(err instanceof ApiHttpError) && !(err instanceof ApiNetworkError)) {
      console.warn('[DaData] Unexpected error during address prefill', err);
    }
  }
}
