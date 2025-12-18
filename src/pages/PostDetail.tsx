import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, ArrowLeft, Send, Play, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { mockPosts, mockComments } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const PostDetail: React.FC = () => {
  const { id } = useParams();
  const post = mockPosts.find(p => p.id === id) || mockPosts[0];
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likes, setLikes] = useState(post.likes);
  const [comment, setComment] = useState('');

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const renderMedia = () => {
    if (!post.mediaUrl) return null;

    switch (post.mediaType) {
      case 'image':
        return (
          <div className="rounded-lg overflow-hidden bg-secondary">
            <img src={post.mediaUrl} alt={post.title} className="w-full object-contain max-h-[600px]" />
          </div>
        );
      case 'video':
        return (
          <div className="relative rounded-lg overflow-hidden bg-secondary aspect-video">
            <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-background/30">
              <div className="h-20 w-20 rounded-full bg-primary/90 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                <Play className="h-10 w-10 text-primary-foreground fill-current ml-1" />
              </div>
            </div>
          </div>
        );
      case 'audio':
        return (
          <div className="rounded-lg bg-gradient-to-r from-[color-mix(in_srgb,var(--accent-primary)20%,transparent)] to-[color-mix(in_srgb,var(--accent-secondary)20%,transparent)] p-8 flex items-center justify-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
              <Music className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="flex gap-1">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full animate-pulse"
                  style={{ height: `${Math.random() * 40 + 10}px`, animationDelay: `${i * 0.05}s` }}
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
    <div className="animate-fade-in">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back to Feed
      </Link>

      <Card className="border-border bg-card">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <Link to={`/community/${post.community.id}`} className="flex items-center gap-2 hover:underline">
              <span className="text-xl">{post.community.icon}</span>
              <span className="font-medium">{post.community.name}</span>
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to={`/profile/${post.author.username}`} className="flex items-center gap-2 hover:underline">
              <Avatar className="h-6 w-6">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.username[0]}</AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground">{post.author.username}</span>
            </Link>
            <span className="text-xs text-muted-foreground ml-auto">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

          {/* Content */}
          {post.content && <p className="text-foreground mb-6 whitespace-pre-wrap">{post.content}</p>}

          {/* Media */}
          {renderMedia()}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border">
            <Button
              variant="ghost"
              className={cn("gap-2", isLiked && "text-destructive")}
              onClick={handleLike}
            >
              <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
              {formatNumber(likes)}
            </Button>
            <Button variant="ghost" className="gap-2">
              <MessageCircle className="h-5 w-5" />
              {formatNumber(post.commentCount)}
            </Button>
            <Button variant="ghost" className="gap-2">
              <Share2 className="h-5 w-5" />
              Share
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "gap-2 ml-auto hover:bg-[color-mix(in_srgb,var(--accent-secondary)10%,transparent)] hover:text-[color:var(--accent-secondary)]",
                isSaved && "text-[color:var(--accent-secondary)]"
              )}
              onClick={() => setIsSaved(!isSaved)}
            >
              <Bookmark className={cn("h-5 w-5", isSaved && "fill-current")} />
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comment Input */}
      <Card className="border-border bg-card mt-4">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
              <AvatarFallback>Y</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <div className="flex justify-end mt-2">
                <Button disabled={!comment.trim()} size="sm" className="gap-2">
                  <Send className="h-4 w-4" />
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments */}
      <div className="mt-4 space-y-4">
        <h2 className="text-lg font-semibold">Comments ({mockComments.length})</h2>
        
        {mockComments.map((comment) => (
          <Card key={comment.id} className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.author.avatar} />
                  <AvatarFallback>{comment.author.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Link to={`/profile/${comment.author.username}`} className="font-medium hover:underline">
                      {comment.author.username}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Button variant="ghost" size="sm" className={cn("h-7 gap-1 text-xs", comment.isLiked && "text-destructive")}>
                      <Heart className={cn("h-3 w-3", comment.isLiked && "fill-current")} />
                      {comment.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      Reply
                    </Button>
                  </div>

                  {/* Nested Replies */}
                  {comment.replies?.map((reply) => (
                    <div key={reply.id} className="mt-4 pl-4 border-l-2 border-border">
                      <div className="flex gap-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={reply.author.avatar} />
                          <AvatarFallback>{reply.author.username[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Link to={`/profile/${reply.author.username}`} className="font-medium text-sm hover:underline">
                              {reply.author.username}
                            </Link>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm">{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PostDetail;
