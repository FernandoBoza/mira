import { useCallback, useEffect, useRef, useState } from 'react';
import { Slider } from '../ui/slider';
import { ScrubTracker } from '@/components/Timeline/ScrubTracker.tsx';
import { Track } from '@/components/Timeline/Track.tsx';

export const TimeLineTicks = ({ scale }: { scale: number }) => {
  const totalDuration = 60 * 60; // 60 minutes in seconds
  const tickInterval = totalDuration / scale; // Calculate the interval between ticks based on the scale

  const ticks = Array.from({ length: scale }, (_, i) => {
    const seconds = i * tickInterval; // Calculate the time in seconds
    const time = new Date(seconds * 1000); // Convert seconds to milliseconds
    const timeString = time.toISOString().substring(11, 19); // Convert seconds to hh:mm:ss format
    return <li key={i}>{timeString}</li>;
  });

  return <ul className="flex w-full justify-between">{ticks}</ul>;
};

export const Timeline = ({ selectFile }: { selectFile?: (file?: File) => void }) => {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [sliderValue, setSliderValue] = useState(10);
  const [scale, setScale] = useState(10);

  const handleSliderChange = useCallback((value: number[]) => {
    setSliderValue(value[0]);
  }, []);

  useEffect(() => {
    const handleWheel = (event: {
      preventDefault: () => void;
      stopPropagation: () => void;
      deltaY: number;
    }) => {
      event.preventDefault();
      setScale((prevScale) => {
        const val = prevScale - event.deltaY * 0.1;
        if (val <= 10) return 10;
        if (val >= 100) return 100;
        handleSliderChange([val]);
        return val;
      });
      event.stopPropagation();
    };

    const timelineElement = timelineRef.current;
    timelineElement?.addEventListener('wheel', handleWheel, { passive: false });

    const containerElement = containerRef.current;
    containerElement?.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      timelineElement?.removeEventListener('wheel', handleWheel);
      containerElement?.removeEventListener('wheel', handleWheel);
    };
  }, [handleSliderChange, scale, sliderValue]);

  const track1 = Track({ selectFile, timelineRef, scale, sliderValue });
  const track2 = Track({ selectFile, timelineRef, scale, sliderValue });

  return (
    <div className="p-6 h-full flex flex-col justify-between" id="container" ref={containerRef}>
      <div id="track-container" className="flex flex-col gap-2 relative overflow-hidden rounded">
        <TimeLineTicks scale={scale} />
        {track1.element}
        {track2.element}
        {(track1.progress || track2.progress) === 100 && (
          <ScrubTracker hoverTime={track1.hoverTime} duration={track1.duration as number} />
        )}
      </div>
      <Slider
        className="w-1/4"
        min={10}
        step={10}
        max={100}
        value={[sliderValue]}
        onValueChange={handleSliderChange}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};
