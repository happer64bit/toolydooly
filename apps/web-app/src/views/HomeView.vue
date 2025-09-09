<script setup lang="ts">
import BottomChatContainer from '@/components/BottomChatContainer.vue'
import FilterTodo from '@/components/FilterTodo.vue'
import TodoList from '@/components/TodoList.vue'
import TodoControls from '@/components/TodoControl.vue'
import { useAuth } from '@/stores/auth'
import { useTodoQuery } from '@/composables/useTodoQuery'
import { ReloadIcon } from '@radix-icons/vue'

const auth = useAuth()
const { todoQuery } = useTodoQuery();
</script>

<template>
    <div class="container mx-auto min-h-screen flex flex-col text-gray-900">
        <header class="flex items-center justify-between sticky top-0 py-4 bg-gray-50 z-10">
            <RouterLink to="/">
                <h1 class="text-2xl font-bold">ToolyDooly</h1>
            </RouterLink>
            <TodoControls :auth="auth" />
        </header>

        <main class="flex-1 pt-6">
            <div class="flex justify-between items-center mb-4">
                <FilterTodo />
                <button @click="todoQuery.refetch()"
                    class="text-blue-500 flex items-center gap-1 hover:bg-black/5 px-4 py-1.5 rounded-lg cursor-pointer">
                    <ReloadIcon :class="todoQuery.isFetching.value ? 'animate-spin' : ''" />
                    <span class="ml-2">Refresh</span>
                </button>
            </div>
            <TodoList />
        </main>

        <footer class="sticky bottom-0 left-0 w-full flex justify-center p-4 bg-gray-50">
            <BottomChatContainer />
        </footer>
    </div>
</template>
