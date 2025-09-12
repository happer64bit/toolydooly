import { defineStore } from "pinia";

interface FilterState {
    hideCompleted: boolean;
    searchQuery?: string
}

export const useFilter = defineStore('filter', {
    state: (): FilterState => ({
        hideCompleted: window.localStorage.getItem("hideCompleted") === "true",
    }),
    getters: {
        isHidden: (state): boolean => state.hideCompleted,
        getSearchQuery: (state): string | undefined => state.searchQuery
    },
    actions: {
        setHideCompleted(value: boolean) {
            this.hideCompleted = value;
            window.localStorage.setItem("hideCompleted", String(value));
        },
        toggleHideCompleted() {
            this.setHideCompleted(!this.hideCompleted);
        },
        setSearchQuery(value: string | undefined) {
            if(value?.trim().length === 0) {
                this.searchQuery = undefined;
                return;
            }
            this.searchQuery = value
        },
    }
});
