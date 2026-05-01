import { z } from "zod";
import { dynadotRequest } from "../client.js";

const contactBaseFields = {
  firstName: z.string().optional().describe("First name"),
  lastName: z.string().optional().describe("Last name"),
  organization: z.string().optional().describe("Organization name"),
  email: z.string().optional().describe("Email address"),
  phone: z.string().optional().describe("Phone number (e.g. +1.5551234567)"),
  fax: z.string().optional().describe("Fax number"),
  address1: z.string().optional().describe("Street address line 1"),
  address2: z.string().optional().describe("Street address line 2"),
  city: z.string().optional().describe("City"),
  state: z.string().optional().describe("State / province"),
  zipcode: z.string().optional().describe("Postal / ZIP code"),
  country: z.string().optional().describe("Country code (ISO 3166-1 alpha-2)"),
};

export const contactTools = [
  {
    name: "dynadot_get_contact",
    description: "Retrieve a single contact record by ID.",
    inputSchema: z.object({
      contactId: z.number().describe("Contact ID"),
    }),
    handler: async (args: { contactId: number }) => {
      return dynadotRequest("GET", `/contacts/${args.contactId}`);
    },
  },
  {
    name: "dynadot_contact_list",
    description: "List all contacts in the account.",
    inputSchema: z.object({
      limit: z.number().optional().describe("Page size"),
      offset: z.number().optional().describe("Page offset"),
    }),
    handler: async (args: { limit?: number; offset?: number }) => {
      return dynadotRequest("GET", "/contacts", undefined, {
        limit: args.limit,
        offset: args.offset,
      });
    },
  },
  {
    name: "dynadot_contact_create",
    description: "Create a new contact record (registrant/admin/tech/billing).",
    inputSchema: z.object({
      ...contactBaseFields,
      type: z.string().optional().describe("Contact type (registrant, admin, tech, billing)"),
    }),
    handler: async (args: Record<string, unknown>) => {
      return dynadotRequest("POST", "/contacts", args);
    },
  },
  {
    name: "dynadot_contact_update",
    description: "Update an existing contact record.",
    inputSchema: z.object({
      contactId: z.number().describe("Contact ID"),
      ...contactBaseFields,
    }),
    handler: async (args: { contactId: number } & Record<string, unknown>) => {
      const { contactId, ...rest } = args;
      return dynadotRequest("PUT", `/contacts/${contactId}`, rest);
    },
  },
  {
    name: "dynadot_contact_delete",
    description: "Delete a contact record.",
    inputSchema: z.object({
      contactId: z.number().describe("Contact ID"),
    }),
    handler: async (args: { contactId: number }) => {
      return dynadotRequest("DELETE", `/contacts/${args.contactId}`);
    },
  },
  {
    name: "dynadot_create_cn_audit",
    description: "Initiate a Chinese (.CN) domain audit for a contact.",
    inputSchema: z.object({
      contactId: z.number().describe("Contact ID"),
    }),
    handler: async (args: { contactId: number }) => {
      return dynadotRequest("POST", `/contacts/${args.contactId}/cn-audit`);
    },
  },
  {
    name: "dynadot_get_cn_audit_status",
    description: "Check the verification status of a CN audit.",
    inputSchema: z.object({
      contactId: z.number().describe("Contact ID"),
    }),
    handler: async (args: { contactId: number }) => {
      return dynadotRequest("GET", `/contacts/${args.contactId}/cn-audit-status`);
    },
  },
  {
    name: "dynadot_set_contact_aero_setting",
    description: "Set .AERO-specific contact data (Aero business ID).",
    inputSchema: z.object({
      contactId: z.number().describe("Contact ID"),
      aeroBusId: z.string().describe(".AERO business ID"),
    }),
    handler: async (args: { contactId: number; aeroBusId: string }) => {
      return dynadotRequest("PUT", `/contacts/${args.contactId}/aero-setting`, { aeroBusId: args.aeroBusId });
    },
  },
  {
    name: "dynadot_set_contact_ca_setting",
    description: "Set .CA-specific contact data (CIRA legal type, etc.).",
    inputSchema: z.object({
      contactId: z.number().describe("Contact ID"),
      caBusNum: z.string().optional().describe("CA business number"),
      caLawType: z.string().optional().describe("CIRA legal type code"),
      caLawEntity: z.string().optional().describe("CIRA legal entity"),
    }),
    handler: async (args: { contactId: number; caBusNum?: string; caLawType?: string; caLawEntity?: string }) => {
      const { contactId, ...rest } = args;
      return dynadotRequest("PUT", `/contacts/${contactId}/ca-setting`, rest);
    },
  },
  {
    name: "dynadot_set_contact_eu_setting",
    description: "Set .EU-specific contact data (residence country).",
    inputSchema: z.object({
      contactId: z.number().describe("Contact ID"),
      euCountry: z.string().describe(".EU country of residence"),
    }),
    handler: async (args: { contactId: number; euCountry: string }) => {
      return dynadotRequest("PUT", `/contacts/${args.contactId}/eu-setting`, { euCountry: args.euCountry });
    },
  },
  {
    name: "dynadot_set_contact_fr_setting",
    description: "Set .FR-specific contact data (SIREN number).",
    inputSchema: z.object({
      contactId: z.number().describe("Contact ID"),
      frSirenNum: z.string().describe(".FR SIREN number"),
    }),
    handler: async (args: { contactId: number; frSirenNum: string }) => {
      return dynadotRequest("PUT", `/contacts/${args.contactId}/fr-setting`, { frSirenNum: args.frSirenNum });
    },
  },
  {
    name: "dynadot_set_contact_hk_setting",
    description: "Set .HK-specific contact data (document type and number).",
    inputSchema: z.object({
      contactId: z.number().describe("Contact ID"),
      hkDocType: z.string().describe(".HK document type"),
      hkDocNum: z.string().describe(".HK document number"),
    }),
    handler: async (args: { contactId: number; hkDocType: string; hkDocNum: string }) => {
      return dynadotRequest("PUT", `/contacts/${args.contactId}/hk-setting`, {
        hkDocType: args.hkDocType,
        hkDocNum: args.hkDocNum,
      });
    },
  },
  {
    name: "dynadot_set_contact_ie_setting",
    description: "Set .IE-specific contact data (company number).",
    inputSchema: z.object({
      contactId: z.number().describe("Contact ID"),
      ieCompanyNum: z.string().describe(".IE company number"),
    }),
    handler: async (args: { contactId: number; ieCompanyNum: string }) => {
      return dynadotRequest("PUT", `/contacts/${args.contactId}/ie-setting`, { ieCompanyNum: args.ieCompanyNum });
    },
  },
  {
    name: "dynadot_set_contact_it_setting",
    description: "Set .IT-specific contact data (entity type, NDAC, SDI).",
    inputSchema: z.object({
      contactId: z.number().describe("Contact ID"),
      itEntityType: z.string().describe(".IT entity type code"),
      itNdac: z.string().optional().describe(".IT NDAC code"),
      itSdi: z.string().optional().describe(".IT SDI code"),
    }),
    handler: async (args: { contactId: number; itEntityType: string; itNdac?: string; itSdi?: string }) => {
      const { contactId, ...rest } = args;
      return dynadotRequest("PUT", `/contacts/${contactId}/it-setting`, rest);
    },
  },
  {
    name: "dynadot_set_contact_lt_setting",
    description: "Set .LT-specific contact data (personal code).",
    inputSchema: z.object({
      contactId: z.number().describe("Contact ID"),
      ltPersonCode: z.string().describe(".LT personal code"),
    }),
    handler: async (args: { contactId: number; ltPersonCode: string }) => {
      return dynadotRequest("PUT", `/contacts/${args.contactId}/lt-setting`, { ltPersonCode: args.ltPersonCode });
    },
  },
  {
    name: "dynadot_set_contact_lv_setting",
    description: "Set .LV-specific contact data (registration number).",
    inputSchema: z.object({
      contactId: z.number().describe("Contact ID"),
      lvRegNum: z.string().describe(".LV registration number"),
    }),
    handler: async (args: { contactId: number; lvRegNum: string }) => {
      return dynadotRequest("PUT", `/contacts/${args.contactId}/lv-setting`, { lvRegNum: args.lvRegNum });
    },
  },
  {
    name: "dynadot_set_contact_music_setting",
    description: "Set .MUSIC-specific contact data (artist name and gramophone).",
    inputSchema: z.object({
      contactId: z.number().describe("Contact ID"),
      musicArtistName: z.string().optional().describe(".MUSIC artist name"),
      musicGramophone: z.string().optional().describe(".MUSIC gramophone identifier"),
    }),
    handler: async (args: { contactId: number; musicArtistName?: string; musicGramophone?: string }) => {
      const { contactId, ...rest } = args;
      return dynadotRequest("PUT", `/contacts/${contactId}/music-setting`, rest);
    },
  },
  {
    name: "dynadot_set_contact_no_setting",
    description: "Set .NO-specific contact data (organization number).",
    inputSchema: z.object({
      contactId: z.number().describe("Contact ID"),
      noOrgNum: z.string().describe(".NO organization number"),
    }),
    handler: async (args: { contactId: number; noOrgNum: string }) => {
      return dynadotRequest("PUT", `/contacts/${args.contactId}/no-setting`, { noOrgNum: args.noOrgNum });
    },
  },
  {
    name: "dynadot_set_contact_pt_setting",
    description: "Set .PT-specific contact data (individual number, citizenship).",
    inputSchema: z.object({
      contactId: z.number().describe("Contact ID"),
      ptIndNum: z.string().optional().describe(".PT individual number"),
      ptCitizenship: z.string().optional().describe(".PT citizenship"),
    }),
    handler: async (args: { contactId: number; ptIndNum?: string; ptCitizenship?: string }) => {
      const { contactId, ...rest } = args;
      return dynadotRequest("PUT", `/contacts/${contactId}/pt-setting`, rest);
    },
  },
  {
    name: "dynadot_set_contact_ro_setting",
    description: "Set .RO-specific contact data (identifier).",
    inputSchema: z.object({
      contactId: z.number().describe("Contact ID"),
      roIdentifier: z.string().describe(".RO identifier"),
    }),
    handler: async (args: { contactId: number; roIdentifier: string }) => {
      return dynadotRequest("PUT", `/contacts/${args.contactId}/ro-setting`, { roIdentifier: args.roIdentifier });
    },
  },
  {
    name: "dynadot_set_contact_us_setting",
    description: "Set .US-specific contact data (nexus category and purpose).",
    inputSchema: z.object({
      contactId: z.number().describe("Contact ID"),
      usNexusCategory: z.string().describe(".US nexus category"),
      usPurpose: z.string().describe(".US purpose"),
    }),
    handler: async (args: { contactId: number; usNexusCategory: string; usPurpose: string }) => {
      return dynadotRequest("PUT", `/contacts/${args.contactId}/us-setting`, {
        usNexusCategory: args.usNexusCategory,
        usPurpose: args.usPurpose,
      });
    },
  },
];
