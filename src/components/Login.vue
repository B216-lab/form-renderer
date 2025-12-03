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
        <n-form
          layout="vertical"
          :show-feedback="false"
          @submit.prevent="handleSubmit"
        >
          <n-form-item :show-label="false">
            <n-input
              v-model:value="email"
              type="text"
              inputmode="email"
              placeholder="user@example.com"
              autocomplete="email"
              :disabled="authStore.isLoading || (isOttMode && tokenRequested)"
            />
          </n-form-item>

          <n-form-item
            v-if="!isOttMode"
            label="Пароль"
          >
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
            v-if="isOttMode && tokenRequested"
            :show-label="false"
          >
            <n-input
              v-model:value="ottToken"
              type="text"
              placeholder="Введите код из письма"
              :disabled="authStore.isLoading"
            />
          </n-form-item>

          <n-form-item
            v-if="isOttMode && tokenRequested"
            :show-label="false"
          >
            <n-alert
              type="success"
              title="Код отправлен"
              closable
            >
              Код отправлен на {{ email }}. Проверьте почту и введите код.
            </n-alert>
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

          <n-form-item
            :show-label="false"
            :style="buttonContainerStyle"
          >
            <n-space
              vertical
              :size="16"
            >
              <n-button
                v-if="isOttMode && !tokenRequested"
                type="primary"
                size="large"
                :block="true"
                :loading="authStore.isLoading"
                :disabled="!email || authStore.isLoading"
                @click="handleRequestToken"
              >
                Отправить код
              </n-button>
              <n-button
                v-else
                type="primary"
                size="large"
                :block="true"
                attr-type="submit"
                :loading="authStore.isLoading"
                :disabled="isSubmitDisabled"
              >
                {{
                  isRegisterMode
                    ? 'Зарегистрироваться'
                    : isOttMode
                      ? 'Войти'
                      : 'Войти'
                }}
              </n-button>
            </n-space>
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
const ottToken = ref('');
const tokenRequested = ref(false);
type AuthMode = 'login' | 'register' | 'ott';
const authMode = ref<AuthMode>('login');

const isRegisterMode = computed(() => authMode.value === 'register');
const isOttMode = computed(() => authMode.value === 'ott');

const passwordsMismatch = computed(
  () =>
    isRegisterMode.value &&
    password.value.length > 0 &&
    confirmPassword.value.length > 0 &&
    password.value !== confirmPassword.value
);

const isSubmitDisabled = computed(() => {
  if (authStore.isLoading) return true;
  if (isOttMode.value) {
    return !tokenRequested.value || !ottToken.value;
  }
  if (!email.value || !password.value) return true;
  if (isRegisterMode.value) {
    return !confirmPassword.value || passwordsMismatch.value;
  }
  return false;
});

watch(authMode, (mode) => {
  errorMessage.value = '';
  tokenRequested.value = false;
  ottToken.value = '';
  if (mode === 'login') {
    confirmPassword.value = '';
  }
});

const handleRequestToken = async () => {
  if (!email.value || authStore.isLoading) {
    return;
  }

  errorMessage.value = '';
  try {
    await authStore.requestOneTimeToken(email.value);
    tokenRequested.value = true;
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Не удалось отправить код';
  }
};

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
    if (isOttMode.value) {
      await authStore.loginWithOneTimeToken(ottToken.value);
    } else if (isRegisterMode.value) {
      await authStore.register(email.value, password.value);
      await authStore.login(email.value, password.value);
    } else {
      await authStore.login(email.value, password.value);
    }

    const redirectPath =
      typeof route.query.redirect === 'string' ? route.query.redirect : '/';
    await router.push(redirectPath);
  } catch (error) {
    const fallback = isRegisterMode.value
      ? 'Ошибка регистрации'
      : isOttMode.value
        ? 'Ошибка входа по коду'
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
  ottToken.value = '';
  tokenRequested.value = false;
  authMode.value = 'ott';
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

const buttonContainerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '16px',
};
</script>

<style scoped></style>
