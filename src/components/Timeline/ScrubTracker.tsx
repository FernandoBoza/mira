type ScrubTrackerProps = {
  hoverTime: number;
  duration: number;
};

export const ScrubTracker = ({ hoverTime, duration }: ScrubTrackerProps) => (
  <span
    style={{
      position: 'absolute',
      pointerEvents: 'none',
      left: `${hoverTime === 0 ? 0 : (hoverTime / duration) * 100}%`,
      height: '100%',
      width: '2px',
      backgroundColor: 'red',
    }}
  ></span>
);
