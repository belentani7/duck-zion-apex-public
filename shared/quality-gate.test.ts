import { describe, expect, it } from "vitest";
import { evaluateQualityGate, QUALITY_DIMENSIONS } from "./quality-gate";
import { groupMetricHistory } from "./metric-history";

describe("quality gate evidence", () => {
  it("opens only when every required evidence key is present", () => {
    const allEvidence = new Set(
      QUALITY_DIMENSIONS.flatMap(dimension => dimension.requiredEvidence)
    );
    const result = evaluateQualityGate(allEvidence);
    expect(result.publishable).toBe(true);
    expect(result.status).toBe("open");
    expect(result.dimensions.every(item => item.score === 10)).toBe(true);
  });

  it("locks when one evidence key is missing", () => {
    const result = evaluateQualityGate(new Set(["schema"]));
    expect(result.publishable).toBe(false);
    expect(result.status).toBe("locked");
  });
});

describe("metric history", () => {
  it("groups snapshots by delivery and keeps unlinked metrics separate", () => {
    const groups = groupMetricHistory([
      { id: 1, deliveryId: 4, lufs: "-14", truePeak: "-1", dynamicRange: "8" },
      { id: 2, deliveryId: 4, lufs: "-13", truePeak: "-1", dynamicRange: "7" },
      {
        id: 3,
        deliveryId: null,
        lufs: "-12",
        truePeak: "-1",
        dynamicRange: "6",
      },
    ]);
    expect(groups["4"]).toHaveLength(2);
    expect(groups.unlinked).toHaveLength(1);
  });
});
