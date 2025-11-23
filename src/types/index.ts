export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: Date;
}

export interface AuthUser extends User {
  accessToken: string;
}

export type PostType = 'text' | 'image' | 'video';

export interface Post {
  id: string;
  userId: string;
  user: User;
  type: PostType;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  hashtags: string[];
  mentions: string[];
  likes: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  content: string;
  mentions: string[];
  likes: number;
  isLiked: boolean;
  createdAt: Date;
}

export interface CreatePostData {
  type: PostType;
  content: string;
  mediaFile?: File;
}

export interface CreateCommentData {
  postId: string;
  content: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  displayName: string;
  email: string;
  password: string;
}

export interface GoogleAuthResponse {
  credential: string;
}

export type NotificationType = 'like' | 'comment' | 'mention' | 'follow';

export interface Notification {
  id: string;
  type: NotificationType;
  userId: string;
  user: User;
  postId?: string;
  commentId?: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}
