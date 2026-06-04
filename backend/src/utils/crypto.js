import dotenv from "dotenv";
dotenv.config()

import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const SECRET_KEY = process.env.CRYPTO_SECRET;
const IV_LENGTH = 16;

export function encrypt(text) {
  if (!text) return "";
  if (!SECRET_KEY) throw new Error("CRYPTO_SECRET não definido no .env");

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(SECRET_KEY, "utf8"),
    iv
  );

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
}

export function decrypt(text) {
  if (!text) return "";
  if (!SECRET_KEY) throw new Error("CRYPTO_SECRET não definido no .env");

  if (!text.includes(":")) return text;

  const [ivHex, encrypted] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(SECRET_KEY, "utf8"),
    iv
  );

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
