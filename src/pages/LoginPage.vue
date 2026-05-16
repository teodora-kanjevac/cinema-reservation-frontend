<template>
  <div class="w-full max-w-110">
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

      <h2 class="font-display text-[28px] tracking-wide mb-1.5">Welcome back</h2>
      <p class="text-sm text-muted mb-7">Log in to your account to continue</p>

      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <div class="flex flex-col gap-1.5">
          <label class="text-[12.5px] font-semibold text-muted uppercase tracking-[0.08em]"> Email Address </label>
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
          <label class="text-[12.5px] font-semibold text-muted uppercase tracking-[0.08em]"> Password </label>
          <div class="relative">
            <LockIcon class="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-dim text-sm pointer-events-none" />
            <input
              v-model="form.password"
              :type="showPass ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="current-password"
              class="w-full bg-elevated border border-dark text-primary rounded-lg pl-10 pr-10 py-2.75 text-[14.5px] font-body outline-none transition-all duration-200 placeholder:text-dim focus:border-gold/70"
            />
            <button
              type="button"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-dim hover:text-muted transition-colors"
              @click="showPass = !showPass"
            >
              <i :class="showPass ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-sm" />
            </button>
          </div>
        </div>

        <div class="flex justify-end -mt-1">
          <a class="text-[13px] text-gold cursor-pointer hover:underline">Forgot password?</a>
        </div>

        <p v-if="error" class="text-sm text-danger -mt-1">{{ error }}</p>

        <button
          type="submit"
          class="w-full py-3.5 rounded-xl text-[15px] font-semibold mt-1 bg-gold text-base shadow-gold-sm hover:bg-[#f0c85a] hover:shadow-gold-md hover:-translate-y-px transition-all duration-200"
          :disabled="loading"
        >
          {{ loading ? 'Signing in…' : 'Sign In →' }}
        </button>
      </form>

      <p class="text-center text-sm text-muted mt-5">
        Don't have an account?
        <router-link to="/auth/signup" class="text-gold font-semibold hover:underline no-underline">
          Sign up free
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import EmailIcon from '@/components/icons/EmailIcon.vue'
import LockIcon from '@/components/icons/LockIcon.vue'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({ email: '', password: '' })
const showPass = ref(false)
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  if (!form.email || !form.password) {
    error.value = 'Please fill in all fields.'
    return
  }

  loading.value = true
  await new Promise((r) => setTimeout(r, 800)) // simulate request

  //   authStore.login({ firstName: 'John', lastName: 'Snapseat', email: form.email })
  router.push({ name: 'home' })
  loading.value = false
}
</script>
