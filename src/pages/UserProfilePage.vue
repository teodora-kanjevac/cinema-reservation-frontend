<template>
  <div class="min-h-screen w-full max-w-6xl mx-auto px-8 py-12 pt-32">
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
          <p class="text-[13px] text-dim mt-2">Account created: {{ dayjs(user?.verifiedAt).format('DD.MM.YYYY') }}</p>
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
            <h2 class="text-[16px] font-semibold mb-5 flex items-center gap-2.5">
              <StatisticsIcon class="size-5.5 text-gold" /> Your Stats
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div v-for="s in stats" :key="s.label" class="bg-elevated border border-dark rounded-xl p-4 text-center">
                <div class="font-display text-[32px] text-gold tracking-wide leading-none mb-1">{{ s.value }}</div>
                <div class="text-[12px] text-muted uppercase tracking-[0.06em]">{{ s.label }}</div>
              </div>
            </div>
          </div>

          <div class="bg-card border border-dark rounded-2xl p-7">
            <h2 class="text-[16px] font-semibold mb-5 flex items-center gap-2.5">
              <ClockIcon class="size-5.5 text-gold" /> Recent Bookings
            </h2>
            <div v-if="bookings.length > 0">
              <BookingItem v-for="b in bookings.slice(0, 3)" :key="b.movie" :booking="b" />
              <button
                class="flex items-center gap-1 mt-3 text-sm text-muted border border-dark rounded-lg px-4 py-2 hover:border-bright hover:text-primary transition-all duration-200"
                @click="activeTab = 'bookings'"
              >
                View All Bookings <ArrowRightIcon class="size-5" />
              </button>
            </div>
            <div v-else class="text-center py-10 text-muted italic">You haven't made any bookings yet.</div>
          </div>
        </template>

        <template v-if="activeTab === 'bookings'">
          <div class="bg-card border border-dark rounded-2xl p-7">
            <h2 class="text-[16px] font-semibold mb-5 flex items-center gap-2.5">
              <TicketIcon class="size-5 text-gold" /> All Bookings
            </h2>

            <div v-if="bookings.length > 0">
              <BookingItem v-for="b in bookings" :key="b.movie + b.date" :booking="b" show-download />
              <button
                class="flex items-center gap-1 mt-3 text-sm text-muted border border-dark rounded-lg px-4 py-2 hover:border-bright hover:text-primary transition-all duration-200"
                @click="activeTab = 'bookings'"
              >
                View All Bookings <ArrowRightIcon class="size-5" />
              </button>
            </div>
            <div v-else class="text-center py-10 text-muted italic">You haven't made any bookings yet.</div>
          </div>
        </template>

        <template v-if="activeTab === 'settings'">
          <div class="bg-card border border-dark rounded-2xl p-7">
            <h2 class="text-[16px] font-semibold mb-5 flex items-center gap-2.5">
              <PersonIcon class="size-5.5 text-gold" /> Personal Information
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <FieldInput label="First Name" v-model="profileForm.firstName" />
              <FieldInput label="Last Name" v-model="profileForm.lastName" />
              <div class="flex flex-col gap-1.5">
                <label class="text-[12.5px] font-semibold text-muted uppercase tracking-[0.08em]">Date of Birth</label>
                <DatePicker
                  v-model="profileForm.dateOfBirth"
                  dateFormat="dd.mm.yy"
                  showIcon
                  iconDisplay="input"
                  placeholder="Select date of birth"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-[12.5px] font-semibold text-muted uppercase tracking-[0.08em]">Gender</label>
                <div class="flex flex-wrap gap-5 mt-2">
                  <label class="flex items-center gap-2 cursor-pointer group text-[14.5px] text-primary">
                    <input type="radio" name="gender" value="m" v-model="profileForm.gender" class="sr-only" />
                    <div
                      class="size-4.5 rounded-full border border-dark bg-elevated flex items-center justify-center group-hover:border-gold transition-all duration-200"
                      :class="{ 'border-gold bg-gold/10': profileForm.gender === 'm' }"
                    >
                      <div
                        class="size-2 rounded-full bg-gold scale-0 transition-transform duration-200"
                        :class="{ 'scale-100': profileForm.gender === 'm' }"
                      />
                    </div>
                    <span>Male</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer group text-[14.5px] text-primary">
                    <input type="radio" name="gender" value="f" v-model="profileForm.gender" class="sr-only" />
                    <div
                      class="size-4.5 rounded-full border border-dark bg-elevated flex items-center justify-center group-hover:border-gold transition-all duration-200"
                      :class="{ 'border-gold bg-gold/10': profileForm.gender === 'f' }"
                    >
                      <div
                        class="size-2 rounded-full bg-gold scale-0 transition-transform duration-200"
                        :class="{ 'scale-100': profileForm.gender === 'f' }"
                      />
                    </div>
                    <span>Female</span>
                  </label>
                </div>
              </div>
            </div>

            <p v-if="profileErrorMessage" class="text-sm text-danger mb-5">{{ profileErrorMessage }}</p>

            <div class="flex gap-2.5">
              <button
                @click="saveProfile"
                class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gold text-base shadow-gold-sm hover:bg-[#f0c85a] transition-all duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>

          <div class="bg-card border border-dark rounded-2xl p-7">
            <h2 class="text-[16px] font-semibold mb-5 flex items-center gap-2.5">
              <LockIcon class="size-5.5 text-gold" /> Change Password
            </h2>
            <div class="flex flex-col gap-4 max-w-sm mb-5">
              <FieldInput
                autocomplete="new-password"
                label="Current Password"
                type="password"
                placeholder="Current password"
                v-model="passwordForm.currentPassword"
              />
              <FieldInput
                label="New Password"
                type="password"
                v-model="passwordForm.newPassword"
                placeholder="Min. 6 characters"
              />
              <FieldInput
                label="Confirm Password"
                type="password"
                v-model="passwordForm.confirmPassword"
                placeholder="Repeat new password"
              />
            </div>

            <p v-if="passwordErrorMessage" class="text-sm text-danger mb-5">{{ passwordErrorMessage }}</p>

            <button
              @click="updatePassword"
              class="self-start px-5 py-2.5 rounded-xl text-sm font-semibold bg-gold text-base shadow-gold-sm hover:bg-[#f0c85a] transition-all duration-200"
            >
              Update Password
            </button>
          </div>

          <div class="bg-card border border-dark rounded-2xl p-7">
            <h2 class="text-[16px] font-semibold mb-5 flex items-center gap-2.5">
              <RingingBellIcon class="size-5.5 text-gold" /> Notifications
            </h2>
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
                    :class="n.on ? 'left-6 bg-base' : 'left-1 bg-dim'"
                  />
                </button>
              </div>
            </div>
          </div>
        </template>

        <template v-if="activeTab === 'payment'">
          <div class="bg-card border border-dark rounded-2xl p-7">
            <h2 class="text-[16px] font-semibold mb-5 flex items-center gap-2.5">
              <CreditCardIcon class="size-5 text-gold" /> Payment Methods
            </h2>
            <div class="flex flex-col gap-3 mb-5">
              <div
                v-for="card in paymentCards"
                :key="card.last4"
                class="flex items-center gap-4 p-4 bg-elevated border border-dark rounded-xl"
              >
                <component :is="card.icon" class="w-8" />
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
              class="flex items-center gap-2.5 mt-3 text-sm text-muted border border-dark rounded-lg px-3 py-2 hover:border-bright hover:text-primary transition-all duration-200"
            >
              <CreditCardAddIcon class="size-5" /> Add Payment Method
            </button>
          </div>
        </template>

        <template v-if="activeTab === 'wishlist'">
          <div class="bg-card border border-dark rounded-2xl p-7">
            <h2 class="text-[16px] font-semibold mb-5 flex items-center gap-2.5">
              <HeartIcon class="size-5 text-gold" /> Wishlist
            </h2>

            <div
              v-if="wishlist && wishlist.items.length > 0"
              class="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              <div
                v-for="item in wishlist?.items"
                :key="item.wishlistItemId"
                class="group relative bg-elevated border border-dark rounded-xl p-3 flex flex-col justify-between hover:border-bright transition-all duration-200"
              >
                <div class="relative aspect-2/3 w-full rounded-lg overflow-hidden bg-dark mb-3">
                  <img
                    v-if="item.movie?.poster"
                    :src="item.movie?.poster"
                    :alt="item.movie?.title"
                    class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <button
                    @click="removeFromWishlist(item.movieId)"
                    class="absolute top-2 right-2 size-7 rounded-full bg-base/80 backdrop-blur border border-dark flex items-center justify-center text-danger hover:bg-danger hover:text-base transition-all duration-200 cursor-pointer"
                    title="Remove item"
                  >
                    <CloseIcon class="size-5" />
                  </button>
                </div>

                <div class="flex-1 flex flex-col justify-between">
                  <div>
                    <h4
                      @click="router.push(`/movie/${item.movieId}`)"
                      class="text-[13.5px] font-semibold text-primary line-clamp-1 hover:text-gold cursor-pointer transition-colors duration-150"
                    >
                      {{ item.movie?.title }}
                    </h4>
                    <p class="text-[11.5px] text-muted line-clamp-1 mt-0.5">
                      {{ item.movie?.genres?.map((g) => g.name).join(', ') }}
                    </p>
                  </div>

                  <button
                    @click="router.push(`/movie/${item.movieId}`)"
                    class="w-full mt-3 py-1.5 text-center text-[12px] font-semibold text-muted bg-dark border border-dark rounded-lg hover:border-bright hover:text-primary transition-all duration-200 cursor-pointer"
                  >
                    View Showtimes
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-12 text-muted italic">Your wishlist is empty.</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import BookingItem from '@/components/ui/BookingItem.vue'
import FieldInput from '@/components/ui/FieldInput.vue'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon.vue'
import StarIcon from '@/components/icons/StarIcon.vue'
import PenIcon from '@/components/icons/PenIcon.vue'
import LogoutIcon from '@/components/icons/LogoutIcon.vue'
import HomeIcon from '@/components/icons/HomeIcon.vue'
import TicketIcon from '@/components/icons/TicketIcon.vue'
import HeartIcon from '@/components/icons/HeartIcon.vue'
import CreditCardIcon from '@/components/icons/CreditCardIcon.vue'
import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import { authService } from '@/services/authService'
import PersonIcon from '@/components/icons/PersonIcon.vue'
import type { User } from '@/types/User'
import type { Wishlist } from '@/types/Wishlist'
import { userService } from '@/services/userService'
import dayjs from 'dayjs'
import { DatePicker } from 'primevue'
import RingingBellIcon from '@/components/icons/RingingBellIcon.vue'
import LockIcon from '@/components/icons/LockIcon.vue'
import ClockIcon from '@/components/icons/ClockIcon.vue'
import StatisticsIcon from '@/components/icons/StatisticsIcon.vue'
import CreditCardAddIcon from '@/components/icons/CreditCardAddIcon.vue'
import MasterCardIcon from '@/components/icons/MasterCardIcon.vue'
import VisaIcon from '@/components/icons/VisaIcon.vue'
import { invoiceService } from '@/services/invoiceService'
import { formatSeatLabel } from '@/utils/seatNumber'
import { movieService } from '@/services/movieService'
import { wishlistService } from '@/services/wishlistService'
import CloseIcon from '@/components/icons/CloseIcon.vue'

const router = useRouter()

const activeTab = ref('overview')
const isLoggedIn = ref(false)
const profileErrorMessage = ref('')
const passwordErrorMessage = ref('')
const user = ref<User | null>(null)
const bookings = ref<any[]>([])
const wishlist = ref<Wishlist | null>(null)

const profileForm = ref({
  firstName: '',
  lastName: '',
  gender: 'm',
  dateOfBirth: null as Date | null,
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const notifications = reactive([
  { label: 'Booking Confirmations', desc: 'Email when your booking is confirmed', on: true },
  { label: 'New Releases', desc: "Notify me about movies I'll love", on: true },
  { label: 'Upcoming Showtimes', desc: 'Reminders before your movies', on: false },
  { label: 'Offers & Promotions', desc: 'Exclusive deals and discounts', on: false },
])

const paymentCards = [
  { icon: VisaIcon, name: 'Visa', last4: '4242', exp: '12/27', default: true },
  { icon: MasterCardIcon, name: 'Mastercard', last4: '8888', exp: '09/26', default: false },
]

const navItems = [
  { tab: 'overview', icon: HomeIcon, label: 'Overview' },
  { tab: 'bookings', icon: TicketIcon, label: 'My Bookings' },
  { tab: 'settings', icon: SettingsIcon, label: 'Settings' },
  { tab: 'payment', icon: CreditCardIcon, label: 'Payment Methods' },
  { tab: 'wishlist', icon: HeartIcon, label: 'Wishlist' },
]

const stats = [
  { value: '24', label: 'Movies Watched' },
  { value: '€312', label: 'Total Spent' },
  { value: '5', label: 'Wishlist Items' },
]

async function loadUserBookings() {
  try {
    const rawInvoices = await invoiceService.getUserBookings()

    const localizedBookings = rawInvoices.map((invoice: any) => {
      const items = invoice.invoiceItems || []
      const firstItem = items[0]
      const timeTable = firstItem?.timeTable
      const cinemaName = timeTable?.cinema?.name || '-'
      const screenDetails = timeTable?.screenType ? `(${timeTable.screenType})` : ''
      const displayCinema = `${cinemaName} ${screenDetails}`.trim()

      const seatLabels =
        items
          .map((item: any) => formatSeatLabel(item.seatNumber))
          .filter((num: any) => num !== undefined && num !== null)
          .join(', ') || 'N/A'

      const isPast = dayjs(invoice.pursTime).isBefore(dayjs())
      const displayStatus = isPast ? 'Completed' : 'Confirmed'

      const calculatedTotal = items.reduce((sum: number, item: any) => {
        return sum + item.pricePerItem
      }, 0)
      const displayAmount = calculatedTotal || 0

      return {
        movieId: timeTable?.movieId,
        cinema: displayCinema,
        date: timeTable?.screeningDate ? dayjs(timeTable.screeningDate).format('MMM DD, YYYY') : 'N/A',
        time: timeTable?.startTime ? timeTable.startTime.substring(0, 5) : '00:00',
        seats: seatLabels,
        amount: displayAmount,
        status: displayStatus,
        poster: timeTable?.movie?.poster || '',
      }
    })

    const movieIds = [...new Set(localizedBookings.map((b) => b.movieId).filter(Boolean))]

    const movieDetailsArray = await Promise.all(
      movieIds.map(async (id) => {
        try {
          const data = await movieService.getMovieById(id)
          return { id, data }
        } catch (err) {
          console.error(`Failed to fetch external movie metadata for ID ${id}:`, err)
          return { id, data: null }
        }
      }),
    )

    const movieLookup = movieDetailsArray.reduce((acc: any, item) => {
      if (item.data) acc[item.id] = item.data
      return acc
    }, {})

    bookings.value = localizedBookings.map((booking) => {
      const externalMovie = movieLookup[booking.movieId]

      return {
        movieId: booking.movieId,
        movieName: externalMovie?.title || 'Unknown Movie',
        cinema: booking.cinema,
        date: booking.date,
        time: booking.time,
        seats: booking.seats,
        amount: booking.amount,
        status: booking.status,
        poster: externalMovie?.poster || '',
      }
    })
  } catch (err) {
    console.error('Failed to resolve booking items:', err)
  }
}

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

async function saveProfile() {
  try {
    profileErrorMessage.value = ''
    if (!profileForm.value.firstName || !profileForm.value.lastName) {
      profileErrorMessage.value = 'Please fill in all fields.'
      return
    }

    const payload = {
      ...profileForm.value,
      dateOfBirth: profileForm.value.dateOfBirth
        ? dayjs(profileForm.value.dateOfBirth).format('YYYY-MM-DD')
        : undefined,
    }

    user.value = await userService.editUser(payload)

    const localUserData = localStorage.getItem('user')
    if (localUserData) {
      const parsedUser = JSON.parse(localUserData)

      const updatedUserStorage = {
        ...parsedUser,
        firstName: user.value.firstName ?? parsedUser.firstName,
        lastName: user.value.lastName ?? parsedUser.lastName,
      }

      localStorage.setItem('user', JSON.stringify(updatedUserStorage))
    }

    window.dispatchEvent(new Event('auth-change'))
  } catch (err) {
    console.error('Failed to update user:', err)
  }
}

async function updatePassword() {
  try {
    if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
      passwordErrorMessage.value = 'Please fill in all fields.'
      return
    }
    if (passwordForm.value.confirmPassword !== passwordForm.value.newPassword) {
      passwordErrorMessage.value = 'New password and confirm password must be identical.'
      return
    }

    await userService.changePassword(passwordForm.value.currentPassword, passwordForm.value.newPassword)

    passwordErrorMessage.value = ''
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  } catch (error: any) {
    if (error.code === 'CANNOT_MODIFY') {
      passwordErrorMessage.value = 'New password cannot be identical to your old password.'
    } else if (error.code === 'INVALID_CREDENTIALS') {
      passwordErrorMessage.value = 'Your current password is incorrect.'
    } else {
      passwordErrorMessage.value = 'Password update failed. Please try again later.'
    }
  }
}

async function fetchUserWishlist() {
  try {
    const data = await wishlistService.getWishlist()
    wishlist.value = data
  } catch (err) {
    console.error('Failed to load user wishlist:', err)
  }
}

async function removeFromWishlist(movieId: number) {
  try {
    await wishlistService.removeItem(movieId)
    if (wishlist.value) {
      wishlist.value = {
        ...wishlist.value,
        items: wishlist.value.items.filter((item) => item.movieId !== movieId),
      }
    }
  } catch (err) {
    console.error('Failed to delete item from wishlist:', err)
  }
}

onMounted(async () => {
  syncAuthState()

  window.addEventListener('auth-change', syncAuthState)
  window.addEventListener('storage', syncAuthState)

  if (isLoggedIn.value) {
    user.value = await userService.getUserInfo()
    await loadUserBookings()
    await fetchUserWishlist()
    profileForm.value = {
      firstName: user.value.firstName || '',
      lastName: user.value.lastName || '',
      gender: user.value.gender || 'm',
      dateOfBirth: user.value.dateOfBirth || null,
    }
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('auth-change', syncAuthState)
  window.removeEventListener('storage', syncAuthState)
})
</script>
