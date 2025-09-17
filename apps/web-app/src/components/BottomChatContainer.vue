<script setup lang="ts">
import { useLLM } from '@/stores/llm'
import IconButton from './IconButton.vue'
import { PlusIcon, ReloadIcon, SliderIcon } from '@radix-icons/vue'
import { ListOrderedIcon, ChevronRightIcon } from 'lucide-vue-next'
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
import { ref, computed, watchEffect } from 'vue'

import ActionButton from './ActionButton.vue'

type Priority = 'low' | 'medium' | 'high'

const props = defineProps<{ isLoading: boolean }>()
const emit = defineEmits<{
    (e: 'submit', payload: { text: string; priority: Priority; aiAction?: string }): void
    (e: 'update:isLoading', value: boolean): void
}>()

const prompt = ref('')
const priority = ref<Priority>('medium')
const model = ref(false)
const priorities: Priority[] = ['low', 'medium', 'high']
const llm = useLLM()

const aiDisabled = ref(true)
const canUseLLM = ref(false)

watchEffect(async () => {
    if(!llm.model) {
        llm.initModel();
    }
    const availability = await llm.availability
    aiDisabled.value = availability === 'downloadable' || llm.model === null
    canUseLLM.value = navigator.userAgent.includes('Chrome') || availability !== 'unavailable'
})

async function executeAIAction(action: string) {
    emit('update:isLoading', true)
    prompt.value = await llm.process(prompt.value, action)
    emit('update:isLoading', false)
}

const onSubmit = (e: Event) => {
    e.preventDefault()
    if (!prompt.value.trim()) return
    emit('submit', { text: prompt.value, priority: priority.value })
    prompt.value = ''
    priority.value = 'medium'
}
</script>

<template>
    <form
        class="flex items-center gap-2 container rounded-full border bg-white border-neutral-300 dark:bg-[#2f2f2f] dark:border-zinc-700 shadow-sm px-2 py-1"
        @submit="onSubmit">

        <PopoverRoot v-model:open="model">
            <PopoverTrigger
                class="rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 min-h-10 min-w-10"
                aria-label="Settings">
                <SliderIcon class="w-5 h-5 dark:text-neutral-200" />
            </PopoverTrigger>

            <PopoverPortal>
                <PopoverContent side="bottom" align="start" :side-offset="15"
                    class="rounded-2xl w-[250px] bg-white dark:bg-[#2f2f2f] border border-black/5 dark:border-zinc-700 shadow-sm px-2 py-1 flex flex-col gap-1
                        data-[state=open]:animate-in data-[state=open]:zoom-in-85 data-[state=open]:fade-in-80 data-[state=open]:slide-in-from-bottom-10
                        data-[state=closed]:animate-out data-[state=closed]:zoom-out-80 data-[state=closed]:fade-out-30">

                    <SelectRoot v-model="priority">
                        <SelectTrigger aria-label="Pick Priority"
                            class="flex items-center justify-between gap-2 outline-none cursor-pointer dark:text-white p-2 rounded-lg w-full">
                            <div class="flex items-center gap-2">
                                <ListOrderedIcon :size='16' />
                                <p class="text-sm font-medium dark:text-white">Priority</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <SelectValue placeholder="Select Priority" class="text-sm" />
                                <ChevronRightIcon :size="16" class="dark:text-white" />
                            </div>
                        </SelectTrigger>

                        <SelectPortal>
                            <SelectContent side="right"
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

                    <template v-if="canUseLLM">
                        <ActionButton label="Fix Spell" icon="PenLineIcon" action="fix_grammer" :disabled="aiDisabled"
                            @click="executeAIAction('fix_grammer')" />
                        <ActionButton label="Improve" icon="PenToolIcon" action="improve" :disabled="aiDisabled"
                            @click="executeAIAction('improve')" />
                        <ActionButton label="Simplify" icon="BookCheckIcon" action="simplify" :disabled="aiDisabled"
                            @click="executeAIAction('simplify')" />
                    </template>

                </PopoverContent>
            </PopoverPortal>
        </PopoverRoot>

        <input v-model="prompt" placeholder="Add a new task..."
            class="flex-1 px-2 py-3 outline-0 dark:text-white dark:placeholder:text-gray-300" />

        <IconButton type="submit" :disabled="props.isLoading">
            <ReloadIcon v-if="props.isLoading" class="w-4 h-4 text-white dark:text-black rounded-full animate-spin" />
            <PlusIcon v-else color="white" class="w-5 h-5" />
        </IconButton>
    </form>
</template>