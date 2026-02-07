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
          :endpoint="submitForm"
          method="post"
          @success="handleSuccess"
          @error="handleError"
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
                :format-data="simplifyAddress"
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
              <component
                :is="'ListElement'"
                name="movements"
                :min="1"
                label="Передвижения"
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
                          'min:0',
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
                          'min:0',
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
                        :format-data="simplifyAddress"
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
                        :rules="['required', precise]"
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
                        :format-data="simplifyAddress"
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
                        :rules="['required', precise]"
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
                        name="comment"
                        :rules="['max:2000']"
                        label="Комментарий"
                        description="Пожелания по улучшению транспортной инфраструктуры"
                      />
                    </GroupElement>
                  </ObjectElement>
                </template>
              </component>
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
import SuccessScreen from '@/components/SuccessScreen.vue';
import { precise } from './validators';
import { submitForm } from './formSubmission';
import { loadStoredForm, setupFormChangeListener } from './formPersistence';
import { prefillFromProfile } from './profilePrefill';
import { simplifyAddress } from './addressUtils';
import { ApiHttpError, ApiNetworkError } from '@/api';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useToast } from '@nuxt/ui/composables';

// Store и computed данные
const store = useFormsStore();
const data = computed({
  get: () => store.dayMovements,
  set: (data) => (store.dayMovements = data),
});

// Form ref
const form$ = ref<Vueform | null>(null);

// DaData настройки
const { getAddressItems, ADDRESS_DELAY, DEFAULT_MIN_CHARS } =
  useDaDataAddress(3);

// Состояние формы
const isSubmitted = ref(false);
const ADDRESS_SUGGESTION_HINT =
  'Начните вводить адрес, чтобы увидеть подсказки и выбрать нужный вариант. Необходимо выбрать из списка с точностью до дома';

// i18n
const { t } = useI18n();

// Router
const router = useRouter();

// Обработчики
const handleSuccess = () => {
  isSubmitted.value = true;
  const formData = localStorage.getItem('form');
  if (import.meta.env.DEV) {
    return;
  }
  if (!formData) {
    return;
  }
  const parsedData = JSON.parse(formData) as Record<string, unknown>;
  parsedData.movements = {};
  localStorage.setItem('form', JSON.stringify(parsedData));
};

const toast = useToast();

const handleError = (error: ApiHttpError | ApiNetworkError) => {
  // Определяем сообщение об ошибке
  let errorMessage = t('forms.errors.defaultMessage');
  let errorTitle = t('forms.errors.defaultTitle');

  if (error instanceof ApiNetworkError) {
    errorTitle = t('forms.errors.networkTitle');
    errorMessage = error.message || t('forms.errors.networkMessage');
  } else if (error instanceof ApiHttpError) {
    errorTitle = t('forms.errors.serverTitle');
    if (error.status === 400) {
      errorMessage = t('forms.errors.invalidData');
    } else if (error.status === 401) {
      errorMessage = t('forms.errors.sessionExpired');
      // Показываем уведомление и перенаправляем на страницу входа
      toast.add({
        title: errorTitle,
        description: errorMessage,
        color: 'error',
        icon: 'i-lucide-alert-circle',
        duration: 5000,
      });
      // Перенаправляем на страницу входа с параметром о истечении сессии
      router.push({
        name: 'login',
        query: { sessionExpired: 'true' },
      });
      return;
    } else if (error.status === 403) {
      errorMessage = t('forms.errors.insufficientPermissions');
    } else if (error.status === 404) {
      errorMessage = t('forms.errors.serverUnavailable');
    } else if (error.status >= 500) {
      errorMessage = t('forms.errors.internalError');
    } else {
      errorMessage = error.message || t('forms.errors.defaultMessage');
    }
  }

  // Показываем уведомление об ошибке
  toast.add({
    title: errorTitle,
    description: errorMessage,
    color: 'error',
    icon: 'i-lucide-alert-circle',
    duration: 5000,
  });
};

// Инициализация формы
onMounted(async () => {
  // Ждём, пока форма полностью смонтируется
  await nextTick();

  if (!form$.value) {
    // Если форма всё ещё не готова, ждём ещё немного
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (!form$.value) return;
  }

  // Сначала пытается загрузить сохранённую форму (включая movements)
  const hasStoredForm = await loadStoredForm(form$);

  // Если нет сохранённой формы, предзаполняет из профиля
  if (!hasStoredForm) {
    await prefillFromProfile(form$, data, getAddressItems);
  }

  setupFormChangeListener(form$);
});
</script>

<style lang="scss">
@import '@vueform/vueform/themes/vueform/scss/index.scss';
</style>
