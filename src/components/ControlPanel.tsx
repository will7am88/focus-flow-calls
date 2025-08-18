import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MonitorOff,
  Camera,
  CameraOff,
  Phone,
  PhoneOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ControlPanelProps {
  isAudioMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isBackgroundBlurred: boolean;
  isInCall: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleBackgroundBlur: () => void;
  onEndCall: () => void;
  onStartCall: () => void;
}

export function ControlPanel({
  isAudioMuted,
  isVideoOff,
  isScreenSharing,
  isBackgroundBlurred,
  isInCall,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onToggleBackgroundBlur,
  onEndCall,
  onStartCall
}: ControlPanelProps) {
  return (
    <div className="flex items-center justify-center gap-3 p-4 bg-card border-t border-border">
      {/* Audio Control */}
      <Button
        size="lg"
        variant={isAudioMuted ? "destructive" : "secondary"}
        className={cn(
          "control-button h-12 w-12 rounded-xl",
          isAudioMuted 
            ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" 
            : "bg-surface hover:bg-surface-hover border-primary/20"
        )}
        onClick={onToggleAudio}
        disabled={!isInCall}
      >
        {isAudioMuted ? (
          <MicOff className="h-5 w-5" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </Button>

      {/* Video Control */}
      <Button
        size="lg"
        variant={isVideoOff ? "destructive" : "secondary"}
        className={cn(
          "control-button h-12 w-12 rounded-xl",
          isVideoOff 
            ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" 
            : "bg-surface hover:bg-surface-hover border-primary/20"
        )}
        onClick={onToggleVideo}
        disabled={!isInCall}
      >
        {isVideoOff ? (
          <VideoOff className="h-5 w-5" />
        ) : (
          <Video className="h-5 w-5" />
        )}
      </Button>

      {/* Screen Share Control */}
      <Button
        size="lg"
        variant={isScreenSharing ? "default" : "secondary"}
        className={cn(
          "control-button h-12 w-12 rounded-xl",
          isScreenSharing
            ? "bg-primary hover:bg-primary-hover text-primary-foreground"
            : "bg-surface hover:bg-surface-hover border-primary/20"
        )}
        onClick={onToggleScreenShare}
        disabled={!isInCall}
      >
        {isScreenSharing ? (
          <MonitorOff className="h-5 w-5" />
        ) : (
          <Monitor className="h-5 w-5" />
        )}
      </Button>

      {/* Background Blur Control */}
      <Button
        size="lg"
        variant={isBackgroundBlurred ? "default" : "secondary"}
        className={cn(
          "control-button h-12 w-12 rounded-xl",
          isBackgroundBlurred
            ? "bg-primary hover:bg-primary-hover text-primary-foreground"
            : "bg-surface hover:bg-surface-hover border-primary/20"
        )}
        onClick={onToggleBackgroundBlur}
        disabled={!isInCall}
      >
        {isBackgroundBlurred ? (
          <CameraOff className="h-5 w-5" />
        ) : (
          <Camera className="h-5 w-5" />
        )}
      </Button>

      {/* Call Control */}
      <Button
        size="lg"
        variant={isInCall ? "destructive" : "default"}
        className={cn(
          "control-button h-12 w-16 rounded-xl ml-4",
          isInCall
            ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            : "bg-primary hover:bg-primary-hover text-primary-foreground"
        )}
        onClick={isInCall ? onEndCall : onStartCall}
      >
        {isInCall ? (
          <PhoneOff className="h-5 w-5" />
        ) : (
          <Phone className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}