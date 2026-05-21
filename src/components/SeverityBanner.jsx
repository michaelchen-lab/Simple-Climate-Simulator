import InfoTooltip from './InfoTooltip';
import { severityColorStyle } from '../model';

export default function SeverityBanner({ severity, info }) {
  return (
    <div
      className="severity-banner"
      style={severityColorStyle(severity.colors)}
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
      <p className="severity-banner__value">
        <span className="severity-banner__face" aria-hidden="true">
          {severity.faceEmoji}
        </span>
        {severity.tagline}
      </p>
      <p className="severity-banner__description">{severity.description}</p>
    </div>
  );
}
