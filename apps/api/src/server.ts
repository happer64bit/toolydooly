import { urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';

export const createServer = (): Express => {
  const app = express();
  app.set('trust proxy', true);
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(express.json())
    .use(cors({
      origin: "http://localhost:5173",
      credentials: true
    }))
    .use(cookieParser())
    .use("/auth", createProxyMiddleware({
      target: "http://localhost:3002",
      changeOrigin: true,
      proxyTimeout: 5000,
      timeout: 5000,
      autoRewrite: true,
      logger: console,
      on: {
        proxyReq: (proxyReq, req) => {
          if (req.headers.cookie) {
            proxyReq.setHeader("cookie", req.headers.cookie);
          }
          fixRequestBody(proxyReq, req);
        },
      },
    }))
    .use("/todo", createProxyMiddleware({
      target: "http://localhost:3003",
      changeOrigin: true,
      proxyTimeout: 5000,
      timeout: 5000,
      on: {
        proxyReq: (proxyReq, req) => {
          if (req.headers.cookie) {
            proxyReq.setHeader("cookie", req.headers.cookie);
          }
          fixRequestBody(proxyReq, req);
        },
      },
    }))

  return app;
};
