import { generateKeyPairSync } from "crypto";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function generateRS512Keys() {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" }
  });

  return { publicKey, privateKey };
}

const keys = generateRS512Keys();

if(!existsSync(join(__dirname, "../keys"))) {
  mkdirSync(join(__dirname, "../keys"));
}

writeFileSync(join(__dirname, "../keys/public.key"), keys.publicKey);
writeFileSync(join(__dirname, "../keys/private.key"), keys.privateKey);

console.log("Keys generated successfully!");
