<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">
        {{ isRegisterMode ? 'Создание аккаунта' : 'Вход в систему' }}
      </h1>

      <div
        class="auth-toggle"
        role="tablist"
      >
        <button
          type="button"
          class="auth-toggle__btn"
          :class="{ 'auth-toggle__btn--active': !isRegisterMode }"
          @click="setMode('login')"
          :disabled="authStore.isLoading"
        >
          Вход
        </button>
        <button
          type="button"
          class="auth-toggle__btn"
          :class="{ 'auth-toggle__btn--active': isRegisterMode }"
          @click="setMode('register')"
          :disabled="authStore.isLoading"
        >
          Регистрация
        </button>
      </div>

      <form
        @submit.prevent="handleSubmit"
        class="login-form"
      >
        <div class="form-group">
          <label
            for="email"
            class="form-label"
            >Email</label
          >
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="form-input"
            placeholder="user@example.com"
            :disabled="authStore.isLoading"
          />
        </div>

        <div class="form-group">
          <label
            for="password"
            class="form-label"
            >Пароль</label
          >
          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="form-input"
            placeholder="Введите пароль"
            :disabled="authStore.isLoading"
          />
        </div>

        <div
          v-if="isRegisterMode"
          class="form-group"
        >
          <label
            for="confirm"
            class="form-label"
            >Повторите пароль</label
          >
          <input
            id="confirm"
            v-model="confirmPassword"
            type="password"
            required
            autocomplete="new-password"
            class="form-input"
            placeholder="Повторите пароль"
            :disabled="authStore.isLoading"
          />
        </div>

        <div
          v-if="passwordsMismatch"
          class="helper-message helper-message--error"
        >
          Пароли не совпадают
        </div>

        <div
          v-if="errorMessage"
          class="error-message"
        >
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="login-button"
          :disabled="isSubmitDisabled"
        >
          <span v-if="authStore.isLoading">
            {{ isRegisterMode ? 'Регистрация...' : 'Вход...' }}
          </span>
          <span v-else>
            {{ isRegisterMode ? 'Зарегистрироваться' : 'Войти' }}
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'LoginScreen' });
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const confirmPassword = ref('');
const isRegisterMode = ref(false);

const passwordsMismatch = computed(
  () =>
    isRegisterMode.value &&
    password.value.length > 0 &&
    confirmPassword.value.length > 0 &&
    password.value !== confirmPassword.value
);

const isSubmitDisabled = computed(() => {
  if (authStore.isLoading) return true;
  if (!email.value || !password.value) return true;
  if (isRegisterMode.value) {
    return !confirmPassword.value || passwordsMismatch.value;
  }
  return false;
});

type AuthMode = 'login' | 'register';

const setMode = (mode: AuthMode) => {
  isRegisterMode.value = mode === 'register';
  errorMessage.value = '';
  if (!isRegisterMode.value) {
    confirmPassword.value = '';
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
    if (isRegisterMode.value) {
      await authStore.register(email.value, password.value);
    }
    await authStore.login(email.value, password.value);
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
  isRegisterMode.value = false;
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f6fb;
  padding: 1.5rem;
}

.login-card {
  background: #fff;
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 2rem;
  width: 100%;
  max-width: 420px;
}

.login-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  text-align: center;
}

.auth-toggle {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.auth-toggle__btn {
  flex: 1;
  padding: 0.45rem 0.75rem;
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 6px;
  background: #f8fafc;
  color: #1f2933;
  cursor: pointer;
  font-weight: 600;
  transition:
    background 0.2s,
    border-color 0.2s;
}

.auth-toggle__btn--active {
  background: #e2e8f0;
  border-color: rgba(15, 23, 42, 0.2);
}

.auth-toggle__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
}

.form-input {
  padding: 0.7rem 0.9rem;
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 6px;
  font-size: 1rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  background: #fff;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
}

.form-input:disabled {
  background-color: #f7fafc;
  cursor: not-allowed;
}

.error-message {
  padding: 0.6rem;
  background-color: rgba(226, 29, 72, 0.08);
  color: #b91c1c;
  border-radius: 6px;
  font-size: 0.875rem;
  text-align: center;
}

.helper-message {
  font-size: 0.85rem;
  color: #475569;
  text-align: center;
}

.helper-message--error {
  color: #b91c1c;
}

.login-button {
  padding: 0.8rem 1.25rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.login-button:hover:not(:disabled) {
  background: #1d4ed8;
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (prefers-color-scheme: dark) {
  .login-card {
    background: #1a202c;
    color: #f7fafc;
  }

  .login-title {
    color: #f7fafc;
  }

  .form-label {
    color: #cbd5e0;
  }

  .form-input {
    background: #2d3748;
    border-color: #4a5568;
    color: #f7fafc;
  }

  .form-input:focus {
    border-color: #667eea;
  }

  .form-input:disabled {
    background-color: #2d3748;
  }

  .auth-toggle__btn {
    border-color: rgba(255, 255, 255, 0.2);
    color: #cbd5e0;
    background: rgba(15, 23, 42, 0.2);
  }

  .auth-toggle__btn--active {
    color: #fff;
    background: rgba(37, 99, 235, 0.35);
  }
}
</style>
