import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email().transform((val) => val.toLowerCase()),
  username: z.string()
    .transform(val => val.toLowerCase())
    .refine(val => /^[a-z0-9]+$/.test(val), { message: "Username can only contain lowercase letters and numbers, no spaces or symbols" }),
  password: z.string().min(8)
});

export const loginUserSchema = z.object({
  usernameOrEmail: z.string().transform((value) => value.toLowerCase()),
  password: z.string().min(8),
});
