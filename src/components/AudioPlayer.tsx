import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface AudioPlayerProps {
  audioFile: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  sectionNumber?: number;
  customLabel?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  audioFile, 
  className = '',
  size = 'md',
  showText = true,
  sectionNumber,
  customLabel
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 28
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatCountdown = (current: number, total: number) => {
    if (total === 0 || isNaN(total)) return '-0:00';
    const remaining = Math.max(0, total - current);
    const minutes = Math.floor(remaining / 60);
    const seconds = Math.floor(remaining % 60);
    return `-${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      console.log('Time update:', audio.currentTime, 'Duration:', audio.duration);
    };
    
    const updateDuration = () => {
      setDuration(audio.duration);
      console.log('Duration loaded:', audio.duration);
    };
    
    const handleEnded = () => setIsPlaying(false);
    const handleCanPlay = () => {
      setDuration(audio.duration);
      console.log('Can play - Duration:', audio.duration);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    // Test if audio file exists
    fetch(`/audio/${audioFile}`)
      .then(response => {
        if (!response.ok) {
          console.error('Audio file not found:', `/audio/${audioFile}`);
          setError('Audio file not found. Please contact support.');
        } else {
          console.log('Audio file found and accessible:', `/audio/${audioFile}`);
        }
      })
      .catch(error => {
        console.error('Error checking audio file:', error);
        setError('Unable to access audio file. Please check your internet connection.');
      });

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioFile]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) {
      console.error('Audio element not found');
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        setError(null);
      }).catch((error) => {
        console.error('Error playing audio:', error);
        setError(`Unable to play audio: ${error.message}`);
        setIsPlaying(false);
      });
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || duration === 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleScrubStart = (e: React.MouseEvent) => {
    e.preventDefault();
    const audio = audioRef.current;
    if (!audio || duration === 0) return;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const rect = audio.parentElement?.getBoundingClientRect();
      if (!rect) return;
      
      const clickX = moveEvent.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      const newTime = percentage * duration;
      
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className={cn('relative audio-player flex justify-center', className)}>
      {/* Professional Audio Player */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100 shadow-sm max-w-md">
        {/* Play/Pause Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePlay}
          className={cn(
            'p-2 hover:bg-white/80 transition-all duration-200 rounded-full shadow-sm border border-blue-200/50',
            sizeClasses[size],
            isPlaying ? 'bg-blue-100' : 'bg-white'
          )}
          title="Play audio guide for this section"
        >
          {isPlaying ? (
            <Pause 
              size={iconSizes[size]} 
              className="text-blue-600" 
            />
          ) : (
            <Play 
              size={iconSizes[size]} 
              className="text-blue-600 ml-0.5" 
            />
          )}
        </Button>
        
        {/* Audio Info */}
        <div className="flex-1 min-w-0">
          {showText && (
            <div className="mb-1 text-center">
              <p className="text-sm font-semibold text-blue-800">
                {customLabel || (sectionNumber ? `Section ${sectionNumber} - Audio Guide` : 'Audio Guide')}
              </p>
              <p className="text-xs text-blue-600">Click to listen to this section</p>
            </div>
          )}
          
          {/* Custom Audio Controls */}
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <div className="bg-white rounded-full h-1.5 overflow-hidden cursor-pointer" onClick={handleSeek}>
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300 relative"
                  style={{ 
                    width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' 
                  }}
                />
                {/* Scrubber Circle */}
                {duration > 0 && (
                  <div 
                    className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-blue-600 rounded-full shadow-md border-2 border-white cursor-pointer hover:scale-110 transition-transform duration-200"
                    style={{ 
                      left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` 
                    }}
                    onMouseDown={handleScrubStart}
                  />
                )}
              </div>
            </div>
            <span className="text-xs text-blue-600 font-mono min-w-[50px]">
              {duration > 0 ? (isPlaying ? formatCountdown(currentTime, duration) : `-${formatTime(duration)}`) : '-0:00'}
            </span>
          </div>
        </div>
        
        {/* Volume Icon */}
        <div className="flex items-center justify-center w-8 h-8">
          <Volume2 
            size={16} 
            className="text-blue-500" 
          />
        </div>
      </div>
      
      {/* Hidden Audio Element for Functionality */}
      <audio 
        ref={audioRef}
        src={`/audio/${audioFile}`}
        preload="metadata"
        onPlay={() => {
          console.log('Audio playing');
          setIsPlaying(true);
        }}
        onPause={() => {
          console.log('Audio paused');
          setIsPlaying(false);
        }}
        onEnded={() => {
          console.log('Audio ended');
          setIsPlaying(false);
        }}
        onTimeUpdate={() => {
          // Force re-render for progress bar
          setIsPlaying(prev => prev);
        }}
        onError={(e) => {
          console.error('Audio error:', e);
          setError('Audio playback error');
        }}
        className="hidden"
      />
      
      {/* Error Message */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs">
          <p className="text-red-700 font-medium">{error}</p>
          <p className="text-red-600 mt-1">Please check your browser settings and try again.</p>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer; 