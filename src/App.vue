<template>
  <div v-if="authStore.isLoading" class="loading-container">
    <div class="loading-spinner"></div>
    <p>Загрузка...</p>
  </div>
  <Login v-else-if="!authStore.isAuthenticated" />
  <div v-else class="app-container">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">Форма передвижений</h1>
        <div class="user-info">
          <span class="username">{{ authStore.user?.username }}</span>
          <button @click="handleLogout" class="logout-button">Выйти</button>
        </div>
      </div>
    </header>
    <main class="app-main">
      <DayMovements />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/authStore';
import Login from './components/Login.vue';
import DayMovements from './forms/DayMovements.vue';

const authStore = useAuthStore();

const handleLogout = async () => {
  await authStore.logout();
};
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  gap: 1rem;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username {
  font-size: 0.875rem;
  opacity: 0.9;
}

.logout-button {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.logout-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 768px) {
  .app-header {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .app-main {
    padding: 1rem;
  }
}
</style>
