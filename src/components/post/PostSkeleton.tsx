import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export type PostSkeletonType = "text" | "media" | "long";

export const TextPostSkeleton: React.FC = () => (
  <Card className="overflow-hidden border-border bg-card">
    <CardContent className="p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20 ml-auto" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </CardContent>
  </Card>
);

export const MediaPostSkeleton: React.FC = () => (
  <Card className="overflow-hidden border-border bg-card">
    <CardContent className="p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20 ml-auto" />
      </div>
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="aspect-video w-full rounded-lg" />
    </CardContent>
  </Card>
);

export const LongPostSkeleton: React.FC = () => (
  <Card className="overflow-hidden border-border bg-card">
    <CardContent className="p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20 ml-auto" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-2/3" />
    </CardContent>
  </Card>
);

const PostSkeleton: React.FC<{ type?: PostSkeletonType }> = ({ type = "text" }) => {
  if (type === "media") return <MediaPostSkeleton />;
  if (type === "long") return <LongPostSkeleton />;
  return <TextPostSkeleton />;
};

export default PostSkeleton;
