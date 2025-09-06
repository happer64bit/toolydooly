<script lang="ts" setup>
type ButtonProps = {
  type?: 'button' | 'submit' | 'reset'
  onClick?: (event: MouseEvent) => void
}

const props = defineProps<ButtonProps>()
</script>

<template>
  <button
    :type="props.type || 'button'"
    @click="props.onClick"
    class="bg-black text-white min-w-10 min-h-10 rounded-full p-0 flex items-center justify-center cursor-pointer hover:bg-black/80"
  >
    <slot />
  </button>
</template>
