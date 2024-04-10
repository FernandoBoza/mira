import { Progress } from '@/components/ui/progress.tsx';
import { ScrubTracker } from '@/components/Timeline/ScrubTracker.tsx';
import {
  DragEvent,
  MouseEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { convertTime } from '@/lib/utils.ts';
import { useEditorStore } from '@/stores/editor.store.ts';

type TrackProps = {
  selectFile?: (file?: File) => void;
  timelineRef: MutableRefObject<HTMLDivElement | null>;
  scale: number;
  sliderValue: number;
};

export const Track = ({ selectFile, timelineRef, scale, sliderValue }: TrackProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { draggedFile, setDraggedFile, setTimeStamp } = useEditorStore();
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [frames, setFrames] = useState<string[]>([]);
  const [displayedFrames, setDisplayedFrames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const preventDefaults = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

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

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      preventDefaults(e);
      e.stopPropagation();

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
    [preventDefaults, draggedFile, setLoading, setFrames, selectFile, videoRef, setDraggedFile],
  );

  useEffect(() => {
    if (loading) {
      return;
    } else if (!loading && frames.length) {
      let newSteps = Math.floor((sliderValue / 100) * frames.length);
      if (newSteps < 10) newSteps = 10;
      const framesAtIntervals = Array.from({ length: newSteps }, (_, i) =>
        Math.floor((i * frames.length) / newSteps),
      ).map((index) => frames[index]);
      setDisplayedFrames(framesAtIntervals);
    }
  }, [displayedFrames.length, frames, loading, sliderValue, scale]);

  return (
    <div
      ref={timelineRef}
      onClick={handleMouseMove}
      onMouseMove={handleMouseMove}
      onMouseDown={() => handleMouseDirection('down')}
      onMouseUp={() => handleMouseDirection('up')}
      onDragEnter={preventDefaults}
      onDragOver={preventDefaults}
      onDrop={handleDrop}
      className="h-20 relative border border-primary rounded-lg overflow-hidden"
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
  );
};
