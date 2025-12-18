import React, { useMemo, useState } from "react";
import { Flame, Clock, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostSkeleton from "@/components/post/PostSkeleton";
import { cn } from "@/lib/utils";
import { useFeedState } from "@/hooks/useFeedState";
import { usePostsQuery, FeedSort } from "@/hooks/usePostsQuery";
import { sortByHot, sortByNew, sortByTop, sortByRising } from "@/utils/feedAlgorithms";
import { VirtualizedFeed } from "@/components/feed/VirtualizedFeed";
import { MoodFilter, PostMood } from "@/components/feed/MoodFilter";
import { mockPosts } from "@/data/mockData";

const Feed: React.FC = () => {
  const { state, setTab } = useFeedState();
  const [mood, setMood] = useState<PostMood>(null);

  const tabs: { id: FeedSort; label: string; icon: React.ComponentType<any> }[] = [
    { id: "hot", label: "Hot", icon: Flame },
    { id: "new", label: "New", icon: Sparkles },
    { id: "top", label: "Top", icon: TrendingUp },
    { id: "rising", label: "Rising", icon: Clock },
  ];

  // For now use mockPosts and sort client-side; swap to usePostsQuery when backend is ready
  const sortFn = (sort: FeedSort) => {
    switch (sort) {
      case "hot":
        return sortByHot;
      case "new":
        return sortByNew;
      case "top":
        return sortByTop;
      case "rising":
        return sortByRising;
      default:
        return sortByHot;
    }
  };

  const filtered = useMemo(() => {
    let posts = [...mockPosts];
    if (mood) {
      posts = posts.filter((p) => p.mood === mood);
    }
    const sorter = sortFn(state.tab as FeedSort);
    return sorter(posts);
  }, [mood, state.tab]);

  const isLoading = false;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">
          <span className="gradient-text">Your Feed</span>
        </h1>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Filter Tabs */}
          <Tabs
            value={state.tab}
            onValueChange={(val) => setTab(val as FeedSort)}
          >
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

          {/* Mood filter */}
          <MoodFilter value={mood} onChange={setMood} />
        </div>
      </div>

      {/* Posts */}
      <VirtualizedFeed
        posts={filtered}
        isLoading={isLoading}
        skeleton={
          <>
            <PostSkeleton />
            <PostSkeleton type="media" />
            <PostSkeleton type="long" />
          </>
        }
      />

      {/* Load More (placeholder for infinite scroll) */}
      <div className="flex justify-center py-4">
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
        >
          Load More Posts
        </Button>
      </div>
    </div>
  );
};

export default Feed;
