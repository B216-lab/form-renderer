<template>
  <div class="py-12 flex justify-center">
    <UCard class="max-w-xl w-full">
      <div class="space-y-4 text-center">
        <div class="flex justify-center">
          <div
            class="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center"
          >
            <UIcon
              name="i-lucide-check-circle"
              class="w-8 h-8 text-green-600 dark:text-green-400"
            />
          </div>
        </div>
        <div class="space-y-2">
          <h2 class="text-2xl font-semibold">Спасибо!</h2>
          <p class="text-gray-600 dark:text-gray-400">
            Ваша форма успешно отправлена. Благодарим за участие в опросе.
          </p>
        </div>
        <div class="pt-4">
          <UButton
            color="primary"
            size="lg"
            @click="fillAnotherForm"
          >
            Заполнить ещё одну форму
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const fillAnotherForm = () => {
  // Navigate to form route with query parameter to force component remount
  router.push({
    name: 'day-movements',
    query: { reset: Date.now().toString() },
  });
};
</script>
