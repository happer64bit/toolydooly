<script setup lang="ts">
import BottomChatContainer from '@/components/BottomChatContainer.vue'
import FilterTodo from '@/components/FilterTodo.vue'
import TodoList from '@/components/TodoList.vue'
import { useAuth } from '@/stores/auth'
import { useTodoQuery } from '@/composables/useTodoQuery'
import { MagnifyingGlassIcon, ReloadIcon } from '@radix-icons/vue'
import ProfileMenu from '@/components/ProfileMenu.vue'
import { useDebounce } from '@/lib/debounce'
import { useFilter } from '@/stores/filter'
import { ref, watch } from 'vue'

const auth = useAuth()
const { todoQuery, createTodoMutation } = useTodoQuery()
const filter = useFilter()

const search = ref('')
const debouncedSearch = useDebounce(search, 150)

watch(debouncedSearch, (val) => {
  filter.setSearchQuery(val)
  todoQuery.refetch()
})
</script>


<template>
    <header class="sticky top-0 py-2 bg-gray-50 z-50 border-b border-b-black/5">
        <div class="container mx-auto flex items-center justify-between">
            <RouterLink to="/">
                <h1 class="text-xl">ToolyDooly</h1>
            </RouterLink>
            <ProfileMenu :auth="auth" />
        </div>
    </header>

    <div class="container mx-auto min-h-screen flex flex-col text-gray-900">
        <main class="flex-1 pt-6">
            <div class="relative w-full mb-2a">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-black/50">
                    <MagnifyingGlassIcon />
                </span>
                <input type="text"
                    v-model="search"
                    class="w-full pl-10 pr-4 py-2 bg-neutral-100 border border-black/5 rounded-lg outline-teal-500"
                    placeholder="Search Todo">
            </div>

            <div class="flex justify-between items-center mb-4 mt-2">
                <FilterTodo />
                <button @click="todoQuery.refetch()"
                    class="text-blue-500 flex items-center gap-1 hover:bg-black/5 px-4 py-1.5 rounded-lg cursor-pointer">
                    <ReloadIcon :class="todoQuery.isFetching.value ? 'animate-spin' : ''" />
                    <span class="ml-2">Refresh</span>
                </button>
            </div>
            <TodoList />
        </main>

        <footer
            class="sticky bottom-0 left-0 w-full flex justify-center p-4 bg-gradient-to-b from-gray-50/10 to-gray-50">
            <BottomChatContainer @submit="(event) => createTodoMutation.mutateAsync(event)" />
        </footer>
    </div>
</template>
