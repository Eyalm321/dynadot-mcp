import { z } from "zod";
import { dynadotRequest, dynadotRestRequest, toPunycode } from "../client.js";

export const domainTools = [
  {
    name: "dynadot_search",
    description: "Check availability of one or more domains. Pass a single name or up to 100. IDN names are auto-punycoded.",
    inputSchema: z.object({
      domains: z.array(z.string()).describe("Up to 100 domain names to check"),
      showPrice: z.boolean().optional().describe("Include pricing information"),
      currency: z.string().optional().describe("Currency code (e.g. 'USD')"),
    }),
    handler: async (args: { domains: string[]; showPrice?: boolean; currency?: string }) => {
      return dynadotRequest("search", {
        domain: args.domains.map(toPunycode),
        show_price: args.showPrice ? 1 : undefined,
        currency: args.currency,
      });
    },
  },
  {
    name: "dynadot_bulk_search",
    description: "Alias for `dynadot_search`. Check availability for multiple domains in one call (up to 100).",
    inputSchema: z.object({
      domainNames: z.array(z.string()).describe("Domain names to check"),
      showPrice: z.boolean().optional(),
      currency: z.string().optional(),
    }),
    handler: async (args: { domainNames: string[]; showPrice?: boolean; currency?: string }) => {
      return dynadotRequest("search", {
        domain: args.domainNames.map(toPunycode),
        show_price: args.showPrice ? 1 : undefined,
        currency: args.currency,
      });
    },
  },
  {
    name: "dynadot_register",
    description: "Register a new domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain to register (IDN auto-punycoded)"),
      duration: z.number().describe("Registration period in years"),
      currency: z.string().optional().describe("Currency code"),
      premium: z.boolean().optional().describe("Allow premium pricing"),
      coupon: z.string().optional().describe("Coupon code"),
      registrantContact: z.number().optional().describe("Registrant contact ID"),
      adminContact: z.number().optional().describe("Admin contact ID"),
      technicalContact: z.number().optional().describe("Technical contact ID"),
      billingContact: z.number().optional().describe("Billing contact ID"),
    }),
    handler: async (args: {
      domainName: string;
      duration: number;
      currency?: string;
      premium?: boolean;
      coupon?: string;
      registrantContact?: number;
      adminContact?: number;
      technicalContact?: number;
      billingContact?: number;
    }) => {
      return dynadotRequest("register", {
        domain: toPunycode(args.domainName),
        duration: args.duration,
        currency: args.currency,
        premium: args.premium ? 1 : undefined,
        coupon: args.coupon,
        registrant_contact: args.registrantContact,
        admin_contact: args.adminContact,
        technical_contact: args.technicalContact,
        billing_contact: args.billingContact,
      });
    },
  },
  {
    name: "dynadot_bulk_register",
    description: "Register multiple domains at once (up to 100).",
    inputSchema: z.object({
      domains: z.array(z.string()).describe("Domains to register"),
      premium: z.boolean().optional(),
      currency: z.string().optional(),
      coupon: z.string().optional(),
    }),
    handler: async (args: { domains: string[]; premium?: boolean; currency?: string; coupon?: string }) => {
      return dynadotRequest("bulk_register", {
        domain: args.domains.map(toPunycode),
        premium: args.premium ? 1 : undefined,
        currency: args.currency,
        coupon: args.coupon,
      });
    },
  },
  {
    name: "dynadot_renew",
    description: "Renew a domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain to renew"),
      duration: z.number().describe("Renewal period in years"),
      currency: z.string().optional(),
      year: z.number().optional().describe("Optional explicit expiration year"),
      priceCheck: z.number().optional().describe("Maximum price you'll pay (server fails the call if actual exceeds this)"),
      coupon: z.string().optional(),
      noRenewIfLateRenewFeeNeeded: z.boolean().optional().describe("Cancel renewal if a late-renewal fee would be charged"),
    }),
    handler: async (args: {
      domainName: string;
      duration: number;
      currency?: string;
      year?: number;
      priceCheck?: number;
      coupon?: string;
      noRenewIfLateRenewFeeNeeded?: boolean;
    }) => {
      return dynadotRequest("renew", {
        domain: toPunycode(args.domainName),
        duration: args.duration,
        currency: args.currency,
        year: args.year,
        price_check: args.priceCheck,
        coupon: args.coupon,
        no_renew_if_late_renew_fee_needed: args.noRenewIfLateRenewFeeNeeded ? 1 : undefined,
      });
    },
  },
  {
    name: "dynadot_transfer_in",
    description: "Initiate a transfer of a domain to Dynadot.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain to transfer in"),
      authCode: z.string().describe("Authorization (EPP) code"),
      currency: z.string().optional(),
      premium: z.boolean().optional(),
      privacy: z.boolean().optional(),
      nameservers: z.array(z.string()).optional().describe("Nameservers to set on transfer"),
      coupon: z.string().optional(),
      registrantContact: z.number().optional(),
      adminContact: z.number().optional(),
      technicalContact: z.number().optional(),
      billingContact: z.number().optional(),
    }),
    handler: async (args: {
      domainName: string;
      authCode: string;
      currency?: string;
      premium?: boolean;
      privacy?: boolean;
      nameservers?: string[];
      coupon?: string;
      registrantContact?: number;
      adminContact?: number;
      technicalContact?: number;
      billingContact?: number;
    }) => {
      return dynadotRequest("transfer", {
        domain: toPunycode(args.domainName),
        auth: args.authCode,
        currency: args.currency,
        premium: args.premium ? 1 : undefined,
        privacy: args.privacy ? 1 : undefined,
        name_servers: args.nameservers,
        coupon: args.coupon,
        registrant_contact: args.registrantContact,
        admin_contact: args.adminContact,
        technical_contact: args.technicalContact,
        billing_contact: args.billingContact,
      });
    },
  },
  {
    name: "dynadot_grace_delete",
    description: "Delete a domain that's still in the grace period (full refund).",
    inputSchema: z.object({
      domainName: z.string(),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("delete", { domain: toPunycode(args.domainName) });
    },
  },
  {
    name: "dynadot_restore",
    description: "Restore a deleted domain (within the redemption period).",
    inputSchema: z.object({
      domainName: z.string(),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("restore", { domain: toPunycode(args.domainName) });
    },
  },
  {
    name: "dynadot_domain_list",
    description: "List domains in the account.",
    inputSchema: z.object({
      countPerPage: z.number().optional().describe("Items per page"),
      pageIndex: z.number().optional().describe("Zero-indexed page number"),
      sort: z.string().optional().describe("Sort key"),
      customerId: z.number().optional(),
    }),
    handler: async (args: { countPerPage?: number; pageIndex?: number; sort?: string; customerId?: number }) => {
      return dynadotRequest("list_domain", {
        count_per_page: args.countPerPage,
        page_index: args.pageIndex,
        sort: args.sort,
        customer_id: args.customerId,
      });
    },
  },
  {
    name: "dynadot_domain_info",
    description: "Get full details for a single domain (settings, contacts, status). IDN auto-punycoded.",
    inputSchema: z.object({
      domainName: z.string(),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("domain_info", { domain: toPunycode(args.domainName) });
    },
  },
  {
    name: "dynadot_domain_appraisal",
    description: "Get an estimated value (appraisal) for a domain. Uses the v2 RESTful endpoint — Dynadot's v3 query-string API does not expose appraisal as a command.",
    inputSchema: z.object({
      domainName: z.string(),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRestRequest("GET", `/domains/${encodeURIComponent(toPunycode(args.domainName))}/appraisal`);
    },
  },
  {
    name: "dynadot_lock_domain",
    description: "Lock a domain (prevent transfers).",
    inputSchema: z.object({
      domainName: z.string(),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("lock_domain", { domain: toPunycode(args.domainName) });
    },
  },
  {
    name: "dynadot_set_domain_forwarding",
    description: "Set HTTP forwarding for a domain.",
    inputSchema: z.object({
      domainName: z.string(),
      forwardUrl: z.string().describe("Destination URL"),
      isTemp: z.boolean().optional().describe("True for 302 (temporary), false/omit for 301"),
    }),
    handler: async (args: { domainName: string; forwardUrl: string; isTemp?: boolean }) => {
      return dynadotRequest("set_forwarding", {
        domain: toPunycode(args.domainName),
        forward_url: args.forwardUrl,
        is_temp: args.isTemp ? 1 : undefined,
      });
    },
  },
  {
    name: "dynadot_set_stealth_forwarding",
    description: "Set stealth (frame) forwarding for a domain.",
    inputSchema: z.object({
      domainName: z.string(),
      stealthUrl: z.string().describe("Destination URL"),
      stealthTitle: z.string().optional().describe("Page title shown in browser tab"),
    }),
    handler: async (args: { domainName: string; stealthUrl: string; stealthTitle?: string }) => {
      return dynadotRequest("set_stealth", {
        domain: toPunycode(args.domainName),
        stealth_url: args.stealthUrl,
        stealth_title: args.stealthTitle,
      });
    },
  },
  {
    name: "dynadot_set_email_forwarding",
    description: "Configure email forwarding rules for a domain.",
    inputSchema: z.object({
      domainName: z.string(),
      forwardType: z.string().describe("Forward type (e.g. 'username_to_email', 'mx_only')"),
      forwards: z.array(z.object({
        username: z.string().describe("Local part / alias (without @domain)"),
        existEmail: z.string().describe("Destination email address"),
      })).optional().describe("Up to 10 username→email forwards"),
      mxHosts: z.array(z.object({
        host: z.string().describe("MX hostname"),
        distance: z.number().describe("MX distance/preference"),
      })).optional().describe("Up to 3 MX hosts"),
    }),
    handler: async (args: {
      domainName: string;
      forwardType: string;
      forwards?: Array<{ username: string; existEmail: string }>;
      mxHosts?: Array<{ host: string; distance: number }>;
    }) => {
      const params: Record<string, any> = {
        domain: toPunycode(args.domainName),
        forward_type: args.forwardType,
      };
      args.forwards?.forEach((f, i) => {
        params[`username${i}`] = f.username;
        params[`exist_email${i}`] = f.existEmail;
      });
      args.mxHosts?.forEach((m, i) => {
        params[`mx_host${i}`] = m.host;
        params[`mx_distance${i}`] = m.distance;
      });
      return dynadotRequest("set_email_forward", params);
    },
  },
  {
    name: "dynadot_set_renew_option",
    description: "Set the renewal option (donot, auto, reset) for a domain.",
    inputSchema: z.object({
      domainName: z.string(),
      renewOption: z.enum(["donot", "auto", "reset"]).describe("Renewal option"),
    }),
    handler: async (args: { domainName: string; renewOption: string }) => {
      return dynadotRequest("set_renew_option", {
        domain: toPunycode(args.domainName),
        renew_option: args.renewOption,
      });
    },
  },
  {
    name: "dynadot_set_whois",
    description: "Set the WHOIS contacts (registrant/admin/tech/billing) for a domain.",
    inputSchema: z.object({
      domainName: z.string(),
      registrantContact: z.number().describe("Registrant contact ID"),
      adminContact: z.number().describe("Admin contact ID"),
      technicalContact: z.number().describe("Technical contact ID"),
      billingContact: z.number().describe("Billing contact ID"),
    }),
    handler: async (args: {
      domainName: string;
      registrantContact: number;
      adminContact: number;
      technicalContact: number;
      billingContact: number;
    }) => {
      return dynadotRequest("set_whois", {
        domain: toPunycode(args.domainName),
        registrant_contact: args.registrantContact,
        admin_contact: args.adminContact,
        technical_contact: args.technicalContact,
        billing_contact: args.billingContact,
      });
    },
  },
  {
    name: "dynadot_set_folder",
    description: "Move a domain to a folder.",
    inputSchema: z.object({
      domainName: z.string(),
      folder: z.string().describe("Folder name"),
      folderId: z.number().optional().describe("Folder ID (alternative to name)"),
    }),
    handler: async (args: { domainName: string; folder: string; folderId?: number }) => {
      return dynadotRequest("set_folder", {
        domain: toPunycode(args.domainName),
        folder: args.folder,
        folder_id: args.folderId,
      });
    },
  },
  {
    name: "dynadot_get_transfer_status",
    description: "Check the status of a transfer order.",
    inputSchema: z.object({
      domainName: z.string(),
      transferType: z.enum(["away", "in"]).describe("Transfer direction"),
    }),
    handler: async (args: { domainName: string; transferType: string }) => {
      return dynadotRequest("get_transfer_status", {
        domain: toPunycode(args.domainName),
        transfer_type: args.transferType,
      });
    },
  },
  {
    name: "dynadot_get_transfer_auth_code",
    description: "Retrieve the authorization (EPP) code for transferring a domain away.",
    inputSchema: z.object({
      domainName: z.string(),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("get_transfer_auth_code", { domain: toPunycode(args.domainName) });
    },
  },
  {
    name: "dynadot_set_ns",
    description: "Set the nameservers for a domain (up to 13).",
    inputSchema: z.object({
      domainName: z.string(),
      nameservers: z.array(z.string()).describe("Nameserver hostnames (max 13)"),
    }),
    handler: async (args: { domainName: string; nameservers: string[] }) => {
      const params: Record<string, any> = { domain: toPunycode(args.domainName) };
      args.nameservers.forEach((ns, i) => { params[`ns${i}`] = ns; });
      return dynadotRequest("set_ns", params);
    },
  },
  {
    name: "dynadot_set_hosting",
    description: "Set the hosting type for a domain.",
    inputSchema: z.object({
      domainName: z.string(),
      hostingType: z.string().describe("Hosting type identifier"),
      mobileViewOn: z.boolean().optional(),
    }),
    handler: async (args: { domainName: string; hostingType: string; mobileViewOn?: boolean }) => {
      return dynadotRequest("set_hosting", {
        domain: toPunycode(args.domainName),
        hosting_type: args.hostingType,
        mobile_view_on: args.mobileViewOn ? 1 : undefined,
      });
    },
  },
  {
    name: "dynadot_set_parking",
    description: "Set parking for a domain.",
    inputSchema: z.object({
      domainName: z.string(),
      withAds: z.boolean().optional().describe("Enable monetization with ads"),
    }),
    handler: async (args: { domainName: string; withAds?: boolean }) => {
      return dynadotRequest("set_parking", {
        domain: toPunycode(args.domainName),
        with_ads: args.withAds ? 1 : undefined,
      });
    },
  },
  {
    name: "dynadot_set_privacy",
    description: "Configure WHOIS privacy for a domain.",
    inputSchema: z.object({
      domainName: z.string(),
      option: z.string().describe("Privacy option (full, partial, off)"),
      whoisPrivacyOption: z.string().describe("WHOIS privacy detail option"),
    }),
    handler: async (args: { domainName: string; option: string; whoisPrivacyOption: string }) => {
      return dynadotRequest("set_privacy", {
        domain: toPunycode(args.domainName),
        option: args.option,
        whois_privacy_option: args.whoisPrivacyOption,
      });
    },
  },
  {
    name: "dynadot_get_dnssec",
    description: "Get DNSSEC records for a domain.",
    inputSchema: z.object({
      domainName: z.string(),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("get_dnssec", { domain_name: toPunycode(args.domainName) });
    },
  },
  {
    name: "dynadot_set_dnssec",
    description: "Set a DNSSEC DS record for a domain.",
    inputSchema: z.object({
      domainName: z.string(),
      keyTag: z.number(),
      digestType: z.number(),
      digest: z.string(),
      algorithm: z.number(),
    }),
    handler: async (args: { domainName: string; keyTag: number; digestType: number; digest: string; algorithm: number }) => {
      return dynadotRequest("set_dnssec", {
        domain_name: toPunycode(args.domainName),
        key_tag: args.keyTag,
        digest_type: args.digestType,
        digest: args.digest,
        algorithm: args.algorithm,
      });
    },
  },
  {
    name: "dynadot_clear_dnssec",
    description: "Remove all DNSSEC records from a domain.",
    inputSchema: z.object({
      domainName: z.string(),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("clear_dnssec", { domain_name: toPunycode(args.domainName) });
    },
  },
  {
    name: "dynadot_clear_domain_setting",
    description: "Reset a specific domain setting (forwarding, dns, ns, etc.) to defaults.",
    inputSchema: z.object({
      domainName: z.string(),
      service: z.string().describe("Setting to clear (e.g. 'forwarding', 'dns', 'ns', 'email_forward')"),
    }),
    handler: async (args: { domainName: string; service: string }) => {
      return dynadotRequest("set_clear_domain_setting", {
        domain: toPunycode(args.domainName),
        service: args.service,
      });
    },
  },
  {
    name: "dynadot_get_domain_push_request",
    description: "List pending domain push requests for a domain.",
    inputSchema: z.object({
      domainName: z.string(),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("get_domain_push_request", { domain: toPunycode(args.domainName) });
    },
  },
  {
    name: "dynadot_set_domain_push_request",
    description: "Push a domain to another Dynadot account.",
    inputSchema: z.object({
      domainName: z.string(),
      receiverPushUsername: z.string().describe("Recipient's Dynadot username"),
      receiverEmail: z.string().optional().describe("Recipient's account email"),
      currency: z.string().optional(),
      unlockDomainForPush: z.boolean().optional(),
    }),
    handler: async (args: {
      domainName: string;
      receiverPushUsername: string;
      receiverEmail?: string;
      currency?: string;
      unlockDomainForPush?: boolean;
    }) => {
      return dynadotRequest("set_domain_push_request", {
        domain: toPunycode(args.domainName),
        receiver_push_username: args.receiverPushUsername,
        receiver_email: args.receiverEmail,
        currency: args.currency,
        unlock_domain_for_push: args.unlockDomainForPush ? 1 : undefined,
      });
    },
  },
  {
    name: "dynadot_get_dns",
    description: "Retrieve current DNS records for a domain.",
    inputSchema: z.object({
      domainName: z.string(),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("get_dns", { domain: toPunycode(args.domainName) });
    },
  },
  {
    name: "dynadot_set_dns",
    description: "Replace DNS records for a domain. Pass main records (root domain) and/or subdomain records.",
    inputSchema: z.object({
      domainName: z.string(),
      mainRecords: z.array(z.object({
        type: z.string().describe("Record type (a, aaaa, cname, mx, txt, srv, etc.)"),
        value: z.string().describe("Record value"),
        valueX: z.string().optional().describe("Auxiliary value (e.g. MX priority)"),
      })).optional().describe("Up to 20 root-level records"),
      subRecords: z.array(z.object({
        subdomain: z.string().describe("Subdomain (host) without the root"),
        type: z.string(),
        value: z.string(),
        valueX: z.string().optional(),
      })).optional().describe("Up to 100 subdomain records"),
      ttl: z.number().optional().describe("TTL in seconds"),
      addToCurrent: z.boolean().optional().describe("Append to existing records instead of replacing"),
    }),
    handler: async (args: {
      domainName: string;
      mainRecords?: Array<{ type: string; value: string; valueX?: string }>;
      subRecords?: Array<{ subdomain: string; type: string; value: string; valueX?: string }>;
      ttl?: number;
      addToCurrent?: boolean;
    }) => {
      const params: Record<string, any> = { domain: toPunycode(args.domainName) };
      args.mainRecords?.forEach((r, i) => {
        params[`main_record_type${i}`] = r.type;
        params[`main_record${i}`] = r.value;
        if (r.valueX !== undefined) params[`main_recordx${i}`] = r.valueX;
      });
      args.subRecords?.forEach((r, i) => {
        params[`subdomain${i}`] = r.subdomain;
        params[`sub_record_type${i}`] = r.type;
        params[`sub_record${i}`] = r.value;
        if (r.valueX !== undefined) params[`sub_recordx${i}`] = r.valueX;
      });
      if (args.ttl !== undefined) params.ttl = args.ttl;
      if (args.addToCurrent) params.add_dns_to_current_setting = 1;
      return dynadotRequest("set_dns2", params);
    },
  },
  {
    name: "dynadot_set_note",
    description: "Add or update a private note on a domain.",
    inputSchema: z.object({
      domainName: z.string(),
      note: z.string(),
    }),
    handler: async (args: { domainName: string; note: string }) => {
      return dynadotRequest("set_note", { domain: toPunycode(args.domainName), note: args.note });
    },
  },
];
