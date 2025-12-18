import React, { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Post } from "@/types";
import PostCard from "@/components/post/PostCard";
import { useFeedState } from "@/hooks/useFeedState";

interface VirtualizedFeedProps {
  posts: Post[];
  isLoading: boolean;
  skeleton: React.ReactNode;
}

export const VirtualizedFeed: React.FC<VirtualizedFeedProps> = ({
  posts,
  isLoading,
  skeleton,
}) => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const { state, setScrollY } = useFeedState();

  const rowVirtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 160,
    overscan: 5,
  });

  useEffect(() => {
    if (parentRef.current && state.scrollY) {
      parentRef.current.scrollTop = state.scrollY;
    }
  }, [state.scrollY]);

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;
    const handler = () => setScrollY(el.scrollTop);
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, [setScrollY]);

  if (isLoading && posts.length === 0) {
    return <div className="space-y-4">{skeleton}</div>;
  }

  return (
    <div ref={parentRef} className="h-[calc(100vh-10rem)] overflow-auto">
      <div
        style={{
          height: rowVirtualizer.getTotalSize(),
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const post = posts[virtualRow.index];
          return (
            <div
              key={post.id}
              className="absolute left-0 w-full"
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              <PostCard post={post} />
            </div>
          );
        })}
      </div>
    </div>
  );
};


