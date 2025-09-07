<script setup lang="ts">
import BottomChatContainer from '@/components/BottomChatContainer.vue'
import FilterTodo from '@/components/FilterTodo.vue'
import { useAuth } from '@/stores/auth'
import { useFilter } from '@/stores/filter'
import { useTodo } from '@/stores/todo'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { watch } from 'vue'

// stores
const auth = useAuth()
const todo = useTodo()
const filter = useFilter()

// infer todo type from store
type Todo = Awaited<ReturnType<typeof todo.fetchTodo>>[number]

// query
const todoQuery = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: () => todo.fetchTodo({
        limit: 10,
        hideCompleted: filter.hideCompleted
    }),
    refetchOnWindowFocus: false,
})

watch(
  () => filter.hideCompleted,
  () => {
    todoQuery.refetch()
  }
)

// toggle mutation
const toggleMutation = useMutation({
    mutationFn: (id: string) => todo.toggleTodo(id),
    onMutate: async (id: string) => {
        const previousTodos = todoQuery.data.value?.slice() ?? []

        if (todoQuery.data.value) {
            todoQuery.data.value = todoQuery.data.value.map(t =>
                t._id === id
                    ? { ...t, is_done: !t.is_done, done_at: !t.is_done ? new Date() : undefined }
                    : t
            )
        }

        return { previousTodos }
    },
    onError: (_err, _id, context) => {
        if (context?.previousTodos) {
            todoQuery.data.value = context.previousTodos
        }
    },
    onSettled: () => {
        todoQuery.refetch()
    },
})

// create mutation
const createTodoMutation = useMutation({
    mutationKey: ['createTodo'],
    mutationFn: (data: Parameters<typeof todo.createTodo>[0]) => todo.createTodo(data),
    onSuccess: () => {
        todoQuery.refetch()
    },
})
</script>

<template>
    <div class="container mx-auto text-gray-900 min-h-screen py-4">
        <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold">ToolyDooly</h1>
            <RouterLink to="/auth/sign-in" class="bg-black px-4 py-2 rounded-full text-white"
                v-if="auth.status == 'unauthenticated' || auth.status == 'loading'">
                Sign In
            </RouterLink>
            <button to="/auth/logout" class="bg-black px-4 py-2 rounded-full text-white hover:opacity-90 cursor-pointer"
                v-if="auth.status == 'authenticated'">
                Logout
            </button>
        </div>

        <div class="pt-6">
            <div class="flex justify-end mb-2">
                <FilterTodo />
            </div>
            <TransitionGroup name="list" tag="div">
                <label v-for="todoItem in todoQuery.data.value" :key="todoItem._id"
                    class="flex items-center justify-between cursor-pointer p-4 rounded-lg hover:bg-gray-100 transition-transform duration-100 active:scale-[0.98] select-none">
                    <div class="flex items-center gap-4">
                        <span :class="`w-1.5 h-10 rounded ${todoItem.priority === 3
                            ? 'bg-green-500'
                            : todoItem.priority === 2
                                ? 'bg-blue-600'
                                : todoItem.priority === 1
                                    ? 'bg-red-600'
                                    : ''
                            }`" />
                        <div class="flex flex-col">
                            <span :class="`text-lg font-medium ${todoItem.is_done && 'line-through opacity-80'}`">
                                {{ todoItem.text }}
                            </span>
                            <span class="text-sm text-gray-500">
                                {{ new Date(todoItem.updated_at).toLocaleString() }}
                            </span>
                        </div>
                    </div>

                    <input type="checkbox" class="w-6 h-6 border-gray-900 rounded bg-black checked:bg-gray-200"
                        :checked="todoItem.is_done" @change="
                            () => {
                                todoItem.is_done = !todoItem.is_done
                                toggleMutation.mutateAsync(todoItem._id)
                            }
                        " />
                </label>
            </TransitionGroup>
        </div>
    </div>

    <div class="sticky bottom-0 left-0 w-full flex justify-center p-4 shadow-md bg-gray-50">
        <BottomChatContainer @submit="data => createTodoMutation.mutate(data)" />
    </div>
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
