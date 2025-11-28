<template>
  <n-layout
    :style="layoutStyle"
    :content-style="layoutContentStyle"
  >
    <n-layout-content>
      <n-card
        size="large"
        :style="cardStyle"
      >
        <template #header>
          <n-space
            vertical
            :size="4"
            align="center"
          >
            <span :style="titleStyle">
              {{ isRegisterMode ? 'Создание аккаунта' : 'Вход в систему' }}
            </span>
          </n-space>
        </template>

        <n-tabs
          v-model:value="authMode"
          type="segment"
          size="large"
        >
          <n-tab-pane
            name="login"
            tab="Вход"
          />
          <n-tab-pane
            name="register"
            tab="Регистрация"
          />
        </n-tabs>

        <n-form
          layout="vertical"
          :show-feedback="false"
          @submit.prevent="handleSubmit"
        >
          <n-form-item label="Email">
            <n-input
              v-model:value="email"
              type="text"
              inputmode="email"
              placeholder="user@example.com"
              autocomplete="email"
              :disabled="authStore.isLoading"
            />
          </n-form-item>

          <n-form-item label="Пароль">
            <n-input
              v-model:value="password"
              type="password"
              placeholder="Введите пароль"
              autocomplete="current-password"
              :disabled="authStore.isLoading"
            />
          </n-form-item>

          <n-form-item
            v-if="isRegisterMode"
            label="Повторите пароль"
          >
            <n-input
              v-model:value="confirmPassword"
              type="password"
              placeholder="Повторите пароль"
              autocomplete="new-password"
              :disabled="authStore.isLoading"
            />
          </n-form-item>

          <n-form-item
            v-if="passwordsMismatch"
            :show-label="false"
          >
            <n-alert
              type="warning"
              title="Проверить пароль"
              closable
            >
              Пароли не совпадают
            </n-alert>
          </n-form-item>

          <n-form-item
            v-if="errorMessage"
            :show-label="false"
          >
            <n-alert
              type="error"
              closable
              @close="errorMessage = ''"
            >
              {{ errorMessage }}
            </n-alert>
          </n-form-item>

          <n-form-item :show-label="false">
            <n-button
              type="primary"
              size="large"
              :block="true"
              attr-type="submit"
              :loading="authStore.isLoading"
              :disabled="isSubmitDisabled"
            >
              {{ isRegisterMode ? 'Зарегистрироваться' : 'Войти' }}
            </n-button>
          </n-form-item>
        </n-form>
      </n-card>
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
defineOptions({ name: 'LoginScreen' });
import {
  NAlert,
  NButton,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NLayout,
  NLayoutContent,
  NSpace,
  NTabPane,
  NTabs,
} from 'naive-ui';
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { CSSProperties } from 'vue';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const confirmPassword = ref('');
type AuthMode = 'login' | 'register';
const authMode = ref<AuthMode>('login');

const isRegisterMode = computed(() => authMode.value === 'register');

const passwordsMismatch = computed(
  () =>
    isRegisterMode.value &&
    password.value.length > 0 &&
    confirmPassword.value.length > 0 &&
    password.value !== confirmPassword.value
);

const isSubmitDisabled = computed(() => {
  // В dev-режиме кнопка всегда разблокирована
  if (import.meta.env.DEV) {
    return false;
  }
  if (authStore.isLoading) return true;
  if (!email.value || !password.value) return true;
  if (isRegisterMode.value) {
    return !confirmPassword.value || passwordsMismatch.value;
  }
  return false;
});

watch(authMode, (mode) => {
  errorMessage.value = '';
  if (mode === 'login') {
    confirmPassword.value = '';
  }
});

const handleSubmit = async () => {
  if (isSubmitDisabled.value) {
    return;
  }

  if (passwordsMismatch.value) {
    errorMessage.value = 'Пароли не совпадают';
    return;
  }

  errorMessage.value = '';
  try {
    if (isRegisterMode.value) {
      await authStore.register(email.value, password.value);
    }
    await authStore.login(email.value, password.value);

    const redirectPath =
      typeof route.query.redirect === 'string' ? route.query.redirect : '/';
    await router.push(redirectPath);
  } catch (error) {
    const fallback = isRegisterMode.value
      ? 'Ошибка регистрации'
      : 'Ошибка входа';
    errorMessage.value = error instanceof Error ? error.message : fallback;
  }
};

onMounted(() => {
  // Очистка полей при монтировании
  email.value = '';
  password.value = '';
  errorMessage.value = '';
  confirmPassword.value = '';
  authMode.value = 'login';
});

const layoutStyle: CSSProperties = {
  minHeight: '100vh',
};

const layoutContentStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '24px',
  background: 'var(--n-body-color)',
};

const cardStyle: CSSProperties = {
  maxWidth: '420px',
  width: '100%',
  margin: '0 auto',
};

const titleStyle: CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 600,
  textAlign: 'center',
  display: 'inline-block',
};
</script>

<style scoped></style>
