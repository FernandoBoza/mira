import { DragEvent, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useEditorStore } from '@/stores/editor.store.ts';
import { Slider } from '../ui/slider';
import { convertTime } from '@/lib/utils.ts';
import { Progress } from '@/components/ui/progress.tsx';
import { ScrubTracker } from '@/components/Timeline/ScrubTracker.tsx';

type TimelineProps = {
  selectFile?: (file?: File) => void;
};

export const Timeline = ({ selectFile }: TimelineProps) => {
  const { draggedFile, setDraggedFile, setTimeStamp } = useEditorStore();
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [frames, setFrames] = useState<string[]>([]);
  const [displayedFrames, setDisplayedFrames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);
  const [sliderValue, setSliderValue] = useState(10);
  const [progress, setProgress] = useState(0);
  const [scale, setScale] = useState(10);

  const handleSliderChange = useCallback(
    (value: number[]) => {
      const sliderValue = value[0];
      setSliderValue(sliderValue);
      let steps = Math.floor((sliderValue / 100) * frames.length);
      if (steps < 10) steps = 10;
      const framesAtIntervals = Array.from({ length: steps }, (_, i) =>
        Math.floor((i * frames.length) / steps),
      ).map((index) => frames[index]);
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

  const generateFramesFromVideo = (video: HTMLVideoElement) => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const { width, height } = canvas;
    const totalFrames = Math.floor(video.duration / 2); // half of video duration
    let currentFrame = 0;

    const generateFrame = () => {
      const currentProgress = Math.floor((currentFrame / totalFrames) * 100);
      setProgress(currentProgress);
      if (currentFrame >= totalFrames) {
        setLoading(false);
        video.onseeked = null; // Remove the event listener
        return;
      } else {
        setLoading(true);
        video.currentTime = currentFrame * 2; // Capture a frame every 2 seconds
        video.onseeked = () => {
          ctx.drawImage(video, 0, 0, width, height);
          const data = canvas.toDataURL('image/jpeg');
          currentFrame++;
          requestAnimationFrame(generateFrame);
          setFrames((prevFrames) => [...prevFrames, data]);
        };
      }
    };

    video.currentTime = 0;
    requestAnimationFrame(generateFrame);
  };

  const preventDefaults = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      preventDefaults(e);
      e.stopPropagation();
      if (draggedFile) {
        selectFile && selectFile(draggedFile);

        const url = URL.createObjectURL(draggedFile);
        const video = document.createElement('video');

        videoRef.current = video;
        video.onloadedmetadata = () => {
          generateFramesFromVideo(video);
        };
        video.src = url;
        setDraggedFile(undefined);
      }
    },
    [preventDefaults, draggedFile, selectFile, setDraggedFile],
  );

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!videoRef?.current || !timelineRef?.current || !isScrubbing) return;
    const timelineWidth = timelineRef.current.offsetWidth;
    const clickPosition = e.clientX - timelineRef.current.getBoundingClientRect().left;
    const time = (clickPosition / timelineWidth) * videoRef.current.duration;

    setHoverTime(time);

    if (isScrubbing) {
      videoRef.current.currentTime = time;
      if (time <= 0) {
        setTimeStamp && setTimeStamp('00:00');
        return;
      }
      setTimeStamp && setTimeStamp(convertTime(time));
    }
  };

  const handleMouseDirection = (direction: 'up' | 'down') => {
    setIsScrubbing(direction === 'down');
  };

  useEffect(() => {
    if (loading || (!loading && frames.length && displayedFrames.length)) {
      return;
    } else if (!loading && frames.length) {
      let steps = Math.floor((sliderValue / 100) * frames.length);
      if (steps < 10) steps = 10;
      const framesAtIntervals = Array.from({ length: steps }, (_, i) =>
        Math.floor((i * frames.length) / steps),
      ).map((index) => frames[index]);
      setDisplayedFrames(framesAtIntervals);
    }
  }, [displayedFrames.length, frames, loading, sliderValue]);

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
      <div
        ref={timelineRef}
        onClick={handleMouseMove}
        onMouseMove={handleMouseMove}
        onMouseDown={() => handleMouseDirection('down')}
        onMouseUp={() => handleMouseDirection('up')}
        onDragEnter={preventDefaults}
        onDragOver={preventDefaults}
        onDrop={handleDrop}
        className="h-1/3 relative border border-primary rounded-lg overflow-hidden"
        id="timeline"
      >
        {loading && (
          <div className="p-6">
            <Progress value={progress} />
          </div>
        )}
        <canvas id="canvas" width="500" height="300" className="hidden"></canvas>
        <div
          id="frameContainer"
          className="h-full flex overflow-x-scroll select-none pointer-events-none"
        >
          {displayedFrames.map((frame, index) => (
            <img key={index} src={frame} className="pointer-events-none select-none" alt="frame" />
          ))}
          {progress === 100 && (
            <ScrubTracker hoverTime={hoverTime} duration={videoRef?.current?.duration as number} />
          )}
        </div>
      </div>
    </div>
  );
};
