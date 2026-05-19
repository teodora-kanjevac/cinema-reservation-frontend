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
        class="w-9.5 h-9.5 rounded flex items-center justify-center bg-elevated border border-dark text-muted hover:text-text-primary hover:border-bright transition-all duration-200"
        title="Search"
      >
        <SearchIcon class="size-5" />
      </router-link>

      <router-link
        to="/cart"
        class="relative w-9.5 h-9.5 rounded flex items-center justify-center bg-elevated border border-dark text-muted hover:text-text-primary hover:border-bright transition-all duration-200"
        title="Cart"
      >
        <CartIcon class="size-5" />
      </router-link>

      <template v-if="!isLoggedIn">
        <router-link
          to="/auth/login"
          class="flex items-center gap-1 text-[13px] font-semibold text-muted px-4 py-2 rounded border border-dark hover:text-text-primary hover:border-bright hover:bg-elevated transition-all duration-200"
        >
          <LogInIcon class="size-4 -ms-1"/> Log In
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
          class="w-9.5 h-9.5 rounded flex items-center justify-center bg-gold/10 border border-gold/30 text-gold text-sm font-bold font-display tracking-wider hover:bg-gold/20 transition-all duration-200"
        >
          TK
        </router-link>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SearchIcon from '../icons/SearchIcon.vue'
import TicketIcon from '../icons/TicketIcon.vue'
import CartIcon from '../icons/CartIcon.vue'
import LogInIcon from '../icons/LogInIcon.vue'

const isLoggedIn = ref(false)

const navLinks = [
  { to: '/', label: 'Now Showing' },
  { to: '/browse', label: 'Browse' },
]
</script>
