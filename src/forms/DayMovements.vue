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
            'dateMovements',
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
          :elements="['h1', 'html', 'divider', 'movements']"
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
          floating="Пол"
        />
        <SelectElement
          name="socialStatus"
          :native="false"
          label="Социальное положение"
          :caret="false"
          :items="[
            {
              value: 'RETIRED',
              label: 'Пенсионер',
            },
            {
              value: 'STUDENT',
              label: 'Студент',
            },
            {
              value: 'PUPIL',
              label: 'Школьник',
            },
            {
              value: 'WORKER',
              label: 'Работающий',
            },
          ]"
          :rules="['required']"
          :columns="{
            container: 6,
          }"
        />
        <SelectElement
          name="transportationCosts"
          :items="[
            {
              value: 'LESS1000',
              label: 'Менее 1000',
            },
            {
              value: '10002000',
              label: '1000-2000',
            },
            {
              value: '20003000',
              label: '2000-3000',
            },
          ]"
          :native="false"
          label="Затраты на транспорт"
          :caret="false"
          :rules="['required']"
          :columns="{
            container: 6,
          }"
        />
        <SelectElement
          name="coordinatesAddress"
          :items="getAddressItems"
          :delay="ADDRESS_DELAY"
          :search="true"
          :native="false"
          label="Адрес проживания"
          :filter-results="false"
          input-type="search"
          autocomplete="off"
          :rules="['required', precise]"
        />
        <DateElement
          name="dateMovements"
          label="Дата передвижений"
          :rules="['required']"
          field-name="date_id"
          :columns="{
            container: 6,
          }"
          description="Нужно будет описать передвижения за этот день"
        />
        <SelectElement
          name="financialSituation"
          :items="[
            {
              value: 0,
              label: 'Label',
            },
          ]"
          :search="true"
          :native="false"
          input-type="search"
          autocomplete="off"
          label="Ежемесячный доход"
          :columns="{
            container: 6,
          }"
          :rules="['required']"
        />
        <TextareaElement
          name="baseComment"
          label="Комментарий"
          description="Код предприятия"
        />
        <StaticElement
          name="h1"
          tag="h1"
          content="Важно"
        />
        <StaticElement
          name="html"
          content="<ol>
<li>Необходимо внести данные о всех передвижениях за выбранный день {dateMovements} и обязательно учитывать передвижения в пешей доступности (например: 1 - из дома на работу, 2 - с работы в магазин, 3 - из магазина домой, 4 - снова из дома в детский сад и т.д.)
</li>
<li>В каждом передвижении важно выбирать адрес отправления и прибытия из списка, который выпадает в качестве подсказки при вводе адреса (для корректного определения координат местоположения)
</li>
</ol>"
          :expressions="true"
        />
        <StaticElement
          name="divider"
          tag="hr"
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
                  :items="[
                    {
                      value: 0,
                      label: 'Пешком',
                    },
                    {
                      value: 1,
                      label: 'Транспорт',
                    },
                  ]"
                  :rules="['required']"
                />
                <MultiselectElement
                  name="transport"
                  :close-on-select="false"
                  :items="[
                    {
                      value: 0,
                      label: 'Велосипед',
                    },
                    {
                      value: '1',
                      label: 'Автобус',
                    },
                    {
                      value: '2',
                      label: 'Трамвай',
                    },
                    {
                      value: '3',
                      label: 'Каршеринг',
                    },
                  ]"
                  :search="true"
                  :native="false"
                  label="Тип транспорта"
                  input-type="search"
                  autocomplete="off"
                  :rules="['required', 'min:1']"
                  :conditions="[
                    ['movements.*.container.typeMovement', 'in', [1]],
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
                    ['movements.*.container.transport', 'in', ['3']],
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
                    ['movements.*.container.typeMovement', 'in', [1]],
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
                    ['movements.*.container.typeMovement', 'in', [1]],
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
                    ['movements.*.container.typeMovement', 'in', [1]],
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
                  :items="[
                    {
                      value: 0,
                      label: 'Дом - место жительства',
                    },
                    {
                      value: null,
                      label: 'Дом друзей или родственников',
                    },
                  ]"
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
                  :items="[
                    {
                      value: 0,
                      label: 'Label',
                    },
                  ]"
                  :search="true"
                  :native="false"
                  label="Адрес отправления"
                  input-type="search"
                  autocomplete="off"
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
                  :items="[
                    {
                      value: 0,
                      label: 'Дом - место жительства',
                    },
                    {
                      value: null,
                      label: 'Дом друзей или родственников',
                    },
                  ]"
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
                    ['movements.*.container.typeMovement', 'in', [1]],
                  ]"
                />
                <TextElement
                  name="number"
                  input-type="number"
                  :rules="['nullable', 'min:0', 'max:25000', 'integer']"
                  autocomplete="off"
                  label="Стоимость поездки / парковки"
                  :conditions="[
                    ['movements.*.container.typeMovement', 'in', [1]],
                  ]"
                />
                <SelectElement
                  name="coordinatesArrivalAddress"
                  :items="[
                    {
                      value: 0,
                      label: 'Label',
                    },
                  ]"
                  :search="true"
                  :native="false"
                  input-type="search"
                  autocomplete="off"
                  label="Адрес прибытия"
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
import { computed, ref } from 'vue';
import { useFormsStore } from '@/forms/formDataStore';
import type { Vueform } from '@vueform/vueform';
import { enumToOptions } from './enums';
import { Gender } from './enums';
import { Validator } from '@vueform/vueform';
import type { DaDataAddress } from 'react-dadata';

const precise = class extends Validator {
  check(value: DaDataAddress | null) {
    console.log(value);
    if (
      !value ||
      typeof value !== 'object' ||
      !('house' in value) ||
      !value.house
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
  // TODO add enhanced home address validation: it has to be house or apartment address
  console.log(form$.data);
};

const store = useFormsStore();

const data = computed({
  get: () => store.form,
  set: (data) => (store.form = data),
});

const { getAddressItems, ADDRESS_DELAY } = useDaDataAddress(3);

const isSubmitted = ref(false);

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
}
</style>
