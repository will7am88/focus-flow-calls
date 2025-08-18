import { useEffect, useState } from 'react';

interface Reaction {
  id: string;
  emoji: string;
  timestamp: number;
}

interface ReactionOverlayProps {
  reactions: Reaction[];
}

export function ReactionOverlay({ reactions }: ReactionOverlayProps) {
  const [visibleReactions, setVisibleReactions] = useState<Reaction[]>([]);

  useEffect(() => {
    // Filter reactions from the last 3 seconds
    const now = Date.now();
    const recentReactions = reactions.filter(
      reaction => now - reaction.timestamp < 3000
    );
    
    setVisibleReactions(recentReactions);
  }, [reactions]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {visibleReactions.map((reaction) => (
        <div
          key={reaction.id}
          className="absolute animate-reaction-pop text-4xl"
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
          }}
        >
          {reaction.emoji}
        </div>
      ))}
    </div>
  );
}