import crypto from "crypto";

// ---- AES-256-GCM: used to encrypt/decrypt the transaction description at rest ----
const ALGORITHM = "aes-256-gcm";

function getKey() {
  const key = process.env.AES_SECRET_KEY;
  if (!key || key.length !== 64) {
    throw new Error(
      "AES_SECRET_KEY must be a 64-character hex string (32 bytes) in .env"
    );
  }
  return Buffer.from(key, "hex");
}

// Encrypts plaintext and returns "iv:authTag:ciphertext" (all hex), stored in enc_description
export function encrypt(plainText) {
  const iv = crypto.randomBytes(12); // recommended IV size for GCM
  const key = getKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

// Decrypts a string produced by encrypt()
export function decrypt(payload) {
  if (!payload) return "";
  const [ivHex, authTagHex, encryptedHex] = payload.split(":");
  const key = getKey();
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(ivHex, "hex")
  );
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// ---- Searchable symmetric encryption (simplified): deterministic keyword hash ----
// Because a HMAC with a fixed secret is deterministic, the same keyword always
// produces the same hash, which lets MongoDB match on keyword_hash without ever
// storing or searching the plaintext description.
export function hashKeyword(keyword) {
  const hmacKey = process.env.HMAC_SECRET_KEY || "fallback_hmac_secret";
  return crypto
    .createHmac("sha256", hmacKey)
    .update(keyword.trim().toLowerCase())
    .digest("hex");
}

// Splits a free-text description into normalized keyword tokens and hashes each one,
// enabling multi-keyword search over the encrypted record (see Section 5.2, Private
// Search Module, in the project report).
export function hashKeywords(text) {
  const tokens = text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1);
  const uniqueTokens = [...new Set(tokens)];
  return uniqueTokens.map(hashKeyword);
}
