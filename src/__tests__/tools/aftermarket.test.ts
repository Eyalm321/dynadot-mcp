import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../client.js", () => ({
  dynadotRequest: vi.fn().mockResolvedValue({ success: true }),
}));

import { dynadotRequest } from "../../client.js";
import { aftermarketTools } from "../../tools/aftermarket.js";

const mockRequest = vi.mocked(dynadotRequest);

function findTool(name: string) {
  const tool = aftermarketTools.find((t: any) => t.name === name);
  if (!tool) throw new Error(`Tool not found: ${name}`);
  return tool as any;
}

describe("aftermarketTools", () => {
  beforeEach(() => {
    mockRequest.mockClear();
  });

  it("dynadot_set_for_sale PUTs listing", async () => {
    await findTool("dynadot_set_for_sale").handler({ domainName: "example.com", price: 1000 });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/aftermarket/example.com/list", {
      price: 1000,
      platform: undefined,
    });
  });

  it("dynadot_set_other_platform_confirm_action POSTs confirmation", async () => {
    await findTool("dynadot_set_other_platform_confirm_action").handler({
      domainName: "example.com",
      action: "approve",
      token: "xyz",
    });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/aftermarket/example.com/confirm", {
      action: "approve",
      token: "xyz",
    });
  });

  it("dynadot_get_listing_item GETs listing", async () => {
    await findTool("dynadot_get_listing_item").handler({ domainName: "example.com" });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/aftermarket/example.com/listing");
  });

  it("dynadot_buy_it_now POSTs price", async () => {
    await findTool("dynadot_buy_it_now").handler({ domainName: "example.com", price: 500 });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/aftermarket/example.com/buy-now", { price: 500 });
  });

  it("dynadot_buy_expired_closeout_domain POSTs", async () => {
    await findTool("dynadot_buy_expired_closeout_domain").handler({ domainName: "example.com", price: 30 });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/aftermarket/expired-closeout/buy", {
      domainName: "example.com",
      price: 30,
    });
  });

  it("dynadot_add_backorder_request POSTs backorder", async () => {
    await findTool("dynadot_add_backorder_request").handler({ domainName: "example.com", backorderPrice: 80 });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/aftermarket/backorder", {
      domainName: "example.com",
      backorderPrice: 80,
    });
  });

  it("dynadot_delete_backorder_request DELETEs", async () => {
    await findTool("dynadot_delete_backorder_request").handler({ backorderId: 99 });
    expect(mockRequest).toHaveBeenCalledWith("DELETE", "/aftermarket/backorder/99");
  });

  it("dynadot_get_closed_auctions GETs", async () => {
    await findTool("dynadot_get_closed_auctions").handler({ limit: 10, offset: 0, status: "won" });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/aftermarket/auctions/closed", undefined, {
      limit: 10,
      offset: 0,
      status: "won",
    });
  });

  it("dynadot_get_auction_details GETs", async () => {
    await findTool("dynadot_get_auction_details").handler({ auctionId: 5 });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/aftermarket/auctions/5");
  });

  it("dynadot_get_whois_stats GETs", async () => {
    await findTool("dynadot_get_whois_stats").handler({ domainName: "example.com" });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/aftermarket/example.com/whois-stats");
  });

  it("dynadot_backorder_request_list GETs", async () => {
    await findTool("dynadot_backorder_request_list").handler({ limit: 10, offset: 0 });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/aftermarket/backorders", undefined, {
      limit: 10,
      offset: 0,
    });
  });

  it("dynadot_place_auction_bid POSTs bid", async () => {
    await findTool("dynadot_place_auction_bid").handler({ auctionId: 5, bidAmount: 200 });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/aftermarket/auctions/5/bid", { bidAmount: 200 });
  });

  it("dynadot_get_auction_bids GETs paginated", async () => {
    await findTool("dynadot_get_auction_bids").handler({ auctionId: 5, limit: 10, offset: 0 });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/aftermarket/auctions/5/bids", undefined, {
      limit: 10,
      offset: 0,
    });
  });

  it("dynadot_set_auction_installment_plan POSTs", async () => {
    await findTool("dynadot_set_auction_installment_plan").handler({
      auctionId: 5,
      planType: "12mo",
      paymentTerms: "monthly",
    });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/aftermarket/auctions/5/installment", {
      planType: "12mo",
      paymentTerms: "monthly",
    });
  });

  it("dynadot_get_auction_installment_plan GETs", async () => {
    await findTool("dynadot_get_auction_installment_plan").handler({ auctionId: 5 });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/aftermarket/auctions/5/installment");
  });

  it("dynadot_get_open_auctions GETs", async () => {
    await findTool("dynadot_get_open_auctions").handler({ limit: 10, offset: 0, category: "premium" });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/aftermarket/auctions/open", undefined, {
      limit: 10,
      offset: 0,
      category: "premium",
    });
  });

  it("dynadot_create_express_pay_link POSTs", async () => {
    await findTool("dynadot_create_express_pay_link").handler({ amount: 100, description: "test", expiryDays: 7 });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/aftermarket/express-pay", {
      amount: 100,
      description: "test",
      expiryDays: 7,
    });
  });

  it("dynadot_get_express_pay_link GETs", async () => {
    await findTool("dynadot_get_express_pay_link").handler({ linkId: "abc" });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/aftermarket/express-pay/abc");
  });

  it("dynadot_list_express_pay_link GETs paginated", async () => {
    await findTool("dynadot_list_express_pay_link").handler({ limit: 10, offset: 0 });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/aftermarket/express-pay", undefined, {
      limit: 10,
      offset: 0,
    });
  });

  it("dynadot_delete_express_pay_link DELETEs", async () => {
    await findTool("dynadot_delete_express_pay_link").handler({ linkId: "abc" });
    expect(mockRequest).toHaveBeenCalledWith("DELETE", "/aftermarket/express-pay/abc");
  });

  it("dynadot_get_listings GETs", async () => {
    await findTool("dynadot_get_listings").handler({ limit: 10, offset: 0, status: "active" });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/aftermarket/listings", undefined, {
      limit: 10,
      offset: 0,
      status: "active",
    });
  });

  it("dynadot_get_expired_closeout_domains GETs", async () => {
    await findTool("dynadot_get_expired_closeout_domains").handler({ limit: 10, offset: 0, tld: "com" });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/aftermarket/expired-closeout", undefined, {
      limit: 10,
      offset: 0,
      tld: "com",
    });
  });

  it("dynadot_listing_on_afternic POSTs", async () => {
    await findTool("dynadot_listing_on_afternic").handler({ domainName: "example.com", price: 999 });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/aftermarket/example.com/list-afternic", {
      price: 999,
      notes: undefined,
    });
  });

  it("dynadot_listing_on_sedo POSTs", async () => {
    await findTool("dynadot_listing_on_sedo").handler({ domainName: "example.com", price: 999, notes: "premium" });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/aftermarket/example.com/list-sedo", {
      price: 999,
      notes: "premium",
    });
  });
});
