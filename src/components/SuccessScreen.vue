<template>
  <div
    class="py-12 flex justify-center"
    data-testid="success-screen"
  >
    <UCard class="max-w-xl w-full">
      <div class="space-y-4 text-center">
        <div class="flex justify-center">
          <div
            class="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center"
            data-testid="success-icon-container"
          >
            <UIcon
              name="i-lucide-check-circle"
              class="w-8 h-8 text-green-600 dark:text-green-400"
            />
          </div>
        </div>
        <div class="space-y-2">
          <h2
            class="text-2xl font-semibold"
            data-testid="success-title"
          >
            {{ t('successScreen.title') }}
          </h2>
          <p
            class="text-gray-600 dark:text-gray-400"
            data-testid="success-message"
          >
            {{ t('successScreen.message') }}
          </p>
        </div>
        <div class="pt-4">
          <UButton
            color="primary"
            size="lg"
            data-testid="fill-another-form-button"
            @click="fillAnotherForm"
          >
            {{ t('successScreen.fillAnotherForm') }}
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

const fillAnotherForm = () => {
  // Navigate to form route with query parameter to force component remount
  router.push({
    name: 'day-movements',
    query: { reset: Date.now().toString() },
  });
};
</script>
