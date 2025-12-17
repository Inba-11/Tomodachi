import React, { useState } from 'react';
import { Flame, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostCard from '@/components/post/PostCard';
import PostSkeleton from '@/components/post/PostSkeleton';
import { mockPosts } from '@/data/mockData';
import { cn } from '@/lib/utils';

const Feed: React.FC = () => {
  const [activeTab, setActiveTab] = useState('hot');
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'hot', label: 'Hot', icon: Flame },
    { id: 'new', label: 'New', icon: Sparkles },
    { id: 'top', label: 'Top', icon: TrendingUp },
    { id: 'recent', label: 'Recent', icon: Clock },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">
          <span className="gradient-text">Your Feed</span>
        </h1>
        
        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-secondary/50 p-1">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {isLoading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : (
          mockPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

      {/* Load More */}
      <div className="flex justify-center py-4">
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
          Load More Posts
        </Button>
      </div>
    </div>
  );
};

export default Feed;
