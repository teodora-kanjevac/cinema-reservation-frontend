<template>
  <div class="w-full max-w-105">
    <div class="bg-card border border-dark rounded-xl3 p-10 shadow-card text-center">
      <div
        class="font-display text-2xl tracking-[0.12em] text-gold mb-6"
        style="text-shadow: 0 0 16px rgba(160, 124, 40, 0.5)"
      >
        <div class="flex items-center justify-center gap-2">
          <img class="w-8 mb-1" src="/images/logo.png" alt="Logo" />
          <span>SNAP<span class="text-primary">SEAT</span></span>
        </div>
      </div>

      <h2 class="font-display text-[26px] tracking-wide mb-2">Verify your email</h2>
      <p class="text-sm text-muted mb-1">We sent a 6-digit code to</p>
      <p class="text-[15px] font-semibold text-primary mb-6">
        {{ emailAddress }}
      </p>

      <CodeVerification ref="codeRef" :error="codeError" @complete="onComplete" @change="codeError = ''" />

      <button
        class="w-full py-3.5 rounded-xl text-[15px] font-semibold mb-4 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        :class="
          verifyReady
            ? 'bg-gold text-base shadow-gold-sm hover:bg-[#f0c85a] hover:-translate-y-px'
            : 'bg-elevated text-dim border border-dark cursor-not-allowed'
        "
        :disabled="!verifyReady || loading"
        @click="verify"
      >
        {{ loading ? 'Verifying…' : 'Verify & Continue' }}
      </button>

      <div class="text-[13px] text-muted mb-4">
        Didn't receive it?
        <span v-if="countdown > 0" class="text-dim">Resend in {{ countdown }}s</span>
        <button v-else class="text-gold font-semibold hover:underline" @click="resend">Resend code</button>
      </div>

      <router-link
        to="/auth/signup"
        class="flex items-center justify-center gap-1 w-full text-[13px] text-muted border border-dark rounded-xl py-2.5 hover:border-bright hover:text-primary transition-all duration-200 no-underline"
      >
        <ArrowRightIcon class="size-4 rotate-180 mt-0.5" /> Back to Sign Up
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import CodeVerification from '@/components/ui/CodeVerification.vue'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon.vue'
import { authService } from '@/services/authService'
import client from '@/config/api'

const router = useRouter()

const codeRef = ref<{ reset: () => void } | null>(null)
const codeError = ref('')
const verifyReady = ref(false)
const loading = ref(false)
const countdown = ref(0)
const emailAddress = ref(localStorage.getItem('pendingEmail') || '-')
const typedCode = ref('')
let timer: any

function startCountdown() {
  clearInterval(timer)
  countdown.value = 30

  timer = setInterval(() => {
    if (countdown.value > 0) countdown.value--
    else clearInterval(timer)
  }, 1000)
}

function onComplete(code: string) {
  typedCode.value = code
  verifyReady.value = code.length === 6
}

const verify = async () => {
  loading.value = true
  codeError.value = ''

  try {
    await authService.verifyCode(emailAddress.value, typedCode.value)
    localStorage.removeItem('pendingEmail')

    router.push('/')
  } catch (error: any) {
    if (error.code === 'INVALID_CREDENTIALS') {
      codeError.value = 'Invalid verification code.'
    } else if (error.code === 'VALIDATION_FAILED') {
      codeError.value = 'Verification code expired. Resend the code using the link below.'
    } else {
      codeError.value = 'Verification failed. Please try again later.'
    }
    verifyReady.value = false
    codeRef.value?.reset()
  } finally {
    loading.value = false
  }
}

const resend = async () => {
  codeError.value = ''
  try {
    await client.post('/auth/resend-code', { email: emailAddress.value })

    codeRef.value?.reset()
    verifyReady.value = false
    startCountdown()
  } catch (err: any) {
    codeError.value = 'Failed to resend code.'
  }
}

onUnmounted(() => clearInterval(timer))
</script>
