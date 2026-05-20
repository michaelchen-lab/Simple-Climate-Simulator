export default function MetricCard({ title, value, subtitle }) {
  return (
    <div className="metric-card">
      <h3>{title}</h3>
      <p className="metric-card__value">{value}</p>
      {subtitle && <p className="metric-card__subtitle">{subtitle}</p>}
    </div>
  );
}
