import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Slider } from '../ui/slider';
import { Track } from '@/components/Timeline/Track.tsx';

type TimelineProps = { selectFile?: (file?: File) => void };

export const Timeline = ({ selectFile }: TimelineProps) => {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [frames, setFrames] = useState<string[]>([]);
  const [displayedFrames, setDisplayedFrames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [sliderValue, setSliderValue] = useState(10);
  const [scale, setScale] = useState(10);

  const steps = useMemo(() => {
    let steps = Math.floor((sliderValue / 100) * frames.length);
    if (steps < 10) steps = 10;
    return steps;
  }, [frames.length, sliderValue]);

  const handleSliderChange = useCallback(
    (value: number[]) => {
      if (!frames.length) return;
      const newSliderValue = value[0];
      let newSteps = Math.floor((newSliderValue / 100) * frames.length);
      if (newSteps < 10) newSteps = 10;
      const framesAtIntervals = Array.from({ length: newSteps }, (_, i) =>
        Math.floor((i * frames.length) / newSteps),
      ).map((index) => frames[index]);

      setSliderValue(newSliderValue);
      setDisplayedFrames(framesAtIntervals);
    },
    [frames],
  );

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

  useEffect(() => {
    if (loading || (!loading && frames.length && displayedFrames.length)) {
      return;
    } else if (!loading && frames.length) {
      const framesAtIntervals = Array.from({ length: steps }, (_, i) =>
        Math.floor((i * frames.length) / steps),
      ).map((index) => frames[index]);
      setDisplayedFrames(framesAtIntervals);
    }
  }, [displayedFrames.length, frames, loading, sliderValue, steps]);

  return (
    <div className="p-6 h-full" id="container" ref={containerRef}>
      <div className="flex gap-4">
        <Slider
          className="w-1/4"
          min={10}
          step={10}
          max={100}
          value={[sliderValue]}
          onValueChange={handleSliderChange}
          onClick={(e) => e.stopPropagation()}
        />
        <h5>frames on track: {displayedFrames.length}</h5>
      </div>
      <Track
        loading={loading}
        setFrames={setFrames}
        selectFile={selectFile}
        setLoading={setLoading}
        timelineRef={timelineRef}
        displayedFrames={displayedFrames}
      />
    </div>
  );
};
