<script lang="ts" setup>
type ButtonProps = {
  type?: 'button' | 'submit' | 'reset'
  onClick?: (event: MouseEvent) => void,
  disabled?: boolean
}

const props = defineProps<ButtonProps>()
</script>

<template>
  <button :type="props.type || 'button'" @click="props.onClick" :disabled="disabled ?? false"
    class="bg-black dark:bg-white disabled:opacity-70 dark:hover:bg-white/70 dark:text-black text-white min-w-10 min-h-10 rounded-full p-0 flex items-center justify-center disabled:cursor-not-allowed not-disabled:cursor-pointer hover:bg-black/80">
    <slot />
  </button>
</template>
