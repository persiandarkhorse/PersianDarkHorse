import { describe, expect, it, vi } from "vitest";

const { getSubscriptionByOpenIdMock } = vi.hoisted(() => ({ getSubscriptionByOpenIdMock: vi.fn() }));
vi.mock("./db", () => ({ getSubscriptionByOpenId: getSubscriptionByOpenIdMock }));

import { assertAgentAccess, assertPaidAccess, resolveAccess } from "./access";

const user = { openId: "user-1", role: "user" as const };
const admin = { openId: "admin-1", role: "admin" as const };

describe("subscription access", () => {
  it("gives administrators unrestricted test access without a subscription row", async () => {
    const access = await resolveAccess(admin);
    expect(access.isAdmin).toBe(true);
    expect(access.plan.id).toBe("sovereign");
    await expect(assertAgentAccess(admin, "negar")).resolves.toBeTruthy();
    await expect(assertPaidAccess(admin)).resolves.toBeTruthy();
    expect(getSubscriptionByOpenIdMock).not.toHaveBeenCalled();
  });

  it("blocks an unsubscribed user while the public launch is private", async () => {
    getSubscriptionByOpenIdMock.mockResolvedValue(undefined);
    const access = await resolveAccess(user);
    expect(access.plan.id).toBe("horse_rider");
    await expect(assertAgentAccess(user, "manika")).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(assertAgentAccess(user, "arvin")).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(assertPaidAccess(user)).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("honors an active paid plan for premium agents", async () => {
    getSubscriptionByOpenIdMock.mockResolvedValue({ status: "active", planId: "swift_rider", isLifetime: 0, expiresAt: new Date(Date.now() + 86_400_000) });
    await expect(assertAgentAccess(user, "negar")).resolves.toBeTruthy();
    await expect(assertPaidAccess(user)).resolves.toBeTruthy();
  });
});
