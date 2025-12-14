<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useHead } from '@unhead/vue';
import * as uiLocales from '@nuxt/ui/locale';

const route = useRoute();
const { t, locale } = useI18n();
const showCookieNotice = ref(false);

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
      <template #default>{{ t('app.headerTitle') }}</template>
      <template #right>
        <div class="flex items-center gap-3">
          <UColorModeButton />
        </div>
      </template>
    </UHeader>
    <UMain>
      <router-view :key="route.fullPath" />
    </UMain>
    <!-- UFooter extracted and muted for now
    <UFooter>
      <template #left>
        <p class="text-muted text-sm">
          ООО «Б216» © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #default>
        <span class="text-muted text-sm flex items-center">
          ОГРН
          <span
            class="px-1 py-1 rounded-md border bg-muted text-xs font-mono mx-1"
            >1243800017603</span
          >
          <span class="inline-block w-8"></span>
          ИНН
          <span
            class="px-1 py-1 rounded-md border bg-muted text-xs font-mono mx-1"
            >3812163477</span
          >
          <span class="inline-block w-8"></span>
          КПП
          <span
            class="px-1 py-1 rounded-md border bg-muted text-xs font-mono mx-1"
            >381201001</span
          >
        </span>
      </template>

      <template #right>
        <UButton
          icon="i-lucide-send"
          color="neutral"
          variant="ghost"
          to="http://t.me/ALevashev"
          target="_blank"
          aria-label="Telegram"
        />
        <UButton
          icon="i-lucide-mail"
          color="neutral"
          variant="ghost"
          to="mailto:al@b216.org"
          target="_blank"
          aria-label="Email"
        />
      </template>
    </UFooter>
    -->
    <UAlert
      v-if="showCookieNotice"
      class="fixed bottom-4 right-4 max-w-sm z-50"
      color="neutral"
      variant="subtle"
      icon="i-lucide-cookie"
      :title="t('app.cookieTitle')"
      :description="t('app.cookieDescription')"
    >
      <template #actions>
        <UButton
          size="sm"
          @click="dismissCookieNotice"
        >
          {{ t('app.cookieClose') }}
        </UButton>
      </template>
    </UAlert>
  </UApp>
</template>

<style scoped></style>
