<template>
<Vueform :prepare="prepare" ref="form$">
  <div style="margin-bottom: 12px">
    <div>Pinia demo:</div>
    <div>Count: {{ counter.count }} | Double: {{ counter.doubleCount }}</div>
    <button type="button" @click="counter.increment()">+1</button>
    <button type="button" @click="counter.decrement()">-1</button>
  </div>
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
import { useDaDataAddress } from '@/components/useDaDataAddress'
import { useCounterStore } from '@/stores/counter'


const prepare = (form$: any) => {
  try {
    console.log(form$.data)
  } catch (error) {
    throw error
  }
}




const { getAddressItems, ADDRESS_DELAY } = useDaDataAddress(3)
const counter = useCounterStore()
</script>

