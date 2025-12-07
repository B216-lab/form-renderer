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
            :label="t('auth.password')"
            name="password"
          >
            <UInput
              v-model="password"
              type="password"
              autocomplete="current-password"
              :placeholder="t('auth.passwordPlaceholder')"
              :disabled="authStore.isLoading"
              class="w-full"
            />
          </UFormField>

          <UFormField
            v-if="isRegisterMode"
            :label="t('auth.confirmPassword')"
            name="confirmPassword"
          >
            <UInput
              v-model="confirmPassword"
              type="password"
              autocomplete="new-password"
              :placeholder="t('auth.confirmPasswordPlaceholder')"
              :disabled="authStore.isLoading"
              class="w-full"
            />
          </UFormField>

          <UFormField
            v-if="isOttMode && tokenRequested"
            name="ottToken"
          >
            <UInput
              v-model="ottToken"
              type="password"
              trailing-icon="i-lucide-key"
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              :disabled="authStore.isLoading"
              class="w-full font-mono text-xs"
            />
          </UFormField>

          <UAlert
            v-if="isOttMode && tokenRequested"
            color="success"
            variant="subtle"
            :title="t('auth.ottSentTitle')"
            :description="
              t('auth.ottSentDescription', {
                email: email || 'указанный e-mail',
              })
            "
          />

          <UAlert
            v-if="passwordsMismatch"
            color="warning"
            variant="subtle"
            :title="t('auth.passwordsMismatchTitle')"
            :description="t('auth.passwordsMismatchDescription')"
          />

          <UAlert
            v-if="errorMessage"
            color="error"
            variant="subtle"
            :title="t('auth.errorTitle')"
            :description="errorMessage"
          />

          <UFormField
            name="consent"
            :error="consentError"
          >
            <div class="flex items-start gap-2 text-xs text-gray-500">
              <UCheckbox v-model="consentAccepted" />
              <p>
                {{ t('auth.consentLabel') }}
                <a
                  href="/consent"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="underline"
                >
                  {{ t('auth.consentLink') }}
                </a>
              </p>
            </div>
          </UFormField>

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
              {{ t('auth.sendCode') }}
            </UButton>
            <UButton
              v-else
              block
              size="md"
              type="submit"
              :loading="authStore.isLoading"
              :disabled="isSubmitDisabled"
            >
              {{ isRegisterMode ? t('auth.register') : t('auth.login') }}
            </UButton>
          </div>

          <div
            v-if="isOttMode && tokenRequested"
            class="flex items-center justify-between pt-1 text-xs text-gray-500"
          >
            <span v-if="!isOttExpired">
              {{
                t('auth.ottCountdown', {
                  time: formattedOttTime,
                })
              }}
            </span>
            <template v-else>
              <span>{{ t('auth.ottExpired') }}</span>
              <UButton
                size="xs"
                variant="ghost"
                color="neutral"
                :loading="authStore.isLoading"
                @click="handleRequestToken"
              >
                {{ t('auth.sendAgain') }}
              </UButton>
            </template>
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
  onBeforeUnmount,
  computed,
  watch,
  nextTick,
  type ComponentPublicInstance,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { z } from 'zod';

import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const OTT_STORAGE_KEY = 'ott-session';

type OttSession = {
  email: string;
  expiresAt: string;
};

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const confirmPassword = ref('');
const ottToken = ref('');
const tokenRequested = ref(false);
const ottExpiresAt = ref<Date | null>(null);
const ottRemainingSeconds = ref(0);
const emailError = ref('');
const emailInputRef = ref<ComponentPublicInstance | null>(null);
const consentAccepted = ref(false);
const consentError = ref('');

const emailSchema = z
  .string()
  .min(1, 'Укажите e-mail')
  .pipe(z.preprocess((val: string) => val.trim(), z.email().toLowerCase()));

type AuthMode = 'login' | 'register' | 'ott';
const authMode = ref<AuthMode>('login');

const isRegisterMode = computed(() => authMode.value === 'register');
const isOttMode = computed(() => authMode.value === 'ott');

