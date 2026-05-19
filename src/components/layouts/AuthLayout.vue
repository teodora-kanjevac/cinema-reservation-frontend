<template>
  <div class="w-full flex-1 flex flex-col relative overflow-hidden">
    <div
      class="pointer-events-none fixed inset-0 z-0"
      style="background: radial-gradient(ellipse at 30% 50%, rgba(232, 184, 75, 0.06) 0%, transparent 60%)"
    />

    <div class="relative z-10 p-5 shrink-0">
      <router-link
        to="/"
        class="inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold transition-colors duration-200"
      >
        <i class="pi pi-arrow-left text-xs" />
        <ArrowRightIcon class="size-5 rotate-180" />
        Back to SnapSeat
      </router-link>
    </div>

    <div class="relative z-10 flex-1 flex items-center justify-center px-4 pb-12">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import ArrowRightIcon from '../icons/ArrowRightIcon.vue'
</script>
