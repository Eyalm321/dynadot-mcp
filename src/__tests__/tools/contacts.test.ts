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

  it("has no duplicate names", () => {
    const names = contactTools.map((t: any) => t.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("dynadot_get_contact GETs by id", async () => {
    await findTool("dynadot_get_contact").handler({ contactId: 1 });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/contacts/1");
  });

  it("dynadot_contact_list paginates", async () => {
    await findTool("dynadot_contact_list").handler({ limit: 25, offset: 50 });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/contacts", undefined, { limit: 25, offset: 50 });
  });

  it("dynadot_contact_create POSTs full contact", async () => {
    const args = { firstName: "Alice", lastName: "Smith", email: "a@b.com", country: "US", type: "registrant" };
    await findTool("dynadot_contact_create").handler(args);
    expect(mockRequest).toHaveBeenCalledWith("POST", "/contacts", args);
  });

  it("dynadot_contact_update strips contactId from body", async () => {
    await findTool("dynadot_contact_update").handler({ contactId: 5, firstName: "Bob" });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/contacts/5", { firstName: "Bob" });
  });

  it("dynadot_contact_delete DELETEs", async () => {
    await findTool("dynadot_contact_delete").handler({ contactId: 5 });
    expect(mockRequest).toHaveBeenCalledWith("DELETE", "/contacts/5");
  });

  it("dynadot_create_cn_audit POSTs", async () => {
    await findTool("dynadot_create_cn_audit").handler({ contactId: 5 });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/contacts/5/cn-audit");
  });

  it("dynadot_get_cn_audit_status GETs", async () => {
    await findTool("dynadot_get_cn_audit_status").handler({ contactId: 5 });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/contacts/5/cn-audit-status");
  });

  it("dynadot_set_contact_aero_setting PUTs aeroBusId", async () => {
    await findTool("dynadot_set_contact_aero_setting").handler({ contactId: 5, aeroBusId: "AB123" });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/contacts/5/aero-setting", { aeroBusId: "AB123" });
  });

  it("dynadot_set_contact_ca_setting PUTs CA fields", async () => {
    await findTool("dynadot_set_contact_ca_setting").handler({
      contactId: 5,
      caBusNum: "BN123",
      caLawType: "CCT",
      caLawEntity: "CORP",
    });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/contacts/5/ca-setting", {
      caBusNum: "BN123",
      caLawType: "CCT",
      caLawEntity: "CORP",
    });
  });

  it("dynadot_set_contact_eu_setting PUTs euCountry", async () => {
    await findTool("dynadot_set_contact_eu_setting").handler({ contactId: 5, euCountry: "DE" });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/contacts/5/eu-setting", { euCountry: "DE" });
  });

  it("dynadot_set_contact_fr_setting PUTs frSirenNum", async () => {
    await findTool("dynadot_set_contact_fr_setting").handler({ contactId: 5, frSirenNum: "12345" });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/contacts/5/fr-setting", { frSirenNum: "12345" });
  });

  it("dynadot_set_contact_hk_setting PUTs HK doc fields", async () => {
    await findTool("dynadot_set_contact_hk_setting").handler({ contactId: 5, hkDocType: "BR", hkDocNum: "999" });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/contacts/5/hk-setting", {
      hkDocType: "BR",
      hkDocNum: "999",
    });
  });

  it("dynadot_set_contact_ie_setting PUTs ieCompanyNum", async () => {
    await findTool("dynadot_set_contact_ie_setting").handler({ contactId: 5, ieCompanyNum: "IE42" });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/contacts/5/ie-setting", { ieCompanyNum: "IE42" });
  });

  it("dynadot_set_contact_it_setting PUTs IT fields", async () => {
    await findTool("dynadot_set_contact_it_setting").handler({
      contactId: 5,
      itEntityType: "1",
      itNdac: "X",
      itSdi: "Y",
    });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/contacts/5/it-setting", {
      itEntityType: "1",
      itNdac: "X",
      itSdi: "Y",
    });
  });

  it("dynadot_set_contact_lt_setting PUTs ltPersonCode", async () => {
    await findTool("dynadot_set_contact_lt_setting").handler({ contactId: 5, ltPersonCode: "12345" });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/contacts/5/lt-setting", { ltPersonCode: "12345" });
  });

  it("dynadot_set_contact_lv_setting PUTs lvRegNum", async () => {
    await findTool("dynadot_set_contact_lv_setting").handler({ contactId: 5, lvRegNum: "LV1" });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/contacts/5/lv-setting", { lvRegNum: "LV1" });
  });

  it("dynadot_set_contact_music_setting PUTs music fields", async () => {
    await findTool("dynadot_set_contact_music_setting").handler({
      contactId: 5,
      musicArtistName: "Artist",
      musicGramophone: "GR",
    });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/contacts/5/music-setting", {
      musicArtistName: "Artist",
      musicGramophone: "GR",
    });
  });

  it("dynadot_set_contact_no_setting PUTs noOrgNum", async () => {
    await findTool("dynadot_set_contact_no_setting").handler({ contactId: 5, noOrgNum: "NO1" });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/contacts/5/no-setting", { noOrgNum: "NO1" });
  });

  it("dynadot_set_contact_pt_setting PUTs PT fields", async () => {
    await findTool("dynadot_set_contact_pt_setting").handler({
      contactId: 5,
      ptIndNum: "PT1",
      ptCitizenship: "PT",
    });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/contacts/5/pt-setting", {
      ptIndNum: "PT1",
      ptCitizenship: "PT",
    });
  });

  it("dynadot_set_contact_ro_setting PUTs roIdentifier", async () => {
    await findTool("dynadot_set_contact_ro_setting").handler({ contactId: 5, roIdentifier: "RO1" });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/contacts/5/ro-setting", { roIdentifier: "RO1" });
  });

  it("dynadot_set_contact_us_setting PUTs US fields", async () => {
    await findTool("dynadot_set_contact_us_setting").handler({
      contactId: 5,
      usNexusCategory: "C11",
      usPurpose: "P1",
    });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/contacts/5/us-setting", {
      usNexusCategory: "C11",
      usPurpose: "P1",
    });
  });
});
