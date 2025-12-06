<template>
  <div
    class="min-h-screen flex items-center justify-center bg-[var(--n-body-color)] px-4"
  >
    <UCard class="w-full max-w-md">
      <div class="space-y-6">
        <UForm
          as="form"
          class="space-y-4"
          @submit.prevent="handleSubmit"
        >
          <UFormField
            name="email"
            :error="emailError"
          >
            <UInput
              ref="emailInputRef"
              v-model="email"
              type="email"
              trailing-icon="i-lucide-at-sign"
              autocomplete="email"
              placeholder="user@example.com"
              :disabled="authStore.isLoading || (isOttMode && tokenRequested)"
              class="w-full"
            />
          </UFormField>

          <UFormField
            v-if="!isOttMode"
            label="Пароль"
            name="password"
          >
            <UInput
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="Введите пароль"
              :disabled="authStore.isLoading"
              class="w-full"
            />
          </UFormField>

          <UFormField
            v-if="isRegisterMode"
            label="Повторите пароль"
            name="confirmPassword"
          >
            <UInput
              v-model="confirmPassword"
              type="password"
              autocomplete="new-password"
              placeholder="Повторите пароль"
              :disabled="authStore.isLoading"
              class="w-full"
            />
          </UFormField>

          <UFormField
            v-if="isOttMode && tokenRequested"
            label="Код из письма"
            name="ottToken"
          >
            <UInput
              v-model="ottToken"
              type="password"
              placeholder="Вставьте или введите код"
              :disabled="authStore.isLoading"
              class="w-full font-mono text-xs"
            />
          </UFormField>

          <UAlert
            v-if="isOttMode && tokenRequested"
            color="success"
            variant="subtle"
            title="Код отправлен"
            :description="`Код отправлен на ${email || 'указанный e-mail'}. Проверьте почту и введите код.`"
          />

          <UAlert
            v-if="passwordsMismatch"
            color="warning"
            variant="subtle"
            title="Проверьте пароль"
            description="Пароли не совпадают."
          />

          <UAlert
            v-if="errorMessage"
            color="error"
            variant="subtle"
            title="Ошибка"
            :description="errorMessage"
          />

          <div class="space-y-3 pt-2">
            <UButton
              v-if="isOttMode && !tokenRequested"
              block
              size="md"
              type="button"
              :loading="authStore.isLoading"
              :disabled="!email || authStore.isLoading"
              @click="handleRequestToken"
            >
              Отправить код
            </UButton>
            <UButton
              v-else
              block
              size="md"
              type="submit"
              :loading="authStore.isLoading"
              :disabled="isSubmitDisabled"
            >
              {{ isRegisterMode ? 'Зарегистрироваться' : 'Войти' }}
            </UButton>
          </div>
        </UForm>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'LoginScreen' });

import {
  ref,
  onMounted,
  computed,
  watch,
  nextTick,
  type ComponentPublicInstance,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { z } from 'zod';
import { ru } from 'zod/locales';

import { useAuthStore } from '../stores/authStore';

z.config(ru());
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const confirmPassword = ref('');
const ottToken = ref('');
const tokenRequested = ref(false);
const emailError = ref('');
const emailInputRef = ref<ComponentPublicInstance | null>(null);

const emailSchema = z
  .string()
  .min(1, 'Укажите e-mail')
  .email('Введите корректный e-mail');

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
  emailError.value = '';
  if (mode === 'login') {
    confirmPassword.value = '';
  }
});

const validateEmail = () => {
  const result = emailSchema.safeParse(email.value);
  if (!result.success) {
    emailError.value = result.error.issues[0]?.message ?? 'Некорректный e-mail';
    return false;
  }
  emailError.value = '';
  return true;
};

const handleRequestToken = async () => {
  if (authStore.isLoading) {
    return;
  }

  if (!validateEmail()) {
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

  if (!isOttMode.value && !validateEmail()) {
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

onMounted(async () => {
  // Очистка полей при монтировании
  email.value = '';
  password.value = '';
  errorMessage.value = '';
  confirmPassword.value = '';
  ottToken.value = '';
  tokenRequested.value = false;
  emailError.value = '';
  authMode.value = 'ott';

  // Фокусируем поле email после монтирования
  await nextTick();
  const inputElement =
    emailInputRef.value?.$el?.querySelector('input') ||
    emailInputRef.value?.$el?.querySelector('input[type="email"]') ||
    document.querySelector('input[type="email"]');
  if (inputElement instanceof HTMLInputElement) {
    inputElement.focus();
  }
});
</script>

<style scoped></style>
