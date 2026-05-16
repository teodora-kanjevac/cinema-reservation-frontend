<template>
  <div class="bg-surface border-b border-dark px-8 py-4 sticky top-20 z-100">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row gap-6 items-start sm:items-center">
      <div class="relative flex-1 w-full">
        <SearchIcon class="size-6 absolute left-4 top-1/2 -translate-y-1/2 text-dim pointer-events-none" />
        <input
          :value="modelValue"
          type="text"
          :placeholder="placeholder"
          class="w-full bg-elevated border border-dark text-primary rounded-full pl-12 pr-4 py-3 text-[15px] font-body outline-none transition-all duration-200 placeholder:text-dim focus:border-gold/70"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          @keyup.enter="$emit('search')"
        />
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <button
          v-for="genre in genres"
          :key="genre"
          class="px-3.5 py-1.5 rounded-full border text-[13px] font-medium transition-all duration-200"
          :class="
            activeGenre === genre
              ? 'border-gold bg-gold/10 text-gold'
              : 'border-dark bg-elevated text-muted hover:border-bright hover:text-primary'
          "
          @click="$emit('genre', genre)"
        >
          {{ genre }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import SearchIcon from '../icons/SearchIcon.vue'

defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Search movies, directors, genres…' },
  genres: { type: Array as PropType<string[]>, default: () => [] as string[] },
  activeGenre: { type: String, default: '' },
})

defineEmits(['update:modelValue', 'search', 'genre'])
</script>
