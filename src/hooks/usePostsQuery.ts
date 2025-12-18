import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/services/api";
import type { Post } from "@/types";

export type FeedSort = "hot" | "new" | "top" | "rising";

interface UsePostsQueryOptions {
  sort: FeedSort;
}

export const usePostsQuery = ({ sort }: UsePostsQueryOptions) => {
  return useQuery<Post[]>({
    queryKey: ["posts", { sort }],
    queryFn: () => getPosts({ sort }),
    staleTime: 60_000,
  });
}


