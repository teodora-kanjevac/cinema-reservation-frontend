<template>
  <div>
    <div class="text-center mb-7">
      <span
        class="block h-1 w-[65%] mx-auto mb-2 rounded-full"
        style="background: linear-gradient(to right, transparent, #e8b84b, transparent)"
      />
      <span class="text-[11px] uppercase tracking-[0.18em] text-dim">Screen</span>
    </div>

    <div class="flex flex-col items-center gap-2">
      <div v-for="(row, ri) in seatMap" :key="ri" class="flex items-center gap-1.5">
        <span class="w-5 text-center text-[11px] font-semibold text-dim shrink-0">
          {{ String.fromCharCode(65 + ri) }}
        </span>

        <template v-for="(seat, ci) in row" :key="ci">
          <div v-if="seat.aisle" class="w-5 shrink-0" />

          <button
            v-else
            class="seat-shape"
            :class="seatClass(seat, ri, ci)"
            :disabled="seat.taken"
            :title="`${String.fromCharCode(65 + ri)}${ci + 1} · €${(seat as Seat).premium ? 16 : 12}`"
            @click="$emit('toggle', seat)"
          />
        </template>

        <span class="w-5 text-center text-[11px] font-semibold text-dim shrink-0">
          {{ String.fromCharCode(65 + ri) }}
        </span>
      </div>
    </div>

    <div class="flex flex-wrap justify-center gap-5 mt-6">
      <div v-for="l in legend" :key="l.label" class="flex items-center gap-2 text-[12.5px] text-muted">
        <div class="w-4 h-3.5 rounded-t border" :style="l.style" />
        {{ l.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Seat = {
  aisle?: false
  taken?: boolean
  row?: number
  col?: number
  premium?: boolean
}

type Aisle = {
  aisle: true
}

type SeatMapCell = Seat | Aisle

const props = defineProps({
  seatMap: { type: Array as () => SeatMapCell[][], required: true },
  isSelected: { type: Function, required: true },
})

defineEmits(['toggle'])

function seatClass(seat: Seat, ri: any, ci: any) {
  if (seat.taken) return ['seat-taken']
  if (props.isSelected(seat.row, seat.col)) {
    return seat.premium ? ['seat-selected', 'seat-premium'] : ['seat-selected']
  }
  return seat.premium ? ['seat-available', 'seat-premium'] : ['seat-available']
}

const legend = [
  { label: 'Available', style: 'background:#2d3a5d;border-color:#26314f' },
  { label: 'Selected', style: 'background:#a07c28;border-color:#886920' },
  { label: 'Taken', style: 'background:#0f1420;border-color:#26314f;opacity:0.5' },
  { label: 'Premium', style: 'background:#4b8fe8;border-color:#4583d3' },
]
</script>
