import { useEffect, useRef } from 'react';

type TimelineProps = {
  duration: number;
  onScrub: (time: number) => void;
};

export const Timeline = ({ duration, onScrub }: TimelineProps) => {
  const timelineRef = useRef<HTMLDivElement>(null);

  const handleScrub = (event: React.MouseEvent) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const scrubTime = (x / rect.width) * duration;
      onScrub(scrubTime);
    }
  };

  useEffect(() => {
    // TODO: Extract frames from the video and display them in the timeline
  }, [duration]);

  return (
    <div ref={timelineRef} onClick={handleScrub} className="timeline">
      TimeLine
    </div>
  );
};
