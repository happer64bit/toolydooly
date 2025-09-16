import type { UserSession } from "@/types/auth.type";
import { defineStore } from "pinia";
import { createUserSchema, loginUserSchema } from "@toolydooly/validation-schemas/auth";
import type z from "zod";
import api from "@/lib/axios";
import axios from "axios";

type Status = "loading" | "authenticated" | "unauthenticated";

export const useAuth = defineStore("auth", {
    state: () => ({
        user: null as UserSession | null,
        accessToken: undefined as string | undefined,
        status: "unauthenticated" as Status,
        fetchIntervalId: undefined as ReturnType<typeof setInterval> | undefined,
        isFetchingUser: false,
    }),
    actions: {
        async handleAuthError() {
            console.error("Authentication failed. Logging out and redirecting.");
        },

        async handleAuthSuccess(token: string, onSuccess?: (user: UserSession) => void) {
            this.accessToken = token;
            localStorage.setItem("token", token);
            await this.fetchUser(onSuccess);
        },

        async login(props: z.infer<typeof loginUserSchema>, onSuccess?: (user: UserSession) => void) {
            this.status = "loading";
            try {
                const parsed = loginUserSchema.parse(props);
                const { data } = await api.post("/auth/login", parsed);

                if (data.status !== "success") {
                    throw new Error(data.message || "Login Failed");
                }

                if (!data.access_token) {
                    throw new Error("No access token returned");
                }

                await this.handleAuthSuccess(data.access_token, onSuccess);
                return this.user;
            } catch (err) {
                if(axios.isAxiosError(err)) {
                    const msg = err?.response?.data?.message || err.message || "Login failed";
                    throw new Error(msg);
                }
                throw err;
            }
        },

        async createUser(props: z.infer<typeof createUserSchema>, onSuccess?: (user: UserSession) => void) {
            this.status = "loading";
            try {
                const parsed = createUserSchema.parse(props);
                const { data } = await api.post("/auth/create-user", parsed);

                if (!data.access_token) throw new Error("Create User Failed");

                await this.handleAuthSuccess(data.access_token, onSuccess);

                return this.user;
            } catch (err) {
                if(axios.isAxiosError(err)) {
                    const msg = err?.response?.data?.message || err.message || "Login failed";
                    throw new Error(msg);
                }
                throw err;
            }
        },

        async fetchUser(onSuccess?: (user: UserSession) => void): Promise<UserSession | undefined> {
            if (this.isFetchingUser || !this.accessToken) {
                if (!this.accessToken) {
                    await this.handleAuthError();
                }
                return;
            }

            this.isFetchingUser = true;
            try {
                const { data } = await api.get("/auth/session", {
                    headers: {
                        "Authorization": `Bearer ${this.accessToken}`
                    }
                });
                this.user = data;
                this.status = "authenticated";
                if (onSuccess) onSuccess(data);
                this.startAutoFetch();
                return data;
            } catch (err) {
                console.error("Failed to fetch user session:", err);
                await this.handleAuthError();
            } finally {
                this.isFetchingUser = false;
            }
        },

        async refresh() {
            try {
                const { data } = await api.get("/auth/refresh", { withCredentials: true });

                if (!data.access_token) {
                    throw new Error("Refresh token failed");
                }

                this.accessToken = data.access_token;
                localStorage.setItem("token", data.access_token);
                return true;
            } catch (err) {
                console.error("Failed to refresh token:", err);
                await this.handleAuthError();
                return false;
            }
        },

        async logout(onSuccess?: () => void) {
            if (this.status !== "unauthenticated") {
                try {
                    await api.get("/auth/logout");
                } catch (err) {
                    console.error("Logout request failed:", err);
                }
            }
            this.user = null;
            this.accessToken = undefined;
            this.status = "unauthenticated";
            localStorage.removeItem("token");
            this.stopAutoFetch();
            if (onSuccess) onSuccess();
        },

        async checkAuth(onSuccess?: (user: UserSession) => void) {
            const token = localStorage.getItem("token");
            if (token) {
                this.accessToken = token;
                await this.fetchUser(onSuccess);
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
