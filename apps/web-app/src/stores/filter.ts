import { defineStore } from "pinia";

export const useFilter = defineStore("filter", {
    state: () => ({
        hideCompleted: window.localStorage.getItem("hideCompleted") === "true"
    }),
    getters: {
        isHidden(state) {
            return state.hideCompleted;
        }
    },
    actions: {
        setHideCompleted(value: boolean) {
            this.hideCompleted = value;
            window.localStorage.setItem("hideCompleted", String(value));
        }
    }
});
