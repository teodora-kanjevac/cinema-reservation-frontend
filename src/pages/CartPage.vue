<template>
  <div class="min-w-5xl mx-auto px-8 py-12 pt-32">
    <div class="mb-8">
      <h1 class="font-display text-[36px] tracking-[0.08em]">YOUR CART</h1>
      <p v-if="cartData && itemCount" class="text-sm text-muted mt-1">
        {{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }} in your cart
      </p>
    </div>

    <div v-if="loading" class="flex flex-col items-center py-20 text-center">
      <Spinner />
      <p class="text-sm text-muted mt-8">Retrieving your order details…</p>
    </div>

    <div v-else-if="!itemCount" class="flex flex-col items-center py-20 text-center">
      <span class="mb-4 opacity-40"><NoTicketIcon class="size-20" /></span>
      <h3 class="text-xl font-semibold text-muted mb-2">Your cart is empty</h3>
      <p class="text-sm text-dim mb-6">You haven't added any tickets yet.</p>
      <router-link
        to="/browse"
        class="px-6 py-2.5 rounded-lg bg-gold text-base text-sm font-semibold shadow-gold-sm hover:bg-[#f0c85a] transition-all duration-200 no-underline"
      >
        Browse Movies
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-7 items-start">
      <div class="flex flex-col gap-4">
        <div
          v-for="item in cartData?.invoiceItems"
          :key="item.invoiceItemId"
          class="flex gap-5 bg-card border border-dark rounded-2xl p-5 hover:border-bright transition-all duration-200"
        >
          <div class="w-18 h-26 rounded-lg overflow-hidden shrink-0 bg-elevated">
            <img
              :src="item.timeTable?.movie.poster"
              :alt="item.timeTable?.movie?.title"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="flex-1 min-w-0">
            <router-link
              :to="`/movie/${item.timeTable.movieId}`"
              class="text-[15px] hover:underline font-semibold text-primary mb-1.5 line-clamp-1"
            >
              {{ item.timeTable?.movie?.title }}
            </router-link>
            <div class="flex items-center gap-1.5 text-[13px] text-muted mb-1">
              <CinemaIcon class="size-4" /> {{ item.timeTable?.cinema?.name }}
            </div>
            <div class="flex items-center gap-1.5 text-[13px] text-muted mb-1">
              <CalendarIcon class="size-4 -mt-0.5" /> {{ dayjs(item.timeTable?.screeningDate).format('DD.MM') }} ·
              <ClockIcon class="size-4 -mt-0.5" />
              {{ item.timeTable?.startTime.substring(0, 5) }}
            </div>
            <div class="flex items-center gap-1.5 text-[13px] text-muted mb-3">
              <ScreenIcon class="size-4" /> {{ item.timeTable?.screenType }}
            </div>

            <div class="flex gap-1.5 flex-wrap">
              <span
                class="px-2.5 py-0.5 rounded-full text-[12px] bg-gold/10 border border-gold/20 text-gold font-mono font-bold"
              >
                Seat Location: {{ formatSeatLabel(item.seatNumber) }}
              </span>
            </div>
          </div>

          <div class="flex flex-col items-end justify-between shrink-0">
            <button
              class="text-dim hover:text-danger transition-colors duration-200 text-lg leading-none"
              :disabled="actionLoading"
              @click="remove(item.invoiceItemId)"
            >
              <CloseIcon class="size-6" />
            </button>
            <span class="font-display text-[22px] text-gold tracking-wide">
              {{ item.pricePerItem * item.count }} RSD
            </span>
          </div>
        </div>
        <div class="flex items-center justify-end">
          <button
            @click="removeAll()"
            class="flex justify-center items-center gap-1.5 w-full py-2.5 rounded-xl text-[13px] font-medium text-muted border border-dark hover:border-bright hover:text-primary transition-all duration-200 no-underline"
          >
            <TrashIcon class="size-4 -mt-0.5" /> Remove all tickets
          </button>
        </div>
      </div>

      <div class="bg-card border border-dark rounded-2xl p-6 sticky top-24">
        <h2 class="font-display text-[20px] tracking-wide mb-5">ORDER SUMMARY</h2>

        <div
          v-for="item in cartData?.invoiceItems"
          :key="'summary-' + item.invoiceItemId"
          class="flex justify-between text-[13.5px] mb-3"
        >
          <span class="text-muted line-clamp-1 mr-2">
            {{ item.timeTable?.movie?.title }} ({{ formatSeatLabel(item.seatNumber) }})
          </span>
          <span class="text-primary shrink-0">{{ item.pricePerItem * item.count }} RSD</span>
        </div>

        <div class="h-px bg-dark my-4" />

        <div class="flex justify-between text-[14px] mb-2">
          <span class="text-muted">Subtotal</span>
          <span>{{ subtotal }} RSD</span>
        </div>
        <div class="flex justify-between text-[14px] mb-2">
          <span class="text-muted">Booking Fee</span>
          <span>{{ bookingFee }} RSD</span>
        </div>

        <div class="h-px bg-dark mb-4" />

        <div class="flex justify-between items-center text-[16px] font-bold mb-5">
          <span>Total</span>
          <span class="font-display text-[26px] text-gold tracking-wide">{{ grandTotal }} RSD</span>
        </div>

        <button
          class="flex items-center gap-1 justify-center w-full py-3.5 rounded-xl text-[15px] font-semibold bg-gold text-base hover:bg-[#f0c85a] hover:shadow-gold-sm hover:-translate-y-px transition-all duration-200 mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="actionLoading"
          @click="handleCheckout"
        >
          {{ actionLoading ? 'Processing Checkout…' : 'Proceed to Checkout' }}
          <ArrowRightIcon v-if="!actionLoading" class="size-4.5" />
        </button>
        <router-link
          to="/browse"
          class="block text-center w-full py-2.5 rounded-xl text-[13px] font-medium text-muted border border-dark hover:border-bright hover:text-primary transition-all duration-200 no-underline"
        >
          Continue Shopping
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ArrowRightIcon from '@/components/icons/ArrowRightIcon.vue'
import NoTicketIcon from '@/components/icons/NoTicketIcon.vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { invoiceService } from '@/services/invoiceService'
import Spinner from '@/components/ui/Spinner.vue'
import { movieService } from '@/services/movieService'
import CalendarIcon from '@/components/icons/CalendarIcon.vue'
import ClockIcon from '@/components/icons/ClockIcon.vue'
import ScreenIcon from '@/components/icons/ScreenIcon.vue'
import CinemaIcon from '@/components/icons/CinemaIcon.vue'
import dayjs from 'dayjs'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import { changeCheckoutAccess } from '@/router'
import { formatSeatLabel } from '@/utils/seatNumber'

