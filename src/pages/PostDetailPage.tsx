import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Post, Comment } from '../types';
import { PostCard } from '../components/post';
import { Avatar, Button, TextArea } from '../components/common';
import { formatRelativeTime } from '../utils/textParser';
import styles from './PostDetailPage.module.css';

// Mock post data
const mockPost: Post = {
  id: '1',
  userId: '2',
  user: {
    id: '2',
    username: 'sarahdev',
    displayName: 'Sarah Developer',
    email: 'sarah@example.com',
    createdAt: new Date(),
  },
  type: 'text',
  content: 'Just deployed my first app with #react and #typescript! Thanks @johndoe for the help 🚀',
  hashtags: ['react', 'typescript'],
  mentions: ['johndoe'],
  likes: 42,
  commentsCount: 5,
  isLiked: false,
  createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
};

// Mock comments
const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    userId: '3',
    user: {
      id: '3',
      username: 'mikecoder',
      displayName: 'Mike Coder',
      email: 'mike@example.com',
      createdAt: new Date(),
    },
    content: 'Congrats! How long did it take you to build?',
    mentions: [],
    likes: 5,
    isLiked: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: '2',
    postId: '1',
    userId: '4',
    user: {
      id: '4',
      username: 'jennytech',
      displayName: 'Jenny Tech',
      email: 'jenny@example.com',
      createdAt: new Date(),
    },
    content: 'Amazing work @sarahdev! Would love to see a demo 🎉',
    mentions: ['sarahdev'],
    likes: 3,
    isLiked: true,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '3',
    postId: '1',
    userId: '1',
    user: {
      id: '1',
      username: 'johndoe',
      displayName: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
    },
    content: 'Happy to help! Keep building awesome stuff 💪',
    mentions: [],
    likes: 8,
    isLiked: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
  },
];

export const PostDetailPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    // Simulate API call
    setTimeout(() => {
      setPost(mockPost);
      setComments(mockComments);
      setIsLoading(false);
    }, 500);
  }, [postId]);

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
      userId: '1',
      user: {
        id: '1',
        username: 'currentuser',
        displayName: 'Current User',
        email: 'user@example.com',
        createdAt: new Date(),
      },
      content: newComment,
      mentions: [],
      likes: 0,
      isLiked: false,
      createdAt: new Date(),
    };

    setComments([...comments, newCommentObj]);
    setNewComment('');
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
      if (matchedText.startsWith('#')) {
        parts.push(
          <span key={`hashtag-${match.index}`} className={styles.hashtag}>
            {matchedText}
          </span>
        );
      } else if (matchedText.startsWith('@')) {
        parts.push(
          <span
            key={`mention-${match.index}`}
            className={styles.mention}
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Navigate to user profile
              console.log('Navigate to user:', matchedText.slice(1));
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
      <div className={styles.loading}>
        <div className={styles.spinner}>Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.error}>
        <h2>Post not found</h2>
        <Button onClick={() => navigate('/')}>Go back home</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className={styles.post}>
        <PostCard post={post} onLike={handlePostLike} onComment={() => {}} />
      </div>

      <div className={styles.commentsSection}>
        <h2 className={styles.commentsTitle}>
          Comments ({comments.length})
        </h2>

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
                      className={`${styles.likeButton} ${comment.isLiked ? styles.liked : ''}`}
                      onClick={() => handleLike(comment.id)}
                    >
                      <span>{comment.isLiked ? '❤️' : '🤍'}</span>
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
  );
};
