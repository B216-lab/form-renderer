<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/authStore';

const authStore = useAuthStore();
const router = useRouter();

const isAuthenticated = computed(() => authStore.isAuthenticated);

const handleLogout = async () => {
  try {
    await authStore.logout();
  } catch {
    // Игнорировать ошибки выхода, так как локальное состояние уже очищено
  } finally {
    await router.push({ name: 'login' });
  }
};
</script>

<template>
  <UApp>
    <UHeader
      title="Б216 | Анкета"
      to="http://al@b216.org/"
    >
      <template #right>
        <div class="flex items-center gap-2">
          <UColorModeButton />
          <UButton
            v-if="isAuthenticated"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="handleLogout"
          >
            Выйти
          </UButton>
        </div>
      </template>
    </UHeader>
    <UMain>
      <router-view />
    </UMain>
  </UApp>
</template>

<style scoped></style>
