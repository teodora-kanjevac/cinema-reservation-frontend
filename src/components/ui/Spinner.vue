<template>
  <ProgressSpinner
    class="custom-spinner"
    style="width: 50px; height: 50px"
    strokeWidth="6"
    animationDuration=".7s"
    aria-label="Loading"
  />
</template>

<script setup lang="ts">
import { ProgressSpinner } from 'primevue'
</script>

<style scoped>
:deep(.p-progressspinner-circle) {
  stroke: #e8b84b !important;
}
</style>