const isOttExpired = computed(
  () => tokenRequested.value && ottRemainingSeconds.value <= 0
);

const formattedOttTime = computed(() => {
  const total = ottRemainingSeconds.value;
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');
  return `${mm}:${ss}`;
});

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

let ottIntervalId: number | null = null;

const clearOttTimer = () => {
  if (ottIntervalId !== null) {
    window.clearInterval(ottIntervalId);
    ottIntervalId = null;
  }
};

const saveOttSession = (session: OttSession) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(OTT_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Игнорируем ошибки доступа к localStorage
  }
};

const loadOttSession = (): OttSession | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(OTT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OttSession>;
    if (!parsed.email || !parsed.expiresAt) return null;
    return { email: parsed.email, expiresAt: parsed.expiresAt };
  } catch {
    return null;
  }
};

const clearOttSession = () => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(OTT_STORAGE_KEY);
  } catch {
    // Игнорируем ошибки доступа к localStorage
  }
};

const startOttTimer = (expiresAtIso: string) => {
  clearOttTimer();

  const expiresAt = new Date(expiresAtIso);
  ottExpiresAt.value = expiresAt;

  const tick = () => {
    const diffMs = expiresAt.getTime() - Date.now();
    const seconds = Math.max(0, Math.floor(diffMs / 1000));
    ottRemainingSeconds.value = seconds;
    if (seconds <= 0) {
      clearOttTimer();
      clearOttSession();
    }
  };

  tick();

  if (expiresAt.getTime() > Date.now()) {
    ottIntervalId = window.setInterval(tick, 1000);
  }
};

watch(authMode, (mode, previous) => {
  errorMessage.value = '';

  // Очищаем состояние OTT только при выходе из режима 'ott',
  // чтобы не сбрасывать восстановленный по refresh поток.
  if (previous === 'ott' && mode !== 'ott') {
    tokenRequested.value = false;
    ottToken.value = '';
    clearOttTimer();
    ottRemainingSeconds.value = 0;
    ottExpiresAt.value = null;
    clearOttSession();
  }

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

  if (!validateConsent()) {
    return;
  }

  errorMessage.value = '';
  try {
    const result = await authStore.requestOneTimeToken(email.value);
    tokenRequested.value = true;
    if (result?.expiresAt) {
      startOttTimer(result.expiresAt);
      saveOttSession({
        email: email.value,
        expiresAt: result.expiresAt,
      });
    } else {
      // Если по какой-то причине время истечения не пришло, сбрасываем таймер
      clearOttTimer();
      ottRemainingSeconds.value = 0;
      ottExpiresAt.value = null;
      clearOttSession();
    }
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Не удалось отправить код';
  }
};

const handleSubmit = async () => {
  if (isSubmitDisabled.value) {
    return;
  }

  if (!validateConsent()) {
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
      clearOttSession();
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
  // Базовая очистка полей при монтировании
  email.value = '';
  password.value = '';
  errorMessage.value = '';
  confirmPassword.value = '';
  ottToken.value = '';
  tokenRequested.value = false;
  emailError.value = '';
  consentAccepted.value = false;

  // Попытка восстановить состояние OTT из localStorage
  const storedSession = loadOttSession();
  if (storedSession) {
    const expiresAt = new Date(storedSession.expiresAt);
    if (expiresAt.getTime() > Date.now()) {
      email.value = storedSession.email;
      authMode.value = 'ott';
      tokenRequested.value = true;
      startOttTimer(storedSession.expiresAt);
    } else {
      clearOttSession();
      authMode.value = 'ott';
    }
  } else {
    authMode.value = 'ott';
  }

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

const validateConsent = () => {
  if (!consentAccepted.value) {
    consentError.value = t('auth.consentError');
    return false;
  }
  consentError.value = '';
  return true;
};

watch(consentAccepted, (value) => {
  if (value) {
    consentError.value = '';
  }
});

onBeforeUnmount(() => {
  clearOttTimer();
});
</script>

<style scoped></style>
