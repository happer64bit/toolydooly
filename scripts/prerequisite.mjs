import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";

function checkCommand(cmd) {
  try {
    execSync(`${cmd} --version`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function detectContainerEngine() {
  let engine = null;
  let compose = null;

  if (checkCommand("docker") && checkCommand("docker-compose")) {
    engine = "docker";
    compose = "docker-compose";
  } else if (checkCommand("podman") && checkCommand("podman-compose")) {
    engine = "podman";
    compose = "podman-compose";
  } else {
    console.error("Error: Neither Docker+Compose nor Podman+Podman-Compose found.");
    process.exit(1);
  }

  console.log("Container engine detected:", engine);
  console.log("Compose tool detected:", compose);

  return { engine, compose };
}

function checkKeys() {
  const keysDir = path.join(process.cwd(), "keys");
  const privateKeyPath = path.join(keysDir, "private.key");
  const publicKeyPath = path.join(keysDir, "public.key");

  if (!fs.existsSync(keysDir)) {
    console.error("Error: keys/ directory does not exist.");
    process.exit(1);
  }

  if (!fs.existsSync(privateKeyPath)) {
    console.error("Error: private.key does not exist in keys/.");
    process.exit(1);
  }

  if (!fs.existsSync(publicKeyPath)) {
    console.error("Error: public.key does not exist in keys/.");
    process.exit(1);
  }

  // Check if keys are valid for RS512
  try {
    const privateKey = fs.readFileSync(privateKeyPath, "utf8");
    const publicKey = fs.readFileSync(publicKeyPath, "utf8");

    // Try signing and verifying a dummy message
    const message = "test";
    const signature = crypto.sign("RSA-SHA512", Buffer.from(message), privateKey);
    const verified = crypto.verify("RSA-SHA512", Buffer.from(message), publicKey, signature);

    if (!verified) throw new Error("Key verification failed");

    console.log("Keys are valid for RS512.");
  } catch (err) {
    console.error("Error: Keys are not suitable for RS512:", err.message);
    process.exit(1);
  }
}

detectContainerEngine();
checkKeys();

console.log("OKAY")