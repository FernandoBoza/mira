import { useState, useRef, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';
import {
  PlayIcon,
  PauseIcon,
  Volume2,
  VolumeX,
  Expand,
  Rewind,
  FastForward,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider.tsx';

type VideoBtnType = {
  onClick: () => void;
};

type PlayPauseBtnType = {
  isPlaying: boolean;
  onClick: () => Promise<void>;
};

type VolumeBtnType = {
  isMuted: boolean;
  onClick: () => void;
};

function FastForwardBtn({ onClick }: VideoBtnType) {
  return (
    <button onClick={onClick} className="text-white mr-4">
      <FastForward className="w-6 h-6 fill-current" />
    </button>
  );
}

function RewindBtn({ onClick }: VideoBtnType) {
  return (
    <button onClick={onClick} className="text-white mr-4">
      <Rewind className="w-6 h-6 fill-current" />
    </button>
  );
}

function PlayPauseBtn({ isPlaying, onClick }: PlayPauseBtnType) {
  return (
    <button onClick={onClick} className="text-white mr-4">
      {isPlaying ? (
        <PauseIcon className="w-6 h-6 fill-current" />
      ) : (
        <PlayIcon className="w-6 h-6 fill-current" />
      )}
    </button>
  );
}

function ToggleFullScreenBtn({ onClick }: VideoBtnType) {
  return (
    <button onClick={onClick} className="text-white">
      <Expand className="w-6 h-6" />
    </button>
  );
}

function VolumeBtn({ isMuted, onClick }: VolumeBtnType) {
  return (
    <button onClick={onClick} className="text-white mr-4">
      {isMuted ? (
        <VolumeX className="w-6 h-6 fill-current" />
      ) : (
        <Volume2 className="w-6 h-6" />
      )}
    </button>
  );
}

export const VideoPlayer = ({ src }: { src: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlayPause = useCallback(async () => {
    const video = videoRef?.current;
    if (!video) return;
    if (video.paused) {
      await video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, [isMuted]);

  const toggleFullScreen = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    if (!document.fullscreenElement) {
      try {
        await video.requestFullscreen();
      } catch (err) {
        if (err instanceof DOMException) {
          console.log(
            `Error attempting to enable full-screen mode: ${err.message} (${err.name})`,
          );
        }
      }
    } else {
      try {
        await document.exitFullscreen();
      } catch (err) {
        if (err instanceof DOMException) {
          console.error(
            `Error attempting to exit full-screen mode: ${err.message} (${err.name})`,
          );
        }
      }
    }
  }, [videoRef.current]);

  const handleRewind = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime -= 10; // Rewind 10 seconds
    setCurrentTime(video.currentTime);
  }, [currentTime]);

  const handleFastForward = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime += 10;
    setCurrentTime(video.currentTime);
  }, [currentTime]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
  };

  const handleScrub = useMemo(
    () =>
      debounce((value: number[]) => {
        const time = parseFloat(`${value[0]}`);
        if (videoRef.current) {
          videoRef.current.currentTime = time;
        }
        setCurrentTime(time);
      }, 100),
    [videoRef.current, currentTime],
  );

  return (
    <div className="relative group">
      <video
        ref={videoRef}
        src={src}
        className="w-full"
        onClick={togglePlayPause}
        onTimeUpdate={handleTimeUpdate}
      />
      <div className="absolute left-0 right-0 flex justify-between px-4 py-2 bg-gray-900 bg-opacity-50 transition-all duration-1000 ease-in-out -bottom-full opacity-0 group-hover:bottom-0 group-hover:opacity-100">
        <RewindBtn onClick={handleRewind} />
        <PlayPauseBtn isPlaying={isPlaying} onClick={togglePlayPause} />
        <FastForwardBtn onClick={handleFastForward} />
        <VolumeBtn isMuted={isMuted} onClick={toggleMute} />
        <ToggleFullScreenBtn onClick={toggleFullScreen} />
      </div>
      <div className="absolute bottom--2 left-0 right-0 bg-gray-900 bg-opacity-50">
        <Slider
          max={videoRef.current?.duration || 0}
          step={1}
          value={[currentTime]}
          onValueChange={handleScrub}
          className={'cursor-pointer'}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
