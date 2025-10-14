<template>
<Vueform :prepare="prepare" ref="form$">
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
  <ButtonElement name="submit" button-label="Submit" submits />
</Vueform>
</template>

<script setup lang="ts">
import { useDaDataAddress } from './components/useDaDataAddress'


const prepare = (form$: any) => {
  try {
    console.log(form$.data)
  } catch (error) {
    throw error
  }
}




const { getAddressItems, ADDRESS_DELAY } = useDaDataAddress(3)
</script>

