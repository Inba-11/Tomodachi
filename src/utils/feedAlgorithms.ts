import type { Post } from "@/types";

export const calculateHotScore = (post: Post) => {
  const likes = post.likes ?? 0;
  const comments = post.commentCount ?? 0;
  const createdAt = new Date(post.createdAt).getTime();
  const ageHours = (Date.now() - createdAt) / 3_600_000;

  return (likes + comments * 2) / Math.pow(ageHours + 2, 1.5);
};

export const sortByHot = (posts: Post[]) =>
  [...posts].sort((a, b) => calculateHotScore(b) - calculateHotScore(a));

export const sortByNew = (posts: Post[]) =>
  [...posts].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

export const sortByTop = (posts: Post[]) =>
  [...posts].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));

export const sortByRising = (posts: Post[]) =>
  [...posts].sort((a, b) => {
    const engagementA = (a.likes ?? 0) + (a.commentCount ?? 0);
    const engagementB = (b.likes ?? 0) + (b.commentCount ?? 0);
    const ageHoursA =
      (Date.now() - new Date(a.createdAt).getTime()) / 3_600_000 + 1;
    const ageHoursB =
      (Date.now() - new Date(b.createdAt).getTime()) / 3_600_000 + 1;
    return engagementB / ageHoursB - engagementA / ageHoursA;
  });


