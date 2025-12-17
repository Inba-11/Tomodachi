export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  banner?: string;
  bio?: string;
  karma: number;
  createdAt: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  icon: string;
  banner: string;
  memberCount: number;
  onlineCount: number;
  createdAt: string;
  rules?: string[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  mediaType: 'text' | 'image' | 'video' | 'audio';
  mediaUrl?: string;
  author: User;
  community: Community;
  likes: number;
  commentCount: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  postId: string;
  parentId?: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
