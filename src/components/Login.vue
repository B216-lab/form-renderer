<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Вход в систему</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
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
          <label for="password" class="form-label">Пароль</label>
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

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="login-button"
          :disabled="authStore.isLoading || !email || !password"
        >
          <span v-if="authStore.isLoading">Вход...</span>
          <span v-else>Войти</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = async () => {
  errorMessage.value = '';
  try {
    await authStore.login(email.value, password.value);
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Ошибка входа';
  }
};

onMounted(() => {
  // Очистка полей при монтировании
  email.value = '';
  password.value = '';
  errorMessage.value = '';
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
}

.login-title {
  margin: 0 0 2rem 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a202c;
  text-align: center;
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
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  background-color: #f7fafc;
  cursor: not-allowed;
}

.error-message {
  padding: 0.75rem;
  background-color: #fed7d7;
  color: #c53030;
  border-radius: 6px;
  font-size: 0.875rem;
  text-align: center;
}

.login-button {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.login-button:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
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
}
</style>

