import { AppUser } from "cocobase";

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

export type PostType = "text" | "image" | "video";

export interface Post {
  user_id: string;
  user: AppUser;
  postType: PostType;
  content: string;
  file?: string;
  mediaType?: string;
  hashtags: string[];
  mentions: string[];
  likes: string[];
  comment_ids?:string[]
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

export type NotificationType = "like" | "comment" | "mention" | "follow";

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

export type MessageType = "text" | "image" | "video" | "voice" | "file";

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  sender: User;
  type: MessageType;
  content: string;
  mediaUrl?: string;
  fileName?: string;
  fileSize?: number;
  duration?: number; // For voice messages
  isRead: boolean;
  createdAt: Date;
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
  createdAt: Date;
}

export interface UserProfile extends User {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
}
