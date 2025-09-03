import type { Request } from "express"

declare module "express" {
    interface Request {
        user?: {
            uid: string
            email: string
            username: string,
            created_at: Date
        }
    }
}
