<script setup lang="ts">
import IconButton from './IconButton.vue'
import { PlusIcon } from '@radix-icons/vue'
import { ref } from 'vue'

const prompt = ref("")

const emit = defineEmits<{
    (e: "submit", value: string): void
}>()

const onSubmit = (e: Event) => {
    e.preventDefault()
    if (!prompt.value.trim()) return
    emit("submit", prompt.value)
    prompt.value = ""
}
</script>

<template>
    <form class="container rounded-full border border-neutral-300 shadow-sm flex items-center gap-2" @submit="onSubmit">
        <input v-model="prompt" placeholder="Add a new task..." class="w-full px-6 py-3 outline-0" />
        <IconButton type="submit">
            <PlusIcon color="white" class="w-5 h-5" />
        </IconButton>
    </form>
</template>
