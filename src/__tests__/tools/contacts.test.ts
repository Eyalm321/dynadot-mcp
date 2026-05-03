import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../client.js", () => ({
  dynadotRequest: vi.fn().mockResolvedValue({ success: true }),
}));

import { dynadotRequest } from "../../client.js";
import { contactTools } from "../../tools/contacts.js";

const mockRequest = vi.mocked(dynadotRequest);

function findTool(name: string) {
  const tool = contactTools.find((t: any) => t.name === name);
  if (!tool) throw new Error(`Tool not found: ${name}`);
  return tool as any;
}

describe("contactTools", () => {
  beforeEach(() => {
    mockRequest.mockClear();
  });

  it("dynadot_get_contact", async () => {
    await findTool("dynadot_get_contact").handler({ contactId: 7 });
    expect(mockRequest).toHaveBeenCalledWith("get_contact", { contact_id: 7 });
  });

  it("dynadot_contact_list", async () => {
    await findTool("dynadot_contact_list").handler({ pageIndex: 0, countPerPage: 50 });
    expect(mockRequest).toHaveBeenCalledWith("contact_list", { page_index: 0, count_per_page: 50 });
  });

  it("dynadot_create_contact maps camelCase to snake_case", async () => {
    await findTool("dynadot_create_contact").handler({
      firstName: "Alice", lastName: "Smith", email: "a@b.com",
      phoneCc: "1", phoneNumber: "5551234567", country: "US", zipcode: "94105",
    });
    expect(mockRequest).toHaveBeenCalledWith("create_contact", expect.objectContaining({
      first_name: "Alice",
      last_name: "Smith",
      email: "a@b.com",
      phone_cc: "1",
      phone_number: "5551234567",
      country: "US",
      zip_code: "94105",
    }));
  });

  it("dynadot_edit_contact", async () => {
    await findTool("dynadot_edit_contact").handler({ contactId: 5, firstName: "Bob" });
    expect(mockRequest).toHaveBeenCalledWith("edit_contact", expect.objectContaining({
      contact_id: 5,
      first_name: "Bob",
    }));
  });

  it("dynadot_delete_contact", async () => {
    await findTool("dynadot_delete_contact").handler({ contactId: 5 });
    expect(mockRequest).toHaveBeenCalledWith("delete_contact", { contact_id: 5 });
  });

  it("dynadot_set_contact_eu_setting", async () => {
    await findTool("dynadot_set_contact_eu_setting").handler({ contactId: 5, euCountry: "DE" });
    expect(mockRequest).toHaveBeenCalledWith("set_contact_eu_setting", { contact_id: 5, eu_country: "DE" });
  });

  it("dynadot_set_contact_lt_setting", async () => {
    await findTool("dynadot_set_contact_lt_setting").handler({ contactId: 5, ltPersonCode: "12345" });
    expect(mockRequest).toHaveBeenCalledWith("set_contact_lt_setting", { contact_id: 5, lt_person_code: "12345" });
  });

  it("dynadot_set_contact_lv_setting", async () => {
    await findTool("dynadot_set_contact_lv_setting").handler({ contactId: 5, lvRegNum: "LV1" });
    expect(mockRequest).toHaveBeenCalledWith("set_contact_lv_setting", { contact_id: 5, lv_reg_num: "LV1" });
  });

  it("dynadot_create_cn_audit", async () => {
    await findTool("dynadot_create_cn_audit").handler({
      domainName: "x.cn",
      firstName: "Li", lastName: "Wei",
      idType: "ID", idNumber: "1234",
    });
    expect(mockRequest).toHaveBeenCalledWith("create_cn_audit", expect.objectContaining({
      domain: "x.cn",
      first_name: "Li",
      last_name: "Wei",
      id_type: "ID",
      id_number: "1234",
    }));
  });

  it("dynadot_get_cn_audit_status", async () => {
    await findTool("dynadot_get_cn_audit_status").handler({ domainName: "x.cn" });
    expect(mockRequest).toHaveBeenCalledWith("get_cn_audit_status", { domain: "x.cn" });
  });
});
