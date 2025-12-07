<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useHead } from '@unhead/vue';
import * as uiLocales from '@nuxt/ui/locale';
import { useAuthStore } from './stores/authStore';

const authStore = useAuthStore();
const router = useRouter();
const { t, locale } = useI18n();
const showCookieNotice = ref(false);

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

const uiLocale = computed(() => {
  const current = (locale.value as keyof typeof uiLocales) || 'en';
  return uiLocales[current] ?? uiLocales.en;
});

useHead(() => ({
  title: t('app.title'),
  meta: [
    {
      name: 'description',
      content: t('app.description'),
    },
  ],
  htmlAttrs: {
    lang: locale.value,
  },
}));

onMounted(() => {
  if (typeof window === 'undefined') return;

  const STORAGE_KEY = 'cookie-notice-dismissed';
  if (!window.localStorage.getItem(STORAGE_KEY)) {
    showCookieNotice.value = true;
  }
});

const dismissCookieNotice = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('cookie-notice-dismissed', '1');
  }
  showCookieNotice.value = false;
};
</script>

<template>
  <UApp :locale="uiLocale">
    <UHeader
      :title="t('app.title')"
      to="http://al@b216.org/"
    >
      <template #right>
        <div class="flex items-center gap-3">
          <UColorModeButton />
          <UButton
            v-if="isAuthenticated"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="handleLogout"
          >
            {{ t('app.logout') }}
          </UButton>
        </div>
      </template>
    </UHeader>
    <UMain>
      <router-view />
    </UMain>
    <UAlert
      v-if="showCookieNotice"
      class="fixed bottom-4 right-4 max-w-sm z-50"
      color="neutral"
      variant="solid"
      icon="i-lucide-cookie"
      :title="t('app.cookieTitle')"
      :description="t('app.cookieDescription')"
    >
      <template #actions>
        <UButton
          color="neutral"
          size="xs"
          variant="ghost"
          @click="dismissCookieNotice"
        >
          {{ t('app.cookieClose') }}
        </UButton>
      </template>
    </UAlert>
  </UApp>
</template>

<style scoped></style>
