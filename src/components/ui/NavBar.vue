<template>
  <header
    class="fixed top-0 left-0 right-0 z-200 py-5 flex items-center px-16 gap-0 bg-base/85 backdrop-blur-xl backdrop-saturate-150 border-b border-dark"
  >
    <router-link
      to="/"
      class="font-display text-[26px] tracking-[0.12em] text-gold no-underline shrink-0 hover:opacity-95 transition-opacity duration-200"
      style="text-shadow: 0 0 20px rgba(160, 124, 40, 0.7)"
    >
      <div class="flex items-center gap-2">
        <img class="w-8 mb-1" src="/images/logo.png" alt="Logo" />
        <span>SNAP<span class="text-primary">SEAT</span></span>
      </div>
    </router-link>

    <nav class="hidden md:flex items-center gap-1 ml-9 flex-1">
      <router-link
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="text-[13.5px] font-medium text-muted px-3.5 py-1.5 rounded border border-transparent transition-all duration-200 hover:text-text-primary hover:bg-elevated"
        exact-active-class="text-gold! border-gold/20! bg-gold/10!"
      >
        {{ link.label }}
      </router-link>
    </nav>

    <div class="flex items-center gap-2.5 ml-auto">
      <router-link
        to="/browse"
        class="size-9.5 rounded flex items-center justify-center bg-elevated border border-dark text-muted hover:text-text-primary hover:border-bright transition-all duration-200"
        title="Search"
      >
        <SearchIcon class="size-5" />
      </router-link>

      <router-link
        to="/cart"
        class="relative size-9.5 rounded flex items-center justify-center bg-elevated border border-dark text-muted hover:text-text-primary hover:border-bright transition-all duration-200"
        title="Cart"
      >
        <CartIcon class="size-5" />

        <span
          v-if="cartItemsCount > 0"
          class="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 px-1 bg-gold text-base text-[10px] font-bold rounded-full flex items-center justify-center border border-base animate-in zoom-in duration-200"
        >
          {{ cartItemsCount }}
        </span>
      </router-link>

      <template v-if="!isLoggedIn">
        <router-link
          to="/auth/login"
          class="flex items-center gap-1 text-[13px] font-semibold text-muted px-4 py-2 rounded border border-dark hover:text-text-primary hover:border-bright hover:bg-elevated transition-all duration-200"
        >
          <LogInIcon class="size-4 -ms-1" /> Log In
        </router-link>
        <router-link
          to="/auth/signup"
          class="text-[13px] font-semibold text-base bg-gold px-4 py-2 rounded hover:bg-[#f0c85a] hover:shadow-gold-sm hover:-translate-y-px transition-all duration-200"
        >
          Join Free
        </router-link>
      </template>

      <template v-else>
        <router-link
          to="/profile"
          class="size-9.5 rounded flex items-center justify-center bg-gold/10 border border-gold/30 text-gold font-bold font-display tracking-wider hover:bg-gold/20 transition-all duration-200"
        >
          <span class="mt-0.5 text-[18px]">{{ userInitials }}</span>
        </router-link>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import SearchIcon from '../icons/SearchIcon.vue'
import CartIcon from '../icons/CartIcon.vue'
import LogInIcon from '../icons/LogInIcon.vue'
import { authService } from '@/services/authService'
import { invoiceService } from '@/services/invoiceService'
import type { User } from '@/types/User'

const isLoggedIn = ref(false)
const user = ref<User | null>(null)
const cartItemsCount = ref<number>(0)

const navLinks = [
  { to: '/', label: 'Now Showing' },
  { to: '/browse', label: 'Browse' },
]

const userInitials = computed(() => {
  if (!user.value || !user.value.firstName) return 'N/A'
  const first = user.value.firstName.charAt(0)
  const last = user.value.lastName ? user.value.lastName.charAt(0) : ''
  return (first + last).toUpperCase()
})

async function fetchCartItemCount() {
  if (!isLoggedIn.value) {
    cartItemsCount.value = 0
    return
  }

  cartItemsCount.value = await invoiceService.getItemCountInCart()
}

function syncAuthState() {
  isLoggedIn.value = authService.isAuthenticated()
  user.value = authService.getCurrentUser()
  fetchCartItemCount()
}

watch(isLoggedIn, (loggedIn) => {
  if (loggedIn) {
    fetchCartItemCount()
  } else {
    cartItemsCount.value = 0
  }
})

onMounted(() => {
  syncAuthState()

  window.addEventListener('auth-change', syncAuthState)
  window.addEventListener('cart-change', fetchCartItemCount)
  window.addEventListener('storage', syncAuthState)
})

onBeforeUnmount(() => {
  window.removeEventListener('auth-change', syncAuthState)
  window.removeEventListener('cart-change', fetchCartItemCount)
  window.removeEventListener('storage', syncAuthState)
})
</script>
