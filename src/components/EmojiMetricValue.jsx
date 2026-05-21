/** One emoji per 0.2% (percent × 5). */
export function emojiCountFromPercent(percent) {
  return Math.max(0, Math.round(percent * 5));
}

export default function EmojiMetricValue({ emoji, percent }) {
  const count = emojiCountFromPercent(percent);

  if (count === 0) {
    return null;
  }

  return (
    <div className="metric-card__emojis" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className="metric-card__emoji">
          {emoji}
        </span>
      ))}
    </div>
  );
}
