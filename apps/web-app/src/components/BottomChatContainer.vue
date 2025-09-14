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

const props = defineProps<{
    isLoading: boolean
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
    <form
        class="container rounded-full border bg-white border-neutral-300 dark:bg-[#2f2f2f] dark:border-zinc-700 shadow-sm flex items-center gap-2"
        @submit="onSubmit">
        <PopoverRoot>
            <PopoverTrigger
                class="rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 min-h-10 min-w-10"
                aria-label="Priority Settings">
                <SliderIcon class="w-5 h-5 dark:text-neutral-200" />
            </PopoverTrigger>
            <PopoverPortal>
                <PopoverContent side="top" align="start" :side-offset="10" class="rounded-2xl w-[250px] bg-white dark:bg-[#2f2f2f] border border-black/5 dark:border-zinc-700 shadow-sm
                 data-[state=open]:animate-in data-[state=closed]:animate-out
                 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
                 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
                 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
                 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                    <div class="px-4 py-2 flex items-center justify-between">
                        <p class="inline-flex items-center gap-2 dark:text-white">
                            <ListBulletIcon />
                            Priority
                        </p>
                        <SelectRoot v-model="priority">
                            <SelectTrigger aria-label="Pick Priority"
                                class="flex items-center gap-2 outline-none cursor-pointer dark:text-white">
                                <SelectValue placeholder="Select Priority" class="capitalize text-sm" />
                                <CaretDownIcon class="dark:text-white" />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectContent side="right" align="start"
                                    class="bg-white dark:bg-[#2f2f2f] px-1 py-2 border border-black/5 dark:border-zinc-700 rounded-lg shadow-sm">
                                    <SelectViewport class="space-y-1">
                                        <SelectItem v-for="option in priorities" :key="option" :value="option"
                                            class="text-black dark:text-gray-200 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 px-4 py-0.5 rounded cursor-pointer outline-none">
                                            <SelectItemText class="capitalize">{{ option }}</SelectItemText>
                                        </SelectItem>
                                    </SelectViewport>
                                </SelectContent>
                            </SelectPortal>
                        </SelectRoot>
                    </div>
                </PopoverContent>
            </PopoverPortal>
        </PopoverRoot>

        <input v-model="prompt" placeholder="Add a new task..."
            class="w-full px-2 py-3 outline-0 dark:text-white dark:placeholder:text-gray-300" />

        <IconButton type="submit" :disabled="props.isLoading">
            <div v-if="props.isLoading"
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <PlusIcon v-else color="white" class="w-5 h-5" />
        </IconButton>
    </form>
</template>
