import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Community } from '@/types';
import { cn } from '@/lib/utils';

interface CommunityCardProps {
  community: Community;
  variant?: 'default' | 'compact';
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community, variant = 'default' }) => {
  const [isJoined, setIsJoined] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  if (variant === 'compact') {
    return (
      <Link to={`/community/${community.id}`}>
        <Card className="overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300">
          <CardContent className="p-3 flex items-center gap-3">
            <span className="text-2xl">{community.icon}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{community.name}</h3>
              <p className="text-xs text-muted-foreground">{formatNumber(community.memberCount)} members</p>
            </div>
            <Button
              size="sm"
              variant={isJoined ? "outline" : "default"}
              onClick={(e) => {
                e.preventDefault();
                setIsJoined(!isJoined);
              }}
              className={cn(
                "shrink-0",
                isJoined && "border-primary text-primary hover:bg-primary/10"
              )}
            >
              {isJoined ? 'Joined' : 'Join'}
            </Button>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/community/${community.id}`}>
      <Card className="overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300 group">
        {/* Banner */}
        <div className="relative h-24 overflow-hidden">
          <img
            src={community.banner}
            alt={community.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        </div>

        <CardContent className="p-4 -mt-8 relative">
          {/* Icon */}
          <div className="h-14 w-14 rounded-xl bg-card border-4 border-card flex items-center justify-center text-3xl mb-2">
            {community.icon}
          </div>

          {/* Info */}
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
            {community.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {community.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{formatNumber(community.memberCount)} members</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-neon-green animate-pulse" />
              <span>{formatNumber(community.onlineCount)} online</span>
            </div>
          </div>

          {/* Join Button */}
          <Button
            className={cn(
              "w-full",
              isJoined && "bg-secondary text-foreground hover:bg-secondary/80"
            )}
            onClick={(e) => {
              e.preventDefault();
              setIsJoined(!isJoined);
            }}
          >
            {isJoined ? 'Joined' : 'Join Community'}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CommunityCard;
