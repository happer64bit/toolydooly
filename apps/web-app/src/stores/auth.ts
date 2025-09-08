import type { UserSession } from "@/types/auth.type";
import { defineStore } from "pinia";
import { createUserSchema, loginUserSchema } from "@toolydooly/validation-schemas/auth";
import type z from "zod";
import api from "@/lib/axios";
import router from "@/router"; // ✅ Import router instance directly

type Status = "loading" | "authenticated" | "unauthenticated";

export const useAuth = defineStore("auth", {
    state: () => ({
        user: null as UserSession | null,
        accessToken: undefined as string | undefined,
        status: "unauthenticated" as Status,
        fetchIntervalId: undefined as ReturnType<typeof setInterval> | undefined,
    }),
    actions: {
        async login(props: z.infer<typeof loginUserSchema>, onSuccess?: (user: UserSession) => void) {
            this.status = "loading";
            try {
                const parsed = loginUserSchema.parse(props);
                const { data } = await api.post("/auth/login", parsed);
                if (!data.access_token) throw new Error("Login Failed");

                this.accessToken = data.access_token;
                localStorage.setItem("token", data.access_token);

                const user = await this.fetchUser(onSuccess, async () => {
                    await router.push("/auth/login");
                });
                this.startAutoFetch();
                return user;
            } catch (err) {
                console.error(err);
                this.status = "unauthenticated";
            }
        },

        async createUser(props: z.infer<typeof createUserSchema>, onSuccess?: (user: UserSession) => void) {
            this.status = "loading";
            try {
                const parsed = createUserSchema.parse(props);
                const { data } = await api.post("/auth/create-user", parsed);
                if (!data.access_token) throw new Error("Create User Failed");

                this.accessToken = data.access_token;
                localStorage.setItem("token", data.access_token);

                const user = await this.fetchUser(onSuccess, async () => {
                    await router.push("/auth/login");
                });
                this.startAutoFetch();
                return user;
            } catch (err) {
                console.error(err);
                this.status = "unauthenticated";
            }
        },

        async fetchUser(
            onSuccess?: (user: UserSession) => void,
            onSessionNotFound?: () => Promise<void>
        ): Promise<UserSession | undefined> {
            if (!this.accessToken) {
                this.status = "unauthenticated";
                return;
            }
            try {
                const { data } = await api.get("/auth/session");
                this.user = data;
                this.status = "authenticated";
                if (onSuccess) onSuccess(data);
                return data;
            } catch (err) {
                console.error(err);
                this.logout(async () => {
                    if (onSessionNotFound) {
                        await onSessionNotFound();
                    } else {
                        await router.push("/auth/login");
                    }
                });
            }
        },

        async refresh() {
            try {
                const { data } = await api.get("/auth/refresh", {
                    withCredentials: true,
                });

                if (!data.access_token) return false;
                this.accessToken = data.access_token;
                localStorage.setItem("token", data.access_token);
                return true;
            } catch (err) {
                console.error("Failed to refresh token", err);
                this.logout(async () => {
                    await router.push("/auth/login");
                });
                return false;
            }
        },

        async logout(onSuccess?: () => void) {
            if (this.status === "authenticated") {
                try {
                    await api.get("/auth/logout");

                    this.user = null;
                    this.accessToken = undefined;
                    this.status = "unauthenticated";
                    localStorage.removeItem("token");

                    this.stopAutoFetch();

                    if(onSuccess) onSuccess();
                    return;
                } catch {
                    return;
                }
            }
        },

        async checkAuth(onSuccess?: (user: UserSession) => void) {
            const token = localStorage.getItem("token");
            if (token) {
                this.accessToken = token;
                await this.fetchUser(onSuccess);
                this.startAutoFetch();
            } else {
                this.status = "unauthenticated";
            }
        },

        startAutoFetch() {
            if (this.fetchIntervalId || this.status !== "authenticated") return;
            this.fetchIntervalId = setInterval(() => this.fetchUser(), 15000);
        },

        stopAutoFetch() {
            if (this.fetchIntervalId) clearInterval(this.fetchIntervalId);
            this.fetchIntervalId = undefined;
        },
    },
});
