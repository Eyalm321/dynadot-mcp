import { z } from "zod";
import { dynadotRequest } from "../client.js";

const contactDataFields = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  organization: z.string().optional(),
  email: z.string().optional(),
  phoneCc: z.string().optional().describe("Phone country code"),
  phoneNumber: z.string().optional(),
  faxCc: z.string().optional(),
  faxNumber: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipcode: z.string().optional(),
  country: z.string().optional().describe("ISO 3166-1 alpha-2 country code"),
});

type ContactData = z.infer<typeof contactDataFields>;

function flattenContactData(data: ContactData): Record<string, any> {
  return {
    first_name: data.firstName,
    last_name: data.lastName,
    organization: data.organization,
    email: data.email,
    phone_cc: data.phoneCc,
    phone_number: data.phoneNumber,
    fax_cc: data.faxCc,
    fax_number: data.faxNumber,
    address1: data.address1,
    address2: data.address2,
    city: data.city,
    state: data.state,
    zip_code: data.zipcode,
    country: data.country,
  };
}

export const contactTools = [
  {
    name: "dynadot_get_contact",
    description: "Retrieve a single contact record by ID.",
    inputSchema: z.object({
      contactId: z.number(),
    }),
    handler: async (args: { contactId: number }) => {
      return dynadotRequest("get_contact", { contact_id: args.contactId });
    },
  },
  {
    name: "dynadot_contact_list",
    description: "List all contacts in the account (paginated).",
    inputSchema: z.object({
      pageIndex: z.number().optional(),
      countPerPage: z.number().optional(),
    }),
    handler: async (args: { pageIndex?: number; countPerPage?: number }) => {
      return dynadotRequest("contact_list", {
        page_index: args.pageIndex,
        count_per_page: args.countPerPage,
      });
    },
  },
  {
    name: "dynadot_create_contact",
    description: "Create a new contact record.",
    inputSchema: contactDataFields,
    handler: async (args: ContactData) => {
      return dynadotRequest("create_contact", flattenContactData(args));
    },
  },
  {
    name: "dynadot_edit_contact",
    description: "Update an existing contact record.",
    inputSchema: contactDataFields.extend({
      contactId: z.number(),
    }),
    handler: async (args: { contactId: number } & ContactData) => {
      const { contactId, ...rest } = args;
      return dynadotRequest("edit_contact", { contact_id: contactId, ...flattenContactData(rest) });
    },
  },
  {
    name: "dynadot_delete_contact",
    description: "Delete a contact record.",
    inputSchema: z.object({
      contactId: z.number(),
    }),
    handler: async (args: { contactId: number }) => {
      return dynadotRequest("delete_contact", { contact_id: args.contactId });
    },
  },
  {
    name: "dynadot_set_contact_eu_setting",
    description: "Set .EU-specific contact data (residence country).",
    inputSchema: z.object({
      contactId: z.number(),
      euCountry: z.string(),
    }),
    handler: async (args: { contactId: number; euCountry: string }) => {
      return dynadotRequest("set_contact_eu_setting", {
        contact_id: args.contactId,
        eu_country: args.euCountry,
      });
    },
  },
  {
    name: "dynadot_set_contact_lt_setting",
    description: "Set .LT-specific contact data (personal code).",
    inputSchema: z.object({
      contactId: z.number(),
      ltPersonCode: z.string(),
    }),
    handler: async (args: { contactId: number; ltPersonCode: string }) => {
      return dynadotRequest("set_contact_lt_setting", {
        contact_id: args.contactId,
        lt_person_code: args.ltPersonCode,
      });
    },
  },
  {
    name: "dynadot_set_contact_lv_setting",
    description: "Set .LV-specific contact data (registration number).",
    inputSchema: z.object({
      contactId: z.number(),
      lvRegNum: z.string(),
    }),
    handler: async (args: { contactId: number; lvRegNum: string }) => {
      return dynadotRequest("set_contact_lv_setting", {
        contact_id: args.contactId,
        lv_reg_num: args.lvRegNum,
      });
    },
  },
  {
    name: "dynadot_create_cn_audit",
    description: "Initiate a Chinese (.CN) domain audit.",
    inputSchema: z.object({
      domainName: z.string(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      organization: z.string().optional(),
      idType: z.string().optional().describe("ID type"),
      idNumber: z.string().optional(),
    }),
    handler: async (args: { domainName: string; firstName?: string; lastName?: string; organization?: string; idType?: string; idNumber?: string }) => {
      return dynadotRequest("create_cn_audit", {
        domain: args.domainName,
        first_name: args.firstName,
        last_name: args.lastName,
        organization: args.organization,
        id_type: args.idType,
        id_number: args.idNumber,
      });
    },
  },
  {
    name: "dynadot_get_cn_audit_status",
    description: "Check the verification status of a CN audit.",
    inputSchema: z.object({
      domainName: z.string(),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("get_cn_audit_status", { domain: args.domainName });
    },
  },
];
