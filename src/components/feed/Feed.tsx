import { useEffect } from "react";
import { CreatePostData } from "../../types";
import { CreatePost, PostCard } from "../post";
import styles from "./Feed.module.css";
import db from "@/lib/cocobase";
import { usePostsStore } from "@/store";

export const Feed = () => {
  // Get state and actions from Zustand store
  const { posts, isLoading, error, fetchPosts, toggleLike, addPost } =
    usePostsStore();

  const handleCreatePost = async (data: CreatePostData) => {
    console.log("Creating post:", data);
    try {
      let newPost;
      if (data.mediaFile && data.type != "text") {
        newPost = await db.createDocumentWithFiles(
          "posts",
          {
            user_id: db.auth.getUser()?.id,
            content: data.content,
            postType: data.type,
          },
          {
            file: data.mediaFile,
          }
        );
      } else {
        newPost = await db.createDocument("posts", {
          user_id: db.auth.getUser()?.id,
          content: data.content,
          postType: data.type,
        });
      }

      // Add the new post to the store with user data
      const user = db.auth.getUser();
      addPost({
        ...newPost,
        user: user as any,
      } as any);

      alert("Post created!");
    } catch (err) {
      console.error("Failed to create post:", err);
      alert("Failed to create post");
    }
  };

  const handleLike = (postId: string) => {
    // TODO: Add API call to persist like
    toggleLike(postId);
  };

  useEffect(() => {
    // Fetch posts on mount (will use cache if available)
    fetchPosts();
  }, [fetchPosts]);

  if (isLoading && posts.length === 0) {
    return (
      <div className={styles.container}>
        <CreatePost onSubmit={handleCreatePost} />
        <div className={styles.posts}>
          <div className={styles.emptyState}>
            <h3>Loading posts…</h3>
            <p>Please wait while we load the latest posts.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className={styles.container}>
        <CreatePost onSubmit={handleCreatePost} />
        <div className={styles.posts}>
          <div className={styles.emptyState}>
            <h3>Unable to load posts</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleRefresh = () => {
    // Force refresh posts
    fetchPosts(true);
  };

  return (
    <div className={styles.container}>
      <CreatePost onSubmit={handleCreatePost} />

      <div className={styles.posts}>
        {isLoading && posts.length > 0 && (
          <div className={styles.refreshIndicator}>⟳ Refreshing...</div>
        )}
        {posts.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No posts yet</h3>
            <p>Be the first to share something!</p>
          </div>
        ) : (
          <>
            <div className={styles.refreshButtonContainer}>
              <button onClick={handleRefresh} className={styles.refreshButton}>
                <span style={{ fontSize: "1rem" }}>⟳</span> Refresh
              </button>
            </div>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onLike={handleLike} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};
