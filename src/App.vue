<template>
  <n-config-provider :theme="theme">
    <div
      v-if="authStore.isLoading"
      class="loading-state"
    >
      <n-spin size="large">
        <template #description>Загрузка...</template>
      </n-spin>
    </div>
    <Login v-else-if="!authStore.isAuthenticated" />
    <n-layout
      v-else
      :style="layoutStyle"
      :content-style="contentStyle"
    >
      <n-layout-header
        bordered
        :style="headerStyle"
      >
        <n-space
          justify="space-between"
          align="center"
          wrap
        >
          <n-gradient-text
            :style="titleStyle"
            type="info"
          >
            Форма передвижений
          </n-gradient-text>
          <n-space
            align="center"
            size="small"
            wrap
          >
            <n-tag
              size="small"
              type="info"
              round
              bordered
            >
              {{ authStore.user?.username }}
            </n-tag>
            <n-button
              size="small"
              tertiary
              @click="handleLogout"
            >
              Выйти
            </n-button>
          </n-space>
        </n-space>
      </n-layout-header>
      <n-layout-content>
        <DayMovements />
      </n-layout-content>
    </n-layout>
  </n-config-provider>
</template>

<script setup lang="ts">
import {
  NButton,
  NConfigProvider,
  NGradientText,
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NSpace,
  NSpin,
  NTag,
} from 'naive-ui';
import { useAuthStore } from './stores/authStore';
import Login from './components/Login.vue';
import DayMovements from './forms/DayMovements.vue';

import { darkTheme, useOsTheme } from 'naive-ui';
import { computed } from 'vue';
const osTheme = useOsTheme();
const theme = computed(() => (osTheme.value === 'dark' ? darkTheme : null));

const authStore = useAuthStore();

const handleLogout = async () => {
  await authStore.logout();
};

const layoutStyle = computed(() => ({
  minHeight: '100vh',
}));

const contentStyle = computed(() => ({
  padding: '16px',
  maxWidth: '1200px',
  margin: '0 auto',
  width: '100%',
}));

const headerStyle = computed(() => ({
  padding: '12px 24px',
}));

const titleStyle = computed(() => ({
  fontSize: '1.25rem',
  fontWeight: 600,
}));
</script>

<style scoped>
.loading-state {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .app-content {
    padding: 1rem;
  }
}
</style>
