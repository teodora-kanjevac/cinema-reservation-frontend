<template>
  <div class="w-full max-w-115">
    <div class="bg-card border border-dark rounded-xl3 p-10 shadow-card">
      <div class="text-center mb-7">
        <span
          class="font-display text-2xl tracking-[0.12em] text-gold"
          style="text-shadow: 0 0 16px rgba(160, 124, 40, 0.5)"
        >
          <div class="flex items-center justify-center gap-2">
            <img class="w-8 mb-1" src="/images/logo.png" alt="Logo" />
            <span>SNAP<span class="text-primary">SEAT</span></span>
          </div>
        </span>
      </div>

      <h2 class="font-display text-[28px] tracking-wide mb-1.5">Create account</h2>
      <p class="text-sm text-muted mb-7">Join SnapSeat and start booking instantly</p>

      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-muted uppercase tracking-[0.08em]">First Name</label>
            <input
              v-model="form.firstName"
              type="text"
              autocomplete="given-name"
              placeholder="Your first name"
              class="bg-elevated border border-dark text-primary rounded-lg px-3.5 py-2.75 text-[14.5px] font-body outline-none transition-all duration-200 placeholder:text-dim focus:border-gold/70"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-muted uppercase tracking-[0.08em]">Last Name</label>
            <input
              v-model="form.lastName"
              type="text"
              autocomplete="family-name"
              placeholder="Your last name"
              class="bg-elevated border border-dark text-primary rounded-lg px-3.5 py-2.75 text-[14.5px] font-body outline-none transition-all duration-200 placeholder:text-dim focus:border-gold/70"
            />
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-muted uppercase tracking-[0.08em]">Email Address</label>
          <div class="relative">
            <EmailIcon class="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-dim text-sm pointer-events-none" />
            <input
              v-model="form.email"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
              class="w-full bg-elevated border border-dark text-primary rounded-lg pl-10 pr-4 py-2.75 text-[14.5px] font-body outline-none transition-all duration-200 placeholder:text-dim focus:border-gold/70"
            />
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-muted uppercase tracking-[0.08em]">Gender</label>
          <div class="grid grid-cols-2 gap-3">
            <label
              class="flex items-center gap-3 bg-elevated border text-primary rounded-lg px-4 py-2.75 text-[14.5px] font-body cursor-pointer transition-all duration-200 select-none"
              :class="form.gender === 'm' ? 'border-gold/70 bg-gold/5' : 'border-dark hover:border-dim/50'"
            >
              <input
                v-model="form.gender"
                type="radio"
                value="m"
                name="gender"
                class="accent-gold size-4 pointer-events-none"
              />
              <span>Male</span>
            </label>
            <label
              class="flex items-center gap-3 bg-elevated border text-primary rounded-lg px-4 py-2.75 text-[14.5px] font-body cursor-pointer transition-all duration-200 select-none"
              :class="form.gender === 'f' ? 'border-gold/70 bg-gold/5' : 'border-dark hover:border-dim/50'"
            >
              <input
                v-model="form.gender"
                type="radio"
                value="f"
                name="gender"
                class="accent-gold size-4 pointer-events-none"
              />
              <span>Female</span>
            </label>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-muted uppercase tracking-[0.08em]">Password</label>
          <div class="relative">
            <LockIcon
              class="size-4 -mt-0.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-dim text-sm pointer-events-none"
            />
            <input
              v-model="form.password"
              :type="showPass ? 'text' : 'password'"
              placeholder="Min. 6 characters"
              class="w-full bg-elevated border border-dark text-primary rounded-lg pl-10 pr-10 py-2.75 text-[14.5px] font-body outline-none transition-all duration-200 placeholder:text-dim focus:border-gold/70"
            />
            <button
              type="button"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 hover:bg-dim/20 rounded-md text-dim hover:text-muted transition"
              @click="showPass = !showPass"
            >
              <EyeIcon class="size-5" />
            </button>
          </div>

          <div v-if="form.password" class="flex gap-1 mt-1">
            <div
              v-for="i in 4"
              :key="i"
              class="flex-1 h-0.75 rounded-full transition-all duration-300"
              :style="{ background: i <= strength ? strengthColor : '#1e2a42' }"
            />
          </div>
          <p v-if="form.password" class="text-[11.5px] mt-0.5" :style="{ color: strengthColor }">
            {{ strengthLabel }}
          </p>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-muted uppercase tracking-[0.08em]">Confirm Password</label>
          <div class="relative">
            <LockIcon
              class="size-4 -mt-0.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-dim text-sm pointer-events-none"
            />
            <input
              v-model="form.confirm"
              :type="showConfirm ? 'text' : 'password'"
              placeholder="Repeat password"
              class="w-full bg-elevated border border-dark text-primary rounded-lg pl-10 pr-10 py-2.75 text-[14.5px] font-body outline-none transition-all duration-200 placeholder:text-dim focus:border-gold/70"
            />
            <button
              type="button"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 hover:bg-dim/20 rounded-md text-dim hover:text-muted transition"
              @click="showConfirm = !showConfirm"
            >
              <EyeIcon class="size-5" />
            </button>
          </div>
          <p v-if="form.confirm && form.confirm !== form.password" class="text-[12px] text-danger">
            Passwords do not match
          </p>
        </div>

        <label class="flex gap-2.5 items-start text-[13px] text-muted cursor-pointer mt-1">
          <input v-model="agreed" type="checkbox" class="mt-0.5 accent-gold shrink-0" />
          <div class="flex gap-1 items-start">
            I agree to the
            <a class="text-gold hover:underline cursor-pointer">Terms of Service</a>
            and
            <a class="text-gold hover:underline cursor-pointer">Privacy Policy</a>
          </div>
        </label>

        <p v-if="errorMessage" class="text-sm text-danger">{{ errorMessage }}</p>

        <button
          type="submit"
          class="w-full border py-3.5 rounded-xl text-[15px] font-semibold mt-1 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          :class="
            agreed
              ? 'bg-gold border-gold text-base hover:border-[#f0c85a] hover:bg-[#f0c85a] hover:shadow-gold-sm hover:-translate-y-px'
              : 'bg-elevated text-dim border-dark cursor-not-allowed'
          "
          :disabled="!agreed || loading"
        >
          {{ loading ? 'Creating account…' : 'Create Account' }}
        </button>
      </form>

      <p class="text-center text-sm text-muted mt-5">
        Already have an account?
        <router-link to="/auth/login" class="text-gold font-semibold hover:underline no-underline">Sign in</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import EmailIcon from '@/components/icons/EmailIcon.vue'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import LockIcon from '@/components/icons/LockIcon.vue'
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'
import type { RegisterPayload } from '@/types/Register'

