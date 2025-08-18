import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
  isOwnMessage: boolean;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  isOpen: boolean;
  onToggle: () => void;
  onSendMessage: (message: string) => void;
  currentUserId: string;
}

export function ChatPanel({ 
  messages, 
  isOpen, 
  onToggle, 
  onSendMessage,
  currentUserId 
}: ChatPanelProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
      inputRef.current?.focus();
    } else {
      // Count unread messages when panel is closed
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && !lastMessage.isOwnMessage) {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages, isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={onToggle}
        variant="secondary"
        size="lg"
        className={cn(
          "fixed bottom-24 right-4 z-40 h-12 w-12 rounded-xl shadow-medium",
          "bg-card border border-primary/20 hover:bg-surface-hover",
          isOpen && "bg-primary text-primary-foreground hover:bg-primary-hover"
        )}
      >
        <MessageCircle className="h-5 w-5" />
        {unreadCount > 0 && !isOpen && (
          <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </Button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-chat-background border border-chat-border rounded-lg shadow-large z-30 animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-chat-border">
            <h3 className="font-semibold text-sm">Chat</h3>
            <Button
              onClick={onToggle}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-surface"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 h-72">
            <div className="p-3 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No messages yet</p>
                  <p className="text-xs">Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.isOwnMessage ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "chat-message max-w-xs",
                        message.isOwnMessage ? "sent" : "received"
                      )}
                    >
                      {!message.isOwnMessage && (
                        <div className="text-xs font-medium text-muted-foreground mb-1">
                          {message.userName}
                        </div>
                      )}
                      <div className="break-words">{message.message}</div>
                      <div className={cn(
                        "text-xs mt-1 opacity-70",
                        message.isOwnMessage ? "text-right" : "text-left"
                      )}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-3 border-t border-chat-border">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 h-9 bg-background border-border"
                maxLength={500}
              />
              <Button
                type="submit"
                size="sm"
                className="h-9 w-9 p-0 bg-primary hover:bg-primary-hover text-primary-foreground"
                disabled={!inputMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}