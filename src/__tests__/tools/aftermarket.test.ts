import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../client.js", async () => {
  const actual = await vi.importActual<typeof import("../../client.js")>("../../client.js");
  return {
    dynadotRequest: vi.fn().mockResolvedValue({ success: true }),
    toPunycode: actual.toPunycode,
  };
});

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

  it("dynadot_add_backorder_request", async () => {
    await findTool("dynadot_add_backorder_request").handler({ domainName: "x.com" });
    expect(mockRequest).toHaveBeenCalledWith("add_backorder_request", {
      domain: "x.com",
      currency: undefined,
      coupon: undefined,
    });
  });

  it("dynadot_delete_backorder_request", async () => {
    await findTool("dynadot_delete_backorder_request").handler({ domainName: "x.com" });
    expect(mockRequest).toHaveBeenCalledWith("delete_backorder_request", { domain: "x.com" });
  });

  it("dynadot_backorder_request_list", async () => {
    await findTool("dynadot_backorder_request_list").handler({ pageIndex: 0, countPerPage: 10 });
    expect(mockRequest).toHaveBeenCalledWith("backorder_request_list", { page_index: 0, count_per_page: 10 });
  });

  it("dynadot_get_open_auctions", async () => {
    await findTool("dynadot_get_open_auctions").handler({ pageIndex: 0, countPerPage: 100 });
    expect(mockRequest).toHaveBeenCalledWith("get_open_auctions", { page_index: 0, count_per_page: 100 });
  });

  it("dynadot_get_closed_auctions", async () => {
    await findTool("dynadot_get_closed_auctions").handler({ pageIndex: 0, countPerPage: 100 });
    expect(mockRequest).toHaveBeenCalledWith("get_closed_auctions", { page_index: 0, count_per_page: 100 });
  });

  it("dynadot_get_auction_details", async () => {
    await findTool("dynadot_get_auction_details").handler({ auctionId: 5 });
    expect(mockRequest).toHaveBeenCalledWith("get_auction_details", { auction_id: 5 });
  });

  it("dynadot_get_auction_bids", async () => {
    await findTool("dynadot_get_auction_bids").handler({ auctionId: 5 });
    expect(mockRequest).toHaveBeenCalledWith("get_auction_bids", { auction_id: 5 });
  });

  it("dynadot_place_auction_bid", async () => {
    await findTool("dynadot_place_auction_bid").handler({ auctionId: 5, bidAmount: 100 });
    expect(mockRequest).toHaveBeenCalledWith("place_auction_bid", { auction_id: 5, bid_amount: 100 });
  });

  it("dynadot_get_open_backorder_auctions", async () => {
    await findTool("dynadot_get_open_backorder_auctions").handler({ pageIndex: 0, countPerPage: 100 });
    expect(mockRequest).toHaveBeenCalledWith("get_open_backorder_auctions", {
      page_index: 0,
      count_per_page: 100,
    });
  });

  it("dynadot_get_closed_backorder_auctions", async () => {
    await findTool("dynadot_get_closed_backorder_auctions").handler({ pageIndex: 0, countPerPage: 100 });
    expect(mockRequest).toHaveBeenCalledWith("get_closed_backorder_auctions", {
      page_index: 0,
      count_per_page: 100,
    });
  });

  it("dynadot_get_backorder_auction_details", async () => {
    await findTool("dynadot_get_backorder_auction_details").handler({ auctionId: 5 });
    expect(mockRequest).toHaveBeenCalledWith("get_backorder_auction_details", { auction_id: 5 });
  });

  it("dynadot_place_backorder_auction_bid", async () => {
    await findTool("dynadot_place_backorder_auction_bid").handler({ auctionId: 5, bidAmount: 100 });
    expect(mockRequest).toHaveBeenCalledWith("place_backorder_auction_bid", { auction_id: 5, bid_amount: 100 });
  });

  it("dynadot_get_expired_closeout_domains", async () => {
    await findTool("dynadot_get_expired_closeout_domains").handler({ pageIndex: 0, countPerPage: 100 });
    expect(mockRequest).toHaveBeenCalledWith("get_expired_closeout_domains", {
      page_index: 0,
      count_per_page: 100,
    });
  });

  it("dynadot_buy_expired_closeout_domain", async () => {
    await findTool("dynadot_buy_expired_closeout_domain").handler({ domainName: "x.com" });
    expect(mockRequest).toHaveBeenCalledWith("buy_expired_closeout_domain", {
      domain: "x.com",
      currency: undefined,
      coupon: undefined,
    });
  });

  it("dynadot_get_listings", async () => {
    await findTool("dynadot_get_listings").handler({ pageIndex: 0, countPerPage: 5000 });
    expect(mockRequest).toHaveBeenCalledWith("get_listings", { page_index: 0, count_per_page: 5000 });
  });

  it("dynadot_get_listing_item uses listing_id (not domain)", async () => {
    await findTool("dynadot_get_listing_item").handler({ listingId: 12345 });
    expect(mockRequest).toHaveBeenCalledWith("get_listing_item", { listing_id: 12345 });
  });

  it("dynadot_buy_it_now", async () => {
    await findTool("dynadot_buy_it_now").handler({ listingId: 12345 });
    expect(mockRequest).toHaveBeenCalledWith("buy_it_now", {
      listing_id: 12345,
      currency: undefined,
      coupon: undefined,
    });
  });

  it("dynadot_set_for_sale", async () => {
    await findTool("dynadot_set_for_sale").handler({ domainName: "x.com", price: 1000 });
    expect(mockRequest).toHaveBeenCalledWith("set_for_sale", {
      domain: "x.com",
      price: 1000,
      currency: undefined,
    });
  });

  it("dynadot_download_all_listings", async () => {
    await findTool("dynadot_download_all_listings").handler({});
    expect(mockRequest).toHaveBeenCalledWith("download_all_listings");
  });

  it("dynadot_set_afternic_confirm_action", async () => {
    await findTool("dynadot_set_afternic_confirm_action").handler({ actionId: 5, action: "approve" });
    expect(mockRequest).toHaveBeenCalledWith("set_afternic_confirm_action", { action_id: 5, action: "approve" });
  });

  it("dynadot_set_sedo_confirm_action", async () => {
    await findTool("dynadot_set_sedo_confirm_action").handler({ actionId: 5, action: "approve" });
    expect(mockRequest).toHaveBeenCalledWith("set_sedo_confirm_action", { action_id: 5, action: "approve" });
  });
});
