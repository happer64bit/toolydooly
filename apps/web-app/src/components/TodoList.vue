<script setup lang="ts">
import { computed } from 'vue'
import { useTodoQuery } from '@/composables/useTodoQuery'
import TodoItem from './TodoItem.vue'
import type { Todo } from '@/types/todo.type'

const { todoQuery } = useTodoQuery()

const groupedTodos = computed(() => {
  const todos = (todoQuery.data.value ?? []).slice().sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  const groups: Record<string, Todo[]> = {}
  for (const todo of todos) {
    const dateKey = new Date(todo.created_at).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(todo)
  }
  return groups
})
</script>

<template>
  <div v-if="!todoQuery.data.value" class="space-y-4">
    <div v-for="n in 5" :key="n" class="animate-pulse flex items-center gap-4 p-4 rounded-lg bg-gray-200 h-16"></div>
  </div>

  <p v-else-if="Object.keys(groupedTodos).length === 0" class="text-center text-gray-500 py-6">
    No todos found. Start adding some!
  </p>

  <div v-else class="space-y-6">
    <div v-for="(todos, date) in groupedTodos" :key="date">
      <h2 class="text-lg font-semibold text-gray-700 mb-2">{{ date }}</h2>
      <TransitionGroup name="list" tag="div" class="space-y-2">
        <TodoItem v-for="todoItem in todos" :key="todoItem._id" :todo="todoItem" />
      </TransitionGroup>
    </div>
  </div>
</template>
