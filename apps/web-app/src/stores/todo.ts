import type { Todo } from "@/types/todo.type";
import { defineStore } from "pinia";
import api from "@/lib/axios";
import { useAuth } from "./auth";

export const useTodo = defineStore("todo", {
    actions: {
        async fetchTodo({
            hideCompleted,
            query
        }: {
            hideCompleted: boolean
            query?: string
        }): Promise<Todo[]> {
            const auth = useAuth()
            try {
                const searchParam = query ? `&query=${encodeURIComponent(query)}` : ''
                const { data } = await api.get(
                    `/todo?hide_completed=${hideCompleted}${searchParam}`,
                    {
                        headers: { Authorization: `Bearer ${auth.accessToken}` }
                    }
                )
                return data
            } catch (err) {
                console.error('Fetching Todo Failed', err)
                throw err
            }
        },

        async toggleTodo(id: string): Promise<boolean> {
            const auth = useAuth();
            try {
                await api.put(
                    "/todo/toggle",
                    { id },
                    { headers: { Authorization: `Bearer ${auth.accessToken}` } }
                );
                return true;
            } catch {
                return false;
            }
        },

        async createTodo(body: { text: string; priority: string }) {
            const priorityMap: Record<string, number> = { high: 1, medium: 2, low: 3 };
            const priorityInt = priorityMap[body.priority];

            if (!priorityInt || !body.text) throw new Error("Canceling Todo Creation");

            const { accessToken } = useAuth();

            try {
                const { data } = await api.post("/todo", { text: body.text, priority: priorityInt }, {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                });
                return data;
            } catch {
                throw new Error("Failed To Create Todo");
            }
        },

        async deleteTodo(id: string) {
            const auth = useAuth();
            try {
                const { data } = await api.delete("/todo", {
                    data: { id },
                    headers: { Authorization: `Bearer ${auth.accessToken}` },
                });
                return data;
            } catch {
                throw new Error("Failed To Delete Todo");
            }
        },

        async updateTodo(id: string, body: { text: string; priority?: string }) {
            const auth = useAuth();
            const updateData: Record<string, unknown> = { id: id, text: body.text.trim() };

            //   if (body.priority) {
            //     const priorityMap: Record<string, number> = { high: 1, medium: 2, low: 3 };
            //     updateData.priority = priorityMap[body.priority];
            //   }

            if (updateData.length === 0) {
                return;
            }

            try {
                const { data } = await api.put("/todo", updateData, {
                    headers: { Authorization: `Bearer ${auth.accessToken}` },
                    data: body
                });
                return data;
            } catch {
                throw new Error("Failed To Update Todo");
            }
        },
    },
});
