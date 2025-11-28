<script setup lang="ts">
import { useMessage } from 'naive-ui';
import { onMounted } from 'vue';
import { setGlobalMessageApi } from '../utils/errorHandler';

const messageApi = useMessage();

onMounted(() => {
  setGlobalMessageApi(messageApi);
});
</script>

<template>
  <slot />
</template>

