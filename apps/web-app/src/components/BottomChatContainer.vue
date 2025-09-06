<script setup lang="ts">
import IconButton from './IconButton.vue'
import { PlusIcon, SliderIcon, CaretDownIcon, ListBulletIcon } from '@radix-icons/vue'
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'radix-vue'
import {
    SelectContent,
    SelectItem,
    SelectItemText,
    SelectPortal,
    SelectRoot,
    SelectTrigger,
    SelectValue,
    SelectViewport,
} from 'radix-vue'
import { ref } from 'vue'

type Priority = 'low' | 'medium' | 'high'

const prompt = ref('')
const priority = ref<Priority>('medium')

const emit = defineEmits<{
    (e: 'submit', payload: { text: string; priority: Priority }): void
}>()

const onSubmit = (e: Event) => {
    e.preventDefault()
    if (!prompt.value.trim()) return

    emit('submit', { text: prompt.value, priority: priority.value })

    prompt.value = ''
    priority.value = 'medium'
}

const priorities: Priority[] = ['low', 'medium', 'high']
</script>

<template>
    <form class="container rounded-full border border-neutral-300 shadow-sm flex items-center gap-2" @submit="onSubmit">
        <PopoverRoot>
            <PopoverTrigger class="rounded-full flex items-center justify-center hover:bg-black/5 min-h-10 min-w-10"
                aria-label="Priority Settings">
                <SliderIcon class="w-5 h-5" />
            </PopoverTrigger>
            <PopoverPortal>
                <PopoverContent side="top" align="start" :side-offset="10" class="rounded-2xl w-[250px] bg-white border border-black/5 shadow-sm animate-in data-[state=open]:fade-in-35 data-[state=open]:duration-100">
                    <div class="px-4 py-2 flex items-center justify-between">
                        <p class="inline-flex items-center gap-2">
                            <ListBulletIcon />
                            Priority
                        </p>
                        <SelectRoot v-model="priority">
                            <SelectTrigger aria-label="Pick Priority"
                                class="flex items-center gap-2 outline-none cursor-pointer">
                                <SelectValue placeholder="Select Priority" class="capitalize text-sm" />
                                <CaretDownIcon />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectContent side="right" align="start"
                                    class="bg-white px-1 py-2 border border-black/5 rounded-lg shadow-sm">
                                    <SelectViewport class="space-y-1">
                                        <SelectItem v-for="option in priorities" :key="option" :value="option"
                                            class="text-gray-800 hover:text-white hover:bg-black px-4 py-0.5 rounded cursor-pointer">
                                            <SelectItemText class="capitalize">
                                                {{ option }}
                                            </SelectItemText>
                                        </SelectItem>
                                    </SelectViewport>
                                </SelectContent>
                            </SelectPortal>
                        </SelectRoot>
                    </div>
                </PopoverContent>
            </PopoverPortal>
        </PopoverRoot>

        <input v-model="prompt" placeholder="Add a new task..." class="w-full px-2 py-3 outline-0" />

        <IconButton type="submit">
            <PlusIcon color="white" class="w-5 h-5" />
        </IconButton>
    </form>
</template>
