import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useTodo } from '@/stores/todo'
import { useFilter } from '@/stores/filter'
import type { Todo } from '@/types/todo.type'

export function useTodoQuery() {
    const todo = useTodo()
    const filter = useFilter()
    const queryClient = useQueryClient()

    const todoQuery = useQuery({
        queryKey: ['todos', filter.hideCompleted],
        queryFn: () => todo.fetchTodo({ limit: 10, hideCompleted: filter.hideCompleted }),
        refetchOnWindowFocus: false,
    })

    const toggleMutation = useMutation({
        mutationFn: (id: string) => todo.toggleTodo(id),
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ['todos'] })
            const previousTodos = queryClient.getQueryData(['todos']) ?? []
            queryClient.setQueryData<Todo[]>(['todos'], old =>
                old?.map(t => t._id === id ? { ...t, is_done: !t.is_done, done_at: !t.is_done ? new Date() : undefined } : t) ?? []
            )
            return { previousTodos }
        },
        onError: (_err, _id, ctx) => {
            if (ctx?.previousTodos) queryClient.setQueryData(['todos'], ctx.previousTodos)
        },
        onSettled: () => todoQuery.refetch(),
    })

    const removeMutation = useMutation({
        mutationFn: (id: string) => todo.deleteTodo(id),
        onSuccess: () => todoQuery.refetch(),
    })

    const editMutation = useMutation({
        mutationFn: (data: { id: string, text: string }) =>
            todo.updateTodo(data.id, { text: data.text }),
        onSuccess: () => todoQuery.refetch(),
    })

    const createTodoMutation = useMutation({
        mutationKey: ['createTodo'],
        mutationFn: (data: Parameters<typeof todo.createTodo>[0]) => todo.createTodo(data),
        onSuccess: () => todoQuery.refetch(),
    })

    return { todoQuery, toggleMutation, removeMutation, editMutation, createTodoMutation }
}
