<template>
  <router-link :to="`/movie/${movie.id}`" class="group block no-underline">
    <div class="relative overflow-hidden rounded-xl" style="aspect-ratio: 2/3">
      <img
        :src="movie.poster"
        :alt="movie.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      <div
        class="absolute inset-0 flex items-center justify-center bg-linear-to-t from-base/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <div
          class="size-11 rounded-full bg-gold/90 flex items-center justify-center text-xl text-base transform scale-90 group-hover:scale-100 transition-all duration-200"
        >
          <EyeIcon class="size-6" />
        </div>
      </div>

      <span
        v-if="movie.releaseDate"
        class="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 rounded text-xs font-bold text-primary/90 bg-base/75 border border-dim/80"
      >
        <div class="flex items-center gap-1">{{ dayjs(movie.releaseDate).year() }}</div>
      </span>

      <div v-if="movie.releaseDate">
        <span class="tag-muted text-xs font-bold tracking-widest">
          {{ dayjs(movie.releaseDate).year() }}
        </span>
      </div>
    </div>

    <div class="pt-3 px-0.5">
      <h3 class="text-[14.5px] font-semibold text-primary leading-snug mb-1 line-clamp-2">
        {{ movie.title }}
      </h3>
      <p class="text-[12.5px] text-muted">
        {{ genres }}
        <span v-if="movie.runTime"> · {{ convertMinutesToHours(movie.runTime) }}</span>
      </p>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import EyeIcon from '../icons/EyeIcon.vue'
import type { Movie } from '@/types/Movie'
import { computed } from 'vue'
import { convertMinutesToHours } from '@/utils/time'

const props = defineProps<{ movie: Movie }>()

const genres = computed(() => {
  const genres = props.movie.genres
  if (!genres || genres.length === 0) return 'No genres'

  return genres.map((g) => g.name).join(', ')
})
</script>
