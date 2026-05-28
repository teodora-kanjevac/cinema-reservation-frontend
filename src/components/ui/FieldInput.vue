<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" class="text-[12.5px] font-semibold text-muted uppercase tracking-[0.08em]">
      {{ label }}
    </label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="bg-elevated border border-dark text-primary rounded-lg px-3.5 py-2.75 text-[14.5px] font-body outline-none focus:border-gold transition-all duration-200 placeholder:text-dim"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    modelValue?: string
    type?: string
    placeholder?: string
    autocomplete?: string
  }>(),
  {
    type: 'text',
    modelValue: '',
    placeholder: '',
    autocomplete: 'off',
  },
)

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>
