<script setup lang="ts">
import { CaretDownIcon, ExitIcon } from '@radix-icons/vue'
import { DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuPortal, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from 'radix-vue'
import router from '@/router'
import { defineProps } from 'vue'
import type { useAuth } from '@/stores/auth';

const props = defineProps<{ auth: ReturnType<typeof useAuth> }>()
</script>

<template>
    <div class="flex items-center gap-2">
        <RouterLink v-if="props.auth.status === 'unauthenticated' || props.auth.status === 'loading'" to="/auth/sign-in"
            class="bg-black px-4 py-2 rounded-full text-white hover:opacity-90">Sign In</RouterLink>

        <DropdownMenuRoot v-else>
            <DropdownMenuTrigger as="button"
                class="bg-black px-4 py-1.5 rounded-full text-white flex items-center gap-2 hover:opacity-90 cursor-pointer select-none">
                Profile
                <CaretDownIcon />
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
                <DropdownMenuContent
                    align="end"
                    class="bg-white border border-black/10 rounded-xl p-2 min-w-[180px] space-y-1 mt-4
                data-[state=open]:animate-in data-[state=open]:fade-in-85 data-[state=open]:slide-in-from-top-2 data-[state=open]:zoom-in-90
                data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-85 duration-200">
                    <p class="text-sm text-gray-500 line-clamp-1 px-2 my-1">Hello @{{ props.auth.user?.username }}</p>
                    <DropdownMenuSeparator class="h-[1px] bg-black/5" />
                    <DropdownMenuItem @click="props.auth.logout(async () => await router.push('/auth/sign-in'))"
                        class="flex items-center gap-2 text-red-500 px-2 py-1.5 hover:bg-gray-500/10 w-full rounded cursor-pointer text-sm">
                        <ExitIcon /> Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenuPortal>
        </DropdownMenuRoot>
    </div>
</template>
