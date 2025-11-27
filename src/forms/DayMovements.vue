<template>
  <div
    v-if="isSubmitted"
    class="thank-you-screen"
  >
    <div class="thank-you-content">
      <h1 class="thank-you-title">Спасибо!</h1>
      <p class="thank-you-message">
        Ваша форма успешно отправлена. Мы благодарим вас за участие в опросе.
      </p>
    </div>
  </div>
  <Vueform
    v-else
    ref="form$"
    :prepare="prepare"
    validate-on="change"
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
            'age',
            'gender',
            'socialStatus',
            'transportationCosts',
            'coordinatesAddress',
            'financialSituation',
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
          name="age"
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
        <SliderElement
          name="transportationCosts"
          :default="[0, 3000]"
          label="Затраты на транспорт"
          :min="0"
          :max="20000"
          :step="100"
          show-tooltip="focus"
          :format="{
            suffix: ' ₽',
          }"
          :rules="['required']"
          description="Указать диапазон затрат. Сдвинуть один ползунок при фиксированном значении."
        />
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
        <SliderElement
          name="financialSituation"
          :default="[0, 50000]"
          label="Ежемесячный доход"
          :min="0"
          show-tooltip="focus"
          :max="250000"
          :step="5000"
          :format="{
            suffix: ' ₽',
          }"
          :rules="['required']"
          description="Минимум и максимум. Установить в одно положение при фиксированном доходе."
        />
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
                    ['movements.*.container.typeMovement', 'in', ['TRANSPORT']],
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
                    ['movements.*.container.transport', 'in', ['CAR_SHARING']],
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
                    ['movements.*.container.typeMovement', 'in', ['TRANSPORT']],
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
                    ['movements.*.container.typeMovement', 'in', ['TRANSPORT']],
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
                    ['movements.*.container.typeMovement', 'in', ['TRANSPORT']],
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
                    ['movements.*.container.typeMovement', 'in', ['TRANSPORT']],
                  ]"
                />
                <TextElement
                  name="number"
                  input-type="number"
                  :rules="['nullable', 'min:0', 'max:25000', 'integer']"
                  autocomplete="off"
                  label="Стоимость поездки / парковки"
                  :conditions="[
                    ['movements.*.container.typeMovement', 'in', ['TRANSPORT']],
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
</template>

<script setup lang="ts">
import { useDaDataAddress } from '@/daDataService/useDaDataAddress';
import { computed, ref, onMounted } from 'vue';
import { useFormsStore } from '@/forms/formDataStore';
import type { Vueform } from '@vueform/vueform';
import { enumToOptions } from './enums';
import { Gender, SocialStatus, TypeMovement, Transport, Place } from './enums';
import { Validator } from '@vueform/vueform';
import type { DaDataAddress, DaDataAddressSuggestion } from 'react-dadata';

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

const prepare = (form$: Vueform) => {
  console.log(form$.data);
};

const store = useFormsStore();

const data = computed({
  get: () => store.form,
  set: (data) => (store.form = data),
});

const form$ = ref(null);
onMounted(async () => {
  form$.value.on('change', (e) => {
    if (form$.value) {
      localStorage.setItem('form', JSON.stringify(form$.value.data));
    }
  });

  const data = localStorage.getItem('form');
  if (data) {
    try {
      await form$.value.load(JSON.parse(data));
      form$.value.clean();
    } catch (error) {
      // If loading fails (bad data), remove invalid saved form
      localStorage.removeItem('form');
    }
  }
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

@media (prefers-color-scheme: dark) {
  :root,
  :before,
  :after,
  * {
    @include vf-dark-vars;
  }
}

.thank-you-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: var(--vf-color-bg, #ffffff);
}

.thank-you-content {
  text-align: center;
  max-width: 600px;
  padding: 3rem;
  background: var(--vf-color-bg-secondary, #f8f9fa);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.thank-you-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--vf-color-text, #212529);
}

.thank-you-message {
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--vf-color-text-secondary, #6c757d);
}

.info-callout {
  background: var(--vf-color-bg-secondary, #f1f5f9);
  border-left: 4px solid var(--vf-color-primary, #3b82f6);
  padding: 1.25rem 1.5rem;
  margin: 1.5rem 0;
  border-radius: 6px;
  color: var(--vf-color-text, #0f172a);
  line-height: 1.6;
  font-size: 1rem;
}

.info-callout__title {
  display: block;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--vf-color-primary, #3b82f6);
}

.info-callout p {
  margin: 0;
  color: var(--vf-color-text, #0f172a);
}

.info-callout a {
  color: var(--vf-color-primary, #3b82f6);
  text-decoration: underline;
}

.info-callout a:hover {
  text-decoration: none;
}

@media (prefers-color-scheme: dark) {
  .thank-you-content {
    background: var(--vf-color-bg-secondary, #1a1a1a);
  }

  .thank-you-title {
    color: var(--vf-color-text, #ffffff);
  }

  .thank-you-message {
    color: var(--vf-color-text-secondary, #adb5bd);
  }

  .info-callout {
    background: var(--vf-color-bg-secondary, #111827);
    border-color: var(--vf-color-primary, #60a5fa);
    color: var(--vf-color-text, #f8fafc);
  }

  .info-callout__title {
    color: var(--vf-color-primary, #60a5fa);
  }

  .info-callout p {
    color: var(--vf-color-text, #f8fafc);
  }
}
</style>
