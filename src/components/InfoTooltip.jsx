export default function InfoTooltip({
  label = 'More information',
  placement = 'above',
  children,
}) {
  return (
    <span className={`info-tooltip info-tooltip--${placement}`}>      <button
        type="button"
        className="info-tooltip__trigger"
        aria-label={label}
      >
        i
      </button>
      <span className="info-tooltip__popup" role="tooltip">
        {children}
      </span>
    </span>
  );
}
