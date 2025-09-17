import { defineStore } from "pinia";

interface Actions {
    [key: string]: { build: (text: string) => string };
}

const actions: Actions = {
    fix_grammar: {
        build: (text: string) =>
            `Correct the following sentences for grammatical errors. Only return final output (max char: 255): "${text}"`
    },
    improve: {
        build: (text: string) =>
            `Improve clarity, style, and readability without changing meaning. Only return final output (max char: 255): "${text}"`
    },
    simplify: {
        build: (text: string) =>
            `Simplify the following text for easy understanding. Only return final output (max char: 255): "${text}"`
    }
};

export const useLLM = defineStore("llm", {
    state: () => ({
        model: null as LanguageModel | null,
    }),
    getters: {
        availability: async () => await LanguageModel.availability()
    },
    actions: {
        async initModel() {
            try {
                if (!this.model) {
                    this.model = await LanguageModel.create({
                        initialPrompts: [
                            {
                                role: "user",
                                content: "You are a Language Model for Todo App that will handle user data."
                            }
                        ]
                    });
                }
            } catch (error) {
                console.error("Error Initializing Model: " + error)
            }
        },

        async process(input: string, type: keyof Actions) {
            if (!actions[type]) throw new Error(`Unknown action type: ${type}`);
            if (!this.model) await this.initModel();
            if (!this.model) throw new Error("Model not initialized");

            const prompt = actions[type].build(input);
            const result = await this.model.prompt(prompt);
            return result;
        },
    }
});
