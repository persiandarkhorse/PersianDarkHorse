import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";

function getVaultKey() {
  const configured = process.env.ADMIN_SECRETS_ENCRYPTION_KEY;
  if (!configured || configured.length < 32) {
    throw new Error("ADMIN_SECRETS_ENCRYPTION_KEY must be configured with at least 32 characters before saving API keys.");
  }
  return createHash("sha256").update(configured, "utf8").digest();
}

export type EncryptedSecret = {
  ciphertext: string;
  iv: string;
  authTag: string;
};

export function encryptSecret(secret: string): EncryptedSecret {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, getVaultKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  return {
    ciphertext: ciphertext.toString("base64").replace(/=+$/g, ""),
    iv: iv.toString("base64").replace(/=+$/g, ""),
    authTag: cipher.getAuthTag().toString("base64").replace(/=+$/g, ""),
  };
}

export function decryptSecret(encrypted: EncryptedSecret): string {
  const decipher = createDecipheriv(ALGORITHM, getVaultKey(), Buffer.from(encrypted.iv, "base64"));
  decipher.setAuthTag(Buffer.from(encrypted.authTag, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(encrypted.ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
}

export function secretLast4(secret: string) {
  return secret.trim().slice(-4).padStart(4, "•");
}
