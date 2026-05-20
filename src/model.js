import sectors from './data/sectors.json';
import ieaSteps from './data/iea-steps.json';
import benchmarks from './data/ipcc-benchmarks.json';
import severityThresholds from './data/severity-thresholds.json';

export const START_YEAR = 2026;
export const REFERENCE_YEAR = START_YEAR;
export const END_YEAR = 2100;
export const SECTOR_SLIDER_CENTER = 50;
export { sectors };

export const BAU_SECTOR_POSITIONS = Object.fromEntries(
  sectors.map((s) => [s.id, SECTOR_SLIDER_CENTER])
);

const anchors = [...ieaSteps.anchors].sort((a, b) => a.year - b.year);

export function getBauEmissions(year) {
  if (year <= anchors[0].year) return anchors[0].gt;
  if (year >= anchors[anchors.length - 1].year) return anchors[anchors.length - 1].gt;

  for (let i = 0; i < anchors.length - 1; i++) {
    const left = anchors[i];
    const right = anchors[i + 1];
    if (year >= left.year && year <= right.year) {
      const t = (year - left.year) / (right.year - left.year);
      return left.gt + t * (right.gt - left.gt);
    }
  }

  return anchors[anchors.length - 1].gt;
}

/** Slider 0–100: center (50) = current emissions; 0 = none; 100 = double. */
export function sliderToMultiplier(sliderPosition) {
  return sliderPosition / SECTOR_SLIDER_CENTER;
}

export function calcEmissionFactor(sectorPositions) {
  return sectors.reduce((sum, s) => {
    const position = sectorPositions[s.id] ?? SECTOR_SLIDER_CENTER;
    const multiplier = sliderToMultiplier(position);
    return sum + s.share * multiplier;
  }, 0);
}

export function annualGt(year, emissionFactor) {
  return getBauEmissions(year) * emissionFactor;
}

/** Additional emissions after the reference year (2026 = 0 cumulative). */
export function cumulativeGt(yearX, emissionFactor) {
  if (yearX <= REFERENCE_YEAR) return 0;

  let total = 0;
  for (let y = REFERENCE_YEAR + 1; y <= yearX; y++) {
    total += annualGt(y, emissionFactor);
  }
  return total;
}

function lerpBenchmark(points, deltaT) {
  if (points.length === 0) return 0;
  if (deltaT <= points[0].deltaT) return points[0].pct;

  for (let i = 0; i < points.length - 1; i++) {
    const left = points[i];
    const right = points[i + 1];
    if (deltaT >= left.deltaT && deltaT <= right.deltaT) {
      const t = (deltaT - left.deltaT) / (right.deltaT - left.deltaT);
      return left.pct + t * (right.pct - left.pct);
    }
  }

  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  const slope = (last.pct - prev.pct) / (last.deltaT - prev.deltaT);
  return last.pct + slope * (deltaT - last.deltaT);
}

function computeCore({ yearX, sectorPositions }) {
  const emissionFactor = calcEmissionFactor(sectorPositions);
  const cumulative = cumulativeGt(yearX, emissionFactor);
  const effectiveDeltaT = (cumulative / 1000) * benchmarks.warmingPer1000Gt;

  const popExposedPct = lerpBenchmark(benchmarks.population, effectiveDeltaT);
  const speciesLostPct = Math.max(
    0,
    lerpBenchmark(benchmarks.species, effectiveDeltaT)
  );

  return {
    effectiveDeltaT,
    cumulativeGt: cumulative,
    popExposedPct,
    speciesLostPct,
    emissionFactor,
  };
}

/** BAU (all sectors at current) impacts by 2100 — severity tiers are scaled to this. */
export const REFERENCE_2100_BAU = computeCore({
  yearX: END_YEAR,
  sectorPositions: BAU_SECTOR_POSITIONS,
});

function buildSeverityResult(tier, fractionOfBau2100, bau2100DeltaT, yearX) {
  const pctOfBau = Math.round(fractionOfBau2100 * 100);
  const descriptions = {
    minimal: 'Near 2026 reference — negligible additional impact',
    low: `Well below 2100 BAU (~${pctOfBau}% of BAU additional warming)`,
    moderate: `Moderate additional impact (~${pctOfBau}% of 2100 BAU warming)`,
    high: `Substantial additional impact (~${pctOfBau}% of 2100 BAU warming)`,
    severe: `Comparable to or exceeding 2100 stated-policies path (~${pctOfBau}% of BAU)`,
  };

  return {
    level: tier.level,
    label: tier.label,
    fractionOfBau2100,
    percentOfBau2100: pctOfBau,
    description: descriptions[tier.level] ?? tier.label,
    referenceYear: severityThresholds.referenceYear,
    bau2100DeltaT,
    yearX,
  };
}

export function getSeverity(effectiveDeltaT, yearX) {
  const bau2100 = REFERENCE_2100_BAU.effectiveDeltaT;
  const tiers = severityThresholds.tiers;

  if (yearX <= REFERENCE_YEAR) {
    return buildSeverityResult(tiers[0], 0, bau2100, yearX);
  }

  const fractionOfBau2100 = bau2100 > 0 ? effectiveDeltaT / bau2100 : 0;

  for (let i = 0; i < tiers.length; i++) {
    const tier = tiers[i];
    if (
      tier.maxFractionOfBau2100 == null ||
      fractionOfBau2100 <= tier.maxFractionOfBau2100
    ) {
      return buildSeverityResult(tier, fractionOfBau2100, bau2100, yearX);
    }
  }

  return buildSeverityResult(
    tiers[tiers.length - 1],
    fractionOfBau2100,
    bau2100,
    yearX
  );
}

export function computeOutputs({ yearX, sectorPositions }) {
  const core = computeCore({ yearX, sectorPositions });
  const severity = getSeverity(core.effectiveDeltaT, yearX);

  return {
    ...core,
    severity,
  };
}
