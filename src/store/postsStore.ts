import { create } from "zustand";
import { Post } from "../types";
import db from "../lib/cocobase";
import { Document } from "cocobase";

interface PostsState {
  posts: Document<Post>[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Actions
  fetchPosts: (forceRefresh?: boolean) => Promise<void>;
  addPost: (post: Document<Post>) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
  deletePost: (postId: string) => void;
  getPostById: (postId: string) => Document<Post> | undefined;
  toggleLike: (postId: string) => void;
  incrementCommentCount: (postId: string) => void;
  clearPosts: () => void;
}

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchPosts: async (forceRefresh = false) => {
    const { lastFetched, isLoading } = get();
    const now = Date.now();

    // Skip if data is fresh and not forcing refresh
    if (
      !forceRefresh &&
      lastFetched &&
      now - lastFetched < CACHE_DURATION &&
      !isLoading
    ) {
      console.log("Using cached posts");
      return;
    }

    // Prevent multiple simultaneous fetches
    if (isLoading) {
      console.log("Already fetching posts");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const posts = await db.listDocuments<Post>("posts", {
        populate: ["user"],
      });

      set({
        posts: posts as any,
        isLoading: false,
        lastFetched: now,
        error: null,
      });
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      set({
        error: (err as Error)?.message ?? "Failed to load posts",
        isLoading: false,
      });
    }
  },

  addPost: (post) => {
    set((state) => ({
      posts: [post, ...state.posts],
    }));
  },

  updatePost: (postId, updates) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, ...updates } : post
      ),
    }));
  },

  deletePost: (postId) => {
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    }));
  },

  getPostById: (postId) => {
    return get().posts.find((post) => post.id === postId);
  },

  toggleLike: (postId) => {
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id !== postId) return post;

        // Ensure likes is an array
        const likes: string[] = Array.isArray(post.data.likes)
          ? [...post.data.likes]
          : [];

        // Try to get current user id from the cocobase client; fall back safely
        const currentUserId = db.auth.getUser()?.id;

        if (!currentUserId) {
          console.warn("toggleLike: no current user id available");
          return post;
        }

        const hasLiked = likes.includes(currentUserId);
        const newLikes = hasLiked
          ? likes.filter((id) => id !== currentUserId)
          : [currentUserId, ...likes];

        if (hasLiked) {
          db.updateDocument("posts", postId, {
            $remove: {
              likes: [currentUserId],
            },
          });
        } else {
          db.updateDocument("posts", postId, {
            $append: {
              likes: [currentUserId],
            },
          });
        }
        // update the db

        return {
          ...post,
          data: {
            ...post.data,
            likes: newLikes,
          },
        };
      }),
    }));
  },

  incrementCommentCount: (postId) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              data: {
                ...post.data,
                commentsCount: (post.data.comment_ids?.length ?? 0) + 1,
              },
            }
          : post
      ),
    }));
  },

  clearPosts: () => {
    set({ posts: [], lastFetched: null, error: null });
  },
}));
