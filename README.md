# Climate Emulator

A proof-of-concept educational web app that illustrates how reducing emissions by sector can affect global temperature and related impact indicators by a chosen future year.

## Run locally

```bash
npm install
npm start
```

**Windows PowerShell:** If `npm start` fails with “running scripts is disabled”, use the `.cmd` launcher instead (same commands):

```bash
npm.cmd install
npm.cmd start
npm.cmd run build
```

Or open **Command Prompt** (cmd.exe) where `npm` works without this restriction.

Open [http://localhost:3000](http://localhost:3000). Production build:

```bash
npm run build
```

Static files are output to `build/`.

## How the model works

1. **Baseline (BAU):** Annual global CO₂ emissions follow the IEA *Stated Policies Scenario*, interpolated between anchor years in `src/data/iea-steps.json`.
2. **Sector adjustments:** Five sliders default to the center (**current / BAU emissions**). Left reduces (down to −100%), right increases (up to +100% vs. current). Changes are weighted by global sector share from Our World in Data (`src/data/sectors.json`).
3. **Cumulative emissions:** Sum adjusted annual emissions from **2027 through the selected year** (2026 is the reference year, so cumulative is **0** when the year slider is at 2026).
4. **Temperature:** `ΔT = (cumulative Gt / 1000) × 0.45°C` relative to **2026** — **0°C** at the reference year (IPCC AR6 linear factor).
5. **Secondary metrics:** Piecewise linear interpolation on IPCC-style anchors for population exposed to dangerous heat and species at very high extinction risk (`src/data/ipcc-benchmarks.json`).
6. **Severity index:** Compares additional warming to the **2100 BAU** projection (IEA stated policies, all sectors at current levels). Tiers in `src/data/severity-thresholds.json`: Minimal (≤8% of BAU), Low (≤25%), Moderate (≤50%), High (≤80%), Severe (>80%).

Climate lag, feedback loops, and non-anthropogenic forcings are **not** modeled.

## Data sources

| Data | Source |
|------|--------|
| Sector shares | [Our World in Data — CO₂ by sector](https://ourworldindata.org/emissions-by-sector) |
| BAU emissions curve | [IEA — Stated Policies Scenario](https://www.iea.org/reports/world-energy-outlook-2025/stated-policies-scenario) (anchor points; 2075–2100 tail estimated) |
| Warming factor | IPCC AR6: ~0.45°C per 1,000 Gt CO₂ |
| Heat exposure | Spec benchmarks: ~700M at 1.5°C, ~2B at 2°C |
| Species risk | IPCC AR6 WGII: % at very high extinction risk by warming level |

## Project structure

```
src/
  App.js              # UI and React state
  model.js            # Pure calculation functions
  data/               # Static JSON inputs
  components/         # SectorSlider, MetricCard, SeverityBanner
```

## Limitations

This is a simplified linear model for teaching, not a scientific climate simulator. IEA anchor values after 2050 are approximate interpolations.
