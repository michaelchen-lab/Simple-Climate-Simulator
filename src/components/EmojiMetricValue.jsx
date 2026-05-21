/** One emoji per 0.2% (percent × 5). */
export function emojiCountFromPercent(percent) {
  return Math.max(0, Math.round(percent * 5));
}

/** One emoji per 0.1° (degrees × 10). */
export function emojiCountFromTenthDegrees(degrees) {
  return Math.max(0, Math.round(degrees * 10));
}

export default function EmojiMetricValue({ emoji, label, count }) {
  return (
    <div className="metric-card__emoji-row" aria-label={label}>
      <span className="metric-card__emoji-label">{label}</span>
      <div className="metric-card__emojis" aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <span key={index} className="metric-card__emoji">
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
}
