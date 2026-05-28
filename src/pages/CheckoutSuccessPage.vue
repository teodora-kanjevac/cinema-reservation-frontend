<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-16 pt-32">
    <div class="max-w-md w-full bg-card border border-dark rounded-2xl p-8 text-center shadow-gold-sm">
      <div
        class="inline-flex items-center justify-center size-16 rounded-full bg-success/10 text-success border border-success/20 mb-6"
      >
        <svg class="size-8" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <h1 class="font-display text-[26px] text-primary tracking-wide mb-2">Payment Successful!</h1>
      <p class="text-[14.5px] text-muted mb-6">Your seats are locked. Enjoy the show!</p>

      <div class="bg-elevated border border-dark rounded-xl p-5 text-left mb-8 flex flex-col gap-3">
        <div class="flex justify-between items-center border-b border-dark/60 pb-2.5">
          <span class="text-[12.5px] font-semibold text-muted uppercase tracking-wider">Booking ID</span>
          <span class="text-[14px] font-mono font-bold text-gold select-all">{{ purchaseId }}</span>
        </div>
        <div class="flex justify-between items-center text-[13.5px]">
          <span class="text-muted">Payment Channel</span>
          <span class="text-primary font-medium">Online Web Client</span>
        </div>
        <div class="flex justify-between items-center text-[13.5px]">
          <span class="text-muted">Status</span>
          <span
            class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-success/12 text-success border border-success/25"
          >
            Confirmed
          </span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <router-link
          to="/profile"
          class="flex-1 px-5 py-3 rounded-xl text-sm font-semibold bg-gold text-base shadow-gold-sm hover:bg-[#f0c85a] transition-all duration-200 cursor-pointer"
        >
          <TicketIcon class="inline-flex size-5 -mt-1 me-1" />
          View Bookings
        </router-link>
        <router-link
          to="/"
          class="flex-1 px-5 py-3 rounded-xl text-sm font-semibold bg-elevated border border-dark text-primary hover:border-bright transition-all duration-200 cursor-pointer"
        >
          Return Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TicketIcon from '@/components/icons/TicketIcon.vue'
import { changeCheckoutAccess } from '@/router'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const purchaseId = ref('N/A')

onMounted(() => {
  if (route.query.id) {
    purchaseId.value = String(route.query.id)
  }
  changeCheckoutAccess(false)
})
</script>
