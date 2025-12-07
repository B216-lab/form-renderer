<template>
  <UPageBody>
    <UContainer>
      <SuccessScreen v-if="isSubmitted" />

      <UCard v-else>
        <Vueform
          ref="form$"
          v-model="data"
          sync
          :add-class="'vf-create-account'"
          size="md"
          :display-errors="false"
          :endpoint="FORM_ENDPOINT"
          method="post"
          @success="handleSuccess"
        >
          <template #empty>
            <FormSteps>
              <FormStep
                name="page0"
                :elements="[
                  'homeAddress',
                  'birthday',
                  'gender',
                  'socialStatus',
                  'coordinatesAddress',
                  'transportationCostsContainer',
                  'financialSituationContainer',
                ]"
                label="Общая информация"
                :labels="{
                  next: 'Далее',
                }"
                :buttons="{
                  previous: false,
                }"
              />
              <FormStep
                name="page1"
                :elements="['html', 'movementsDate', 'movements']"
                label="Передвижения"
                :labels="{
                  previous: 'Назад',
                  next: 'Завершить',
                }"
              />
            </FormSteps>
            <FormElements>
              <DateElement
                name="birthday"
                label="День рождения"
                :floating="false"
                min="1956-12-01"
                max="2018-12-01"
                value-format="YYYY-MM-DD"
                :rules="['required']"
                :columns="{
                  container: 6,
                }"
              />
              <SelectElement
                name="gender"
                :items="enumToOptions(Gender)"
                :native="false"
                :columns="{
                  container: 6,
                }"
                label="Пол"
                :rules="['required']"
              />
              <SelectElement
                name="socialStatus"
                :native="false"
                label="Социальный статус"
                :items="enumToOptions(SocialStatus)"
                :rules="['required']"
              />
              <SelectElement
                name="homeAddress"
                :items="getAddressItems"
                :resolve-on-load="false"
                :delay="ADDRESS_DELAY"
                label-prop="value"
                :object="true"
                allow-absent
                :min-chars="DEFAULT_MIN_CHARS"
                :search="true"
                :native="false"
                label="Адрес проживания"
                :filter-results="false"
                input-type="search"
                autocomplete="off"
                :description="ADDRESS_SUGGESTION_HINT"
                :rules="['required', precise]"
              />
              <GroupElement
                name="transportationCostsContainer"
                label="Расходы на транспорт"
              >
                <TextElement
                  name="transportCostMin"
                  input-type="number"
                  :rules="['required', 'min:0', 'max:20000', 'integer']"
                  autocomplete="off"
                  :floating="false"
                  label="Минимум, ₽/мес"
                  placeholder="0"
                  :force-numbers="true"
                  :columns="{
                    container: 6,
                  }"
                  default="0"
                />
                <TextElement
                  name="transportCostMax"
                  input-type="number"
                  :rules="['required', 'min:0', 'max:20000', 'integer']"
                  autocomplete="off"
                  label="Максимум, ₽/мес"
                  :floating="false"
                  placeholder="3000"
                  :force-numbers="true"
                  :columns="{
                    container: 6,
                  }"
                  default="3000"
                />
              </GroupElement>
              <GroupElement
                name="financialSituationContainer"
                label="Ежемесячный доход"
              >
                <TextElement
                  name="incomeMin"
                  input-type="number"
                  :rules="['required', 'min:0', 'max:250000', 'integer']"
                  autocomplete="off"
                  label="Минимум, ₽/мес"
                  :floating="false"
                  placeholder="0"
                  :force-numbers="true"
                  :columns="{
                    container: 6,
                  }"
                  default="0"
                  description="Минимум. Установить, если доход фиксированный."
                />
                <TextElement
                  name="incomeMax"
                  input-type="number"
                  :rules="['required', 'min:0', 'max:250000', 'integer']"
                  autocomplete="off"
                  label="Максимум, ₽/мес"
                  :floating="false"
                  placeholder="50000"
                  :force-numbers="true"
                  :columns="{
                    container: 6,
                  }"
                  default="50000"
                  description="Максимум. Установить как минимум если доход фиксированный."
                />
              </GroupElement>
              <StaticElement
                name="html"
                content="<strong class='block text-lg font-semibold mb-2 text-blue-500 dark:text-blue-400'>Важно</strong><p>Необходимо внести данные о всех передвижениях за выбранный день {movementsDate} и обязательно учитывать передвижения в пешей доступности. Например, из дома на работу → с работы в магазин → из магазина домой → снова из дома в детский сад и т.д.</p>"
                :expressions="true"
                add-class="border-l-4 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 py-5 px-6 my-6 rounded-md leading-relaxed text-base"
              />
              <DateElement
                name="movementsDate"
                label="Дата передвижений"
                :rules="['required']"
                field-name="date_id"
                description="Нужно будет описать передвижения за этот день"
              />
              <ListElement
                name="movements"
                :min="1"
                :max="15"
                add-text="Добавить передвижение"
                :rules="['required', 'min:1', 'max:15']"
              >
                <template #default="{ index }">
                  <ObjectElement :name="index">
                    <GroupElement name="container">
                      <RadiogroupElement
                        name="movementType"
                        view="tabs"
                        default="ON_FOOT"
                        :items="enumToOptions(TypeMovement)"
                        label="Способ передвижения"
                        :rules="['required']"
                      />
                      <MultiselectElement
                        name="transport"
                        :close-on-select="false"
                        :items="enumToOptions(Transport)"
                        :search="true"
                        :native="false"
                        label="Тип транспорта"
                        input-type="search"
                        autocomplete="off"
                        :rules="['required', 'min:1']"
                        :conditions="[
                          [
                            'movements.*.container.typeMovement',
                            'in',
                            ['TRANSPORT'],
                          ],
                        ]"
                      />
                      <TextElement
                        name="numberPeopleInCar"
                        input-type="number"
                        :rules="[
                          'nullable',
                          'required',
                          'min:1',
                          'max:15',
                          'integer',
                        ]"
                        autocomplete="off"
                        label="Количество людей в автомобиле"
                        :force-numbers="true"
                        :conditions="[
                          [
                            'movements.*.container.transport',
                            'in',
                            ['CAR_SHARING'],
                          ],
                        ]"
                        default="1"
                      />
                      <TextElement
                        name="walkToStartMinutes"
                        input-type="number"
                        :rules="[
                          'nullable',
                          'required',
                          'min:5',
                          'max:180',
                          'integer',
                        ]"
                        autocomplete="off"
                        label="Пешком до начальной остановки / парковки, мин"
                        :force-numbers="true"
                        :conditions="[
                          [
                            'movements.*.container.movementType',
                            'in',
                            ['TRANSPORT'],
                          ],
                        ]"
                      />
                      <TextElement
                        name="waitAtStartMinutes"
                        input-type="number"
                        :rules="[
                          'nullable',
                          'required',
                          'min:5',
                          'max:180',
                          'integer',
                        ]"
                        autocomplete="off"
                        label="Ожидание на начальной остановке, мин"
                        :force-numbers="true"
                        :conditions="[
                          [
                            'movements.*.container.movementType',
                            'in',
                            ['TRANSPORT'],
                          ],
                        ]"
                      />
                      <TextElement
                        name="numberOfTransfers"
                        input-type="number"
                        :rules="['required', 'min:0', 'max:15', 'integer']"
                        autocomplete="off"
                        label="Количество пересадок"
                        :force-numbers="true"
                        default="0"
                        :conditions="[
                          [
                            'movements.*.container.movementType',
                            'in',
                            ['TRANSPORT'],
                          ],
                        ]"
                      />
                      <TextElement
                        name="waitBetweenTransfersMinutes"
                        input-type="number"
                        :rules="['required', 'min:0', 'max:180', 'integer']"
                        autocomplete="off"
                        label="Ожидание при пересадках, мин"
                        default="0"
                        :floating="false"
                      />
                      <DateElement
                        name="departureTime"
                        label="Время отправления"
                        :time="true"
                        :date="false"
                        :columns="{
                          container: 6,
                        }"
                        :rules="['required']"
                      />
                      <SelectElement
                        name="departurePlace"
                        :items="enumToOptions(Place)"
                        :search="true"
                        :native="false"
                        label="Пункт отправления"
                        input-type="search"
                        autocomplete="off"
                        :columns="{
                          container: 6,
                        }"
                        :rules="['required']"
                      />
                      <SelectElement
                        name="departureAddress"
                        :items="getAddressItems"
                        :delay="ADDRESS_DELAY"
                        :search="true"
                        label-prop="value"
                        :object="true"
                        allow-absent
                        :resolve-on-load="false"
                        :native="false"
                        :min-chars="DEFAULT_MIN_CHARS"
                        :filter-results="false"
                        label="Адрес отправления"
                        input-type="search"
                        autocomplete="off"
                        :description="ADDRESS_SUGGESTION_HINT"
                        :rules="[
                          'required',
                          precise,
                          'different:movements.*.container.arrivalAddress',
                        ]"
                        :conditions="[
                          [
                            'movements.*.container.departurePlace',
                            'not_in',
                            ['HOME_RESIDENCE'],
                          ],
                        ]"
                      />
                      <StaticElement
                        name="divider_1"
                        tag="hr"
                      />
                      <DateElement
                        name="arrivalTime"
                        label="Время прибытия"
                        :time="true"
                        :date="false"
                        :columns="{
                          container: 6,
                        }"
                        :rules="['required']"
                      />
                      <SelectElement
                        name="arrivalPlace"
                        :items="enumToOptions(Place)"
                        :search="true"
                        :native="false"
                        label="Пункт прибытия"
                        input-type="search"
                        autocomplete="off"
                        :columns="{
                          container: 6,
                        }"
                        :rules="['required']"
                      />
                      <TextElement
                        name="walkFromFinishMinutes"
                        input-type="number"
                        :rules="['required', 'min:0', 'max:180', 'integer']"
                        autocomplete="off"
                        label="Пешком от конечной остановки / парковки до места прибытия, мин"
                        :conditions="[
                          [
                            'movements.*.container.movementType',
                            'in',
                            ['TRANSPORT'],
                          ],
                        ]"
                      />
                      <TextElement
                        name="tripCost"
                        input-type="number"
                        :rules="['nullable', 'min:0', 'max:25000', 'integer']"
                        autocomplete="off"
                        label="Стоимость поездки / парковки, ₽"
                        :conditions="[
                          [
                            'movements.*.container.movementType',
                            'in',
                            ['TRANSPORT'],
                          ],
                        ]"
                      />
                      <SelectElement
                        name="arrivalAddress"
                        :items="getAddressItems"
                        :delay="ADDRESS_DELAY"
                        :search="true"
                        label-prop="value"
                        :object="true"
                        allow-absent
                        :min-chars="DEFAULT_MIN_CHARS"
                        :resolve-on-load="false"
                        :native="false"
                        :filter-results="false"
                        input-type="search"
                        autocomplete="off"
                        label="Адрес прибытия"
                        :description="ADDRESS_SUGGESTION_HINT"
                        :rules="[
                          'required',
                          precise,
                          'different:movements.*.container.departureAddress', // TODO проверить, что между отправлениями не валидирует
                        ]"
                        :conditions="[
                          [
                            'movements.*.container.arrivalPlace',
                            'not_in',
                            ['HOME_RESIDENCE'],
                          ],
                        ]"
                      />
                      <StaticElement
                        name="divider_2"
                        tag="hr"
                      />
                      <TextareaElement
                        name="textarea"
                        label="Комментарий"
                        description="Пожелания по улучшению транспортной инфраструктуры"
                      />
                    </GroupElement>
                  </ObjectElement>
                </template>
              </ListElement>
            </FormElements>

            <FormStepsControls />
          </template>
        </Vueform>
      </UCard>
    </UContainer>
  </UPageBody>
