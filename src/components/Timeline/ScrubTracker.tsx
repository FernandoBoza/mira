type ScrubTrackerProps = {
  hoverTime: number;
  duration: number;
};

export const ScrubTracker = ({ hoverTime, duration }: ScrubTrackerProps) => (
  <span
    style={{
      position: 'absolute',
      left: `${hoverTime === 0 ? 0 : (hoverTime / duration) * 100}%`,
      height: 'inherit',
      width: '2px',
      backgroundColor: 'red',
    }}
  ></span>
);
