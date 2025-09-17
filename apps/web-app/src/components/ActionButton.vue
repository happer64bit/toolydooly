<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import { PenLineIcon, PenToolIcon, BookCheckIcon, LucideLockKeyhole } from 'lucide-vue-next'

const props = defineProps({
  label: { type: String, required: true },
  icon: { type: String as () => 'PenLineIcon' | 'PenToolIcon' | 'BookCheckIcon', required: true },
  action: { type: String, required: false },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits({
    click: (_event?: Event) => true
})

const icons = { PenLineIcon, PenToolIcon, BookCheckIcon }
const IconComponent = computed(() => icons[props.icon as keyof typeof icons])
</script>

<template>
  <button
    class="p-1.5 flex items-center justify-between w-full dark:text-white hover:bg-white/5 rounded-lg cursor-pointer disabled:opacity-70"
    :disabled="props.disabled"
    @click="() => !props.disabled && emit('click')">
    <div class="flex items-center gap-2">
      <component :is="IconComponent" :size="14" />
      <p class="text-sm">{{ props.label }}</p>
    </div>
    <LucideLockKeyhole v-if="props.disabled" :size="14" />
  </button>
</template>