import * as z from "zod/v4";

export const createTodoSchema = z.object({
    text: z.string(),
    body: z.string().optional(),
    start_on: z.iso.datetime().optional(),
    deadline: z.iso.datetime().optional(),
    reminder_at: z.iso.datetime().optional(),
    priority: z.enum(["low", "normal", "high"])
});

export const updateTodoSchema = z.object({
    text: z.string().optional(),
    body: z.string().optional(),
    start_on: z.iso.datetime().optional(),
    deadline: z.iso.datetime().optional(),
    reminder_at: z.iso.datetime().optional(),
    priority: z.enum(["low", "normal", "high"]).optional()
})
