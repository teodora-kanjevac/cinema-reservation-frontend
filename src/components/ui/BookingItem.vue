<template>
  <div class="flex gap-4 items-center py-4 border-b border-dark last:border-0">
    <div class="w-13 h-19 rounded-lg overflow-hidden shrink-0 bg-elevated">
      <img :src="booking.poster ?? ''" :alt="booking.movie" class="w-full h-full object-cover" />
    </div>

    <div class="flex-1 min-w-0">
      <p class="text-[14.5px] font-semibold text-primary mb-1">
        {{ booking.movie }}
      </p>
      <p class="text-[12.5px] text-muted leading-relaxed whitespace-pre-line">
        {{ booking.cinema }}<br />
        {{ booking.date }} · {{ booking.time }}<br />
        Seats: {{ booking.seats }}
      </p>
    </div>

    <div class="flex flex-col items-end gap-2 shrink-0">
      <span :class="['px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold border', statusClass]">
        {{ booking.status }}
      </span>
      <span class="font-display text-[18px] text-gold tracking-wide"> €{{ booking.amount }} </span>
      <button
        v-if="showDownload"
        class="text-[11px] px-2.5 py-1 rounded border border-dark text-muted hover:border-bright transition-all cursor-pointer"
      >
        Download 🎫
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Booking {
  movie: string
  cinema: string
  date: string
  time: string
  seats: string
  amount: string
  status: string
  poster?: string
}

const props = defineProps<{
  booking: Booking
  showDownload?: boolean
}>()

const statusClass = computed(() =>
  props.booking.status === 'Confirmed'
    ? 'bg-success/12 text-[#70e8a8] border-success/25'
    : 'bg-elevated text-muted border-dark',
)
</script>
