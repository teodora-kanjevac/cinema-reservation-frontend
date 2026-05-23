<template>
  <div>
    <section class="relative h-155 flex items-end overflow-hidden">
      <div
        class="absolute inset-0 bg-cover bg-center transition-all duration-700"
        :style="{ backgroundImage: `url(${featured[heroIdx]?.poster})`, filter: 'brightness(0.32) saturate(0.8)' }"
      />
      <div
        class="absolute inset-0 pointer-events-none"
        style="background: linear-gradient(to top, #080b12 0%, rgba(8, 11, 18, 0.5) 50%, transparent 100%)"
      />

      <div class="relative z-10 px-12 pb-14 animate-slide-up">
        <div
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold/15 text-gold border border-gold/30 mb-3.5 tracking-widest"
        >
          <ClapperboardIcon class="size-3.5" />
          <span class="mt-0.75">NOW SHOWING</span>
        </div>

        <h1
          class="font-display text-[clamp(38px,5vw,64px)] leading-none tracking-wider text-primary mb-3"
          style="text-shadow: 0 2px 20px rgba(0, 0, 0, 0.6)"
        >
          {{ featured[heroIdx]?.title }}
        </h1>

        <div class="flex items-center gap-4 flex-wrap mb-5">
          <span class="text-[13.5px] text-muted">{{ convertMinutesToHours(featured[heroIdx]?.runTime) }}</span>
          <span class="size-1 rounded-full bg-dim" />
          <span class="text-[13.5px] text-muted">{{}}{{ dayjs(featured[heroIdx]?.releaseDate).year() }}</span>
        </div>

        <p class="text-[15px] text-muted leading-[1.75] mb-7 max-w-3xl line-clamp-3">
          {{ featured[heroIdx]?.description }}
        </p>

        <div class="flex gap-3 flex-wrap">
          <router-link
            :to="`/movie/${featured[heroIdx]?.id}`"
            class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-[16px] font-semibold bg-gold text-base hover:bg-gold/85 hover:shadow-gold-sm hover:-translate-y-px transition-all duration-200 no-underline"
          >
            <TicketIcon class="size-5" />
            <span>Book Tickets</span>
          </router-link>
          <button
            class="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-xl text-[16px] font-semibold text-primary bg-elevated border border-bright hover:border-gold hover:text-gold transition-all duration-200"
          >
            <PlayIcon class="size-6 -ms-1" />
            <span>Trailer</span>
          </button>
        </div>
      </div>

      <div class="absolute bottom-6 right-12 z-10 flex gap-2">
        <button
          v-for="(_, i) in featured"
          :key="i"
          class="h-2 rounded-full transition-all duration-300"
          :class="i === heroIdx ? 'w-5 bg-gold' : 'w-2.5 bg-bright'"
          @click="heroIdx = i"
        />
      </div>
    </section>

    <SearchBar
      v-model="searchQuery"
      :show-genres="true"
      :genres="genres.slice(0, 6).map((g) => g.name)"
      :active-genre="activeGenre"
      @genre="toggleGenre"
      @search="goToBrowse"
    />

    <section class="max-w-7xl mx-auto px-8">
      <div class="flex items-end justify-between mt-14 mb-6">
        <h2 class="font-display text-[28px] tracking-[0.06em]">Now <span class="text-gold">Showing</span></h2>
        <router-link
          to="/browse"
          class="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-gold transition-colors duration-200 no-underline"
        >
          <span>View All</span>
          <ArrowRightIcon class="size-5" />
        </router-link>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        <MovieCard v-for="movie in filteredMovies.slice(0, 6)" :key="movie.id" :movie="movie" />
      </div>

      <div class="flex items-center justify-between mt-14 mb-6">
        <h2 class="font-display text-[28px] tracking-[0.06em]">Coming <span class="text-gold">Soon</span></h2>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 pb-8">
        <MovieCard v-for="movie in comingSoon" :key="movie.id" :movie="movie" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import SearchBar from '@/components/ui/SearchBar.vue'
import MovieCard from '@/components/ui/MovieCard.vue'
import ClapperboardIcon from '@/components/icons/ClapperboardIcon.vue'
import TicketIcon from '@/components/icons/TicketIcon.vue'
import PlayIcon from '@/components/icons/PlayIcon.vue'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon.vue'
import { movieService } from '@/services/movieService'
import type { Genre, Movie } from '@/types/Movie'
import { convertMinutesToHours } from '@/utils/time'
import dayjs from 'dayjs'

const router = useRouter()

const heroIdx = ref(0)
const searchQuery = ref('')
const activeGenre = ref('')
const isLoading = ref(true)
const movies = ref<Movie[]>([])
const genres = ref<Genre[]>([])

const featured = computed(() => [movies.value[0], movies.value[5], movies.value[12]].filter(Boolean))

const filteredMovies = computed(() =>
  movies.value.filter((m: Movie) => {
    const q = searchQuery.value.toLowerCase()
    const matchQ = !q || m.title.toLowerCase().includes(q) || m.director.name.toLowerCase().includes(q)
    const matchG = !activeGenre.value || m.genres.some((g: Genre) => g.name === activeGenre.value)
    return matchQ && matchG
  }),
)

const comingSoon = computed(() => {
  if (!movies.value.length) return []

  return [...movies.value]
    .sort((a, b) => {
      const dateA = dayjs(a.releaseDate)
      const dateB = dayjs(b.releaseDate)
      return dateB.isAfter(dateA) ? 1 : -1
    })
    .slice(0, 4)
})

function toggleGenre(g: string) {
  activeGenre.value = activeGenre.value === g ? '' : g
}

function goToBrowse() {
  router.push({ name: 'browse', query: { q: searchQuery.value } })
}

let timer: any
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
  timer = setInterval(() => {
    heroIdx.value = (heroIdx.value + 1) % featured.value.length
  }, 5000)
})
onUnmounted(() => clearInterval(timer))
</script>
