import { describe, expect, it } from "vitest";

import {
  buildDatabasePropertiesFromArtifact,
  buildSourceTextFromArtifacts,
} from "./document-artifact-utils";

describe("document-artifact-utils", () => {
  it("keeps dense AP8 text patterns in source payload", () => {
    const sourceText = buildSourceTextFromArtifacts([
      {
        text: "10 3RDTW5BD1 SET 756,000 小計618,530 （一）SCADA站內工程 光纖熔接",
      },
    ], "fallback");

    expect(sourceText).toContain("3RDTW5BD1");
    expect(sourceText).toContain("小計618,530");
    expect(sourceText).toContain("光纖熔接");
  });

  it("derives database properties from nested structured artifacts", () => {
    const properties = buildDatabasePropertiesFromArtifact({
      vendor: { name: "ABB", email: "vendor@example.com" },
      summary: {
        amount: 123,
        approved: true,
        deliveryDate: "2025-04-30",
      },
    });

    expect(properties.map((property) => property.name)).toEqual(
      expect.arrayContaining([
        "Vendor Name",
        "Vendor Email",
        "Summary Amount",
        "Summary Approved",
        "Summary DeliveryDate",
      ]),
    );
    expect(properties.find((property) => property.name === "Vendor Email")?.type).toBe("email");
    expect(properties.find((property) => property.name === "Summary Amount")?.type).toBe("number");
    expect(properties.find((property) => property.name === "Summary Approved")?.type).toBe("checkbox");
  });
});
