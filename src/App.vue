<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <n-notification-provider>
        <MessageProviderInit>
          <router-view />
        </MessageProviderInit>
      </n-notification-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import {
  NConfigProvider,
  NMessageProvider,
  NNotificationProvider,
  darkTheme,
  useOsTheme,
} from 'naive-ui';
import { computed } from 'vue';
import MessageProviderInit from './components/MessageProviderInit.vue';

const osTheme = useOsTheme();
const theme = computed(() => (osTheme.value === 'dark' ? darkTheme : null));
</script>

<style scoped></style>
