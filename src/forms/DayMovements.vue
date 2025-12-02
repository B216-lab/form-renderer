<template>
  <div class="day-movements">
    <div class="day-movements__card">
      <SuccessScreen v-if="isSubmitted" />
      <Vueform
        v-else
        ref="form$"
        v-model="data"
        sync
        size="md"
        :display-errors="false"
        add-class="vf-create-account"
        endpoint="http://localhost:8081/api/v1/public/forms/movements"
        method="post"
        @success="handleSuccess"
      >
        <template #empty>
          <FormSteps>
            <FormStep
              name="page0"
              :elements="[
                'agenix',
                'gender',
                'socialStatus',
                'transportationCostsContainer',
                'coordinatesAddress',
                'financialSituationContainer',
                'baseComment',
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
              :elements="['html', 'dateMovements', 'movements']"
              label="Передвижения"
              :labels="{
                previous: 'Назад',
                next: 'Завершить',
              }"
            />
          </FormSteps>
          <FormElements>
            <TextElement
              name="agenix"
              input-type="number"
              :rules="['required', 'min:7', 'max:80', 'integer']"
              autocomplete="off"
              label="Возраст"
              placeholder="18"
              :force-numbers="true"
              :columns="{
                container: 6,
              }"
              :floating="false"
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
              label="Социальное положение"
              :caret="false"
              :items="enumToOptions(SocialStatus)"
              :rules="['required']"
            />
            <GroupElement
              name="transportationCostsContainer"
              label="Расходы на транспорт"
            >
              <TextElement
                name="transportationCostMin"
                input-type="number"
                :rules="['required', 'min:0', 'max:20000', 'integer']"
                autocomplete="off"
                label="Mинимум"
                placeholder="0"
                :force-numbers="true"
                :columns="{
                  container: 6,
                }"
                default="0"
              />
              <TextElement
                name="transportationCostMax"
                input-type="number"
                :rules="['required', 'min:0', 'max:20000', 'integer']"
                autocomplete="off"
                label="Максимум"
                placeholder="3000"
                :force-numbers="true"
                :columns="{
                  container: 6,
                }"
                default="3000"
              />
            </GroupElement>
            <SelectElement
              name="coordinatesAddress"
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
              name="financialSituationContainer"
              label="Ежемесячный доход"
            >
              <TextElement
                name="financialSituationMin"
                input-type="number"
                :rules="['required', 'min:0', 'max:250000', 'integer']"
                autocomplete="off"
                label="Минимум"
                placeholder="0"
                :force-numbers="true"
                :columns="{
                  container: 6,
                }"
                default="0"
                description="Минимум. Установить, если доход фиксированный."
              />
              <TextElement
                name="financialSituationMax"
                input-type="number"
                :rules="['required', 'min:0', 'max:250000', 'integer']"
                autocomplete="off"
                label="Максимум"
                placeholder="50000"
                :force-numbers="true"
                :columns="{
                  container: 6,
                }"
                default="50000"
                description="Максимум. Установить как минимум если доход фиксированный."
              />
            </GroupElement>
            <TextareaElement
              name="baseComment"
              label="Комментарий"
              description="Код предприятия"
            />
            <StaticElement
              name="html"
              content="<strong class='info-callout__title'>Важно</strong><p>Необходимо внести данные о всех передвижениях за выбранный день {dateMovements} и обязательно учитывать передвижения в пешей доступности. Например, из дома на работу → с работы в магазин → из магазина домой → снова из дома в детский сад и т.д.</p>"
              :expressions="true"
              add-class="info-callout"
            />
            <DateElement
              name="dateMovements"
              label="Дата всех передвижений, описываемых далее в форме"
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
                      name="typeMovement"
                      view="tabs"
                      default="ON_FOOT"
                      :items="enumToOptions(TypeMovement)"
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
                      name="pedestrianApproachtoStartingStopOrParkingLot"
                      input-type="number"
                      :rules="[
                        'nullable',
                        'required',
                        'min:5',
                        'max:180',
                        'integer',
                      ]"
                      autocomplete="off"
                      label="Время пешего пути к начальной остановке / парковке (в минутах)"
                      :force-numbers="true"
                      :conditions="[
                        [
                          'movements.*.container.typeMovement',
                          'in',
                          ['TRANSPORT'],
                        ],
                      ]"
                    />
                    <TextElement
                      name="waitingTimeForTransport"
                      input-type="number"
                      :rules="[
                        'nullable',
                        'required',
                        'min:5',
                        'max:180',
                        'integer',
                      ]"
                      autocomplete="off"
                      label="Время ожидания транспорта на начальной остановке (в минутах)"
                      :force-numbers="true"
                      :conditions="[
                        [
                          'movements.*.container.typeMovement',
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
                          'movements.*.container.typeMovement',
                          'in',
                          ['TRANSPORT'],
                        ],
                      ]"
                    />
                    <TextElement
                      name="waitingTimeBetweenTransfers"
                      input-type="number"
                      :rules="['required', 'min:0', 'max:180', 'integer']"
                      autocomplete="off"
                      label="Суммарное время ожидания при пересадке / пересадках (в минутах)"
                      default="0"
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
                      name="coordinatesDepartureAddress"
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
                        'different:movements.*.container.departurePlace',
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
                      name="pedestrianApproachFromFinalStopOrParking"
                      input-type="number"
                      :rules="['required', 'min:0', 'max:180', 'integer']"
                      autocomplete="off"
                      label="Время пешего хода от конечной остановки / парковки до места прибытия (в минутах)"
                      :conditions="[
                        [
                          'movements.*.container.typeMovement',
                          'in',
                          ['TRANSPORT'],
                        ],
                      ]"
                    />
                    <TextElement
                      name="number"
                      input-type="number"
                      :rules="['nullable', 'min:0', 'max:25000', 'integer']"
                      autocomplete="off"
                      label="Стоимость поездки / парковки"
                      :conditions="[
                        [
                          'movements.*.container.typeMovement',
                          'in',
                          ['TRANSPORT'],
                        ],
                      ]"
                    />
                    <SelectElement
                      name="coordinatesArrivalAddress"
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
                        'different:movements.*.container.coordinatesDepartureAddress',
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDaDataAddress } from '@/daDataService/useDaDataAddress';
import { computed, ref, onMounted } from 'vue';
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

