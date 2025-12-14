<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push({ name: 'day-movements' });
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto py-8 px-4 space-y-6">
    <UCard>
      <div class="space-y-4">
        <h1 class="text-xl font-semibold">
          {{ t('consent.title') }}
        </h1>
        <p class="text-sm text-gray-500">
          {{ t('consent.intro') }}
        </p>

        <div class="space-y-3 text-sm text-gray-600">
          <section>
            <h2 class="font-medium">
              {{ t('consent.emailTitle') }}
            </h2>
            <p>
              {{ t('consent.emailText') }}
            </p>
          </section>

          <section>
            <h2 class="font-medium">
              {{ t('consent.cookiesTitle') }}
            </h2>
            <p>
              {{ t('consent.cookiesText') }}
            </p>
          </section>
        </div>

        <div class="pt-2">
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            @click="goBack"
          >
            {{ t('consent.back') }}
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<style scoped></style>


