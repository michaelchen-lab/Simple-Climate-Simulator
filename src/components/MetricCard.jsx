import InfoTooltip from './InfoTooltip';
import { severityColorStyle } from '../model';

export default function MetricCard({ title, value, subtitle, info, severityColors }) {
  return (
    <div
      className="metric-card"
      style={severityColors ? severityColorStyle(severityColors) : undefined}
    >
      <h3 className="metric-card__title">
        {title}
        {info && <InfoTooltip label={`About ${title}`}>{info}</InfoTooltip>}
      </h3>
      <div className="metric-card__value">{value}</div>
      {subtitle && <p className="metric-card__subtitle">{subtitle}</p>}
    </div>
  );
}
