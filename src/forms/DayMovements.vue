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
  get: () => store.dayMovements,
  set: (data) => (store.dayMovements = data),
});

const form$ = ref<Vueform | null>(null);
onMounted(async () => {
  if (!form$.value) {
    return;
  }

  const data: string | null = localStorage.getItem('form');
  if (data) {
    try {
      const parsedData = JSON.parse(data);
      await form$.value.load(parsedData);
    } catch {
      localStorage.removeItem('form');
    }
  } else if (import.meta.env.DEV) {
    const testData =
      '{"agenix":22,"gender":"MALE","socialStatus":"STUDENT","coordinatesAddress":{"value":"г Ростов-на-Дону, ул Байкальская, д 88","unrestricted_value":"344041, Ростовская обл, г Ростов-на-Дону, ул Байкальская, д 88","data":{"postal_code":"344041","country":"Россия","country_iso_code":"RU","federal_district":"Южный","region_fias_id":"f10763dc-63e3-48db-83e1-9c566fe3092b","region_kladr_id":"6100000000000","region_iso_code":"RU-ROS","region_with_type":"Ростовская обл","region_type":"обл","region_type_full":"область","region":"Ростовская","area_fias_id":null,"area_kladr_id":null,"area_with_type":null,"area_type":null,"area_type_full":null,"area":null,"city_fias_id":"c1cfe4b9-f7c2-423c-abfa-6ed1c05a15c5","city_kladr_id":"6100000100000","city_with_type":"г Ростов-на-Дону","city_type":"г","city_type_full":"город","city":"Ростов-на-Дону","city_area":null,"city_district_fias_id":null,"city_district_kladr_id":null,"city_district_with_type":null,"city_district_type":null,"city_district_type_full":null,"city_district":null,"settlement_fias_id":null,"settlement_kladr_id":null,"settlement_with_type":null,"settlement_type":null,"settlement_type_full":null,"settlement":null,"street_fias_id":"40e5bb3e-2ce7-4263-9318-40111507b3fd","street_kladr_id":"61000001000025600","street_with_type":"ул Байкальская","street_type":"ул","street_type_full":"улица","street":"Байкальская","stead_fias_id":null,"stead_cadnum":null,"stead_type":null,"stead_type_full":null,"stead":null,"house_fias_id":"1817b5e3-949b-4be8-a6c6-d7eb63022319","house_kladr_id":"6100000100002560144","house_cadnum":null,"house_flat_count":null,"house_type":"д","house_type_full":"дом","house":"88","block_type":null,"block_type_full":null,"block":null,"entrance":null,"floor":null,"flat_fias_id":null,"flat_cadnum":null,"flat_type":null,"flat_type_full":null,"flat":null,"flat_area":null,"square_meter_price":null,"flat_price":null,"room_fias_id":null,"room_cadnum":null,"room_type":null,"room_type_full":null,"room":null,"postal_box":null,"fias_id":"1817b5e3-949b-4be8-a6c6-d7eb63022319","fias_code":null,"fias_level":"8","fias_actuality_state":"0","kladr_id":"6100000100002560144","geoname_id":"501175","capital_marker":"2","okato":"60401000000","oktmo":"60701000001","tax_office":"6194","tax_office_legal":"6194","timezone":null,"geo_lat":"47.2409159","geo_lon":"39.6266622","beltway_hit":null,"beltway_distance":null,"metro":null,"divisions":null,"qc_geo":"0","qc_complete":null,"qc_house":null,"history_values":null,"unparsed_parts":null,"source":null,"qc":null}},"baseComment":"это тест","dateMovements":"2025-11-12","movements":[{"typeMovement":"ON_FOOT","transport":[],"numberPeopleInCar":"1","pedestrianApproachtoStartingStopOrParkingLot":null,"waitingTimeForTransport":null,"numberOfTransfers":"0","waitingTimeBetweenTransfers":"85","departureTime":"12:10","departurePlace":"HOME_RESIDENCE","coordinatesDepartureAddress":null,"arrivalTime":"13:35","arrivalPlace":"DAYCARE_CENTER","pedestrianApproachFromFinalStopOrParking":null,"number":null,"coordinatesArrivalAddress":{"value":"Приморский край, г Находка, тер. ГСК Карс, д 8","unrestricted_value":"Приморский край, г Находка, тер. ГСК Карс, д 8","data":{"postal_code":null,"country":"Россия","country_iso_code":"RU","federal_district":"Дальневосточный","region_fias_id":"43909681-d6e1-432d-b61f-ddac393cb5da","region_kladr_id":"2500000000000","region_iso_code":"RU-PRI","region_with_type":"Приморский край","region_type":"край","region_type_full":"край","region":"Приморский","area_fias_id":null,"area_kladr_id":null,"area_with_type":null,"area_type":null,"area_type_full":null,"area":null,"city_fias_id":"225a3506-35aa-4456-8bd7-244bdfbc4eaf","city_kladr_id":"2500000400000","city_with_type":"г Находка","city_type":"г","city_type_full":"город","city":"Находка","city_area":null,"city_district_fias_id":null,"city_district_kladr_id":null,"city_district_with_type":null,"city_district_type":null,"city_district_type_full":null,"city_district":null,"settlement_fias_id":"150bc38e-49c5-4f17-a541-d18065b6e709","settlement_kladr_id":"25000004000072400","settlement_with_type":"тер. ГСК Карс","settlement_type":"тер. ГСК","settlement_type_full":"территория гск","settlement":"Карс","street_fias_id":null,"street_kladr_id":null,"street_with_type":null,"street_type":null,"street_type_full":null,"street":null,"stead_fias_id":null,"stead_cadnum":null,"stead_type":null,"stead_type_full":null,"stead":null,"house_fias_id":null,"house_kladr_id":null,"house_cadnum":null,"house_flat_count":null,"house_type":"д","house_type_full":"дом","house":"8","block_type":null,"block_type_full":null,"block":null,"entrance":null,"floor":null,"flat_fias_id":null,"flat_cadnum":null,"flat_type":null,"flat_type_full":null,"flat":null,"flat_area":null,"square_meter_price":null,"flat_price":null,"room_fias_id":null,"room_cadnum":null,"room_type":null,"room_type_full":null,"room":null,"postal_box":null,"fias_id":"150bc38e-49c5-4f17-a541-d18065b6e709","fias_code":null,"fias_level":"65","fias_actuality_state":"0","kladr_id":"25000004000072400","geoname_id":"2019528","capital_marker":"0","okato":"05414000000","oktmo":"05714000001","tax_office":"2508","tax_office_legal":"2508","timezone":null,"geo_lat":"42.82406","geo_lon":"132.8928168","beltway_hit":null,"beltway_distance":null,"metro":null,"divisions":null,"qc_geo":"4","qc_complete":null,"qc_house":null,"history_values":null,"unparsed_parts":null,"source":null,"qc":null}},"textarea":"странный переход"}],"financialSituationMin":25000,"financialSituationMax":48000,"transportationCostMin":15844,"transportationCostMax":20000}';
    await form$.value.load(JSON.parse(testData));
    form$.value.clean();
  }

  if (form$.value) {
    form$.value.on('change', () => {
      if (form$.value) {
        localStorage.setItem('form', JSON.stringify(form$.value.data));
      }
    });
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
