type ScrubTrackerProps = {
  hoverTime: number;
  duration: number;
};

export const ScrubTracker = ({ hoverTime, duration }: ScrubTrackerProps) => {
  return (
    <span
      style={{
        position: 'absolute',
        left: `${(hoverTime / duration) * 100}%`,
        height: 'inherit',
        width: '2px',
        backgroundColor: 'red',
      }}
    ></span>
  );
};
