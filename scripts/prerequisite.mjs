import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";
import readline from "readline";

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

  try {
    const privateKey = fs.readFileSync(privateKeyPath, "utf8");
    const publicKey = fs.readFileSync(publicKeyPath, "utf8");

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

function promptMigrations() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Do you want to run database migrations? (y/N): ", (answer) => {
    const normalized = answer.trim().toLowerCase();
    if (normalized === "y") {
      try {
        console.log("Running migrations...");
        execSync("bun run migrate:auth", { stdio: "inherit" });
        console.log("Migrations completed.");
      } catch (err) {
        console.error("Error running migrations:", err.message);
        process.exit(1);
      }
    } else {
      console.log("Skipping migrations.");
    }

    rl.close();
  });
}

detectContainerEngine();
checkKeys();
promptMigrations();

console.log("OKAY")