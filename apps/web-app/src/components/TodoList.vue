<script setup lang="ts">
import { useTodoQuery } from '@/composables/useTodoQuery'
import TodoItem from './TodoItem.vue'

const { todoQuery } = useTodoQuery()
</script>

<template>
  <div v-if="!todoQuery.data">
    <div v-for="n in 5" :key="n" class="animate-pulse flex items-center gap-4 p-4 rounded-lg bg-gray-200 h-16"></div>
  </div>

  <p v-else-if="(todoQuery.data.value ?? []).length === 0" class="text-center text-gray-500 py-6">
    No todos found. Start adding some!
  </p>

  <TransitionGroup name="list" tag="div" class="space-y-2" v-else>
    <TodoItem v-for="todoItem in todoQuery.data.value" :key="todoItem._id" :todo="todoItem" />
  </TransitionGroup>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
    transition: all 0.3s ease;
}

.list-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.list-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
