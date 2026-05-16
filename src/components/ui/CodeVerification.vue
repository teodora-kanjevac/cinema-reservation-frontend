<template>
  <div>
    <div class="flex justify-center gap-2.5 my-6">
      <input
        v-for="(_, i) in digits"
        :id="`code-${i}`"
        :key="i"
        v-model="digits[i]"
        type="text"
        inputmode="numeric"
        maxlength="1"
        class="w-13 h-15 rounded-xl text-center text-[28px] font-display tracking-widest bg-elevated border-2 text-primary outline-none caret-gold transition-all duration-200"
        :class="
          digits[i]
            ? 'border-gold bg-gold/10'
            : 'border-dark focus:border-gold focus:shadow-[0_0_0_3px_rgba(232,184,75,0.18)]'
        "
        @input="onInput(i, $event)"
        @keydown="onKeydown(i, $event)"
        @paste="onPaste($event)"
      />
    </div>

    <p v-if="error" class="text-center text-sm text-danger mb-3">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  error: { type: String, default: '' },
})

const emit = defineEmits(['complete', 'change'])

const digits = ref(['', '', '', '', '', ''])

watch(
  digits,
  (val) => {
    const code = val.join('')
    emit('change', code)
    if (code.length === 6 && val.every((d) => d !== '')) {
      emit('complete', code)
    }
  },
  { deep: true },
)

function onInput(i: number, e: Event) {
  const target = e.target as HTMLInputElement
  const val = target.value.replace(/[^0-9]/g, '').slice(-1)
  digits.value[i] = val
  if (val && i < 5) {
    document.getElementById(`code-${i + 1}`)?.focus()
  }
}

function onKeydown(i: number, e: KeyboardEvent) {
  if (e.key === 'Backspace' && !digits.value[i] && i > 0) {
    document.getElementById(`code-${i - 1}`)?.focus()
  }
}

function onPaste(e: ClipboardEvent) {
  const clipboardData = e.clipboardData
  if (!clipboardData) {
    return
  }

  const text = clipboardData
    .getData('text')
    .replace(/[^0-9]/g, '')
    .slice(0, 6)
  if (text) {
    text.split('').forEach((ch, i) => {
      digits.value[i] = ch
    })
    document.getElementById(`code-${Math.min(text.length, 5)}`)?.focus()
    e.preventDefault()
  }
}

function reset() {
  digits.value = ['', '', '', '', '', '']
  document.getElementById('code-0')?.focus()
}

defineExpose({ reset })
</script>
