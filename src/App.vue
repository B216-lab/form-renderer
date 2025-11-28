<template>
  <n-config-provider :theme="theme">
    <router-view />
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, darkTheme, useOsTheme } from 'naive-ui';
import { computed } from 'vue';

const osTheme = useOsTheme();
const theme = computed(() => (osTheme.value === 'dark' ? darkTheme : null));
</script>

<style scoped></style>
