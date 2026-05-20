import { SECTOR_SLIDER_CENTER, sliderToMultiplier } from '../model';

function formatSectorChange(position) {
  if (position === SECTOR_SLIDER_CENTER) {
    return 'Current emissions (BAU)';
  }
  const multiplier = sliderToMultiplier(position);
  const pctChange = Math.round(Math.abs(multiplier - 1) * 100);
  if (position < SECTOR_SLIDER_CENTER) {
    return `${pctChange}% below current`;
  }
  return `${pctChange}% above current`;
}

export default function SectorSlider({ id, label, share, position, onChange }) {
  const changeLabel = formatSectorChange(position);

  return (
    <div className="sector-slider">
      <div className="sector-slider__header">
        <label htmlFor={id}>{label}</label>
        <span className="sector-slider__meta">
          {Math.round(share * 100)}% of global emissions · {changeLabel}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={position}
        aria-valuetext={changeLabel}
      />
      <div className="sector-slider__scale" aria-hidden="true">
        <span>−100%</span>
        <span>Current</span>
        <span>+100%</span>
      </div>
    </div>
  );
}
