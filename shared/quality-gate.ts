export const QUALITY_DIMENSIONS = [
  {
    key: "backend",
    label: "Backend",
    requiredEvidence: ["schema", "typed-procedures", "tests", "build"],
  },
  {
    key: "frontend",
    label: "Frontend",
    requiredEvidence: [
      "desktop-capture",
      "mobile-capture",
      "route-404",
      "accessibility",
    ],
  },
  {
    key: "utility",
    label: "Utility",
    requiredEvidence: [
      "project-flow",
      "stem-flow",
      "delivery-flow",
      "audit-flow",
    ],
  },
  {
    key: "relevance",
    label: "Relevance",
    requiredEvidence: [
      "exact-presets",
      "exact-scenes",
      "plugin-sources",
      "fl-studio-validation",
    ],
  },
  {
    key: "potential",
    label: "Potential",
    requiredEvidence: [
      "typed-domain",
      "extension-contracts",
      "observability",
      "load-test",
    ],
  },
  {
    key: "identity",
    label: "Identity",
    requiredEvidence: [
      "duck-zion-theme",
      "technical-type",
      "motion",
      "responsive",
    ],
  },
] as const;

export type QualityDimensionKey = (typeof QUALITY_DIMENSIONS)[number]["key"];

export function scoreDimension(
  completedEvidence: Set<string>,
  requiredEvidence: readonly string[]
) {
  const passed = requiredEvidence.filter(item =>
    completedEvidence.has(item)
  ).length;
  return Math.floor((passed / requiredEvidence.length) * 10);
}

export function evaluateQualityGate(completedEvidence: Set<string>) {
  const dimensions = QUALITY_DIMENSIONS.map(dimension => {
    const score = scoreDimension(completedEvidence, dimension.requiredEvidence);
    return {
      key: dimension.key,
      label: dimension.label,
      score,
      evidence: `${dimension.requiredEvidence.filter(item => completedEvidence.has(item)).length}/${dimension.requiredEvidence.length} required evidence checks passed.`,
    };
  });
  return {
    status: dimensions.every(item => item.score === 10)
      ? ("open" as const)
      : ("locked" as const),
    publishable: dimensions.every(item => item.score === 10),
    dimensions,
  };
}
