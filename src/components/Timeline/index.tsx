import { useCallback, useEffect, useRef, useState } from 'react';
import { Slider } from '../ui/slider';
import { Track } from '@/components/Timeline/Track.tsx';

type TimelineProps = { selectFile?: (file?: File) => void };

export const Timeline = ({ selectFile }: TimelineProps) => {
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

  return (
    <div className="p-6 h-full flex flex-col justify-between" id="container" ref={containerRef}>
      <div id="track-container" className="flex flex-col gap-2">
        <Track
          selectFile={selectFile}
          timelineRef={timelineRef}
          scale={scale}
          sliderValue={sliderValue}
        />
        <Track
          selectFile={selectFile}
          timelineRef={timelineRef}
          scale={scale}
          sliderValue={sliderValue}
        />
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
