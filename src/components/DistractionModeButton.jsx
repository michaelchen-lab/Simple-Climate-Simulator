export const DISTRACTION_VIDEO_ID = 'vTfD20dbxho';

export function distractionEmbedSrc() {
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: DISTRACTION_VIDEO_ID,
    controls: '0',
    playsinline: '1',
    rel: '0',
  });
  return `https://www.youtube.com/embed/${DISTRACTION_VIDEO_ID}?${params}`;
}

export default function DistractionModeButton({ distractionOpen, onToggle }) {
  return (
    <button
      type="button"
      className="distraction-mode-btn"
      onClick={onToggle}
      aria-pressed={distractionOpen}
    >
      {distractionOpen
        ? 'Switch to lock in mode'
        : 'Switch to distraction mode'}
    </button>
  );
}
