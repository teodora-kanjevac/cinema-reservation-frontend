<template>
  <footer class="bg-surface border-t border-dark mt-20 pt-12 pb-7 px-8">
    <div class="max-w-300 mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">
        <div>
          <div
            class="font-display text-2xl tracking-[0.12em] text-gold mb-3"
            style="text-shadow: 0 0 16px rgba(160, 124, 40, 0.5)"
          >
            <div class="flex items-center gap-2">
              <img class="w-7 mb-1" src="/images/logo.png" alt="Logo" />
              <span>SNAP<span class="text-primary">SEAT</span></span>
            </div>
          </div>
          <p class="text-sm text-muted leading-relaxed max-w-70">
            The modern way to book cinema tickets. Discover, book, and enjoy films at the best cinemas near you.
          </p>
          <div class="flex gap-2.5 mt-5">
            <a
              href="#"
              class="p-1 rounded flex items-center justify-center bg-elevated border border-dark text-muted text-sm hover:border-gold/40 hover:text-gold transition-all duration-200 cursor-pointer"
            >
              <FacebookIcon class="size-5" />
            </a>
            <a
              href="#"
              class="p-1 rounded flex items-center justify-center bg-elevated border border-dark text-muted text-sm hover:border-gold/40 hover:text-gold transition-all duration-200 cursor-pointer"
            >
              <InstagramIcon class="size-5" />
            </a>
            <a
              href="#"
              class="p-1 rounded flex items-center justify-center bg-elevated border border-dark text-muted text-sm hover:border-gold/40 hover:text-gold transition-all duration-200 cursor-pointer"
            >
              <YoutubeIcon class="size-5" />
            </a>
          </div>
        </div>

        <div v-for="col in footerCols" :key="col.title">
          <h4 class="text-[11px] font-bold uppercase tracking-[0.12em] text-dim mb-4">
            {{ col.title }}
          </h4>
          <ul class="space-y-2.5">
            <li v-for="item in col.links" :key="item.label">
              <router-link
                v-if="item.to"
                :to="item.to"
                class="text-[13.5px] text-muted hover:text-gold transition-colors duration-200 no-underline"
              >
                {{ item.label }}
              </router-link>
              <span
                v-else
                class="text-[13.5px] text-muted hover:text-gold transition-colors duration-200 cursor-pointer"
              >
                {{ item.label }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-dark pt-5 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p class="text-[12.5px] text-dim">© 2026 SnapSeat. All rights reserved.</p>
        <p class="text-[12.5px] text-dim inline-flex items-center gap-1">
          Made with <HeartIcon class="size-3 -mt-0.5" /> by Teodora Kanjevac
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import FacebookIcon from '../icons/FacebookIcon.vue'
import HeartIcon from '../icons/HeartIcon.vue'
import InstagramIcon from '../icons/InstagramIcon.vue'
import YoutubeIcon from '../icons/YoutubeIcon.vue'

const footerCols = [
  {
    title: 'Explore',
    links: [
      { label: 'Now Showing', to: '/' },
      { label: 'Coming Soon', to: '/browse' },
      { label: 'Cinemas', to: null },
      { label: 'Special Events', to: null },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign In', to: '/auth/login' },
      { label: 'Create Account', to: '/auth/signup' },
      { label: 'My Bookings', to: '/profile' },
      { label: 'Loyalty Points', to: null },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Centre', to: null },
      { label: 'Contact Us', to: null },
      { label: 'Terms of Service', to: null },
      { label: 'Privacy Policy', to: null },
    ],
  },
]
</script>
