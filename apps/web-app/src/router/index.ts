import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuth } from '@/stores/auth'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: { requiresAuth: true, title: "ToolyDooly - App" },
        },
        {
            path: "/auth/sign-in",
            name: 'sign-in',
            component: async () => await import("@/views/SignInView.vue"),
            meta: {
                title: "Sign In - ToolyDooly"
            }
        },
        {
            path: "/auth/create-user",
            name: 'create-user',
            component: async () => await import("@/views/CreateUserView.vue"),
            meta: {
                title: "Create User - ToolyDooly"
            }
        }
    ],
})

router.beforeResolve(async (to) => {
    const auth = useAuth();
    document.title = to.meta.title as string ?? "Not Found"

    if (auth.status === "unauthenticated") {
        await auth.checkAuth();
    }

    if (to.meta.requiresAuth && auth.status !== "authenticated") {
        return { path: "/auth/sign-in" };
    }

    if (to.path === "/auth/sign-in" && auth.status === "authenticated") {
        return { path: "/" }
    }
})

export default router;
