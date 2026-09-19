import { TRPCError } from "@trpc/server";
import type { Subscription, User } from "../drizzle/schema";
import { getSubscriptionByOpenId } from "./db";
import { FREE_PLAN_ID, getPlan, PUBLIC_FREE_ACCESS, type Plan } from "../shared/plans";

type AccessUser = Pick<User, "openId" | "role"> | null | undefined;

export async function resolveAccess(user: AccessUser): Promise<{ plan: Plan; isAdmin: boolean; source: "admin" | "subscription" | "free"; subscription?: Subscription }> {
  if (!user) throw new TRPCError({ code: "UNAUTHORIZED", message: "برای استفاده از FEZI AI ابتدا وارد حساب شوید." });
  if (user.role === "admin") return { plan: getPlan("sovereign"), isAdmin: true, source: "admin", subscription: undefined };
  const subscription = await getSubscriptionByOpenId(user.openId);
  const active = subscription?.status === "active" && (subscription.isLifetime === 1 || !subscription.expiresAt || subscription.expiresAt.getTime() > Date.now());
  return active
    ? { plan: getPlan(subscription?.planId), isAdmin: false, source: "subscription", subscription }
    : { plan: getPlan(FREE_PLAN_ID), isAdmin: false, source: "free", subscription };
}

export function canAccessAgent(plan: Plan, agentId: string) {
  return plan.agents.includes(agentId);
}

export async function assertAgentAccess(user: AccessUser, agentId: string) {
  const access = await resolveAccess(user);
  if (!access.isAdmin && access.source === "free" && !PUBLIC_FREE_ACCESS) {
    throw new TRPCError({ code: "FORBIDDEN", message: "استفاده از FEZI AI در مرحلهٔ ساخت فقط برای Admin فعال است. برای دسترسی عمومی، اشتراک تهیه کنید." });
  }
  if (!canAccessAgent(access.plan, agentId)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `Agent «${agentId}» در پلن «${access.plan.nameFa}» فعال نیست. برای ادامه، پلن خود را ارتقا دهید.`,
    });
  }
  return access;
}

export async function assertPaidAccess(user: AccessUser) {
  const access = await resolveAccess(user);
  if (!access.isAdmin && access.source !== "subscription") {
    throw new TRPCError({ code: "FORBIDDEN", message: "این قابلیت در پلن رایگان قفل است. برای ادامه، اشتراک تهیه کنید." });
  }
  return access;
}
