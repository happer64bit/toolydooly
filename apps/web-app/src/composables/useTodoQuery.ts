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
        queryFn: () => todo.fetchTodo({ hideCompleted: filter.hideCompleted, query: filter.searchQuery }),
        refetchOnWindowFocus: false,
        refetchInterval: 15000
    })

    const toggleMutation = useMutation({
        mutationFn: (id: string) => todo.toggleTodo(id),
        onSuccess: (_res, id) => {
            const oldTodos = queryClient.getQueryData<Todo[]>(['todos', filter.hideCompleted]) ?? []
            const newTodos = oldTodos.map(t =>
                t._id === id ? { ...t, is_done: !t.is_done, done_at: !t.is_done ? new Date() : undefined } : t
            )
            queryClient.setQueryData(['todos', filter.hideCompleted], newTodos)
        },
    })

    const removeMutation = useMutation({
        mutationFn: (id: string) => todo.deleteTodo(id),
        onSuccess: (_res, id) => {
            const oldTodos = queryClient.getQueryData<Todo[]>(['todos', filter.hideCompleted]) ?? []
            queryClient.setQueryData(
                ['todos', filter.hideCompleted],
                oldTodos.filter(t => t._id !== id)
            )
        },
    })

    const editMutation = useMutation({
        mutationFn: (data: { id: string, text: string }) => todo.updateTodo(data.id, { text: data.text }),
        onSuccess: (updatedTodo) => {
            const oldTodos = queryClient.getQueryData<Todo[]>(['todos', filter.hideCompleted]) ?? []
            queryClient.setQueryData(
                ['todos', filter.hideCompleted],
                oldTodos.map(t => t._id === updatedTodo._id ? updatedTodo : t)
            )
        },
    })

    const createTodoMutation = useMutation({
        mutationFn: (data: Parameters<typeof todo.createTodo>[0]) => todo.createTodo(data),
        onSuccess: (createdTodo) => {
            const oldTodos = queryClient.getQueryData<Todo[]>(['todos', filter.hideCompleted]) ?? []
            queryClient.setQueryData(['todos', filter.hideCompleted], [...oldTodos, createdTodo])
        },
    })

    return { todoQuery, toggleMutation, removeMutation, editMutation, createTodoMutation }
}
