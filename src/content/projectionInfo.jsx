import severityThresholds from '../data/severity-thresholds.json';
import { REFERENCE_2100_BAU, START_YEAR } from '../model';

const tierList = ['Severe', 'High', 'Moderate', 'Low', 'Minimal'];

const tierRows = severityThresholds.tiers.map((tier) => {
  if (tier.maxFractionOfBau2100 == null) {
    return (
      <li key={tier.level}>
        <strong>{tier.label}</strong> — worse than about 80% of the policy-as-usual
        path to 2100
      </li>
    );
  }
  const pct = Math.round(tier.maxFractionOfBau2100 * 100);
  return (
    <li key={tier.level}>
      <strong>{tier.label}</strong> — up to {pct}% of that same reference level
    </li>
  );
});

const bau2100Dt = REFERENCE_2100_BAU.effectiveDeltaT.toFixed(2);

export const severityInfo = (
  <div className="info-tooltip__body">
    <p>
      <strong>Levels (most to least impact):</strong> {tierList.join(' → ')}
    </p>
    <p>
      This summarizes how much <em>extra</em> harm your choices add from {START_YEAR}{' '}
      through the year you picked, compared with continuing on the IEA stated-policies
      energy path through 2100.
    </p>
    <ul>{tierRows}</ul>
    <p>
      <strong>How it is calculated:</strong>
    </p>
    <ol className="info-tooltip__steps">
      <li>Estimate extra warming from your scenario (see Temperature rise).</li>
      <li>
        Compare that to extra warming if emissions followed stated policies through
        2100 (~{bau2100Dt}°C above {START_YEAR} with sliders at center).
      </li>
      <li>Pick a label from the list above based on that comparison.</li>
    </ol>
    <p>
      <strong>At {START_YEAR}:</strong> always Minimal — the reference year counts as
      no additional impact yet.
    </p>
    <p>
      <strong>Sources:</strong> IEA World Energy Outlook, Stated Policies Scenario
      (policy-as-usual reference to 2100).
    </p>
  </div>
);

export const temperatureInfo = (
  <div className="info-tooltip__body">
    <p>
      Extra global warming above {START_YEAR}. At {START_YEAR} this is always 0°C.
    </p>
    <p>
      <strong>How it is calculated:</strong>
    </p>
    <ol className="info-tooltip__steps">
      <li>
        For each year from {START_YEAR + 1} through your selected year, estimate
        global CO₂ emissions using the IEA stated-policies trend, adjusted by your
        sector sliders (left = less, center = today’s mix, right = more).
      </li>
      <li>Add up those yearly emissions to get a total in gigatonnes (Gt).</li>
      <li>
        Convert the total to warming: about <strong>0.45°C for every 1,000 Gt</strong>{' '}
        (a simplified IPCC-style relationship).
      </li>
    </ol>
    <p>
      <strong>Sources:</strong> IEA Stated Policies Scenario for the baseline emissions
      path; Our World in Data for sector shares; IPCC AR6 for the warming factor.
    </p>
  </div>
);

export const populationInfo = (
  <div className="info-tooltip__body">
    <p>
      Extra share of the world’s population facing dangerous heat, above the{' '}
      {START_YEAR} baseline (0% at the reference year).
    </p>
    <p>
      <strong>How it is calculated:</strong>
    </p>
    <ol className="info-tooltip__steps">
      <li>Start from the temperature rise shown above.</li>
      <li>
        Map that warming to a percent exposed using IPCC-style reference points, with
        straight-line steps in between:
        <ul>
          <li>0°C extra → 0%</li>
          <li>1.5°C extra → about 9% (~700 million people)</li>
          <li>2.0°C extra → about 25% (~2 billion people)</li>
        </ul>
      </li>
    </ol>
    <p>
      <strong>Sources:</strong> IPCC AR6 WGII (heat exposure benchmarks); ~8 billion
      world population for the people estimate under the percent.
    </p>
  </div>
);

export const speciesInfo = (
  <div className="info-tooltip__body">
    <p>
      Extra share of <strong>terrestrial and freshwater</strong> species at very high
      extinction risk — this includes <strong>plants, fungi, invertebrates, and
      animals</strong>, not animals alone. Counts are above the {START_YEAR} baseline
      (0% at the reference year).
    </p>
    <p>
      <strong>How it is calculated:</strong>
    </p>
    <ol className="info-tooltip__steps">
      <li>Start from the temperature rise shown above.</li>
      <li>
        Map that warming to a percent at very high risk using IPCC reference points,
        with straight-line steps in between (for example 0% at 0°C extra, about 9% at
        1.5°C extra, about 10% at 2°C extra, rising to about 15% at 5°C extra).
      </li>
      <li>
        The absolute species count is illustrative: percent × about 2 million
        terrestrial and freshwater species (rough global estimate for this POC).
      </li>
    </ol>
    <p>
      <strong>Sources:</strong> IPCC AR6 WGII (extinction risk by warming level).
    </p>
  </div>
);
