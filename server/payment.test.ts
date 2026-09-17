import { describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  createPaymentSubmission: vi.fn().mockResolvedValue(undefined),
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const context: TrpcContext = {
  user: null,
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
};

describe("payment.submitTxid", () => {
  it("accepts a valid payment reference and leaves it pending for verification", async () => {
    const result = await appRouter.createCaller(context).payment.submitTxid({
      amount: "100",
      currency: "USDT TRC20",
      txid: "txid-example-12345678",
    });

    expect(result).toEqual({ submitted: true, status: "pending" });
  });

  it("rejects an invalid amount", async () => {
    await expect(appRouter.createCaller(context).payment.submitTxid({
      amount: "not-a-number",
      currency: "BTC",
      txid: "txid-example-12345678",
    })).rejects.toThrow();
  });

  it("requires a memo for TON and XRP payments", async () => {
    const caller = appRouter.createCaller(context);

    await expect(caller.payment.submitTxid({
      amount: "20",
      currency: "TON",
      txid: "ton-txid-example-123",
    })).rejects.toThrow("Memo");

    await expect(caller.payment.submitTxid({
      amount: "20",
      currency: "Xrp",
      txid: "xrp-txid-example-123",
    })).rejects.toThrow("Memo");
  });
});
