import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "./libs/jwt";
import * as cache from "./libs/cache";
import * as userRepo from "./user.repostiory";
import { JsonWebTokenError } from "jsonwebtoken";

export default async function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(403).json({
        message: "Forbidden",
        status: "error",
      });
    }

    const token = authorization.split(" ")[1]; // grab only the token part

    const payload = verifyAccessToken(token);
    if (!payload || !payload.sub) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token payload" });
    }

    const userId = payload.sub.toString();

    // Try cache first
    const cached = await cache.getCache(userId);
    if (cached) {
      req.user = cached;
      return next();
    }

    // Fallback to DB
    const user = await userRepo.findUserById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Cache user info
    await cache.setCache(userId, {
      uid: user.uid,
      username: user.username,
      email: user.email,
      created_at: user.created_at
    }, 60 * 15);

    req.user = {
      uid: user.uid,
      email: user.email,
      username: user.username,
      created_at: user.created_at
    };

    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return res
        .status(401)
        .json({ success: false, message: error.message });
    }
    next(error); // let express error handler deal with it
  }
}
