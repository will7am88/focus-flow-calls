import { useState } from 'react';
import { Smile, Heart, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ReactionButtonsProps {
  onReaction: (emoji: string) => void;
  disabled?: boolean;
}

const reactions = [
  { emoji: '👍', label: 'Thumbs up', icon: ThumbsUp },
  { emoji: '😄', label: 'Smile', icon: Smile },
  { emoji: '🎉', label: 'Celebrate', icon: Heart },
];

export function ReactionButtons({ onReaction, disabled = false }: ReactionButtonsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [recentReaction, setRecentReaction] = useState<string | null>(null);

  const handleReaction = (emoji: string) => {
    onReaction(emoji);
    setRecentReaction(emoji);
    setIsExpanded(false);

    // Clear recent reaction after animation
    setTimeout(() => {
      setRecentReaction(null);
    }, 1000);
  };

  return (
    <div className="fixed bottom-32 right-4 z-40">
      {/* Reaction Buttons */}
      {isExpanded && (
        <div className="flex flex-col gap-2 mb-2 animate-fade-in">
          {reactions.map((reaction) => (
            <Button
              key={reaction.emoji}
              onClick={() => handleReaction(reaction.emoji)}
              variant="secondary"
              size="lg"
              disabled={disabled}
              className={cn(
                "h-12 w-12 rounded-xl bg-card border border-primary/20 hover:bg-surface-hover shadow-medium",
                "hover:scale-110 transition-all duration-200"
              )}
              title={reaction.label}
            >
              <span className="text-xl">{reaction.emoji}</span>
            </Button>
          ))}
        </div>
      )}

      {/* Toggle Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        variant="secondary"
        size="lg"
        disabled={disabled}
        className={cn(
          "h-12 w-12 rounded-xl shadow-medium",
          "bg-card border border-primary/20 hover:bg-surface-hover",
          isExpanded && "bg-primary text-primary-foreground hover:bg-primary-hover"
        )}
      >
        {recentReaction ? (
          <span className="text-xl animate-scale-in">{recentReaction}</span>
        ) : (
          <Smile className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}