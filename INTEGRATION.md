# Bidnes.chat Integration Guide

## Overview
This document outlines the integration points for connecting the Bidnes.chat frontend with backend services including WebRTC (PeerJS), Socket.io, and Whisper.cpp transcription.

## 🔧 Backend Integration Points

### 1. WebRTC Integration (PeerJS)

**Location**: `src/pages/VideoCall.tsx` - `initializeWebRTC` function

```typescript
// Install PeerJS
npm install peerjs @types/peerjs

// Usage in VideoCall component:
import Peer from 'peerjs';

const peer = new Peer('unique-user-id', {
  host: 'your-peerjs-server.com',
  port: 9000,
  path: '/myapp'
});

// Connection handling is already implemented in the component
```

### 2. Socket.io Integration

**Location**: `src/pages/VideoCall.tsx` - `initializeSocket` function

```typescript
// Install Socket.io client
npm install socket.io-client

// Uncomment and configure in VideoCall component:
import { io } from 'socket.io-client';

const socket = io('wss://your-server.com');

// Event handlers are already prepared for:
// - user-joined, user-left
// - chat-message, reaction
// - ice-candidate exchange
```

### 3. Transcription Service Integration

**Location**: `src/pages/VideoCall.tsx` - `handleRequestTranscription` function

**Endpoint**: `POST /transcribe`

```typescript
// Expected request format:
{
  callId: string,
  audioData?: Blob, // Optional audio data
  duration: number,
  participants: string[]
}

// Expected response format:
{
  transcriptionId: string,
  status: 'processing' | 'completed' | 'failed',
  downloadUrl?: string
}
```

## 🎨 Design System

### Colors (HSL Format)
- **Primary Blue**: `hsl(224, 76%, 48%)` (#1E40AF)
- **Secondary Blue**: `hsl(220, 91%, 69%)` (#60A5FA)
- **Navy Dark Mode**: `hsl(224, 68%, 24%)` (#1E3A8A)
- **Background**: `hsl(0, 0%, 100%)` (White)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Animations
- Smooth fades: 300ms ease-out
- Hover effects: 200ms transitions
- Scale animations for reactions
- Recording pulse animation

## 📱 Mobile Responsiveness

The interface is fully responsive with:
- Adaptive video grid (stacked on mobile)
- Touch-friendly button sizes (minimum 44px)
- Responsive chat panel (full-width on mobile)
- Collapsible participant list

## 🔒 Security Features

### Password Protection
- Secure room entry modal
- Input validation and error handling
- Encrypted connection indicators

### Media Permissions
- Graceful camera/microphone access handling
- Error states for permission denials
- Fallback UI for missing streams

## 🎥 Video Features

### Implemented Components
- **VideoGrid**: Dual video stream display
- **ControlPanel**: Audio/video/screen share controls
- **ReactionOverlay**: Animated emoji reactions
- **ChatPanel**: Real-time text messaging
- **ParticipantList**: Live participant status
- **TranscriptionDownload**: Post-call transcription

### Media Constraints
```typescript
const videoConstraints = {
  width: { ideal: 1280 },
  height: { ideal: 720 },
  frameRate: { ideal: 30 }
};

const audioConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true
};
```

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install peerjs socket.io-client @types/peerjs
   ```

2. **Configure Environment**:
   ```bash
   # Add to .env.local
   VITE_PEER_SERVER_HOST=your-peerjs-server.com
   VITE_PEER_SERVER_PORT=9000
   VITE_SOCKET_SERVER_URL=wss://your-server.com
   VITE_TRANSCRIPTION_API_URL=https://your-api.com/transcribe
   ```

3. **Enable Backend Services**:
   - Uncomment Socket.io initialization in VideoCall.tsx
   - Configure WebRTC STUN/TURN servers
   - Set up transcription API endpoint

4. **Test Integration**:
   - Password: `demo123` (for development)
   - All UI components are functional
   - Backend integration points are clearly marked

## 📊 Performance Optimizations

- Lazy loading for non-critical components
- Efficient state management with React hooks
- Minimal re-renders with useCallback
- Optimized video stream handling

## 🎯 Next Steps

1. Connect to your PeerJS signaling server
2. Implement Socket.io real-time events
3. Set up Whisper.cpp transcription endpoint
4. Add production STUN/TURN servers
5. Implement user authentication
6. Add call recording functionality

The frontend is production-ready and follows modern React patterns with TypeScript, making backend integration straightforward and maintainable.