import { z } from "zod";
import { dynadotRequest, toPunycode } from "../client.js";

export const aftermarketTools = [
  // Backorders
  {
    name: "dynadot_add_backorder_request",
    description: "Place a backorder on an expiring domain.",
    inputSchema: z.object({
      domainName: z.string(),
      currency: z.string().optional(),
      coupon: z.string().optional(),
    }),
    handler: async (args: { domainName: string; currency?: string; coupon?: string }) => {
      return dynadotRequest("add_backorder_request", {
        domain: toPunycode(args.domainName),
        currency: args.currency,
        coupon: args.coupon,
      });
    },
  },
  {
    name: "dynadot_delete_backorder_request",
    description: "Cancel a backorder request.",
    inputSchema: z.object({
      domainName: z.string(),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("delete_backorder_request", { domain: toPunycode(args.domainName) });
    },
  },
  {
    name: "dynadot_backorder_request_list",
    description: "List active backorders.",
    inputSchema: z.object({
      pageIndex: z.number().optional(),
      countPerPage: z.number().optional(),
    }),
    handler: async (args: { pageIndex?: number; countPerPage?: number }) => {
      return dynadotRequest("backorder_request_list", {
        page_index: args.pageIndex,
        count_per_page: args.countPerPage,
      });
    },
  },

  // Expired auctions (require auction-API permission from Dynadot CS)
  {
    name: "dynadot_get_open_auctions",
    description: "List active expired-domain auctions. NOTE: requires Dynadot to grant auction-API access on your account; otherwise returns 403.",
    inputSchema: z.object({
      pageIndex: z.number().optional(),
      countPerPage: z.number().optional(),
    }),
    handler: async (args: { pageIndex?: number; countPerPage?: number }) => {
      return dynadotRequest("get_open_auctions", {
        page_index: args.pageIndex,
        count_per_page: args.countPerPage,
      });
    },
  },
  {
    name: "dynadot_get_closed_auctions",
    description: "List completed auctions. NOTE: requires auction-API access.",
    inputSchema: z.object({
      pageIndex: z.number().optional(),
      countPerPage: z.number().optional(),
    }),
    handler: async (args: { pageIndex?: number; countPerPage?: number }) => {
      return dynadotRequest("get_closed_auctions", {
        page_index: args.pageIndex,
        count_per_page: args.countPerPage,
      });
    },
  },
  {
    name: "dynadot_get_auction_details",
    description: "Get details for a single auction. NOTE: requires auction-API access.",
    inputSchema: z.object({
      auctionId: z.union([z.number(), z.string()]),
    }),
    handler: async (args: { auctionId: number | string }) => {
      return dynadotRequest("get_auction_details", { auction_id: args.auctionId });
    },
  },
  {
    name: "dynadot_get_auction_bids",
    description: "Get the bid history for an auction. NOTE: requires auction-API access.",
    inputSchema: z.object({
      auctionId: z.union([z.number(), z.string()]),
    }),
    handler: async (args: { auctionId: number | string }) => {
      return dynadotRequest("get_auction_bids", { auction_id: args.auctionId });
    },
  },
  {
    name: "dynadot_place_auction_bid",
    description: "Place a bid on an expired-domain auction. NOTE: requires auction-API access.",
    inputSchema: z.object({
      auctionId: z.union([z.number(), z.string()]),
      bidAmount: z.number(),
    }),
    handler: async (args: { auctionId: number | string; bidAmount: number }) => {
      return dynadotRequest("place_auction_bid", {
        auction_id: args.auctionId,
        bid_amount: args.bidAmount,
      });
    },
  },

  // Backorder auctions
  {
    name: "dynadot_get_open_backorder_auctions",
    description: "List active backorder auctions. NOTE: requires auction-API access.",
    inputSchema: z.object({
      pageIndex: z.number().optional(),
      countPerPage: z.number().optional(),
    }),
    handler: async (args: { pageIndex?: number; countPerPage?: number }) => {
      return dynadotRequest("get_open_backorder_auctions", {
        page_index: args.pageIndex,
        count_per_page: args.countPerPage,
      });
    },
  },
  {
    name: "dynadot_get_closed_backorder_auctions",
    description: "List completed backorder auctions.",
    inputSchema: z.object({
      pageIndex: z.number().optional(),
      countPerPage: z.number().optional(),
    }),
    handler: async (args: { pageIndex?: number; countPerPage?: number }) => {
      return dynadotRequest("get_closed_backorder_auctions", {
        page_index: args.pageIndex,
        count_per_page: args.countPerPage,
      });
    },
  },
  {
    name: "dynadot_get_backorder_auction_details",
    description: "Get details for a backorder auction.",
    inputSchema: z.object({
      auctionId: z.union([z.number(), z.string()]),
    }),
    handler: async (args: { auctionId: number | string }) => {
      return dynadotRequest("get_backorder_auction_details", { auction_id: args.auctionId });
    },
  },
  {
    name: "dynadot_place_backorder_auction_bid",
    description: "Place a bid on a backorder auction.",
    inputSchema: z.object({
      auctionId: z.union([z.number(), z.string()]),
      bidAmount: z.number(),
    }),
    handler: async (args: { auctionId: number | string; bidAmount: number }) => {
      return dynadotRequest("place_backorder_auction_bid", {
        auction_id: args.auctionId,
        bid_amount: args.bidAmount,
      });
    },
  },

  // Closeout
  {
    name: "dynadot_get_expired_closeout_domains",
    description: "List expired closeout domains available for purchase (paginated).",
    inputSchema: z.object({
      pageIndex: z.number().optional(),
      countPerPage: z.number().optional(),
    }),
    handler: async (args: { pageIndex?: number; countPerPage?: number }) => {
      return dynadotRequest("get_expired_closeout_domains", {
        page_index: args.pageIndex,
        count_per_page: args.countPerPage,
      });
    },
  },
  {
    name: "dynadot_buy_expired_closeout_domain",
    description: "Buy an expired closeout domain.",
    inputSchema: z.object({
      domainName: z.string(),
      currency: z.string().optional(),
      coupon: z.string().optional(),
    }),
    handler: async (args: { domainName: string; currency?: string; coupon?: string }) => {
      return dynadotRequest("buy_expired_closeout_domain", {
        domain: toPunycode(args.domainName),
        currency: args.currency,
        coupon: args.coupon,
      });
    },
  },

  // Marketplace listings (public catalog browse)
  {
    name: "dynadot_get_listings",
    description: "Browse the public Dynadot marketplace listings (paginated). Returns ALL listings, not your own — for your own use the dashboard. Required: countPerPage and pageIndex.",
    inputSchema: z.object({
      countPerPage: z.number().describe("Items per page (required)"),
      pageIndex: z.number().describe("Zero-indexed page number (required)"),
    }),
    handler: async (args: { countPerPage: number; pageIndex: number }) => {
      return dynadotRequest("get_listings", {
        count_per_page: args.countPerPage,
        page_index: args.pageIndex,
      });
    },
  },
  {
    name: "dynadot_get_listing_item",
    description: "Get details for a single marketplace listing (by listing ID, not domain name).",
    inputSchema: z.object({
      listingId: z.union([z.number(), z.string()]).describe("Listing ID from get_listings"),
    }),
    handler: async (args: { listingId: number | string }) => {
      return dynadotRequest("get_listing_item", { listing_id: args.listingId });
    },
  },
  {
    name: "dynadot_buy_it_now",
    description: "Purchase a marketplace listing at its Buy-It-Now price.",
    inputSchema: z.object({
      listingId: z.union([z.number(), z.string()]),
      currency: z.string().optional(),
      coupon: z.string().optional(),
    }),
    handler: async (args: { listingId: number | string; currency?: string; coupon?: string }) => {
      return dynadotRequest("buy_it_now", {
        listing_id: args.listingId,
        currency: args.currency,
        coupon: args.coupon,
      });
    },
  },
  {
    name: "dynadot_set_for_sale",
    description: "List a domain you own for sale on the Dynadot marketplace.",
    inputSchema: z.object({
      domainName: z.string(),
      price: z.number(),
      currency: z.string().optional(),
    }),
    handler: async (args: { domainName: string; price: number; currency?: string }) => {
      return dynadotRequest("set_for_sale", {
        domain: toPunycode(args.domainName),
        price: args.price,
        currency: args.currency,
      });
    },
  },
  {
    name: "dynadot_download_all_listings",
    description: "Export all marketplace listings as a downloadable file.",
    inputSchema: z.object({}),
    handler: async () => {
      return dynadotRequest("download_all_listings");
    },
  },

  // Confirmations for external marketplaces
  {
    name: "dynadot_set_afternic_confirm_action",
    description: "Confirm an Afternic sale action.",
    inputSchema: z.object({
      actionId: z.union([z.number(), z.string()]),
      action: z.string().describe("Action to confirm"),
    }),
    handler: async (args: { actionId: number | string; action: string }) => {
      return dynadotRequest("set_afternic_confirm_action", {
        action_id: args.actionId,
        action: args.action,
      });
    },
  },
  {
    name: "dynadot_set_sedo_confirm_action",
    description: "Confirm a Sedo marketplace action.",
    inputSchema: z.object({
      actionId: z.union([z.number(), z.string()]),
      action: z.string(),
    }),
    handler: async (args: { actionId: number | string; action: string }) => {
      return dynadotRequest("set_sedo_confirm_action", {
        action_id: args.actionId,
        action: args.action,
      });
    },
  },
];
