import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { apiCredentials, InsertApiCredential, InsertPaymentSubmission, InsertSubscription, InsertUser, paymentSubmissions, subscriptions, users } from "../drizzle/schema";
import { ENV } from './_core/env';
import { decryptSecret, encryptSecret, secretLast4 } from './secretVault';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getSubscriptionByOpenId(userOpenId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(subscriptions).where(eq(subscriptions.userOpenId, userOpenId)).limit(1);
  return result[0];
}

export async function upsertSubscription(input: InsertSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available.");
  await db.insert(subscriptions).values(input).onDuplicateKeyUpdate({
    set: {
      planId: input.planId,
      status: input.status,
      expiresAt: input.expiresAt ?? null,
      isLifetime: input.isLifetime ?? 0,
      updatedAt: new Date(),
    },
  });
  return getSubscriptionByOpenId(input.userOpenId);
}

export async function createPaymentSubmission(payment: InsertPaymentSubmission) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(paymentSubmissions).values(payment);
  return result;
}

export async function listApiCredentials() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: apiCredentials.id,
    provider: apiCredentials.provider,
    label: apiCredentials.label,
    lastFour: apiCredentials.lastFour,
    createdAt: apiCredentials.createdAt,
    updatedAt: apiCredentials.updatedAt,
  }).from(apiCredentials).orderBy(desc(apiCredentials.updatedAt));
}

export async function saveApiCredential(input: { id?: number; provider: string; label: string; secret: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available.");
  const trimmedSecret = input.secret.trim();
  if (!trimmedSecret) throw new Error("API Key cannot be empty.");
  const encrypted = encryptSecret(trimmedSecret);
  const values: InsertApiCredential = {
    provider: input.provider.trim(),
    label: input.label.trim(),
    ciphertext: encrypted.ciphertext,
    iv: encrypted.iv,
    authTag: encrypted.authTag,
    lastFour: secretLast4(trimmedSecret),
  };
  if (input.id) {
    await db.update(apiCredentials).set({ ...values, updatedAt: new Date() }).where(eq(apiCredentials.id, input.id));
    return input.id;
  }
  const result = await db.insert(apiCredentials).values(values);
  return Number(result[0].insertId);
}

export async function deleteApiCredential(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available.");
  await db.delete(apiCredentials).where(eq(apiCredentials.id, id));
  return { deleted: true };
}

/** Internal-only accessor for server integrations. Never return this from tRPC. */
export async function getApiCredentialSecret(provider: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(apiCredentials).where(eq(apiCredentials.provider, provider)).limit(1);
  const row = result[0];
  return row ? decryptSecret({ ciphertext: row.ciphertext, iv: row.iv, authTag: row.authTag }) : undefined;
}
