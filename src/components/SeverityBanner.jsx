export default function SeverityBanner({ severity }) {
  return (
    <div
      className={`severity-banner severity-banner--${severity.level}`}
      role="status"
      aria-live="polite"
    >
      <p className="severity-banner__label">Environmental impact severity</p>
      <p className="severity-banner__value">{severity.label}</p>
      <p className="severity-banner__description">{severity.description}</p>
    </div>
  );
}
