<template>
  <div>
    <SearchBar
      v-model="searchQuery"
      :genres="GENRES"
      :active-genre="activeGenre"
      @genre="toggleGenre"
      class="sticky! top-0!"
    />

    <section class="max-w-7xl mx-auto px-8 pt-6 pb-12">
      <div class="flex items-center gap-2.5 flex-wrap mb-5">
        <button
          class="px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-200"
          :class="
            activeGenre === ''
              ? 'border-gold bg-gold/10 text-gold'
              : 'border-dark bg-elevated text-muted hover:border-bright hover:text-primary'
          "
          @click="activeGenre = ''"
        >
          All
        </button>
        <button
          v-for="g in GENRES"
          :key="g"
          class="px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-200"
          :class="
            activeGenre === g
              ? 'border-gold bg-gold/10 text-gold'
              : 'border-dark bg-elevated text-muted hover:border-bright hover:text-primary'
          "
          @click="toggleGenre(g)"
        >
          {{ g }}
        </button>
      </div>

      <p class="text-[13px] text-dim mb-5">{{ filteredMovies.length }} movies found</p>

      <div v-if="filteredMovies.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        <MovieCard v-for="m in filteredMovies" :key="m.id" :movie="m" />
      </div>

      <div v-else class="flex flex-col items-center py-20 text-center">
        <span class="text-5xl mb-4 opacity-40">🎬</span>
        <h3 class="text-xl font-semibold text-muted mb-2">No movies found</h3>
        <p class="text-sm text-dim mb-6">Try a different search term or genre filter.</p>
        <button
          class="px-6 py-2.5 rounded-lg bg-gold text-base text-sm font-semibold shadow-gold-sm hover:bg-[#f0c85a] transition-all duration-200"
          @click="((searchQuery = ''), (activeGenre = ''))"
        >
          Clear Filters
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { MOVIES, GENRES } from '@/data/movie'
import SearchBar from '@/components/ui/SearchBar.vue'
import MovieCard from '@/components/ui/MovieCard.vue'

const route = useRoute()

const searchQuery = ref('')
const activeGenre = ref('')

onMounted(() => {
  const q = route.query.q
  if (typeof q === 'string') searchQuery.value = q
})

const filteredMovies = computed(() =>
  MOVIES.filter((m: { title: string; director: string; genres: string[] }) => {
    const q = searchQuery.value.toLowerCase()
    const matchQ =
      !q ||
      m.title.toLowerCase().includes(q) ||
      m.director.toLowerCase().includes(q) ||
      m.genres.some((g: string) => g.toLowerCase().includes(q))
    const matchG = !activeGenre.value || m.genres.includes(activeGenre.value)
    return matchQ && matchG
  }),
)

function toggleGenre(g: string) {
  activeGenre.value = activeGenre.value === g ? '' : g
}
</script>
