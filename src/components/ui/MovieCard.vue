<template>
  <router-link :to="`/movie/${movie.id}`" class="group block no-underline">
    <div class="relative overflow-hidden rounded-xl bg-elevated" style="aspect-ratio: 2/3">
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
          <EyeIcon class="size-6"/>
        </div>
      </div>

      <span
        class="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded text-xs font-bold text-gold bg-base/75 backdrop-blur-sm border border-gold/30"
      >
        <div class="flex items-center gap-1"><StarIcon class="size-4" /> {{ movie.rating }}</div>
      </span>

      <div v-if="movie.release" class="absolute inset-0 bg-base/40 flex items-end p-3">
        <span class="tag-muted text-xs font-bold tracking-widest">
          {{ movie.release }}
        </span>
      </div>
    </div>

    <div class="pt-3 px-0.5">
      <h3 class="text-[14.5px] font-semibold text-primary leading-snug mb-1 line-clamp-2">
        {{ movie.title }}
      </h3>
      <p class="text-[12.5px] text-muted">
        {{ movie.genres ? movie.genres[0] : '' }}
        <span v-if="movie.duration"> · {{ movie.duration }}</span>
      </p>
    </div>
  </router-link>
</template>

<script setup>
import EyeIcon from '../icons/EyeIcon.vue';
import StarIcon from '../icons/StarIcon.vue'

defineProps({
  movie: { type: Object, required: true },
})
</script>
