import type { Todo } from "@/types/todo.type";
import { defineStore } from "pinia";
import api from "@/lib/axios";

export const useTodo = defineStore("todo", {
  actions: {
    async fetchTodo(limit: number, page: number): Promise<Todo[]> {
      try {
        const { data } = await api.get(`/todo?limit=${limit}&page=${page}`);
        return data;
      } catch (err) {
        console.error("Fetching Todo Failed", err);
        throw err;
      }
    },
    async toggleTodo(id: string): Promise<boolean> {
        try {
            await api.put("/todo/toggle", {
                id,
            })

            return true;
        } catch {
            return false;
        }
    },
    async createTodo(body: {
        text: string,
        priority: string
    }) {
        const priorityMap: Record<string, number> = {
            "high": 1,
            "medium": 2,
            "low": 3
        };

        const priorityInt = priorityMap[body.priority];

        if(!priorityInt || !body.text) throw new Error("Canceling Todo Creation");

        try {
            const response = await api.post("/todo", {
                text: body.text,
                priority: priorityInt
            });
            return response.data;
        } catch {
            throw new Error("Failed To Create Todo")
        }
    }
  },
});
