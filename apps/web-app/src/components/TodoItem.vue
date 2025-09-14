<script setup lang="ts">
import { ref } from 'vue'
import { TrashIcon } from '@radix-icons/vue'
import { useTodoQuery } from '@/composables/useTodoQuery'
import type { Todo } from '@/types/todo.type';

const props = defineProps<{ todo: Todo }>()
const { toggleMutation, removeMutation, editMutation } = useTodoQuery()
const editingId = ref<string | null>(null)
const editingText = ref('')
</script>

<template>
  <div
    class="flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-transform duration-100 active:scale-[0.98] select-none">
    <div class="flex items-center gap-4">
      <input type="checkbox"
        class="w-6 h-6 border-gray-900 rounded bg-black checked:bg-gray-200 dark:border-gray-200 dark:bg-white dark:checked:bg-gray-700"
        :checked="props.todo.is_done" @change="() => toggleMutation.mutate(props.todo._id)" />
      <span
        :class="`w-2.5 h-10 rounded ${props.todo.priority === 3 ? 'bg-green-500' : props.todo.priority === 2 ? 'bg-blue-600' : 'bg-red-600'}`" />
      <div class="flex flex-col w-full">
        <template v-if="editingId === props.todo._id">
          <input type="text" v-model="editingText"
            class="border rounded px-2 py-1 dark:border-gray-600 dark:bg-zinc-700 dark:text-white"
            @keyup.enter="editMutation.mutate({ id: props.todo._id, text: editingText }); editingId = null"
            @keyup.esc="editingId = null"
            @blur="editingId = null" />
        </template>
        <template v-else>
          <span @dblclick="editingId = props.todo._id; editingText = props.todo.text"
            :class="`text-lg font-medium ${props.todo.is_done ? 'line-through opacity-70' : ''} cursor-pointer dark:text-white`">
            {{ props.todo.text }}
          </span>
        </template>
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ new Date(props.todo.updated_at).toLocaleString([], {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute:'2-digit' }) }}
        </span>
      </div>
    </div>
    <button @click="removeMutation.mutate(props.todo._id)"
      class="text-red-500 hover:text-red-700 dark:hover:text-red-400">
      <TrashIcon class="w-5 h-5" />
    </button>
  </div>
</template>
