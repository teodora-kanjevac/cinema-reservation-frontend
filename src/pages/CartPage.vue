<template>
  <div class="max-w-275 mx-auto px-8 py-12 pt-32">
    <div class="mb-8">
      <h1 class="font-display text-[36px] tracking-[0.08em]">YOUR CART</h1>
      <p class="text-sm text-muted mt-1">6 items in your cart</p>
    </div>

    <div v-if="!itemCount" class="flex flex-col items-center py-20 text-center">
      <span class="mb-4 opacity-40"><NoTicketIcon class="size-10" /></span>
      <h3 class="text-xl font-semibold text-muted mb-2">Your cart is empty</h3>
      <p class="text-sm text-dim mb-6">You haven't added any tickets yet.</p>
      <router-link
        to="/"
        class="px-6 py-2.5 rounded-xl bg-gold text-base text-sm font-semibold shadow-gold-sm hover:bg-[#f0c85a] transition-all duration-200 no-underline"
      >
        Browse Movies
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-7 items-start">
      <div class="flex flex-col gap-4">
        <div
          v-for="(item, idx) in 4"
          :key="idx"
          class="flex gap-5 bg-card border border-dark rounded-2xl p-5 hover:border-bright transition-all duration-200"
        >
          <div class="w-18 h-26 rounded-lg overflow-hidden shrink-0 bg-elevated">
            <img src="" alt="sdfsdf" class="w-full h-full object-cover" />
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="text-[15px] font-semibold text-primary mb-1.5 line-clamp-1">
              {{ 'item.movie.title' }}
            </h3>
            <div class="flex items-center gap-1.5 text-[13px] text-muted mb-1">
              <i class="pi pi-map-marker text-xs" /> {{ 'item.cinema' }}
            </div>
            <div class="flex items-center gap-1.5 text-[13px] text-muted mb-1">
              <i class="pi pi-calendar text-xs" /> {{ ' item.date' }} · <i class="pi pi-clock text-xs ml-1" />
              {{ 'item.time' }}
            </div>
            <div class="flex items-center gap-1.5 text-[13px] text-muted mb-3">
              <i class="pi pi-desktop text-xs" /> {{ 'item.type' }}
            </div>
            <div class="flex gap-1.5 flex-wrap">
              <span
                v-for="s in 10"
                class="px-2.5 py-0.5 rounded-full text-[12px] bg-elevated border border-dark text-muted"
              >
                {{ 's.label ' }}
              </span>
            </div>
          </div>

          <div class="flex flex-col items-end justify-between shrink-0">
            <button
              class="text-dim hover:text-danger transition-colors duration-200 text-lg leading-none"
              @click="remove(idx)"
            >
              ✕
            </button>
            <span class="font-display text-[22px] text-gold tracking-wide">€{{ 90 }}</span>
          </div>
        </div>
      </div>

      <div class="bg-card border border-dark rounded-2xl p-6 sticky top-24">
        <h2 class="font-display text-[20px] tracking-wide mb-5">ORDER SUMMARY</h2>

        <div v-for="item in 4" class="flex justify-between text-[13.5px] mb-3">
          <span class="text-muted line-clamp-1 mr-2"> {{ 'item.movie.title' }} x{{ 2 }} </span>
          <span class="text-primary shrink-0">€{{ 70 }}</span>
        </div>

        <div class="h-px bg-border my-4" />

        <div class="flex justify-between text-[14px] mb-2">
          <span class="text-muted">Subtotal</span>
          <span>€{{ 90 }}</span>
        </div>
        <div class="flex justify-between text-[14px] mb-2">
          <span class="text-muted">Booking Fee</span>
          <span>€{{ 2 }}</span>
        </div>
        <div class="flex justify-between text-[14px] mb-4">
          <span class="text-muted">Taxes (10%)</span>
          <span>€{{ 32 }}</span>
        </div>

        <div class="h-px bg-border mb-4" />

        <div class="flex justify-between items-center text-[16px] font-bold mb-5">
          <span>Total</span>
          <span class="font-display text-[26px] text-gold tracking-wide">€{{ 160 }}</span>
        </div>

        <div class="flex gap-2 mb-5">
          <input
            v-model="promoCode"
            placeholder="Promo code"
            class="flex-1 bg-elevated border border-dark text-primary rounded-lg px-3 py-2 text-[13px] font-body outline-none focus:border-gold transition-colors duration-200 placeholder:text-dim"
          />
          <button
            class="px-3 py-2 rounded-lg border border-dark text-[13px] font-medium text-muted hover:border-bright hover:text-primary transition-all duration-200 bg-elevated"
            @click="applyPromo"
          >
            Apply
          </button>
        </div>

        <button
          class="flex items-center gap-1 justify-center w-full py-3.5 rounded-xl text-[15px] font-semibold bg-gold text-base hover:bg-[#f0c85a] hover:shadow-gold-sm hover:-translate-y-px transition-all duration-200 mb-2"
          @click="checkout"
        >
          Proceed to Checkout <ArrowRightIcon class="size-4.5"/>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const promoCode = ref('')
const itemCount = ref(2)

function remove(idx: any) {
  //   cartStore.removeItem(idx)
  //   toast.success('Item removed from cart')
}

function applyPromo() {
  //   toast.info('Promo code applied!')
}

function checkout() {
  //   if (!authStore.isLoggedIn) {
  //     router.push({ name: 'login' })
  //     return
  //   }
}
</script>
