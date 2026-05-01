import { z } from "zod";
import { dynadotRequest } from "../client.js";

export const aftermarketTools = [
  {
    name: "dynadot_set_for_sale",
    description: "List a domain for sale on the marketplace.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      price: z.number().describe("Sale price"),
      platform: z.string().optional().describe("Marketplace platform (dynadot, afternic, sedo)"),
    }),
    handler: async (args: { domainName: string; price: number; platform?: string }) => {
      return dynadotRequest("PUT", `/aftermarket/${encodeURIComponent(args.domainName)}/list`, {
        price: args.price,
        platform: args.platform,
      });
    },
  },
  {
    name: "dynadot_set_other_platform_confirm_action",
    description: "Confirm an action on an external marketplace listing.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      action: z.string().describe("Action to confirm"),
      token: z.string().describe("Confirmation token"),
    }),
    handler: async (args: { domainName: string; action: string; token: string }) => {
      return dynadotRequest("POST", `/aftermarket/${encodeURIComponent(args.domainName)}/confirm`, {
        action: args.action,
        token: args.token,
      });
    },
  },
  {
    name: "dynadot_get_listing_item",
    description: "Get details for a single domain marketplace listing.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("GET", `/aftermarket/${encodeURIComponent(args.domainName)}/listing`);
    },
  },
  {
    name: "dynadot_buy_it_now",
    description: "Buy a domain at its fixed Buy-It-Now price.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      price: z.number().describe("Listing price to confirm purchase at"),
    }),
    handler: async (args: { domainName: string; price: number }) => {
      return dynadotRequest("POST", `/aftermarket/${encodeURIComponent(args.domainName)}/buy-now`, { price: args.price });
    },
  },
  {
    name: "dynadot_buy_expired_closeout_domain",
    description: "Buy an expired closeout domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      price: z.number().describe("Closeout price"),
    }),
    handler: async (args: { domainName: string; price: number }) => {
      return dynadotRequest("POST", "/aftermarket/expired-closeout/buy", {
        domainName: args.domainName,
        price: args.price,
      });
    },
  },
  {
    name: "dynadot_add_backorder_request",
    description: "Place a backorder on an expiring domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name to backorder"),
      backorderPrice: z.number().describe("Maximum backorder price"),
    }),
    handler: async (args: { domainName: string; backorderPrice: number }) => {
      return dynadotRequest("POST", "/aftermarket/backorder", {
        domainName: args.domainName,
        backorderPrice: args.backorderPrice,
      });
    },
  },
  {
    name: "dynadot_delete_backorder_request",
    description: "Cancel a backorder request.",
    inputSchema: z.object({
      backorderId: z.number().describe("Backorder ID"),
    }),
    handler: async (args: { backorderId: number }) => {
      return dynadotRequest("DELETE", `/aftermarket/backorder/${args.backorderId}`);
    },
  },
  {
    name: "dynadot_get_closed_auctions",
    description: "List completed (closed) auctions.",
    inputSchema: z.object({
      limit: z.number().optional().describe("Page size"),
      offset: z.number().optional().describe("Page offset"),
      status: z.string().optional().describe("Filter by auction status"),
    }),
    handler: async (args: { limit?: number; offset?: number; status?: string }) => {
      return dynadotRequest("GET", "/aftermarket/auctions/closed", undefined, {
        limit: args.limit,
        offset: args.offset,
        status: args.status,
      });
    },
  },
  {
    name: "dynadot_get_auction_details",
    description: "Get details for a single auction.",
    inputSchema: z.object({
      auctionId: z.number().describe("Auction ID"),
    }),
    handler: async (args: { auctionId: number }) => {
      return dynadotRequest("GET", `/aftermarket/auctions/${args.auctionId}`);
    },
  },
  {
    name: "dynadot_get_whois_stats",
    description: "Get WHOIS lookup statistics for a domain (used to gauge buyer interest).",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("GET", `/aftermarket/${encodeURIComponent(args.domainName)}/whois-stats`);
    },
  },
  {
    name: "dynadot_backorder_request_list",
    description: "List active backorder requests.",
    inputSchema: z.object({
      limit: z.number().optional().describe("Page size"),
      offset: z.number().optional().describe("Page offset"),
    }),
    handler: async (args: { limit?: number; offset?: number }) => {
      return dynadotRequest("GET", "/aftermarket/backorders", undefined, { limit: args.limit, offset: args.offset });
    },
  },
  {
    name: "dynadot_place_auction_bid",
    description: "Submit a bid in an auction.",
    inputSchema: z.object({
      auctionId: z.number().describe("Auction ID"),
      bidAmount: z.number().describe("Bid amount"),
    }),
    handler: async (args: { auctionId: number; bidAmount: number }) => {
      return dynadotRequest("POST", `/aftermarket/auctions/${args.auctionId}/bid`, { bidAmount: args.bidAmount });
    },
  },
  {
    name: "dynadot_get_auction_bids",
    description: "Retrieve the bid history for an auction.",
    inputSchema: z.object({
      auctionId: z.number().describe("Auction ID"),
      limit: z.number().optional().describe("Page size"),
      offset: z.number().optional().describe("Page offset"),
    }),
    handler: async (args: { auctionId: number; limit?: number; offset?: number }) => {
      return dynadotRequest("GET", `/aftermarket/auctions/${args.auctionId}/bids`, undefined, {
        limit: args.limit,
        offset: args.offset,
      });
    },
  },
  {
    name: "dynadot_set_auction_installment_plan",
    description: "Set up an installment payment plan for a won auction.",
    inputSchema: z.object({
      auctionId: z.number().describe("Auction ID"),
      planType: z.string().describe("Installment plan type"),
      paymentTerms: z.string().describe("Payment terms"),
    }),
    handler: async (args: { auctionId: number; planType: string; paymentTerms: string }) => {
      return dynadotRequest("POST", `/aftermarket/auctions/${args.auctionId}/installment`, {
        planType: args.planType,
        paymentTerms: args.paymentTerms,
      });
    },
  },
  {
    name: "dynadot_get_auction_installment_plan",
    description: "Get the installment plan for a won auction.",
    inputSchema: z.object({
      auctionId: z.number().describe("Auction ID"),
    }),
    handler: async (args: { auctionId: number }) => {
      return dynadotRequest("GET", `/aftermarket/auctions/${args.auctionId}/installment`);
    },
  },
  {
    name: "dynadot_get_open_auctions",
    description: "List currently open (active) auctions.",
    inputSchema: z.object({
      limit: z.number().optional().describe("Page size"),
      offset: z.number().optional().describe("Page offset"),
      category: z.string().optional().describe("Filter by category"),
    }),
    handler: async (args: { limit?: number; offset?: number; category?: string }) => {
      return dynadotRequest("GET", "/aftermarket/auctions/open", undefined, {
        limit: args.limit,
        offset: args.offset,
        category: args.category,
      });
    },
  },
  {
    name: "dynadot_create_express_pay_link",
    description: "Generate an express-pay payment link.",
    inputSchema: z.object({
      amount: z.number().describe("Amount"),
      description: z.string().describe("Description shown to the payer"),
      expiryDays: z.number().optional().describe("Days until the link expires"),
    }),
    handler: async (args: { amount: number; description: string; expiryDays?: number }) => {
      return dynadotRequest("POST", "/aftermarket/express-pay", {
        amount: args.amount,
        description: args.description,
        expiryDays: args.expiryDays,
      });
    },
  },
  {
    name: "dynadot_get_express_pay_link",
    description: "Retrieve an express-pay link by ID.",
    inputSchema: z.object({
      linkId: z.string().describe("Express-pay link ID"),
    }),
    handler: async (args: { linkId: string }) => {
      return dynadotRequest("GET", `/aftermarket/express-pay/${args.linkId}`);
    },
  },
  {
    name: "dynadot_list_express_pay_link",
    description: "List express-pay links.",
    inputSchema: z.object({
      limit: z.number().optional().describe("Page size"),
      offset: z.number().optional().describe("Page offset"),
    }),
    handler: async (args: { limit?: number; offset?: number }) => {
      return dynadotRequest("GET", "/aftermarket/express-pay", undefined, { limit: args.limit, offset: args.offset });
    },
  },
  {
    name: "dynadot_delete_express_pay_link",
    description: "Delete an express-pay link.",
    inputSchema: z.object({
      linkId: z.string().describe("Express-pay link ID"),
    }),
    handler: async (args: { linkId: string }) => {
      return dynadotRequest("DELETE", `/aftermarket/express-pay/${args.linkId}`);
    },
  },
  {
    name: "dynadot_get_listings",
    description: "Get the user's domain marketplace listings.",
    inputSchema: z.object({
      limit: z.number().optional().describe("Page size"),
      offset: z.number().optional().describe("Page offset"),
      status: z.string().optional().describe("Filter by listing status"),
    }),
    handler: async (args: { limit?: number; offset?: number; status?: string }) => {
      return dynadotRequest("GET", "/aftermarket/listings", undefined, {
        limit: args.limit,
        offset: args.offset,
        status: args.status,
      });
    },
  },
  {
    name: "dynadot_get_expired_closeout_domains",
    description: "List expired closeout domains available for purchase.",
    inputSchema: z.object({
      limit: z.number().optional().describe("Page size"),
      offset: z.number().optional().describe("Page offset"),
      tld: z.string().optional().describe("Filter by TLD"),
    }),
    handler: async (args: { limit?: number; offset?: number; tld?: string }) => {
      return dynadotRequest("GET", "/aftermarket/expired-closeout", undefined, {
        limit: args.limit,
        offset: args.offset,
        tld: args.tld,
      });
    },
  },
  {
    name: "dynadot_listing_on_afternic",
    description: "List a domain on the Afternic marketplace.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      price: z.number().describe("Listing price"),
      notes: z.string().optional().describe("Listing notes"),
    }),
    handler: async (args: { domainName: string; price: number; notes?: string }) => {
      return dynadotRequest("POST", `/aftermarket/${encodeURIComponent(args.domainName)}/list-afternic`, {
        price: args.price,
        notes: args.notes,
      });
    },
  },
  {
    name: "dynadot_listing_on_sedo",
    description: "List a domain on the Sedo marketplace.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      price: z.number().describe("Listing price"),
      notes: z.string().optional().describe("Listing notes"),
    }),
    handler: async (args: { domainName: string; price: number; notes?: string }) => {
      return dynadotRequest("POST", `/aftermarket/${encodeURIComponent(args.domainName)}/list-sedo`, {
        price: args.price,
        notes: args.notes,
      });
    },
  },
];