const data = computed({
  get: () => store.dayMovements,
  set: (data) => (store.dayMovements = data),
});

const form$ = ref<Vueform | null>(null);

/**
 * Загружает сохранённую форму из localStorage, включая все шаги (включая movements).
 */
async function loadStoredForm(): Promise<boolean> {
  if (!form$.value) return false;

  const storedForm: string | null = localStorage.getItem('form');
  if (!storedForm) return false;

  try {
    const parsedData = JSON.parse(storedForm);
    await form$.value.load(parsedData);
    return true;
  } catch {
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

    // Пол
    if (profile.gender) {
      current.gender = profile.gender;
    }

    // Доход: min/maxSalary -> financialSituationMin/Max
    if (typeof profile.minSalary === 'number') {
      current.financialSituationMin = profile.minSalary;
    }
    if (typeof profile.maxSalary === 'number') {
      current.financialSituationMax = profile.maxSalary;
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
  if (!form$.value) return;

  // Сначала пытается загрузить сохранённую форму (включая movements)
  const hasStoredForm = await loadStoredForm();

  // Если нет сохранённой формы, предзаполняет из профиля
  if (!hasStoredForm) {
    await prefillFromProfile();
  }

  // Настраивает автосохранение изменений
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
@import '@/styles/callout.scss';

.day-movements {
  padding: 15px;
}

.day-movements__card {
  margin: 0 auto;
  max-width: 800px;
  padding: 2rem;
  border-radius: 10px;
  position: relative;
  width: 100%;
}

#app.dark .day-movements__card {
  background-color: #1a1a1a;
  color: #fff;
}

@media (prefers-color-scheme: dark) {
  :root,
  :before,
  :after,
  * {
    @include vf-dark-vars;
  }
}
</style>
