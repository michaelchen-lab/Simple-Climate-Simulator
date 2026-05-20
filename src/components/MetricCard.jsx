import InfoTooltip from './InfoTooltip';

export default function MetricCard({ title, value, subtitle, info, severityLevel }) {
  const levelClass = severityLevel
    ? `metric-card--${severityLevel}`
    : '';

  return (
    <div className={`metric-card ${levelClass}`.trim()}>
      <h3 className="metric-card__title">
        {title}
        {info && <InfoTooltip label={`About ${title}`}>{info}</InfoTooltip>}
      </h3>
      <p className="metric-card__value">{value}</p>
      {subtitle && <p className="metric-card__subtitle">{subtitle}</p>}
    </div>
  );
}