</template>

<script setup lang="ts">
import { useDaDataAddress } from '@/daDataService/useDaDataAddress';
import { computed, ref, onMounted, nextTick } from 'vue';
import { useFormsStore } from '@/forms/formDataStore';
import type { Vueform } from '@vueform/vueform';
import { enumToOptions } from './enums';
import { Gender, SocialStatus, TypeMovement, Transport, Place } from './enums';
import { Validator } from '@vueform/vueform';
import type { DaDataAddressSuggestion } from 'react-dadata';
import SuccessScreen from '@/components/SuccessScreen.vue';
import { apiFetch, ApiHttpError, ApiNetworkError } from '@/api';

const precise = class extends Validator {
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

const store = useFormsStore();

const FORM_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/forms/movements`;

const data = computed({
  get: () => store.dayMovements,
  set: (data) => (store.dayMovements = data),
});

const form$ = ref<Vueform | null>(null);

/**
 * Загружает сохранённую форму из localStorage, включая все шаги (включая movements).
 */
async function loadStoredForm(): Promise<boolean> {
  const storedForm: string | null = localStorage.getItem('form');
  if (!storedForm) return false;

  try {
    const parsedData = JSON.parse(storedForm) as Record<string, unknown>;
    // console.warn('[DayMovements] Loading stored form data:', parsedData);
    // console.warn(
    //   '[DayMovements] Birthday value:',
    //   parsedData.birthday,
    //   typeof parsedData.birthday
    // );

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
    store.dayMovements = { ...store.dayMovements, ...parsedData };

    // Затем загружаем через метод load() для полной инициализации формы
    // @ts-expect-error - parsedData is a valid object (no idea why it's working against docs)
    await form$.value.load(parsedData);

    // Проверяем, что данные загрузились
    await nextTick();
    // const formData = form$.value.data as Record<string, unknown> | undefined;
    // console.warn('[DayMovements] Form data after load:', formData);
    // console.warn('[DayMovements] Birthday in form:', formData?.birthday);

    return true;
  } catch (error) {
    console.error('[DayMovements] Error loading stored form:', error);
    localStorage.removeItem('form');
    return false;
  }
}

/**
 * Предзаполняет форму данными из профиля пользователя (только первая страница).
 */
async function prefillFromProfile(): Promise<void> {
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
    await prefillAddressFromProfile(current, profile);

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
 */
async function prefillAddressFromProfile(
  current: Record<string, unknown>,
  profile: Record<string, unknown>
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

/**
 * Настраивает слушатель изменений формы для сохранения в localStorage.
 */
function setupFormChangeListener(): void {
  if (!form$.value) return;

  form$.value.on('change', () => {
    if (form$.value) {
      localStorage.setItem('form', JSON.stringify(form$.value.data));
    }
  });
}

onMounted(async () => {
  // Ждём, пока форма полностью смонтируется
  await nextTick();

  if (!form$.value) {
    // Если форма всё ещё не готова, ждём ещё немного
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (!form$.value) return;
  }

  // Сначала пытается загрузить сохранённую форму (включая movements)
  const hasStoredForm = await loadStoredForm();

  // Если нет сохранённой формы, предзаполняет из профиля
  if (!hasStoredForm) {
    await prefillFromProfile();
  }

  setupFormChangeListener();
});

const { getAddressItems, ADDRESS_DELAY, DEFAULT_MIN_CHARS } =
  useDaDataAddress(3);

const isSubmitted = ref(false);
const ADDRESS_SUGGESTION_HINT =
  'Начните вводить адрес, чтобы увидеть подсказки и выбрать нужный вариант. Необходимо выбрать из списка с точностью до дома';

const handleSuccess = () => {
  isSubmitted.value = true;
};
</script>

<style lang="scss">
@import '@vueform/vueform/themes/vueform/scss/index.scss';
</style>
