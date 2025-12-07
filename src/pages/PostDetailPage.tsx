import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Post, Comment } from "../types";
import { PostCard } from "../components/post";
import { Avatar, Button, TextArea, Layout } from "../components/common";
import { formatRelativeTime } from "../utils/textParser";
import styles from "./PostDetailPage.module.css";
import db from "../lib/cocobase";
import { Document } from "cocobase";
import { usePostsStore } from "../store/postsStore";

export const PostDetailPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleLike, incrementCommentCount } = usePostsStore();
  const [post, setPost] = useState<Document<Post> | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      setError(null);

      // First, check if post was passed via navigation state
      const statePost = (location.state as { post?: Document<Post> })?.post;

      if (statePost && statePost.id === postId) {
        // Use the passed post data
        setPost(statePost);
        // Load comments from database
        try {
          console.log("Loading comments for post:", postId);
          console.log("Comment IDs:", statePost.data.comment_ids);

          if (
            statePost.data.comment_ids &&
            statePost.data.comment_ids.length > 0
          ) {
            console.log(
              "Fetching comments with IDs:",
              statePost.data.comment_ids
            );
            const fetchedComments = await db.listDocuments("comments", {
              filters: {
                id_in: statePost.data.comment_ids.join(","),
              },
              populate: ["user"],
            });
            console.log("Fetched comments:", fetchedComments);
            setComments(fetchedComments as any);
          } else {
            console.log("No comment IDs found on post");
            setComments([]);
          }
          setIsLoading(false);
        } catch (err) {
          console.error("Failed to load comments:", err);
          setComments([]);
          setIsLoading(false);
        }
      } else {
        // Fallback: Load post from database (for direct URL access)
        try {
          const fetchedPost = (
            await db.listDocuments<Post>("posts", {
              populate: ["user", "comments:comments"],
              limit: 1,
            })
          )[0];
          setPost(fetchedPost as any);
          // Load comments from database
          if (
            fetchedPost.data.comment_ids &&
            fetchedPost.data.comment_ids.length > 0
          ) {
            const fetchedComments = await db.listDocuments("comments", {
              filters: {
                id_in: fetchedPost.data.comment_ids.join(","),
              },
              populate: ["user"],
            });
            setComments(fetchedComments as any);
          }
        } catch (err) {
          console.error("Failed to load post:", err);
          setError("Failed to load post. It may have been deleted.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (postId) {
      loadPost();
    }
  }, [postId, location.state]);

  const handleLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment
      )
    );
  };

  const handlePostLike = () => {
    if (post) {
      toggleLike(post.id);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      console.log("Adding comment to post:", postId, newComment);
      const comment = await db.createDocument("comments", {
        user_id: db.auth.getUser()?.id,
        comment: newComment,
      });

      // add comment to post
      await db.updateDocument("posts", post?.id!, {
        $append: {
          comment_ids: [comment.id],
        },
      });
      incrementCommentCount(postId!);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Failed to add comment");
    }
  };

  const renderContent = (content: string, mentions: string[]) => {
    const parts: React.ReactNode[] = [];
    const regex = /(#[\w]+|@[\w]+)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {content.substring(lastIndex, match.index)}
          </span>
        );
      }

      const matchedText = match[0];
      if (matchedText.startsWith("#")) {
        parts.push(
          <span key={`hashtag-${match.index}`} className={styles.hashtag}>
            {matchedText}
          </span>
        );
      } else if (matchedText.startsWith("@")) {
        parts.push(
          <span
            key={`mention-${match.index}`}
            className={styles.mention}
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Navigate to user profile
              console.log("Navigate to user:", matchedText.slice(1));
            }}
          >
            {matchedText}
          </span>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>{content.substring(lastIndex)}</span>
      );
    }

    return parts;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className={styles.loading}>
          <div className={styles.spinner}>Loading...</div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className={styles.error}>
          <h2>Post not found</h2>
          <p>{error || "The post you are looking for does not exist."}</p>
          <Button onClick={() => navigate("/")}>Go back home</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className={styles.post}>
          <PostCard post={post} onLike={handlePostLike} onComment={() => {}} />
        </div>

        <div className={styles.commentsSection}>
          <h2 className={styles.commentsTitle}>Comments ({comments.length})</h2>

          <div className={styles.addComment}>
            <TextArea
              placeholder="Write a comment... Use @ to mention users"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              variant="primary"
              size="sm"
            >
              Post Comment
            </Button>
          </div>

          <div className={styles.comments}>
            {comments.length === 0 ? (
              <div className={styles.emptyComments}>
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className={styles.comment}>
                  <Avatar
                    src={comment.user.avatarUrl}
                    alt={comment.user.displayName}
                    username={comment.user.displayName}
                    size="md"
                  />

                  <div className={styles.commentContent}>
                    <div className={styles.commentHeader}>
                      <span className={styles.commentUser}>
                        {comment.user.displayName}
                      </span>
                      <span className={styles.commentUsername}>
                        @{comment.user.username}
                      </span>
                      <span className={styles.commentTime}>
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>

                    <p className={styles.commentText}>
                      {renderContent(comment.content, comment.mentions)}
                    </p>

                    <div className={styles.commentActions}>
                      <button
                        className={`${styles.likeButton} ${
                          comment.isLiked ? styles.liked : ""
                        }`}
                        onClick={() => handleLike(comment.id)}
                      >
                        <span>{comment.isLiked ? "❤️" : "🤍"}</span>
                        <span>{comment.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
