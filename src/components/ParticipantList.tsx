import { Users, Mic, MicOff, Video, VideoOff, Crown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Participant {
  id: string;
  name: string;
  isAudioMuted: boolean;
  isVideoOff: boolean;
  isHost: boolean;
  isCurrentUser: boolean;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
}

interface ParticipantListProps {
  participants: Participant[];
  isVisible: boolean;
}

export function ParticipantList({ participants, isVisible }: ParticipantListProps) {
  if (!isVisible) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-success';
      case 'connecting':
        return 'bg-warning';
      case 'disconnected':
        return 'bg-destructive';
      default:
        return 'bg-muted';
    }
  };

  const getConnectionStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card className="fixed top-4 right-4 w-64 bg-card border border-border shadow-medium animate-fade-in z-30">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">
            Participants ({participants.length})
          </h3>
        </div>

        {/* Participant List */}
        <div className="space-y-2">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg transition-colors",
                participant.isCurrentUser 
                  ? "bg-primary/10 border border-primary/20" 
                  : "hover:bg-surface"
              )}
            >
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                    {getInitials(participant.name)}
                  </AvatarFallback>
                </Avatar>
                
                {/* Connection Status Indicator */}
                <div 
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
                    getConnectionStatusColor(participant.connectionStatus)
                  )}
                />
              </div>

              {/* Participant Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium truncate">
                    {participant.name}
                    {participant.isCurrentUser && ' (You)'}
                  </span>
                  {participant.isHost && (
                    <Crown className="h-3 w-3 text-warning flex-shrink-0" />
                  )}
                </div>
                
                <div className="flex items-center gap-1 mt-0.5">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs px-1.5 py-0 h-4",
                      participant.connectionStatus === 'connected' && "border-success/30 text-success",
                      participant.connectionStatus === 'connecting' && "border-warning/30 text-warning", 
                      participant.connectionStatus === 'disconnected' && "border-destructive/30 text-destructive"
                    )}
                  >
                    {getConnectionStatusText(participant.connectionStatus)}
                  </Badge>
                </div>
              </div>

              {/* Audio/Video Status */}
              <div className="flex items-center gap-1">
                {participant.isAudioMuted ? (
                  <MicOff className="h-3 w-3 text-destructive" />
                ) : (
                  <Mic className="h-3 w-3 text-success" />
                )}
                {participant.isVideoOff ? (
                  <VideoOff className="h-3 w-3 text-destructive" />
                ) : (
                  <Video className="h-3 w-3 text-success" />
                )}
              </div>
            </div>
          ))}

          {participants.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-4">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No participants yet</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}