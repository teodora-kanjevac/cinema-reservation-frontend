<template>
  <div class="w-full flex-1 flex flex-col">
    <Toast position="bottom-right" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { Toast } from 'primevue'
</script>
