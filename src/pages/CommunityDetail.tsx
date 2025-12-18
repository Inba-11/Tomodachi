import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Calendar, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostCard from '@/components/post/PostCard';
import { mockCommunities, mockPosts } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const CommunityDetail: React.FC = () => {
  const { id } = useParams();
  const community = mockCommunities.find(c => c.id === id) || mockCommunities[0];
  const communityPosts = mockPosts.filter(p => p.community.id === community.id);
  const [isJoined, setIsJoined] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <div className="animate-fade-in -mx-4 -mt-6">
      {/* Banner */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img
          src={community.banner}
          alt={community.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Community Info */}
      <div className="px-4 -mt-16 relative">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
          <div className="h-24 w-24 rounded-2xl bg-card border-4 border-background flex items-center justify-center text-5xl shadow-lg">
            {community.icon}
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">{community.name}</h1>
            <p className="text-muted-foreground mt-1">{community.description}</p>
          </div>

          <Button
            size="lg"
            className={cn(
              "shrink-0",
              isJoined && "bg-secondary text-foreground hover:bg-secondary/80"
            )}
            onClick={() => setIsJoined(!isJoined)}
          >
            {isJoined ? 'Joined' : 'Join Community'}
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{formatNumber(community.memberCount)}</span>
            <span className="text-muted-foreground">members</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[color:var(--accent-secondary)] animate-pulse" />
            <span className="font-semibold">{formatNumber(community.onlineCount)}</span>
            <span className="text-muted-foreground">online</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Created {format(new Date(community.createdAt), 'MMM yyyy')}
            </span>
          </div>
        </div>

        {/* Content */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="bg-secondary/50 mb-4">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            {communityPosts.length > 0 ? (
              communityPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <Card className="border-border bg-card">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="about">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Community Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                {community.rules ? (
                  <ol className="list-decimal list-inside space-y-2">
                    {community.rules.map((rule, index) => (
                      <li key={index} className="text-muted-foreground">{rule}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-muted-foreground">No specific rules defined for this community.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommunityDetail;
