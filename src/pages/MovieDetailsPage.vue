<template>
  <div v-if="loading" class="flex flex-col items-center justify-center py-32">
    <Spinner />
    <p class="mt-4 text-sm text-gold tracking-wider uppercase font-semibold">Loading Movie Details...</p>
  </div>

  <div v-else-if="movie">
    <section class="relative min-h-120 flex items-center">
      <div
        class="absolute inset-1 bg-cover bg-center"
        :style="{ backgroundImage: `url(${movie.poster})`, filter: 'blur(3px) brightness(0.25)' }"
      />
      <div
        class="absolute inset-0 pointer-events-none"
        style="
          background:
            linear-gradient(to right, #080b12 35%, transparent 100%),
            linear-gradient(to top, #080b12 0%, transparent 40%);
        "
      />

      <div class="relative z-10 max-w-7xl mx-auto px-8 w-full flex flex-col sm:flex-row items-start pt-32 pb-16 gap-12">
        <div
          class="hidden sm:block w-56 shrink-0 rounded-2xl overflow-hidden border border-bright shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
        >
          <img :src="movie.poster" :alt="movie.title" class="w-full block" />
        </div>

        <div class="flex-1 w-full">
          <div class="flex gap-2 mb-3 flex-wrap">
            <span
              v-for="genre in movie.genres"
              :key="genre.id"
              class="px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold tracking-wide bg-elevated text-muted border border-dark"
            >
              {{ genre.name }}
            </span>
          </div>

          <h1
            class="font-display text-[clamp(32px,4vw,52px)] font-medium leading-tight tracking-wider mb-3 text-white"
            style="text-shadow: 0 2px 16px rgba(0, 0, 0, 0.6)"
          >
            {{ movie.title }}
          </h1>

          <div class="flex items-center gap-3 flex-wrap mb-4">
            <span v-if="movie.releaseDate" class="text-sm text-muted">
              {{ dayjs(movie.releaseDate).year() }}
            </span>
            <span class="size-1 rounded-full bg-dim" />
            <span v-if="movie.runTime" class="text-sm text-muted">
              {{ convertMinutesToHours(movie.runTime) }}
            </span>
          </div>

          <p class="text-[15px] text-muted leading-relaxed mb-6 max-w-3xl">{{ movie.description }}</p>

          <div class="flex flex-wrap gap-x-12 gap-y-4 mb-8">
            <div>
              <label class="text-[11px] uppercase tracking-widest text-dim block mb-1">Director</label>
              <span class="text-sm text-primary font-medium">{{ movie.director.name }}</span>
            </div>
            <div class="max-w-md">
              <label class="text-[11px] uppercase tracking-widest text-dim block mb-1">Cast</label>
              <span class="text-sm text-primary font-medium line-clamp-2">{{ actors }}</span>
            </div>
          </div>

          <div class="flex gap-3 flex-wrap">
            <a
              href="#screenings"
              class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-[15px] font-semibold bg-gold text-base hover:bg-[#f0c85a] hover:shadow-gold-sm hover:-translate-y-px transition-all duration-200 no-underline cursor-pointer"
            >
              <TicketIcon class="size-5" />
              <span>Book Tickets</span>
            </a>
            <button
              class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-[15px] font-semibold text-primary bg-elevated border border-bright hover:border-gold hover:text-gold transition-all duration-200 cursor-pointer"
            >
              <HeartIcon class="size-4.5" />
              <span>Wishlist</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section id="screenings" class="max-w-7xl mx-auto px-8 pt-12">
      <h2 class="font-display text-[24px] tracking-[0.06em] mb-5">SELECT SHOWING</h2>

      <div v-if="screeningsLoading" class="flex items-center gap-3 text-muted py-8">
        <Spinner class="size-5" />
        <span class="text-sm">Loading screenings…</span>
      </div>

      <div v-else-if="!screeningDates.length" class="py-12 text-center">
        <span class="flex items-center justify-center mb-6 opacity-40"><NoScreeningIcon class="size-20" /></span>
        <p class="text-muted text-sm">No upcoming screenings for this movie.</p>
      </div>

      <template v-else>
        <div class="flex gap-2 overflow-x-auto pb-1 mb-7 scrollbar-hide">
          <button
            v-for="(d, i) in screeningDates"
            :key="d.date"
            class="shrink-0 text-center px-4 py-2.5 rounded-xl border transition-all duration-200"
            :class="
              selectedDateIdx === i ? 'border-gold bg-gold/10 text-gold' : 'border-dark bg-card hover:border-bright'
            "
            @click="selectDate(i)"
          >
            <span
              class="block text-[11px] uppercase tracking-[0.08em]"
              :class="selectedDateIdx === i ? 'text-gold' : 'text-dim'"
              >{{ d.label }}</span
            >
            <span
              class="block font-display text-[26px] leading-none mt-0.5"
              :class="selectedDateIdx === i ? 'text-gold' : 'text-primary'"
              >{{ d.dayNum }}</span
            >
          </button>
        </div>

        <div v-for="cinema in activeDateCinemas" :key="cinema.cinemaId" class="mb-7">
          <div class="flex items-center gap-2 text-sm font-semibold text-muted mb-3">
            <span class="w-0.75 h-3.5 rounded-sm bg-gold shrink-0" />
            {{ cinema.name }}
            <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-elevated text-dim border border-dark">
              {{ cinema.address }}
            </span>
          </div>

          <div class="flex gap-2.5 flex-wrap">
            <button
              v-for="slot in cinema.slots"
              :key="slot.timeTableId"
              class="text-center px-4 py-2.5 rounded-lg border transition-all duration-200"
              :class="
                selectedTimeTableId === slot.timeTableId
                  ? 'border-gold bg-gold/10'
                  : 'border-dark bg-card hover:border-gold/50 hover:bg-gold/5'
              "
              @click="selectSlot(cinema, slot)"
            >
              <span class="block text-[15px] font-semibold text-primary">{{ slot.time }}</span>
              <span class="block text-[11px] text-muted mt-0.5">{{ slot.type }}</span>
              <span
                class="block text-[11px] mt-0.5"
                :class="slot.seatsLeft === 0 ? 'text-danger' : slot.seatsLeft <= 10 ? 'text-[#f0a030]' : 'text-success'"
              >
                {{ slot.seatsLeft === 0 ? 'Sold out' : `${slot.seatsLeft} left` }}
              </span>
            </button>
          </div>
        </div>

        <transition name="page">
          <div v-if="selectedTimeTableId !== null" class="mt-10 pt-8 border-t border-dark">
            <h2 class="font-display text-[24px] tracking-[0.06em] mb-6">CHOOSE YOUR SEATS</h2>

            <div v-if="seatMapLoading" class="flex items-center gap-3 text-muted py-8">
              <Spinner class="size-5" />
              <span class="text-sm">Loading seat map…</span>
            </div>

            <div v-else class="flex flex-wrap gap-6 items-start">
              <div class="flex-1 min-w-[320px]">
                <SeatMap :seat-map="seatMap" :is-selected="isSelected" @toggle="toggleSeat" />
              </div>

              <div class="w-65 bg-card border border-dark rounded-2xl p-6 shrink-0">
                <h3 class="font-display text-lg tracking-wide mb-4">BOOKING SUMMARY</h3>

                <p class="text-[13.5px] text-muted mb-1 inline-flex items-center gap-1.5">
                  <ClapperboardIcon class="size-3.5 -mt-0.5" />
                  {{ movie.title }}
                </p>
                <p class="text-[13px] text-dim mb-1">
                  {{ selectedCinema?.name }}
                </p>
                <p class="text-[13px] text-dim mb-4">
                  {{ activeDate?.label }} {{ dayjs(activeDate?.date).format('DD.MM') }} · {{ selectedSlot?.time }}
                  <span class="ml-1 text-[11px] text-muted">({{ selectedSlot?.type }})</span>
                </p>

                <div class="h-px bg-dark mb-4" />

                <p v-if="!selectedSeats.length" class="text-[13.5px] text-dim text-center py-3">No seats selected</p>

                <div v-for="s in selectedSeats" :key="s.label" class="flex justify-between text-[13.5px] mb-2">
                  <span class="text-muted">
                    Seat {{ s.label }}
                    <span v-if="s.premium" class="ml-1 text-[10px] text-info font-semibold uppercase tracking-wide"
                      >Premium</span
                    >
                  </span>
                  <span class="text-gold font-semibold">{{ s.price }} RSD</span>
                </div>

                <div class="h-px bg-dark my-3" />
                <div class="flex justify-between items-center text-[15px] font-bold mb-5">
                  <span>Total</span>
                  <span class="font-display text-[22px] text-gold tracking-wider"> {{ totalPrice() }} RSD</span>
                </div>

                <button
                  class="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                  :class="
                    selectedSeats.length
                      ? 'bg-gold text-base hover:shadow-gold-sm hover:bg-[#f0c85a] hover:-translate-y-px'
                      : 'bg-elevated text-dim border border-dark cursor-not-allowed'
                  "
                  :disabled="!selectedSeats.length"
                  @click="addToCart"
                >
                  <span class="inline-flex items-center gap-2"> <CartIcon class="size-4" />Add to Cart </span>
                </button>
              </div>
            </div>
          </div>
        </transition>
      </template>

      <div class="h-16" />
    </section>
  </div>

  <div v-else class="flex flex-col items-center justify-center pt-72 pb-32 text-center">
    <span class="mb-6 opacity-40"><NoMovieIcon class="size-20" /></span>
    <h2 class="text-xl font-semibold text-muted mb-3">Movie not found</h2>
    <router-link to="/" class="flex items-center gap-1 text-gold text-sm hover:underline no-underline">
      Back to home <ArrowRightIcon class="size-4" />
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSeatMap } from '@/composables/useSeatMap'
import { movieService } from '@/services/movieService'
import { convertMinutesToHours } from '@/utils/time'
import type { Movie } from '@/types/Movie'
import SeatMap from '@/components/ui/SeatMap.vue'
import Spinner from '@/components/ui/Spinner.vue'
import TicketIcon from '@/components/icons/TicketIcon.vue'
import HeartIcon from '@/components/icons/HeartIcon.vue'
import ClapperboardIcon from '@/components/icons/ClapperboardIcon.vue'
import CartIcon from '@/components/icons/CartIcon.vue'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon.vue'
import NoMovieIcon from '@/components/icons/NoMovieIcon.vue'
import dayjs from 'dayjs'
import type { CinemaScreenings, ScreeningDate, ScreeningSlot } from '@/types/TimeTable'
import { timeTableService } from '@/services/timeTableService'
import NoScreeningIcon from '@/components/icons/NoScreeningIcon.vue'
import { invoiceService } from '@/services/invoiceService'

const route = useRoute()

const movie = ref<Movie>()
const loading = ref(true)

const screeningDates = ref<ScreeningDate[]>([])
const screeningsLoading = ref(false)
const selectedDateIdx = ref(0)

const selectedTimeTableId = ref<number | null>(null)
const selectedCinema = ref<CinemaScreenings | null>(null)
const selectedSlot = ref<ScreeningSlot | null>(null)

const seatMapLoading = ref(false)
const { seatMap, selectedSeats, buildMap, isSelected, toggleSeat, totalPrice } = useSeatMap()

const actors = computed(() => {
  const list = movie.value?.actors
  if (!list?.length) return 'No actors listed'
  return list.map((a: any) => a.name).join(', ')
})

const activeDateCinemas = computed<CinemaScreenings[]>(() => screeningDates.value[selectedDateIdx.value]?.cinemas ?? [])
const activeDate = computed<ScreeningDate | undefined>(() => screeningDates.value[selectedDateIdx.value])

onMounted(async () => {
  const id = route.params.id as string
  await Promise.all([fetchMovie(id), fetchScreenings(id)])
})

async function fetchMovie(id: string) {
  try {
    loading.value = true
    movie.value = await movieService.getMovieById(id)
  } catch (err) {
    console.error('Failed to load movie:', err)
  } finally {
    loading.value = false
  }
}

async function fetchScreenings(id: string) {
  try {
    screeningsLoading.value = true
    screeningDates.value = await timeTableService.getScreeningsForMovie(id)
  } catch (err) {
    console.error('Failed to load screenings:', err)
    screeningDates.value = []
  } finally {
    screeningsLoading.value = false
  }
}

function selectDate(idx: number) {
  selectedDateIdx.value = idx
  selectedTimeTableId.value = null
  selectedCinema.value = null
  selectedSlot.value = null
  buildMap()
}

async function selectSlot(cinema: CinemaScreenings, slot: ScreeningSlot) {
  if (slot.seatsLeft === 0) return

  selectedTimeTableId.value = slot.timeTableId
  selectedCinema.value = cinema
  selectedSlot.value = slot

  try {
    seatMapLoading.value = true
    buildMap()

    const data = await timeTableService.getSeatMap(slot.timeTableId)
    buildMap(data.seats)
  } catch (err) {
    console.error('Failed to load seat map:', err)
  } finally {
    seatMapLoading.value = false
  }
}

async function addToCart() {
  if (!selectedSeats.value.length || !movie.value || !selectedSlot.value) return

  const ticketsCountAdded = selectedSeats.value.length
  const targetTimeTableId = selectedSlot.value.timeTableId

  await invoiceService.addToCart(
    targetTimeTableId,
    selectedSeats.value.map((s) => ({
      label: s.label,
      price: s.price,
      seatIndex: s.seatIndex,
    })),
  )

  window.dispatchEvent(new Event('cart-change'))

  const activeDateObj = screeningDates.value[selectedDateIdx.value]
  if (activeDateObj && activeDateObj.cinemas) {
    for (const cinema of activeDateObj.cinemas) {
      const targetSlot = cinema.slots.find((slot) => slot.timeTableId === targetTimeTableId)

      if (targetSlot) {
        targetSlot.seatsLeft = Math.max(0, targetSlot.seatsLeft - ticketsCountAdded)
        break
      }
    }
  }

  const updatedSeats = await timeTableService.getSeatMap(targetTimeTableId)
  buildMap(updatedSeats.seats)

  selectedTimeTableId.value = null
  selectedCinema.value = null
  selectedSlot.value = null
}
</script>
