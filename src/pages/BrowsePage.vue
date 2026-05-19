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
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-32">
        <ProgressSpinner
          style="width: 50px; height: 50px"
          strokeWidth="4"
          animationDuration=".5s"
          aria-label="Loading movies"
        />
        <p class="mt-4 text-sm text-gold tracking-wider uppercase font-semibold">Loading Movies...</p>
      </div>

      <div v-else>
        <div class="flex items-center gap-2.5 flex-wrap mb-5">
          <button
            class="px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 cursor-pointer"
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
            v-for="genre in genres"
            :key="genre.id"
            class="px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 cursor-pointer"
            :class="
              activeGenre === genre.name
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-dark bg-elevated text-muted hover:border-bright hover:text-primary'
            "
            @click="toggleGenre(genre.name)"
          >
            {{ genre.name }}
          </button>
        </div>

        <p class="text-[13px] text-dim mb-5">{{ filteredMovies.length }} movies found</p>

        <div v-if="filteredMovies.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          <MovieCard v-for="movie in filteredMovies" :key="movie.id" :movie="movie" />
        </div>

        <div v-else class="flex flex-col items-center py-20 text-center">
          <span class="mb-4 opacity-40"><NoMovieIcon class="size-20" /></span>
          <h3 class="text-xl font-semibold text-muted mb-2">No movies found</h3>
          <p class="text-sm text-dim mb-6">Try a different search term or genre filter.</p>
          <button
            class="px-6 py-2.5 rounded-lg bg-gold text-base text-sm font-semibold shadow-gold-sm hover:bg-[#f0c85a] transition-all duration-200 cursor-pointer"
            @click="((searchQuery = ''), (activeGenre = ''))"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { GENRES } from '@/data/movie'
import SearchBar from '@/components/ui/SearchBar.vue'
import MovieCard from '@/components/ui/MovieCard.vue'
import ProgressSpinner from 'primevue/progressspinner'
import type { Genre, Movie } from '@/types/Movie'
import { movieService } from '@/services/movieService'
import NoMovieIcon from '@/components/icons/NoMovieIcon.vue'

const movies = ref<Movie[]>([])
const genres = ref<Genre[]>([])
const searchQuery = ref('')
const activeGenre = ref('')
const isLoading = ref(true)

onMounted(async () => {
  try {
    isLoading.value = true
    const [moviesData, genresData] = await Promise.all([movieService.getAllMovies(), movieService.getGenres()])
    movies.value = moviesData
    genres.value = genresData
  } catch (error) {
    console.error('Failed to connect to backend api:', error)
  } finally {
    isLoading.value = false
  }
})

const filteredMovies = computed(() => {
  return movies.value.filter((m) => {
    const q = searchQuery.value.toLowerCase()
    const matchQ =
      !q ||
      m.title.toLowerCase().includes(q) ||
      m.director.toLowerCase().includes(q) ||
      m.genres.some((g) => g.name.toLowerCase().includes(q))
    const matchG =
      !activeGenre.value ||
      m.genres.some((g) => g.name === activeGenre.value)
    return matchQ && matchG
  })
})

function toggleGenre(g: string) {
  activeGenre.value = activeGenre.value === g ? '' : g
}
</script>
