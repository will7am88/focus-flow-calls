import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Users, Volume2, VolumeX } from 'lucide-react';
import { ReactionOverlay } from './ReactionOverlay';

interface VideoGridProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isLocalMuted: boolean;
  isLocalVideoOff: boolean;
  isRemoteMuted: boolean;
  isRemoteVideoOff: boolean;
  isRecording: boolean;
  participantName: string;
  currentUserName: string;
  reactions: { id: string; emoji: string; timestamp: number }[];
}

export function VideoGrid({
  localStream,
  remoteStream,
  isLocalMuted,
  isLocalVideoOff,
  isRemoteMuted,
  isRemoteVideoOff,
  isRecording,
  participantName,
  currentUserName,
  reactions
}: VideoGridProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localVideoError, setLocalVideoError] = useState(false);
  const [remoteVideoError, setRemoteVideoError] = useState(false);

  // Handle local stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      setLocalVideoError(false);
    }
  }, [localStream]);

  // Handle remote stream  
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      setRemoteVideoError(false);
    }
  }, [remoteStream]);

  const handleLocalVideoError = () => {
    setLocalVideoError(true);
  };

  const handleRemoteVideoError = () => {
    setRemoteVideoError(true);
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
      {/* Recording Indicator */}
      {isRecording && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-card border border-recording rounded-lg px-3 py-2 shadow-medium animate-fade-in">
          <div className="w-2 h-2 bg-recording rounded-full animate-recording-pulse" />
          <span className="text-sm font-medium text-recording">Recording</span>
        </div>
      )}

      {/* Remote Video Stream */}
      <div className="video-stream aspect-video relative group">
        {remoteStream && !isRemoteVideoOff && !remoteVideoError ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            onError={handleRemoteVideoError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-3 mx-auto">
                {isRemoteVideoOff ? (
                  <VideoOff className="w-8 h-8 text-primary-foreground" />
                ) : (
                  <Users className="w-8 h-8 text-primary-foreground" />
                )}
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {participantName || "Waiting for participant..."}
              </p>
            </div>
          </div>
        )}

        {/* Remote User Info Overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className="text-white text-sm font-medium truncate max-w-32">
            {participantName || "Participant"}
          </span>
          {isRemoteMuted ? (
            <MicOff className="w-3 h-3 text-red-400" />
          ) : (
            <Mic className="w-3 h-3 text-green-400" />
          )}
          {isRemoteMuted ? (
            <VolumeX className="w-3 h-3 text-white/60" />
          ) : (
            <Volume2 className="w-3 h-3 text-white/60" />
          )}
        </div>

        <ReactionOverlay reactions={reactions} />
      </div>

      {/* Local Video Stream */}
      <div className="video-stream aspect-video relative group lg:order-last">
        {localStream && !isLocalVideoOff && !localVideoError ? (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
            onError={handleLocalVideoError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-3 mx-auto">
                {isLocalVideoOff ? (
                  <VideoOff className="w-8 h-8 text-primary-foreground" />
                ) : (
                  <Users className="w-8 h-8 text-primary-foreground" />
                )}
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {currentUserName || "You"}
              </p>
            </div>
          </div>
        )}

        {/* Local User Info Overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className="text-white text-sm font-medium">
            {currentUserName || "You"}
          </span>
          {isLocalMuted ? (
            <MicOff className="w-3 h-3 text-red-400" />
          ) : (
            <Mic className="w-3 h-3 text-green-400" />
          )}
        </div>
      </div>
    </div>
  );
}