const router = useRouter()

const cartData = ref<any | null>(null)
const loading = ref(true)
const actionLoading = ref(false)

const itemCount = computed(() => {
  if (!cartData.value?.invoiceItems) return 0
  return cartData.value.invoiceItems.reduce((acc: number, item: any) => acc + item.count, 0)
})

const subtotal = computed(() => {
  if (!cartData.value?.invoiceItems) return 0
  return cartData.value.invoiceItems.reduce((acc: number, item: any) => acc + item.pricePerItem * item.count, 0)
})

const bookingFee = computed(() => {
  return itemCount.value > 0 ? 50 : 0
})

const grandTotal = computed(() => {
  return subtotal.value + bookingFee.value
})

async function loadCart() {
  try {
    loading.value = true
    const cart = await invoiceService.getCart()

    if (cart?.invoiceItems && cart.invoiceItems.length > 0) {
      const uniqueMovieIds = [...new Set(cart.invoiceItems.map((item: any) => item.timeTable?.movieId))].filter(Boolean)

      const movieRequests = uniqueMovieIds.map((id: any) =>
        movieService.getMovieById(String(id)).catch((err) => {
          return null
        }),
      )

      const moviesData = await Promise.all(movieRequests)

      const movieMap = uniqueMovieIds.reduce((map: Record<number, any>, id: any, index) => {
        if (moviesData[index]) {
          map[id] = moviesData[index]
        }
        return map
      }, {})

      cart.invoiceItems = cart.invoiceItems.map((item: any) => {
        const movieId = item.timeTable?.movieId
        if (movieId && movieMap[movieId]) {
          item.timeTable.movie = movieMap[movieId]
        }
        return item
      })
    }

    cartData.value = cart
  } catch (err) {
    console.error('Failed to load shopping cart:', err)
  } finally {
    loading.value = false
  }
}

async function remove(invoiceItemId: number) {
  try {
    actionLoading.value = true
    await invoiceService.removeFromCart(invoiceItemId)

    await loadCart()

    window.dispatchEvent(new Event('cart-change'))
  } catch (err) {
    console.error('Failed to remove cart item:', err)
  } finally {
    actionLoading.value = false
  }
}

async function removeAll() {
  try {
    actionLoading.value = true
    await invoiceService.removeAllFromCart()

    await loadCart()

    window.dispatchEvent(new Event('cart-change'))
  } catch (err) {
    console.error('Failed to remove cart items:', err)
  } finally {
    actionLoading.value = false
  }
}

async function handleCheckout() {
  try {
    actionLoading.value = true

    const purchaseId = 'INV-' + Date.now()
    const payload = {
      purchaseId: purchaseId,
      counterName: 'ONLINE_WEB_CLIENT',
    }

    await invoiceService.checkout(payload)

    window.dispatchEvent(new Event('cart-change'))

    changeCheckoutAccess(true)
    router.push({
      path: '/checkout/success',
      query: { id: purchaseId },
    })
  } catch (err) {
    console.error('Checkout processing error occurred:', err)
  } finally {
    actionLoading.value = false
  }
}

onMounted(() => {
  loadCart()
})
</script>
