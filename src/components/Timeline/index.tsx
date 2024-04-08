import { DragEvent, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useFileStore } from '@/stores/file.store.ts';
import { Slider } from '../ui/slider';
import { convertTime } from '@/lib/utils.ts';

type TimelineProps = {
  selectFile?: (file?: File) => void;
};

export const Timeline = ({ selectFile }: TimelineProps) => {
  const { draggedFile, setDraggedFile } = useFileStore();
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [frames, setFrames] = useState<string[]>([]);
  const [displayedFrames, setDisplayedFrames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeStamp, setTimeStamp] = useState('00:00');
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);

  const handleSliderChange = (value: number[]) => {
    console.log(value[0]);
    // const step = value[0]
    // const totalFrames = frames.length; // replace with your total frames
    // const steps = step; // number of steps
    // const framesAtIntervals = Array.from({ length: steps }, (_, i) =>
    //   Math.floor(i * totalFrames * 0.1),
    // ).map((index) => frames[index]);
    // setDisplayedFrames(framesAtIntervals);
  };

  const generateFramesFromVideo = (video: HTMLVideoElement) => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const { width, height } = canvas;
    const totalFrames = Math.floor(video.duration / 2);
    const interval = 2; // Capture a frame every 2 seconds
    let currentFrame = 0;

    const generateFrame = () => {
      if (currentFrame >= totalFrames) {
        setLoading(false);
        video.onseeked = null; // Remove the event listener
        return;
      } else {
        setLoading(true);
        video.currentTime = currentFrame * interval;
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

        // Create a video element
        const video = document.createElement('video');
        videoRef.current = video;
        // When the metadata is loaded, log the duration
        video.onloadedmetadata = () => {
          generateFramesFromVideo(video);
        };

        // Set the source of the video element to the uploaded file
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

    setHoverTime(time); // Always update hoverTime

    if (isScrubbing) {
      videoRef.current.currentTime = time;
      setTimeStamp(convertTime(time));
    }
  };

  const handleMouseDown = () => {
    setIsScrubbing(true);
  };

  const handleMouseUp = () => {
    setIsScrubbing(false);
  };

  useEffect(() => {
    if (loading) {
      console.log('... loading');
      return;
    } else if (!loading && frames.length && displayedFrames.length) {
      return;
    } else if (!loading && frames.length) {
      console.log('done loading and setting frames');
      const framesAtIntervals = Array.from({ length: 10 }, (_, i) =>
        Math.floor(i * frames.length * 0.1),
      ).map((index) => frames[index]);
      setDisplayedFrames(framesAtIntervals);
    }
  }, [displayedFrames.length, frames, loading]);

  return (
    <div className="p-6 h-full">
      <div>
        <Slider
          className="w-1/4"
          min={10}
          step={10}
          max={100}
          onValueChange={handleSliderChange}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <h5>displayedFrames: {displayedFrames.length}</h5>
      <br />
      <h5>{timeStamp}</h5>
      <div
        onClick={handleMouseMove}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onDragEnter={preventDefaults}
        onDragOver={preventDefaults}
        onDrop={handleDrop}
        ref={timelineRef}
        className="h-full relative"
        id="timeline"
      >
        <canvas id="canvas" width="500" height="300" className="hidden"></canvas>
        <div
          id="frameContainer2"
          className="h-1/3 flex overflow-x-scroll select-none pointer-events-none"
        >
          {displayedFrames.map((frame, index) => (
            <img key={index} src={frame} className="pointer-events-none select-none" alt="frame" />
          ))}
          {videoRef?.current?.currentTime && (
            <div
              style={{
                position: 'absolute',
                left: `${(hoverTime / videoRef?.current?.duration) * 100}%`,
                height: 'inherit',
                width: '2px',
                backgroundColor: 'red',
              }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
};
