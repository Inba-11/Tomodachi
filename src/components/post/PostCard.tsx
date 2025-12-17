import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Play, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Post } from '@/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const renderMedia = () => {
    if (!post.mediaUrl) return null;

    switch (post.mediaType) {
      case 'image':
        return (
          <div className="relative aspect-video overflow-hidden rounded-lg bg-secondary">
            <img
              src={post.mediaUrl}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        );
      case 'video':
        return (
          <div className="relative aspect-video overflow-hidden rounded-lg bg-secondary">
            <img
              src={post.mediaUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-background/30">
              <div className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center">
                <Play className="h-8 w-8 text-primary-foreground fill-current ml-1" />
              </div>
            </div>
          </div>
        );
      case 'audio':
        return (
          <div className="relative h-24 overflow-hidden rounded-lg bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 flex items-center justify-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              <Music className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex gap-1">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 30 + 10}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300"
      onClick={() => navigate(`/post/${post.id}`)}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <Link 
            to={`/community/${post.community.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 hover:underline"
          >
            <span className="text-lg">{post.community.icon}</span>
            <span className="text-sm font-medium text-muted-foreground">
              {post.community.name}
            </span>
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link 
            to={`/profile/${post.author.username}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 hover:underline"
          >
            <Avatar className="h-5 w-5">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.username[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{post.author.username}</span>
          </Link>
          <span className="text-xs text-muted-foreground ml-auto">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        {/* Content Preview */}
        {post.mediaType === 'text' && (
          <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
            {post.content}
          </p>
        )}

        {/* Media */}
        {renderMedia()}

        {/* Actions */}
        <div className="flex items-center gap-1 mt-4 -ml-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-2 hover:bg-destructive/10 hover:text-destructive",
              isLiked && "text-destructive"
            )}
            onClick={handleLike}
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
            <span>{formatNumber(likes)}</span>
          </Button>

          <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 hover:text-primary">
            <MessageCircle className="h-4 w-4" />
            <span>{formatNumber(post.commentCount)}</span>
          </Button>

          <Button variant="ghost" size="sm" className="gap-2 hover:bg-accent/10 hover:text-accent">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-2 hover:bg-neon-green/10 hover:text-neon-green ml-auto",
              isSaved && "text-neon-green"
            )}
            onClick={handleSave}
          >
            <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Hide post</DropdownMenuItem>
              <DropdownMenuItem>Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
