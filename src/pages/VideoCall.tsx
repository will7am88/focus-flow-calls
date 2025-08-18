import { useState, useEffect, useCallback, useRef } from 'react';
import { VideoGrid } from '@/components/VideoGrid';
import { ControlPanel } from '@/components/ControlPanel';
import { ChatPanel } from '@/components/ChatPanel';
import { ParticipantList } from '@/components/ParticipantList';
import { ReactionButtons } from '@/components/ReactionButtons';
import { ThemeSelector } from '@/components/ThemeSelector';
import { PasswordModal } from '@/components/PasswordModal';
import { TranscriptionDownload } from '@/components/TranscriptionDownload';
import { useToast } from '@/hooks/use-toast';

// Types for the video call interface
interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
  isOwnMessage: boolean;
}

interface Participant {
  id: string;
  name: string;
  isAudioMuted: boolean;
  isVideoOff: boolean;
  isHost: boolean;
  isCurrentUser: boolean;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
}

interface Reaction {
  id: string;
  emoji: string;
  timestamp: number;
}

interface TranscriptionData {
  id: string;
  callId: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: number;
  completedAt?: number;
  duration: number;
  participantCount: number;
  fileSize?: number;
  downloadUrl?: string;
}

export default function VideoCall() {
  // State management
  const [isInCall, setIsInCall] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  
  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  // Participant state
  const [showParticipants, setShowParticipants] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: 'current-user',
      name: 'You',
      isAudioMuted: false,
      isVideoOff: false,
      isHost: true,
      isCurrentUser: true,
      connectionStatus: 'connected'
    }
  ]);
  
  // Media streams
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  
  // Reactions
  const [reactions, setReactions] = useState<Reaction[]>([]);
  
  // Transcription
  const [transcription, setTranscription] = useState<TranscriptionData | null>(null);
  const [showTranscription, setShowTranscription] = useState(false);
  
  // WebRTC and Socket.io refs for integration
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<any>(null); // Socket.io instance
  
  const { toast } = useToast();

  // Initialize media stream
  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        variant: "destructive",
        title: "Media Access Error",
        description: "Unable to access camera or microphone. Please check permissions.",
      });
      return null;
    }
  }, [toast]);

  // WebRTC Integration Hook
  const initializeWebRTC = useCallback(async () => {
    if (!peerConnectionRef.current) {
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          // Add your TURN servers here for production
        ]
      });

      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.emit('ice-candidate', event.candidate);
        }
      };

      peerConnection.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      peerConnectionRef.current = peerConnection;
    }
  }, []);

  // Socket.io Integration Hook
  const initializeSocket = useCallback(() => {
    // Initialize Socket.io connection
    // socketRef.current = io('your-server-url');
    
    // Socket event handlers
    /*
    socketRef.current.on('user-joined', (user) => {
      setParticipants(prev => [...prev, user]);
    });

    socketRef.current.on('user-left', (userId) => {
      setParticipants(prev => prev.filter(p => p.id !== userId));
    });

    socketRef.current.on('chat-message', (message) => {
      setChatMessages(prev => [...prev, message]);
    });

    socketRef.current.on('reaction', (reaction) => {
      setReactions(prev => [...prev, reaction]);
    });
    */
  }, []);

  // Call controls
  const handleStartCall = useCallback(async () => {
    const stream = await initializeMedia();
    if (stream) {
      setIsInCall(true);
      setIsRecording(true);
      await initializeWebRTC();
      initializeSocket();
      
      toast({
        title: "Call Started",
        description: "You're now connected to the call.",
      });
    }
  }, [initializeMedia, initializeWebRTC, initializeSocket, toast]);

  const handleEndCall = useCallback(() => {
    // Clean up streams
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    // Clean up WebRTC
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    // Clean up Socket.io
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    
    setIsInCall(false);
    setIsRecording(false);
    setRemoteStream(null);
    setShowTranscription(true);
    
    toast({
      title: "Call Ended",
      description: "The call has been terminated.",
    });
  }, [localStream, toast]);

  const handleToggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
        
        // Update participant list
        setParticipants(prev => 
          prev.map(p => 
            p.isCurrentUser 
              ? { ...p, isAudioMuted: !audioTrack.enabled }
              : p
          )
        );
      }
    }
  }, [localStream]);

  const handleToggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
        
        // Update participant list
        setParticipants(prev => 
          prev.map(p => 
            p.isCurrentUser 
              ? { ...p, isVideoOff: !videoTrack.enabled }
              : p
          )
        );
      }
    }
  }, [localStream]);

  const handleToggleScreenShare = useCallback(async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        // Replace video track in peer connection
        if (peerConnectionRef.current && localStream) {
          const videoTrack = screenStream.getVideoTracks()[0];
          const sender = peerConnectionRef.current.getSenders().find(s => 
            s.track?.kind === 'video'
          );
          
          if (sender && videoTrack) {
            await sender.replaceTrack(videoTrack);
          }
        }
        
        setIsScreenSharing(true);
        
        // Handle screen share ending
        screenStream.getVideoTracks()[0].addEventListener('ended', () => {
          setIsScreenSharing(false);
        });
      } else {
        // Switch back to camera
        if (localStream && peerConnectionRef.current) {
          const videoTrack = localStream.getVideoTracks()[0];
          const sender = peerConnectionRef.current.getSenders().find(s => 
            s.track?.kind === 'video'
          );
          
          if (sender && videoTrack) {
            await sender.replaceTrack(videoTrack);
          }
        }
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
      toast({
        variant: "destructive",
        title: "Screen Share Error",
        description: "Unable to start screen sharing.",
      });
    }
  }, [isScreenSharing, localStream, toast]);

  const handleToggleBackgroundBlur = useCallback(() => {
    setIsBackgroundBlurred(!isBackgroundBlurred);
    // Implement background blur logic here
    toast({
      title: isBackgroundBlurred ? "Background Blur Off" : "Background Blur On",
      description: isBackgroundBlurred 
        ? "Background blur has been disabled." 
        : "Background blur is now active.",
    });
  }, [isBackgroundBlurred, toast]);

  // Chat handlers
  const handleSendMessage = useCallback((message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      message,
      timestamp: Date.now(),
      isOwnMessage: true
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    
    // Send via Socket.io
    if (socketRef.current) {
      socketRef.current.emit('chat-message', newMessage);
    }
  }, []);

  // Reaction handler
  const handleReaction = useCallback((emoji: string) => {
    const reaction: Reaction = {
      id: Date.now().toString(),
      emoji,
      timestamp: Date.now()
    };
    
    setReactions(prev => [...prev, reaction]);
    
    // Send via Socket.io
    if (socketRef.current) {
      socketRef.current.emit('reaction', reaction);
    }
    
    // Clean up old reactions
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== reaction.id));
    }, 3000);
  }, []);

  // Password modal handlers
  const handlePasswordSubmit = useCallback(async (password: string) => {
    setIsPasswordLoading(true);
    setPasswordError('');
    
    try {
      // Implement password verification logic here
      // const response = await fetch('/api/verify-room-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ password })
      // });
      
      // Simulate password verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (password === 'demo123') { // Demo password
        setShowPasswordModal(false);
        await handleStartCall();
      } else {
        setPasswordError('Invalid password. Please try again.');
      }
    } catch (error) {
      setPasswordError('Connection error. Please try again.');
    } finally {
      setIsPasswordLoading(false);
    }
  }, [handleStartCall]);

  // Transcription handlers
  const handleRequestTranscription = useCallback(async () => {
    try {
      // Implement transcription request logic
      // const response = await fetch('/transcribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ callId: 'current-call-id' })
      // });
      
      const newTranscription: TranscriptionData = {
        id: Date.now().toString(),
        callId: 'demo-call-id',
        status: 'processing',
        createdAt: Date.now(),
        duration: 300, // 5 minutes demo
        participantCount: participants.length
      };
      
      setTranscription(newTranscription);
      
      // Simulate processing completion
      setTimeout(() => {
        setTranscription(prev => prev ? {
          ...prev,
          status: 'completed',
          completedAt: Date.now(),
          fileSize: 45678, // Demo file size
          downloadUrl: '/demo-transcription.txt'
        } : null);
      }, 3000);
      
      toast({
        title: "Transcription Requested",
        description: "Your transcription is being processed.",
      });
    } catch (error) {
      console.error('Error requesting transcription:', error);
      toast({
        variant: "destructive",
        title: "Transcription Error",
        description: "Unable to process transcription request.",
      });
    }
  }, [participants.length, toast]);

  const handleDownloadTranscription = useCallback((transcriptionData: TranscriptionData) => {
    // Implement download logic
    const link = document.createElement('a');
    link.href = transcriptionData.downloadUrl || '#';
    link.download = `call-transcription-${transcriptionData.callId}.txt`;
    link.click();
    
    toast({
      title: "Download Started",
      description: "Your transcription is being downloaded.",
    });
  }, [toast]);

  // Show password modal on component mount (demo behavior)
  useEffect(() => {
    setShowPasswordModal(true);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Theme Selector */}
      <ThemeSelector />
      
      {/* Main Video Interface */}
      <div className="flex-1 flex">
        <VideoGrid
          localStream={localStream}
          remoteStream={remoteStream}
          isLocalMuted={isAudioMuted}
          isLocalVideoOff={isVideoOff}
          isRemoteMuted={false} // Get from participant state
          isRemoteVideoOff={false} // Get from participant state  
          isRecording={isRecording}
          participantName="Demo User"
          currentUserName="You"
          reactions={reactions}
        />
      </div>
      
      {/* Controls */}
      <ControlPanel
        isAudioMuted={isAudioMuted}
        isVideoOff={isVideoOff}
        isScreenSharing={isScreenSharing}
        isBackgroundBlurred={isBackgroundBlurred}
        isInCall={isInCall}
        onToggleAudio={handleToggleAudio}
        onToggleVideo={handleToggleVideo}
        onToggleScreenShare={handleToggleScreenShare}
        onToggleBackgroundBlur={handleToggleBackgroundBlur}
        onEndCall={handleEndCall}
        onStartCall={handleStartCall}
      />
      
      {/* Participant List */}
      <ParticipantList
        participants={participants}
        isVisible={showParticipants && isInCall}
      />
      
      {/* Chat Panel */}
      <ChatPanel
        messages={chatMessages}
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        onSendMessage={handleSendMessage}
        currentUserId="current-user"
      />
      
      {/* Reaction Buttons */}
      <ReactionButtons
        onReaction={handleReaction}
        disabled={!isInCall}
      />
      
      {/* Password Modal */}
      <PasswordModal
        isOpen={showPasswordModal}
        onSubmit={handlePasswordSubmit}
        onCancel={() => setShowPasswordModal(false)}
        error={passwordError}
        isLoading={isPasswordLoading}
        required={false}
      />
      
      {/* Transcription Download */}
      <TranscriptionDownload
        transcription={transcription}
        onRequestTranscription={handleRequestTranscription}
        onDownload={handleDownloadTranscription}
        isVisible={showTranscription}
      />
    </div>
  );
}