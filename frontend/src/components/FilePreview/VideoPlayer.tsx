import { useState, useRef } from 'react';
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
      <FastForward className="w-6 h-6" />
    </button>
  );
}

function RewindBtn({ onClick }: VideoBtnType) {
  return (
    <button onClick={onClick} className="text-white mr-4">
      <Rewind className="w-6 h-6" />
    </button>
  );
}

function PlayPauseBtn({ isPlaying, onClick }: PlayPauseBtnType) {
  return (
    <button onClick={onClick} className="text-white mr-4">
      {isPlaying ? (
        <PauseIcon className="w-6 h-6" />
      ) : (
        <PlayIcon className="w-6 h-6" />
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
        <VolumeX className="w-6 h-6" />
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

  const togglePlayPause = async () => {
    const video = videoRef?.current;
    if (!video) return;
    if (video.paused) {
      await video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullScreen = async () => {
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
  };

  const handleRewind = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime -= 10; // Rewind 10 seconds
    setCurrentTime(video.currentTime);
  };

  const handleFastForward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime += 10;
    setCurrentTime(video.currentTime);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
  };

  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={src}
        className="w-full"
        onClick={togglePlayPause}
        onTimeUpdate={handleTimeUpdate}
      />
      <div className="absolute bottom-0 left-0 right-0 flex justify-between p-4 bg-gray-900 bg-opacity-50">
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
          onValueChange={(e) => {
            const time = parseFloat(`${e[0]}`);
            if (videoRef.current) {
              videoRef.current.currentTime = time;
            }
            setCurrentTime(time);
          }}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
