import { useEffect, useState } from 'react';
import './App.css';
import SectorSlider from './components/SectorSlider';
import MetricCard from './components/MetricCard';
import EmojiMetricValue, {
  emojiCountFromPercent,
  emojiCountFromTenthDegrees,
} from './components/EmojiMetricValue';
import SeverityBanner from './components/SeverityBanner';
import {
  severityInfo,
  temperatureInfo,
  populationInfo,
  speciesInfo,
} from './content/projectionInfo';
import {
  computeOutputs,
  sectors,
  START_YEAR,
  END_YEAR,
  SECTOR_SLIDER_CENTER,
} from './model';

const INITIAL_SECTOR_POSITIONS = {
  energy: SECTOR_SLIDER_CENTER,
  industry: SECTOR_SLIDER_CENTER,
  transport: SECTOR_SLIDER_CENTER,
  agriculture: SECTOR_SLIDER_CENTER,
  buildings: SECTOR_SLIDER_CENTER,
};

function celsiusDeltaToFahrenheit(celsius) {
  return celsius * (9 / 5);
}

function App() {
  const [yearX, setYearX] = useState(2050);
  const [sectorPositions, setSectorPositions] = useState(INITIAL_SECTOR_POSITIONS);

  const outputs = computeOutputs({ yearX, sectorPositions });
  const deltaF = celsiusDeltaToFahrenheit(outputs.effectiveDeltaT);

  useEffect(() => {
    document.body.style.backgroundColor = outputs.severity.colors.pageBackground;
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [outputs.severity.colors.pageBackground]);

  const updateSector = (id, position) => {
    setSectorPositions((prev) => ({ ...prev, [id]: position }));
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>all simulation is environmental simulation</h1>
        <p>
          A proof-of-concept educational climate simulator. Not 100% accurate!
        </p>
      </header>

      <main className="app__main">
        <section className="controls" aria-label="Simulation controls">
          <h2 className="panel-title">Sector emissions (vs. current)</h2>
          {sectors.map((sector) => (
            <SectorSlider
              key={sector.id}
              id={sector.id}
              label={sector.label}
              share={sector.share}
              icon={sector.icon}
              accentColor={sector.accentColor}
              position={sectorPositions[sector.id]}
              onChange={(value) => updateSector(sector.id, value)}
            />
          ))}
        </section>

        <section className="metrics" aria-label="Impact indicators">
          <h2 className="panel-title">Projected impacts</h2>
          <p className="panel-subtitle">Relative to 2026</p>

          <div className="year-slider">
            <div className="year-slider__header">
              <label htmlFor="year-x">Year</label>
              <span>{yearX}</span>
            </div>
            <input
              id="year-x"
              type="range"
              min={START_YEAR}
              max={END_YEAR}
              value={yearX}
              onChange={(e) => setYearX(Number(e.target.value))}
              aria-valuemin={START_YEAR}
              aria-valuemax={END_YEAR}
              aria-valuenow={yearX}
              aria-valuetext={`Year ${yearX}`}
            />
          </div>

          <SeverityBanner severity={outputs.severity} info={severityInfo} />

          <div className="metrics__grid">
            <MetricCard
              title="Temperature rise (ΔT)"
              value={
                <EmojiMetricValue
                  emoji="🌡️"
                  label={`${deltaF.toFixed(1)} °F`}
                  count={emojiCountFromTenthDegrees(deltaF)}
                />
              }
              info={temperatureInfo}
              severityColors={outputs.severity.colors}
            />
            <MetricCard
              title="Additional population exposed to dangerous heat"
              value={
                <EmojiMetricValue
                  emoji="🥵"
                  label={`${outputs.popExposedPct.toFixed(1)}%`}
                  count={emojiCountFromPercent(outputs.popExposedPct)}
                />
              }
              info={populationInfo}
              severityColors={outputs.severity.colors}
            />
            <MetricCard
              title="Additional species at very high extinction risk"
              value={
                <EmojiMetricValue
                  emoji="☠️"
                  label={`${outputs.speciesLostPct.toFixed(1)}%`}
                  count={emojiCountFromPercent(outputs.speciesLostPct)}
                />
              }
              info={speciesInfo}
              severityColors={outputs.severity.colors}
            />
          </div>
        </section>
      </main>

      <footer className="app__footer">
        Business-as-usual path based on IEA Stated Policies Scenario. Sector
        shares from Our World in Data. Warming uses IPCC linear factor (0.45°C
        per 1,000 Gt). Climate lag and feedback loops are not modeled.
      </footer>
    </div>
  );
}

export default App;
