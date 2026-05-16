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
              placeholder="John"
              class="bg-elevated border border-dark text-primary rounded-lg px-3.5 py-2.75 text-[14.5px] font-body outline-none transition-all duration-200 placeholder:text-dim focus:border-gold/70"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[12.5px] font-semibold text-muted uppercase tracking-[0.08em]">Last Name</label>
            <input
              v-model="form.lastName"
              type="text"
              placeholder="Doe"
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
          <label class="text-[12.5px] font-semibold text-muted uppercase tracking-[0.08em]">Phone Number</label>
          <div class="relative">
            <PhoneIcon class="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-dim text-sm pointer-events-none" />
            <input
              v-model="form.phone"
              type="tel"
              placeholder="+1 555 000 0000"
              class="w-full bg-elevated border border-dark text-primary rounded-lg pl-10 pr-4 py-2.75 text-[14.5px] font-body outline-none transition-all duration-200 placeholder:text-dim focus:border-gold/70"
            />
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-muted uppercase tracking-[0.08em]">Password</label>
          <div class="relative">
            <LockIcon class="size-4 -mt-0.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-dim text-sm pointer-events-none" />
            <input
              v-model="form.password"
              :type="showPass ? 'text' : 'password'"
              placeholder="Min. 8 characters"
              class="w-full bg-elevated border border-dark text-primary rounded-lg pl-10 pr-10 py-2.75 text-[14.5px] font-body outline-none transition-all duration-200 placeholder:text-dim focus:border-gold/70"
            />
            <button
              type="button"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-dim hover:text-muted"
              @click="showPass = !showPass"
            >
              <i :class="showPass ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-sm" />
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
          <input
            v-model="form.confirm"
            type="password"
            placeholder="Repeat password"
            class="bg-elevated border text-primary rounded-lg px-3.5 py-2.75 text-[14.5px] font-body outline-none transition-all duration-200 placeholder:text-dim"
            :class="
              form.confirm && form.confirm !== form.password
                ? 'border-danger focus:border-danger'
                : 'border-dark focus:border-gold/70'
            "
          />
          <p v-if="form.confirm && form.confirm !== form.password" class="text-[12px] text-danger">
            Passwords do not match
          </p>
        </div>

        <label class="flex gap-2.5 items-start text-[13px] text-muted cursor-pointer mt-1">
          <input v-model="agreed" type="checkbox" class="mt-0.5 accent-gold shrink-0" />
          I agree to the
          <a class="text-gold hover:underline cursor-pointer">Terms of Service</a>
          and
          <a class="text-gold hover:underline cursor-pointer">Privacy Policy</a>
        </label>

        <p v-if="error" class="text-sm text-danger">{{ error }}</p>

        <button
          type="submit"
          class="w-full py-3.5 rounded-xl text-[15px] font-semibold mt-1 transition-all duration-200"
          :class="
            agreed
              ? 'bg-gold text-base shadow-gold-sm hover:bg-[#f0c85a] hover:shadow-gold-md hover:-translate-y-px'
              : 'bg-elevated text-dim border border-dark cursor-not-allowed'
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
import LockIcon from '@/components/icons/LockIcon.vue'
import PhoneIcon from '@/components/icons/PhoneIcon.vue'
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' })
const agreed = ref(false)
const showPass = ref(false)
const loading = ref(false)
const error = ref('')

const strength = computed(() => {
  const p = form.password
  if (!p) return 0
  let s = 0
  if (p.length >= 8) s++
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

async function submit() {
  error.value = ''
  if (!form.email || !form.firstName || !form.password) {
    error.value = 'Please fill in all fields.'
    return
  }
  if (form.password !== form.confirm) {
    error.value = 'Passwords do not match.'
    return
  }

  loading.value = true
  //   authStore.setPendingEmail(form.email)
  await new Promise((r) => setTimeout(r, 600))
  loading.value = false
  router.push({ name: 'verify' })
}
</script>
