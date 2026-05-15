<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <h1 class="text-3xl font-bold text-blue-600 mb-4">Setup Successful</h1>
    <p class="mb-4 text-red-500">Today's date: {{ testDate }}</p>
    <Button label="PrimeVue Button" class="p-button-success" />
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import dayjs from 'dayjs'

const testDate = dayjs().format('DD.MM.YYYY')
</script>
