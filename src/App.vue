<script setup lang="ts"></script>

<template>
  <UApp>
    <UHeader
      title="Б216 | Анкета"
      to="http://al@b216.org/"
    >
      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>
    <UMain>
      <router-view />
    </UMain>
  </UApp>
</template>

<style scoped></style>
