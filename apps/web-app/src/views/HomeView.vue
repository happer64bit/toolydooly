<script setup lang="ts">
import BottomChatContainer from '@/components/BottomChatContainer.vue';
import { useAuth } from '@/stores/auth';
import { useTodo } from '@/stores/todo';
import { useMutation, useQuery } from '@tanstack/vue-query';

const auth = useAuth();
const todo = useTodo();

const todoQuery = useQuery({
    queryKey: ["todos"],
    queryFn: async () => await todo.fetchTodo(10, 0)
})

const toggleMutation = useMutation({
    mutationKey: ["toggle_todo"],
    mutationFn: async (id: string) => await todo.toggleTodo(id)
})

</script>

<template>
    <div class="container mx-auto bg-white text-gray-900 min-h-screen py-4">
        <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold">ToolyDooly</h1>
            <RouterLink to="/auth/sign-in" class="bg-black px-4 py-2 rounded-full text-white"
                v-if="auth.status == 'unauthenticated' || auth.status == 'loading'">
                Sign In
            </RouterLink>
        </div>
        <div class="pt-6">
            <label v-for="todoItem in todoQuery.data.value" :key="todoItem._id"
                class="flex items-center justify-between cursor-pointer p-4 rounded-lg hover:bg-gray-100 transition-transform duration-100 active:scale-[0.98] select-none">
                <div class="flex items-center gap-4">
                    <span class="w-1.5 h-10 bg-red-400 rounded"></span>
                    <div class="flex flex-col">
                        <span class="text-lg font-medium">{{ todoItem.text }}</span>
                        <span class="text-sm text-gray-500">
                            {{ new Date(todoItem.updated_at).toLocaleString() }}
                        </span>
                    </div>
                </div>
                <input type="checkbox" class="w-6 h-6 border-gray-900 rounded bg-black checked:bg-gray-200"
                    :checked="todoItem.is_done" @change="() => {
                        todoItem.is_done = !todoItem.is_done;
                        toggleMutation.mutateAsync(todoItem._id);
                    }" />
            </label>
        </div>

    </div>

    <div class="fixed bottom-0 left-0 w-full flex justify-center bg-white p-4 shadow-md">
        <BottomChatContainer @submit="console.log" />
    </div>
</template>
