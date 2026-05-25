<template>
  <div class="min-h-screen min-w-6xl mx-auto px-8 py-12 pt-32">
    <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-7 items-start">
      <aside class="bg-card border border-dark rounded-2xl overflow-hidden lg:sticky lg:top-22.5">
        <div
          class="p-7 text-center border-b border-dark"
          style="background: linear-gradient(135deg, #1a2135 0%, #141926 100%)"
        >
          <div class="relative inline-block mb-3.5">
            <div
              class="size-20 rounded-full border-[3px] border-card flex items-center justify-center font-display text-[32px] text-base"
              style="background: linear-gradient(135deg, #a07c28, #e8b84b)"
            >
              {{ userInitials }}
            </div>
            <button
              @click="activeTab = 'settings'"
              class="absolute bottom-0 right-0 size-7 rounded-full bg-dark border-2 border-card flex items-center justify-center text-[12px] text-muted hover:text-gold transition-colors duration-200"
            >
              <PenIcon class="size-4" />
            </button>
          </div>
          <p class="text-[16px] font-semibold text-primary mb-0.5">{{ user?.firstName }} {{ user?.lastName }}</p>
          <p class="text-[13px] text-muted">{{ user?.email }}</p>
          <div class="mt-3">
            <span
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-semibold tracking-wide bg-gold/15 text-gold border border-gold/30"
            >
              <StarIcon class="size-4 mt-px" /> Premium Member
            </span>
          </div>
        </div>

        <nav class="p-3">
          <button
            v-for="item in navItems"
            :key="item.tab"
            class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 text-left"
            :class="activeTab === item.tab ? 'bg-gold/10 text-gold' : 'text-muted hover:bg-elevated hover:text-primary'"
            @click="activeTab = item.tab"
          >
            <component :is="item.icon" class="size-5" />
            {{ item.label }}
          </button>

          <div class="h-px bg-dark mx-1 my-2.5" />

          <button
            class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] font-medium text-danger hover:bg-danger/10 transition-all duration-200 text-left"
            @click="logout"
          >
            <LogoutIcon class="size-5 mt-0.5" />
            Sign Out
          </button>
        </nav>
      </aside>

      <div class="flex flex-col gap-5">
        <template v-if="activeTab === 'overview'">
          <div class="bg-card border border-dark rounded-2xl p-7">
            <h2 class="text-[16px] font-semibold mb-5 flex items-center gap-2.5"><span>📊</span> Your Stats</h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div v-for="s in stats" :key="s.label" class="bg-elevated border border-dark rounded-xl p-4 text-center">
                <div class="font-display text-[32px] text-gold tracking-wide leading-none mb-1">{{ s.value }}</div>
                <div class="text-[12px] text-muted uppercase tracking-[0.06em]">{{ s.label }}</div>
              </div>
            </div>
          </div>

          <div class="bg-card border border-dark rounded-2xl p-7">
            <h2 class="text-[16px] font-semibold mb-5 flex items-center gap-2.5"><span>🕐</span> Recent Bookings</h2>
            <BookingItem v-for="b in bookings.slice(0, 3)" :key="b.movie" :booking="b" />
            <button
              class="flex items-center gap-1 mt-3 text-sm text-muted border border-dark rounded-lg px-4 py-2 hover:border-bright hover:text-primary transition-all duration-200"
              @click="activeTab = 'bookings'"
            >
              View All Bookings <ArrowRightIcon class="size-5" />
            </button>
          </div>
        </template>

        <template v-if="activeTab === 'bookings'">
          <div class="bg-card border border-dark rounded-2xl p-7">
            <h2 class="text-[16px] font-semibold mb-5 flex items-center gap-2.5">
              <TicketIcon class="size-5" /> All Bookings
            </h2>
            <BookingItem v-for="b in bookings" :key="b.movie + b.date" :booking="b" show-download />
          </div>
        </template>

        <template v-if="activeTab === 'settings'">
          <div class="bg-card border border-dark rounded-2xl p-7">
            <h2 class="text-[16px] font-semibold mb-5 flex items-center gap-2.5">
              <PersonIcon class="size-5.5"/> Personal Information
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <FieldInput label="First Name" :value="'t'" />
              <FieldInput label="Last Name" :value="'t'" />
              <FieldInput label="Email" :value="'t'" type="email" />
              <FieldInput label="Phone" value="+1 555 123 4567" type="tel" />
              <FieldInput label="Date of Birth" value="1990-06-15" type="date" class="sm:col-span-2" />
            </div>
            <div class="flex gap-2.5">
              <button
                class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gold text-base shadow-gold-sm hover:bg-[#f0c85a] transition-all duration-200"
              >
                Save Changes
              </button>
              <button
                class="px-5 py-2.5 rounded-xl text-sm font-medium text-muted border border-dark hover:border-bright hover:text-primary transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>

          <div class="bg-card border border-dark rounded-2xl p-7">
            <h2 class="text-[16px] font-semibold mb-5 flex items-center gap-2.5"><span>🔒</span> Change Password</h2>
            <div class="flex flex-col gap-4 max-w-sm">
              <FieldInput label="Current Password" type="password" value="••••••••" />
              <FieldInput label="New Password" type="password" value="" placeholder="Min. 8 characters" />
              <FieldInput label="Confirm Password" type="password" value="" placeholder="Repeat password" />
              <button
                class="self-start px-5 py-2.5 rounded-xl text-sm font-semibold bg-gold text-base shadow-gold-sm hover:bg-[#f0c85a] transition-all duration-200"
              >
                Update Password
              </button>
            </div>
          </div>

          <div class="bg-card border border-dark rounded-2xl p-7">
            <h2 class="text-[16px] font-semibold mb-5 flex items-center gap-2.5"><span>🔔</span> Notifications</h2>
            <div class="flex flex-col gap-4">
              <div v-for="n in notifications" :key="n.label" class="flex items-center justify-between">
                <div>
                  <p class="text-[14px] font-medium text-primary">{{ n.label }}</p>
                  <p class="text-[12.5px] text-muted">{{ n.desc }}</p>
                </div>
                <button
                  class="relative w-11 h-6 rounded-full transition-all duration-300 shrink-0"
                  :class="n.on ? 'bg-gold' : 'bg-elevated border border-dark'"
                  @click="n.on = !n.on"
                >
                  <span
                    class="absolute top-1 size-4 rounded-full transition-all duration-300"
                    :class="n.on ? 'left-6 bg-base' : 'left-1 bg-text-dim'"
                  />
                </button>
              </div>
            </div>
          </div>
        </template>

        <template v-if="activeTab === 'payment'">
          <div class="bg-card border border-dark rounded-2xl p-7">
            <h2 class="text-[16px] font-semibold mb-5 flex items-center gap-2.5">
              <CreditCard class="size-5" /> Payment Methods
            </h2>
            <div class="flex flex-col gap-3 mb-5">
              <div
                v-for="card in paymentCards"
                :key="card.last4"
                class="flex items-center gap-4 p-4 bg-elevated border border-dark rounded-xl"
              >
                <span class="text-2xl">{{ card.icon }}</span>
                <div class="flex-1">
                  <p class="text-[14px] font-semibold text-primary">{{ card.name }}</p>
                  <p class="text-[12.5px] text-muted">•••• •••• •••• {{ card.last4 }} · Exp {{ card.exp }}</p>
                </div>
                <span
                  v-if="card.default"
                  class="px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold bg-gold/15 text-gold border border-gold/30"
                  >Default</span
                >
                <button
                  class="text-xs px-3 py-1.5 rounded-lg border text-danger border-danger/20 hover:bg-danger/10 transition-all duration-200"
                >
                  Remove
                </button>
              </div>
            </div>
            <button
              class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-elevated border border-dark text-muted hover:border-bright hover:text-primary transition-all duration-200"
            >
              <i class="pi pi-plus text-xs" /> Add Payment Method
            </button>
          </div>
        </template>

        <template v-if="activeTab === 'wishlist'">
          <div class="bg-card border border-dark rounded-2xl p-7">
            <h2 class="text-[16px] font-semibold mb-5 flex items-center gap-2.5">
              <HeartIcon class="size-5" /> Wishlist
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"></div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { MOVIES } from '@/data/movie.ts'
import MovieCard from '@/components/ui/MovieCard.vue'
import BookingItem from '@/components/ui/BookingItem.vue'
import FieldInput from '@/components/ui/FieldInput.vue'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon.vue'
import StarIcon from '@/components/icons/StarIcon.vue'
import PenIcon from '@/components/icons/PenIcon.vue'
import LogoutIcon from '@/components/icons/LogoutIcon.vue'
import HomeIcon from '@/components/icons/HomeIcon.vue'
import TicketIcon from '@/components/icons/TicketIcon.vue'
import HeartIcon from '@/components/icons/HeartIcon.vue'
import CreditCard from '@/components/icons/CreditCard.vue'
import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import { authService } from '@/services/authService'
import PersonIcon from '@/components/icons/PersonIcon.vue'

const router = useRouter()

const activeTab = ref('overview')
const isLoggedIn = ref(false)
const user = ref<any | null>(null)

const navItems = [
  { tab: 'overview', icon: HomeIcon, label: 'Overview' },
  { tab: 'bookings', icon: TicketIcon, label: 'My Bookings' },
  { tab: 'settings', icon: SettingsIcon, label: 'Settings' },
  { tab: 'payment', icon: CreditCard, label: 'Payment Methods' },
  { tab: 'wishlist', icon: HeartIcon, label: 'Wishlist' },
]

const stats = [
  { value: '24', label: 'Movies Watched' },
  { value: '€312', label: 'Total Spent' },
  { value: '5', label: 'Wishlist Items' },
]

const bookings = [
  {
    movie: 'DUNE: MESSIAH',
    cinema: 'Grand Cinemax IMAX',
    date: 'May 10, 2025',
    time: '20:15',
    seats: 'C4, C5',
    amount: '32',
    status: 'Confirmed',
    poster: MOVIES[0]?.poster,
  },
  {
    movie: 'ATLAS OF GHOSTS',
    cinema: 'Starlight Cinema',
    date: 'Apr 28, 2025',
    time: '19:00',
    seats: 'F8',
    amount: '12',
    status: 'Confirmed',
    poster: MOVIES[7]?.poster,
  },
  {
    movie: 'NEON GHOST',
    cinema: 'CinePlex Downtown',
    date: 'Apr 15, 2025',
    time: '21:30',
    seats: 'B3–B5',
    amount: '48',
    status: 'Completed',
    poster: MOVIES[1]?.poster,
  },
  {
    movie: 'THE IRON MERIDIAN',
    cinema: 'Grand Cinemax IMAX',
    date: 'Mar 22, 2025',
    time: '17:00',
    seats: 'D6, D7',
    amount: '32',
    status: 'Completed',
    poster: MOVIES[2]?.poster,
  },
]

const notifications = reactive([
  { label: 'Booking Confirmations', desc: 'Email when your booking is confirmed', on: true },
  { label: 'New Releases', desc: "Notify me about movies I'll love", on: true },
  { label: 'Upcoming Showtimes', desc: 'Reminders before your movies', on: false },
  { label: 'Offers & Promotions', desc: 'Exclusive deals and discounts', on: false },
])

const paymentCards = [
  { icon: '💳', name: 'Visa', last4: '4242', exp: '12/27', default: true },
  { icon: '🟠', name: 'Mastercard', last4: '8888', exp: '09/26', default: false },
]

const userInitials = computed(() => {
  if (!user.value || !user.value.firstName) return 'N/A'
  const first = user.value.firstName.charAt(0)
  const last = user.value.lastName ? user.value.lastName.charAt(0) : ''
  return (first + last).toUpperCase()
})

function syncAuthState() {
  isLoggedIn.value = authService.isAuthenticated()
  user.value = authService.getCurrentUser()

  if (!isLoggedIn.value && router.currentRoute.value.name === 'profile') router.push('/')
}

async function logout() {
  await authService.logout()
  window.dispatchEvent(new Event('auth-change'))

  router.push('/')
}

onMounted(() => {
  syncAuthState()

  window.addEventListener('auth-change', syncAuthState)
  window.addEventListener('storage', syncAuthState)
})

onBeforeUnmount(() => {
  window.removeEventListener('auth-change', syncAuthState)
  window.removeEventListener('storage', syncAuthState)
})
</script>
