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
    }
  },
});
