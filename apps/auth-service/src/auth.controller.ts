import type { Request, Response } from 'express';
import { createUserSchema, loginUserSchema } from '@toolydooly/validation-schemas/auth';
import * as authService from './auth.service';

export const createUser = async (req: Request, res: Response) => {
    const parsed = await createUserSchema.safeParseAsync(req.body);
    if (!parsed.success) return res.status(400).json({ status: "error", message: parsed.error.format() });

    try {
        const { user, accessToken, refreshToken } = await authService.registerUser(parsed.data.username, parsed.data.email, parsed.data.password);
        res.cookie("refresh_token", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: "none" });
        res.status(201).json({ status: "success", data: user, access_token: accessToken });
    } catch (err: any) {
        res.status(409).json({ status: "error", message: err.message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const parsed = await loginUserSchema.safeParseAsync(req.body);
    if (!parsed.success) return res.status(400).json({ status: "error", message: parsed.error.format() });

    try {
        const { user, accessToken, refreshToken } = await authService.loginUser(parsed.data.usernameOrEmail, parsed.data.password);
        if (refreshToken) res.cookie("refresh_token", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: "none" });
        res.status(200).json({ status: "success", data: user, access_token: accessToken });
    } catch (err: any) {
        res.status(401).json({ status: "error", message: err.message });
    }
};

export const verify = async (req: Request, res: Response) => {
    if (!req.user) res.status(403).json({
        message: "Unauthorized Access",
        status: "error"
    });

    return res.json(req.user);
};

export const refresh = async (req: Request, res: Response) => {
    const token = req.cookies["refresh_token"];
    if (!token) {
        return res.status(401).json({ status: "error", message: "No refresh token" });
    }

    try {
        const accessToken = await authService.refreshUserToken(token);

        res.status(200).json({
            status: "success",
            access_token: accessToken,
        });
    } catch (err: any) {
        res.status(401).json({ status: "error", message: err.message });
    }
};
