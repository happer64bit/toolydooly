import { urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import { createUser, loginUser, logout, refresh, verify } from "./auth.controller";
import AuthMiddleware from "./auth.middleware";
import cookieParser from "cookie-parser";
import cors from 'cors';

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(cors({
      origin: "http://localhost:5173",
      credentials: true
    }))
    .use(urlencoded({ extended: true }))
    .use(express.json())
    .use(cookieParser())
    .post("/create-user", createUser)
    .post("/login", loginUser)
    .get("/session", AuthMiddleware, verify)
    .get("/refresh", refresh)
    .get("/logout", AuthMiddleware, logout)

  return app;
};
