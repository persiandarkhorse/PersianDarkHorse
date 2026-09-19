import { afterEach, describe, expect, it } from "vitest";
import { decryptSecret, encryptSecret, secretLast4 } from "./secretVault";

const originalKey = process.env.ADMIN_SECRETS_ENCRYPTION_KEY;

afterEach(() => {
  if (originalKey === undefined) delete process.env.ADMIN_SECRETS_ENCRYPTION_KEY;
  else process.env.ADMIN_SECRETS_ENCRYPTION_KEY = originalKey;
});

describe("admin API secret vault", () => {
  it("encrypts and decrypts a key without storing the raw value", () => {
    process.env.ADMIN_SECRETS_ENCRYPTION_KEY = "test-only-encryption-key-that-is-long-enough";
    const raw = "provider-test-value-123456";
    const encrypted = encryptSecret(raw);
    expect(encrypted.ciphertext).not.toContain(raw);
    expect(decryptSecret(encrypted)).toBe(raw);
    expect(secretLast4(raw)).toBe("3456");
  });

  it("refuses to encrypt when the server-side master key is missing", () => {
    delete process.env.ADMIN_SECRETS_ENCRYPTION_KEY;
    expect(() => encryptSecret("test-secret-123456")).toThrow("ADMIN_SECRETS_ENCRYPTION_KEY");
  });

  it("validates the configured deployment secret without exposing its value", () => {
    const configured = process.env.ADMIN_SECRETS_ENCRYPTION_KEY;
    expect(configured).toBeTruthy();
    expect(configured?.length ?? 0).toBeGreaterThanOrEqual(32);
    const encrypted = encryptSecret("deployment-secret-validation");
    expect(decryptSecret(encrypted)).toBe("deployment-secret-validation");
  });
});
