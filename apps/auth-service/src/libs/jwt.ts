import { readFileSync } from "fs";
import { join } from "path";
import jwt from "jsonwebtoken";

const privateKey = readFileSync(join(__dirname, "./../../../../keys/private.key"));
const publicKey = readFileSync(join(__dirname, "./../../../../keys/public.key"));

const ISSUER = "toolydooly-app";

export function signAccessToken(sub: string) {
  return jwt.sign({}, privateKey, {
    algorithm: "RS512",
    subject: sub,
    expiresIn: "15m",
    issuer: ISSUER,
    audience: "access",
  });
}

export function signRefreshToken(sub: string) {
  return jwt.sign({}, privateKey, {
    algorithm: "RS512",
    subject: sub,
    expiresIn: "7d",
    issuer: ISSUER,
    audience: "refresh",
  });
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, publicKey, {
      algorithms: ["RS512"],
      issuer: ISSUER,
      audience: "access",
    });
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, publicKey, {
      algorithms: ["RS512"],
      issuer: ISSUER,
      audience: "refresh",
    });
  } catch {
    return null;
  }
}
