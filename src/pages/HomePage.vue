<template>
  <div>
    <section class="relative h-155 flex items-end overflow-hidden">
      <div
        class="absolute inset-0 bg-cover bg-center transition-all duration-700"
        :style="{ backgroundImage: `url(${featured[heroIdx]?.backdrop})`, filter: 'brightness(0.32) saturate(0.8)' }"
      />
      <div
        class="absolute inset-0 pointer-events-none"
        style="background: linear-gradient(to top, #080b12 0%, rgba(8, 11, 18, 0.5) 50%, transparent 100%)"
      />

      <div class="relative z-10 max-w-150 px-12 pb-14 animate-slide-up">
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
          <div class="flex gap-0.5">
            <StarIcon
              v-for="i in 5"
              :key="i"
              class="size-4"
              :class="i <= Math.round((Number(featured[heroIdx]?.rating) || 0) / 2) ? 'text-gold' : 'text-bright'"
            />
          </div>
          <span class="text-[13.5px] text-muted">{{ featured[heroIdx]?.rating }}/10</span>
          <span class="size-1 rounded-full bg-dim" />
          <span class="text-[13.5px] text-muted">{{ featured[heroIdx]?.duration }}</span>
          <span class="size-1 rounded-full bg-dim" />
          <span class="text-[13.5px] text-muted">{{ featured[heroIdx]?.year }}</span>
        </div>

        <p class="text-[15px] text-muted leading-[1.75] mb-7 max-w-125">
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
      :genres="GENRES"
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
        <MovieCard v-for="m in filteredMovies.slice(0, 6)" :key="m.id" :movie="m" />
      </div>

      <div class="flex items-center justify-between mt-14 mb-6">
        <h2 class="font-display text-[28px] tracking-[0.06em]">Coming <span class="text-gold">Soon</span></h2>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 pb-8">
        <MovieCard v-for="m in COMING_SOON" :key="m.id" :movie="m" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { MOVIES, COMING_SOON, GENRES } from '@/data/movie'
import SearchBar from '@/components/ui/SearchBar.vue'
import MovieCard from '@/components/ui/MovieCard.vue'
import ClapperboardIcon from '@/components/icons/ClapperboardIcon.vue'
import StarIcon from '@/components/icons/StarIcon.vue'
import TicketIcon from '@/components/icons/TicketIcon.vue'
import PlayIcon from '@/components/icons/PlayIcon.vue'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon.vue'

const router = useRouter()

const heroIdx = ref(0)
const searchQuery = ref('')
const activeGenre = ref('')

const featured = [MOVIES[0], MOVIES[2], MOVIES[7]]

const filteredMovies = computed(() =>
  MOVIES.filter((m: any) => {
    const q = searchQuery.value.toLowerCase()
    const matchQ = !q || m.title.toLowerCase().includes(q) || m.director.toLowerCase().includes(q)
    const matchG = !activeGenre.value || m.genres.includes(activeGenre.value)
    return matchQ && matchG
  }),
)

function toggleGenre(g: string) {
  activeGenre.value = activeGenre.value === g ? '' : g
}

function goToBrowse() {
  router.push({ name: 'browse', query: { q: searchQuery.value } })
}

let timer: any
onMounted(() => {
  timer = setInterval(() => {
    heroIdx.value = (heroIdx.value + 1) % featured.length
  }, 5000)
})
onUnmounted(() => clearInterval(timer))
</script>