const router = useRouter()

const form = reactive<RegisterPayload & { confirm: string }>({
  firstName: '',
  lastName: '',
  email: '',
  gender: 'm',
  password: '',
  confirm: '',
})
const agreed = ref(false)
const showPass = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const strength = computed(() => {
  const p = form.password
  if (!p) return 0
  let s = 0
  if (p.length >= 6) s++
  if (/[A-Z]/.test(p)) s++
  if (/[0-9]/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
})

const strengthColor = computed(() => {
  return ['#e84b4b', '#f0a030', '#f0d030', '#4be884'][strength.value - 1] || '#e84b4b'
})

const strengthLabel = computed(() => {
  return ['Weak', 'Fair', 'Good', 'Strong'][strength.value - 1] || 'Weak'
})

const submit = async () => {
  errorMessage.value = ''
  if (!form.email || !form.firstName || !form.lastName || !form.password || !form.gender) {
    errorMessage.value = 'Please fill in all fields.'
    return
  }
  if (form.password !== form.confirm) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  loading.value = true
  try {
    const registerPayload: RegisterPayload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      gender: form.gender,
      password: form.password,
    }

    await authService.register(registerPayload)

    localStorage.setItem('pendingEmail', form.email)
    router.push({ name: 'verify' })
  } catch (error: any) {
    if (error.code === 'EMAIL_IN_USE') {
      errorMessage.value = 'User with this email already exists.'
    } else {
      errorMessage.value = 'Registeration failed. Please try again later.'
    }
  } finally {
    loading.value = false
  }
}
</script>
