<template>
  <div class="thank-you-screen">
    <div class="thank-you-content">
      <h1 class="thank-you-title">Спасибо!</h1>
      <p class="thank-you-message">
        Ваша форма успешно отправлена. Мы благодарим вас за участие в опросе.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Компонент экрана успешной отправки формы
</script>

<style lang="scss">
.thank-you-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: var(--vf-color-bg, #ffffff);
}

.thank-you-content {
  text-align: center;
  max-width: 600px;
  padding: 3rem;
  background: var(--vf-color-bg-secondary, #f8f9fa);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.thank-you-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--vf-color-text, #212529);
}

.thank-you-message {
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--vf-color-text-secondary, #6c757d);
}

@media (prefers-color-scheme: dark) {
  .thank-you-content {
    background: var(--vf-color-bg-secondary, #1a1a1a);
  }

  .thank-you-title {
    color: var(--vf-color-text, #ffffff);
  }

  .thank-you-message {
    color: var(--vf-color-text-secondary, #adb5bd);
  }
}
</style>
