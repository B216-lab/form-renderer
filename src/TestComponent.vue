<template>
  <Vueform
    :prepare="prepare"
    ref="form$"
    v-model="data"
    sync
  >
    <SelectElement
      label="Адрес проживания"
      name="address"
      :search="true"
      :delay="ADDRESS_DELAY"
      :filter-results="false"
      :items="getAddressItems"
    />

    <SelectElement
      label="Другой адрес проживания"
      name="address_other"
      :search="true"
      :delay="ADDRESS_DELAY"
      :filter-results="false"
      :items="getAddressItems"
    />
    <ButtonElement
      name="submit"
      button-label="Submit"
      submits
    />
  </Vueform>
</template>

<script setup lang="ts">
import { useDaDataAddress } from '@/daDataService/useDaDataAddress';
import { computed } from 'vue';
import { useFormsStore } from '@/forms/formDataStore';
import type { Vueform } from '@vueform/vueform';

const prepare = (form$: Vueform) => {
  console.log(form$.data);
};

const store = useFormsStore();

const data = computed({
  get: () => store.form,
  set: (data) => (store.form = data),
});

const { getAddressItems, ADDRESS_DELAY } = useDaDataAddress(3);
</script>
