<template>
  <div class="pt-17" v-if="movie">
    <section class="relative h-120 overflow-hidden">
      <div
        class="absolute inset-0 bg-cover bg-center scale-105"
        :style="{ backgroundImage: `url(${movie.backdrop})`, filter: 'blur(3px) brightness(0.25)' }"
      />
      <div
        class="absolute inset-0 pointer-events-none"
        style="
          background:
            linear-gradient(to right, #080b12 35%, transparent 100%),
            linear-gradient(to top, #080b12 0%, transparent 40%);
        "
      />

      <div class="relative z-10 max-w-7xl mx-auto px-8 h-full flex items-end pb-12 gap-12">
        <div
          class="hidden sm:block w-52.5 shrink-0 rounded-2xl overflow-hidden border border-bright shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
        >
          <img :src="movie.poster" :alt="movie.title" class="w-full block" />
        </div>

        <div class="flex-1 pb-1">
          <div class="flex gap-2 mb-3 flex-wrap">
            <span
              v-for="g in movie.genres"
              :key="g"
              class="px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold tracking-wide bg-elevated text-muted border border-dark"
              >{{ g }}</span
            >
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11.5px] font-semibold tracking-wide bg-gold/15 text-gold border border-gold/30"
            >
              <StarIcon class="size-4 -mb-0.5" /> {{ movie.rating }}
            </span>
          </div>

          <h1
            class="font-display text-[clamp(32px,4vw,56px)] leading-none tracking-wider mb-3"
            style="text-shadow: 0 2px 16px rgba(0, 0, 0, 0.5)"
          >
            {{ movie.title }}
          </h1>

          <div class="flex items-center gap-3 flex-wrap mb-4">
            <span class="text-sm text-muted">{{ movie.year }}</span>
            <span class="size-1 rounded-full bg-dim" />
            <span class="text-sm text-muted">{{ movie.duration }}</span>
            <span class="size-1 rounded-full bg-dim" />
            <span
              class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-info/12 text-[#7ab3f0] border border-info/25"
            >
              PG-13
            </span>
          </div>

          <p class="text-[15px] text-muted leading-[1.75] max-w-145 mb-5">
            {{ movie.description }}
          </p>

          <div class="flex gap-8 mb-7">
            <div>
              <label class="text-[11px] uppercase tracking-widest text-dim block mb-1">Director</label>
              <span class="text-sm text-primary font-medium">{{ movie.director }}</span>
            </div>
            <div>
              <label class="text-[11px] uppercase tracking-widest text-dim block mb-1">Cast</label>
              <span class="text-sm text-primary font-medium">{{ movie.cast }}</span>
            </div>
          </div>

          <div class="flex gap-2.5">
            <a
              href="#screenings"
              class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-[15px] font-semibold bg-gold text-base hover:bg-[#f0c85a] hover:shadow-gold-sm hover:-translate-y-px transition-all duration-200 no-underline"
            >
              <TicketIcon class="size-5" />
              <span>Book Tickets</span>
            </a>
            <button
              class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-[15px] font-semibold text-primary bg-elevated border border-bright hover:border-gold hover:text-gold transition-all duration-200"
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

      <div class="flex gap-2 overflow-x-auto pb-1 mb-7 scrollbar-hide">
        <button
          v-for="(d, i) in SCREENING_DATES"
          :key="i"
          class="shrink-0 text-center px-4 py-2.5 rounded-xl border transition-all duration-200"
          :class="selectedDate === i ? 'border-gold bg-gold/10 text-gold' : 'border-dark bg-card hover:border-bright'"
          @click="selectedDate = i"
        >
          <span
            class="block text-[11px] uppercase tracking-[0.08em]"
            :class="selectedDate === i ? 'text-gold' : 'text-dim'"
            >{{ d.name }}</span
          >
          <span
            class="block font-display text-[26px] leading-none mt-0.5"
            :class="selectedDate === i ? 'text-gold' : 'text-primary'"
            >{{ d.num }}</span
          >
        </button>
      </div>

      <div v-for="cinema in CINEMAS" :key="cinema.name" class="mb-7">
        <div class="flex items-center gap-2 text-sm font-semibold text-muted mb-3">
          <span class="w-0.75 h-3.5 rounded-sm bg-gold shrink-0" />
          {{ cinema.name }}
          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-elevated text-dim border border-dark">
            {{ cinema.distance }}
          </span>
        </div>

        <div class="flex gap-2.5 flex-wrap">
          <button
            v-for="time in cinema.times"
            :key="time.t"
            class="text-center px-4 py-2.5 rounded-lg border transition-all duration-200"
            :class="
              selectedTimeKey === cinema.name + time.t
                ? 'border-gold bg-gold/10'
                : 'border-dark bg-card hover:border-gold/50 hover:bg-gold/5'
            "
            @click="selectTime(cinema, time)"
          >
            <span class="block text-[15px] font-semibold text-primary">{{ time.t }}</span>
            <span class="block text-[11px] text-muted mt-0.5">{{ time.type }}</span>
            <span class="block text-[11px] text-success mt-0.5">{{ time.seats }} left</span>
          </button>
        </div>
      </div>

      <transition name="page">
        <div v-if="selectedTimeKey" class="mt-10 pt-8 border-t border-dark">
          <h2 class="font-display text-[24px] tracking-[0.06em] mb-6">CHOOSE YOUR SEATS</h2>

          <div class="flex flex-wrap gap-6 items-start">
            <div class="flex-1 min-w-[320px]">
              <SeatMap :seat-map="seatMap" :is-selected="isSelected" @toggle="toggleSeat" />
            </div>

            <div class="w-65 bg-card border border-dark rounded-2xl p-6 shrink-0">
              <h3 class="font-display text-lg tracking-wide mb-4">BOOKING SUMMARY</h3>
              <p class="text-[13.5px] text-muted mb-1 inline-flex items-center gap-1.5">
                <ClapperboardIcon class="size-3.5 -mt-0.5" /> {{ movie.title }}
              </p>
              <p class="text-[13px] text-dim mb-4">{{ selectedCinema?.name }} · {{ selectedTimeObj?.t }}</p>

              <div class="h-px bg-dark mb-4" />

              <p v-if="!selectedSeats.length" class="text-[13.5px] text-dim text-center py-3">No seats selected</p>
              <div v-for="s in selectedSeats" :key="s.label" class="flex justify-between text-[13.5px] mb-2">
                <span class="text-muted">Seat {{ s.label }}</span>
                <span class="text-gold font-semibold">€{{ s.price }}</span>
              </div>

              <div class="h-px bg-dark my-3" />
              <div class="flex justify-between items-center text-[15px] font-bold mb-5">
                <span>Total</span>
                <span class="font-display text-[22px] text-gold tracking-wider"> €{{ totalPrice() }} </span>
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
                <span class="inline-flex items-center gap-2"><CartIcon class="size-4" />Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </transition>

      <div class="h-16" />
    </section>
  </div>

  <div v-else class="flex flex-col items-center justify-center pt-72 pb-32 text-center">
    <span class="mb-6 opacity-40"><NoMovieIcon class="size-20"/></span>
    <h2 class="text-xl font-semibold text-muted mb-3">Movie not found</h2>
    <router-link to="/" class="flex items-center gap-1 text-gold text-sm hover:underline no-underline">Back to home <ArrowRightIcon class="size-4"/></router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { MOVIES, CINEMAS, SCREENING_DATES } from '@/data/movie'
import { useSeatMap } from '@/composables/useSeatMap.js'
import SeatMap from '@/components/ui/SeatMap.vue'
import StarIcon from '@/components/icons/StarIcon.vue'
import TicketIcon from '@/components/icons/TicketIcon.vue'
import HeartIcon from '@/components/icons/HeartIcon.vue'
import ClapperboardIcon from '@/components/icons/ClapperboardIcon.vue'
import CartIcon from '@/components/icons/CartIcon.vue'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon.vue'
import NoMovieIcon from '@/components/icons/NoMovieIcon.vue'

const route = useRoute()

const movie = computed(() => MOVIES.find((m: any) => m.id === Number(route.params.id)))

const selectedDate = ref(0)
const selectedTimeKey = ref('')
const selectedCinema = ref<any | null>(null)
const selectedTimeObj = ref<any | null>(null)

const { seatMap, selectedSeats, buildMap, isSelected, toggleSeat, totalPrice } = useSeatMap()

function selectTime(cinema: any, time: any) {
  selectedTimeKey.value = cinema.name + time.t
  selectedCinema.value = cinema
  selectedTimeObj.value = time
  buildMap()
  setTimeout(() => {
    document.querySelector('[data-seat-map]')?.scrollIntoView({ behavior: 'smooth' })
  }, 100)
}

function addToCart() {
  if (!selectedSeats.value.length) return
  //   cartStore.addItem({
  //     movie: movie.value,
  //     cinema: selectedCinema.value.name,
  //     date: `${SCREENING_DATES[selectedDate.value].name} ${SCREENING_DATES[selectedDate.value].num}`,
  //     time: selectedTimeObj.value.t,
  //     type: selectedTimeObj.value.type,
  //     seats: [...selectedSeats.value],
  //     total: totalPrice(),
  //   })
  //   toast.success(`${selectedSeats.value.length} ticket(s) added to cart!`)
  buildMap()
  selectedTimeKey.value = ''
}
</script>
