<template>
  <div class="day-movements">
    <div class="day-movements__card">
      <SuccessScreen v-if="isSubmitted" />
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

  const data: string | null = localStorage.getItem('form');
  if (data) {
    try {
      await form$.value.load(JSON.parse(data));
      form$.value.clean();
    } catch {
      // If loading fails (bad data), remove invalid saved form
      localStorage.removeItem('form');
    }
  } else if (import.meta.env.DEV) {
    // If we are in dev environment and there's no saved form, optionally seed with test data
    // For now, just log for dev
    const testData =
      '{"age":22,"gender":"MALE","socialStatus":"PENSIONER","transportationCosts":[0,3000],"coordinatesAddress":{"value":"Саратовская обл, г Энгельс, ул Байкальская, д 98","unrestricted_value":"413112, Саратовская обл, г Энгельс, ул Байкальская, д 98","data":{"postal_code":"413112","country":"Россия","country_iso_code":"RU","federal_district":"Приволжский","region_fias_id":"df594e0e-a935-4664-9d26-0bae13f904fe","region_kladr_id":"6400000000000","region_iso_code":"RU-SAR","region_with_type":"Саратовская обл","region_type":"обл","region_type_full":"область","region":"Саратовская","area_fias_id":null,"area_kladr_id":null,"area_with_type":null,"area_type":null,"area_type_full":null,"area":null,"city_fias_id":"c58d0505-54eb-4c34-8216-b14f7cdb0ecb","city_kladr_id":"6400001300000","city_with_type":"г Энгельс","city_type":"г","city_type_full":"город","city":"Энгельс","city_area":null,"city_district_fias_id":null,"city_district_kladr_id":null,"city_district_with_type":null,"city_district_type":null,"city_district_type_full":null,"city_district":null,"settlement_fias_id":null,"settlement_kladr_id":null,"settlement_with_type":null,"settlement_type":null,"settlement_type_full":null,"settlement":null,"street_fias_id":"bdc00cf0-a061-472e-aaae-056a2c85e2d8","street_kladr_id":"64000013000001000","street_with_type":"ул Байкальская","street_type":"ул","street_type_full":"улица","street":"Байкальская","stead_fias_id":null,"stead_cadnum":null,"stead_type":null,"stead_type_full":null,"stead":null,"house_fias_id":"51304840-19aa-4d2f-93a1-e6ea0215e8cb","house_kladr_id":"6400001300000100098","house_cadnum":null,"house_flat_count":null,"house_type":"д","house_type_full":"дом","house":"98","block_type":null,"block_type_full":null,"block":null,"entrance":null,"floor":null,"flat_fias_id":null,"flat_cadnum":null,"flat_type":null,"flat_type_full":null,"flat":null,"flat_area":null,"square_meter_price":null,"flat_price":null,"room_fias_id":null,"room_cadnum":null,"room_type":null,"room_type_full":null,"room":null,"postal_box":null,"fias_id":"51304840-19aa-4d2f-93a1-e6ea0215e8cb","fias_code":null,"fias_level":"8","fias_actuality_state":"0","kladr_id":"6400001300000100098","geoname_id":"563464","capital_marker":"0","okato":"63250501000","oktmo":"63650101001","tax_office":"6449","tax_office_legal":"6449","timezone":null,"geo_lat":"51.4470576","geo_lon":"46.0841895","beltway_hit":null,"beltway_distance":null,"metro":null,"divisions":null,"qc_geo":"0","qc_complete":null,"qc_house":null,"history_values":null,"unparsed_parts":null,"source":null,"qc":null}},"financialSituation":[65000,145000],"baseComment":null,"dateMovements":"2025-11-12","movements":[{"typeMovement":"ON_FOOT","transport":[],"numberPeopleInCar":1,"pedestrianApproachtoStartingStopOrParkingLot":null,"waitingTimeForTransport":null,"numberOfTransfers":0,"waitingTimeBetweenTransfers":"5","departureTime":"12:30","departurePlace":"HOME_RESIDENCE","coordinatesDepartureAddress":null,"arrivalTime":"15:00","arrivalPlace":"FRIENDS_RELATIVES_HOME","pedestrianApproachFromFinalStopOrParking":null,"number":null,"coordinatesArrivalAddress":{"value":"г Саратов, тер СНТ Хлеб-Клещевка, д 5","unrestricted_value":"410531, Саратовская обл, г Саратов, тер СНТ Хлеб-Клещевка, д 5","data":{"postal_code":"410531","country":"Россия","country_iso_code":"RU","federal_district":"Приволжский","region_fias_id":"df594e0e-a935-4664-9d26-0bae13f904fe","region_kladr_id":"6400000000000","region_iso_code":"RU-SAR","region_with_type":"Саратовская обл","region_type":"обл","region_type_full":"область","region":"Саратовская","area_fias_id":null,"area_kladr_id":null,"area_with_type":null,"area_type":null,"area_type_full":null,"area":null,"city_fias_id":"bf465fda-7834-47d5-986b-ccdb584a85a6","city_kladr_id":"6400000100000","city_with_type":"г Саратов","city_type":"г","city_type_full":"город","city":"Саратов","city_area":null,"city_district_fias_id":null,"city_district_kladr_id":null,"city_district_with_type":null,"city_district_type":null,"city_district_type_full":null,"city_district":null,"settlement_fias_id":"fb51926a-4af4-4f94-ad11-27b7d18a0c0d","settlement_kladr_id":"64000001000261200","settlement_with_type":"тер СНТ Хлеб-Клещевка","settlement_type":"тер","settlement_type_full":"территория","settlement":"СНТ Хлеб-Клещевка","street_fias_id":null,"street_kladr_id":null,"street_with_type":null,"street_type":null,"street_type_full":null,"street":null,"stead_fias_id":null,"stead_cadnum":null,"stead_type":null,"stead_type_full":null,"stead":null,"house_fias_id":"f5aea59e-bb2d-421c-b524-5350d8b62898","house_kladr_id":"6400000100026120028","house_cadnum":null,"house_flat_count":null,"house_type":"д","house_type_full":"дом","house":"5","block_type":null,"block_type_full":null,"block":null,"entrance":null,"floor":null,"flat_fias_id":null,"flat_cadnum":null,"flat_type":null,"flat_type_full":null,"flat":null,"flat_area":null,"square_meter_price":null,"flat_price":null,"room_fias_id":null,"room_cadnum":null,"room_type":null,"room_type_full":null,"room":null,"postal_box":null,"fias_id":"f5aea59e-bb2d-421c-b524-5350d8b62898","fias_code":null,"fias_level":"8","fias_actuality_state":"0","kladr_id":"6400000100026120028","geoname_id":"498677","capital_marker":"2","okato":"63201000000","oktmo":"63701000","tax_office":"6432","tax_office_legal":"6432","timezone":null,"geo_lat":"51.533557","geo_lon":"46.034257","beltway_hit":null,"beltway_distance":null,"metro":null,"divisions":null,"qc_geo":"4","qc_complete":null,"qc_house":null,"history_values":["тер СНТ Хлеб"],"unparsed_parts":null,"source":null,"qc":null}},"textarea":null}]}';
    await form$.value.load(JSON.parse(testData));
    form$.value.clean();
    console.log('Dev environment detected. No saved form loaded.');
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
