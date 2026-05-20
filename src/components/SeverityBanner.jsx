import InfoTooltip from './InfoTooltip';

export default function SeverityBanner({ severity, info }) {
  return (
    <div
      className={`severity-banner severity-banner--${severity.level}`}
      role="status"
      aria-live="polite"
    >
      <div className="severity-banner__header">
        <p className="severity-banner__label">Environmental impact severity</p>
        {info && (
          <InfoTooltip
            label="About environmental impact severity"
            placement="below"
          >
            {info}
          </InfoTooltip>
        )}
      </div>
      <p className="severity-banner__value">{severity.label}</p>
      <p className="severity-banner__description">{severity.description}</p>
    </div>
  );
}
