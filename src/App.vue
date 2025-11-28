<template>
  <div
    v-if="authStore.isLoading"
    class="loading-container"
  >
    <div class="loading-spinner"></div>
    <p>Загрузка...</p>
  </div>
  <Login v-else-if="!authStore.isAuthenticated" />
  <div
    v-else
    class="app-container"
  >
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">Форма передвижений</h1>
        <div class="user-info">
          <span class="username">{{ authStore.user?.username }}</span>
          <button
            @click="handleLogout"
            class="logout-button"
          >
            Выйти
          </button>
        </div>
      </div>
    </header>
    <!-- <main class="app-main"> -->
    <DayMovements />
    <!-- </main> -->
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
  background: #fff;
  color: #1f2933;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
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
  font-size: 1.25rem;
  font-weight: 600;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.username {
  font-size: 0.875rem;
  color: #475569;
}

.logout-button {
  padding: 0.4rem 0.85rem;
  background: transparent;
  color: #1f2933;
  border: 1px solid rgba(15, 23, 42, 0.2);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition:
    background 0.2s,
    color 0.2s;
}

.logout-button:hover {
  background: #1f2933;
  color: #fff;
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
    padding: 0.75rem 1rem;
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
