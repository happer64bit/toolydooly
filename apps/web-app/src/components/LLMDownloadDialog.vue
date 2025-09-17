<script setup lang="ts">
import { computed, onMounted, ref, watch, type Ref } from 'vue'
import {
    DialogClose,
    DialogContent,
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogTitle,
} from 'radix-vue'
import { useLLM } from '@/stores/llm';

const progress = ref(0)
const status = ref<'idle' | 'downloading' | 'completed'>('idle')

const emit = defineEmits<{
    (e: 'update:open', value: boolean): void
}>()

const props = defineProps<{ open: boolean }>()

const { availability } = useLLM()

onMounted(() => {
    status.value = "completed"
    progress.value = 1
})

const isLocked = ref(false);

async function download() {
    isLocked.value = true;
    status.value = 'downloading'
    progress.value = 0
    await LanguageModel.create({
        monitor(m) {
            m.addEventListener('downloadprogress', (e) => {
                progress.value = Math.floor((e.loaded / e.total) * 100)
            })
        },
    })
    status.value = 'completed'
    isLocked.value = false;
    emit('update:open', false)
}

</script>

<template>
    <DialogRoot v-model:open="props.open" @update:open="(value) => {
        emit('update:open', value)
    }">
        <DialogPortal>
            <DialogOverlay class="bg-black/40 fixed inset-0 z-50" />
            <DialogContent class="z-[60] bg-white fixed top-[50%] left-[50%] w-[90vw] max-w-[500px] 
                translate-x-[-50%] translate-y-[-50%] rounded-[6px] p-[25px] focus:outline-none
                data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-80
                data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-90 data-[state=closed]:slide-out-to-bottom-3
                ">
                <div>
                    <DialogTitle class="text-2xl">Download AI Model</DialogTitle>
                </div>

                <div class="p-2 bg-gray-100 border border-gray-200 rounded-lg my-4">
                    <h2 class="font-bold mb-2 text-lg">Requirements</h2>
                    <ul class="list-disc list-inside text-sm space-y-1">
                        <li>Browser: Chrome Canary or Beta, version 127 or higher</li>
                        <li>Disk Space: At least 22 GB of free storage</li>
                        <li>Enable <code>#prompt-api-for-gemini-nano</code> and
                            <code>#optimization-guide-on-device-model</code> in <code>chrome://flags</code>
                        </li>
                        <li>Click Relaunch and Then go to <code>chrome://components</code> and click
                            <code>Optimization Guide On Device Model</code>
                        </li>
                        <li>Or See Guide <a
                                href="https://medium.com/google-cloud/getting-started-with-chromes-built-in-ai-from-setup-to-smart-clothing-advisor-f11760172139#:~:text=Get%20Started%20with,please%20kindly%20wait!"
                                target="_blank" class="text-blue-500">Here</a></li>
                    </ul>
                </div>

                <div v-if="status === 'downloading'" class="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                    <div class="bg-black h-4 rounded-full transition-all" :style="{ width: progress + '%' }"></div>
                </div>

                <button @click="download" :disabled="status === 'downloading'"
                    class="cursor-pointer bg-black hover:opacity-80 active:opacity-85 py-2.5 w-full text-white rounded-full disabled:opacity-50">
                    {{ status === 'downloading' ? 'Downloading...' : status === 'completed' ? 'Done' : 'Download' }}
                </button>
            </DialogContent>
        </DialogPortal>
    </DialogRoot>
</template>
