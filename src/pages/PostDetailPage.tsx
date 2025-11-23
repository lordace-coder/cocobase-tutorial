import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Post, Comment } from "../types";
import { PostCard } from "../components/post";
import { Avatar, Button, TextArea, Layout } from "../components/common";
import { formatRelativeTime } from "../utils/textParser";
import styles from "./PostDetailPage.module.css";
import db from "../lib/cocobase";

export const PostDetailPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      setError(null);

      // First, check if post was passed via navigation state
      const statePost = (location.state as { post?: Post })?.post;

      if (statePost && statePost.id === postId) {
        // Use the passed post data
        setPost(statePost);
        setIsLoading(false);
        // TODO: Load comments from database
        setComments([]);
      } else {
        // Fallback: Load post from database (for direct URL access)
        try {
          const fetchedPost = (
            await db.listDocuments<Post>("posts", {
              populate: ["user"],
              limit: 1,
            })
          )[0];
          setPost(fetchedPost as any);
          // TODO: Load comments from database
          setComments([]);
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
      setPost({
        ...post,
        isLiked: !post.isLiked,
        likes: post.isLiked ? post.likes - 1 : post.likes + 1,
      });
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    // TODO: Replace with actual API call
    const newCommentObj: Comment = {
      id: String(Date.now()),
      postId: postId!,
      userId: "1",
      user: {
        id: "1",
        username: "currentuser",
        displayName: "Current User",
        email: "user@example.com",
        createdAt: new Date(),
      },
      content: newComment,
      mentions: [],
      likes: 0,
      isLiked: false,
      createdAt: new Date(),
    };

    setComments([...comments, newCommentObj]);
    setNewComment("");
    if (post) {
      setPost({ ...post, commentsCount: post.commentsCount + 1 });
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
