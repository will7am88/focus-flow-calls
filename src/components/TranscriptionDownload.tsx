import { useState } from 'react';
import { Download, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TranscriptionData {
  id: string;
  callId: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: number;
  completedAt?: number;
  duration: number; // in seconds
  participantCount: number;
  fileSize?: number; // in bytes
  downloadUrl?: string;
}

interface TranscriptionDownloadProps {
  transcription: TranscriptionData | null;
  onRequestTranscription: () => void;
  onDownload: (transcription: TranscriptionData) => void;
  isVisible: boolean;
}

export function TranscriptionDownload({
  transcription,
  onRequestTranscription,
  onDownload,
  isVisible
}: TranscriptionDownloadProps) {
  const [isRequesting, setIsRequesting] = useState(false);

  if (!isVisible) return null;

  const handleRequestTranscription = async () => {
    setIsRequesting(true);
    try {
      await onRequestTranscription();
    } finally {
      setIsRequesting(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${Math.round(kb)} KB`;
    }
    return `${Math.round(kb / 1024 * 10) / 10} MB`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-4 w-4 text-warning animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing':
        return 'Processing...';
      case 'completed':
        return 'Ready';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'processing':
        return 'outline';
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="fixed bottom-4 left-4 w-80 bg-card border border-border shadow-medium animate-fade-in z-30">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Call Transcription</h3>
        </div>

        {/* No Transcription Available */}
        {!transcription && (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Generate a transcription of this call for easy review and sharing.
            </p>
            <Button
              onClick={handleRequestTranscription}
              disabled={isRequesting}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              {isRequesting ? 'Requesting...' : 'Generate Transcription'}
            </Button>
          </div>
        )}

        {/* Transcription Available */}
        {transcription && (
          <div className="space-y-3">
            {/* Status */}
            <div className="flex items-center justify-between">
              <Badge 
                variant={getStatusVariant(transcription.status)}
                className="flex items-center gap-1"
              >
                {getStatusIcon(transcription.status)}
                {getStatusText(transcription.status)}
              </Badge>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{formatDuration(transcription.duration)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Participants:</span>
                <span>{transcription.participantCount}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Created:</span>
                <span>{formatDate(transcription.createdAt)}</span>
              </div>
              
              {transcription.completedAt && (
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span>{formatDate(transcription.completedAt)}</span>
                </div>
              )}
              
              {transcription.fileSize && (
                <div className="flex justify-between">
                  <span>File Size:</span>
                  <span>{formatFileSize(transcription.fileSize)}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              {transcription.status === 'completed' && (
                <Button
                  onClick={() => onDownload(transcription)}
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Transcription
                </Button>
              )}

              {transcription.status === 'failed' && (
                <Button
                  onClick={handleRequestTranscription}
                  variant="outline"
                  disabled={isRequesting}
                  className="w-full"
                >
                  {isRequesting ? 'Retrying...' : 'Try Again'}
                </Button>
              )}

              {transcription.status === 'processing' && (
                <div className="text-center text-sm text-muted-foreground py-2">
                  <Clock className="h-4 w-4 mx-auto mb-1 animate-spin" />
                  Processing transcription...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}