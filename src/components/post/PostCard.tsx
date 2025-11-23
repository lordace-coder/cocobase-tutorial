import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post } from '../../types';
import { formatRelativeTime, formatNumber } from '../../utils/textParser';
import { Avatar } from '../common';
import { CommentSection } from './CommentSection';
import styles from './PostCard.module.css';
import { Document } from 'cocobase';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
}

export const PostCard = ({ post, onLike, onComment }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const navigate = useNavigate();

  // Guard clause: skip rendering if post data is not properly populated
  if (!post.user) {
    console.error('Post data or user is missing:', post,post.user);
    return null;
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'BUTTON' ||
      target.closest('button') ||
      target.classList.contains(styles.hashtag) ||
      target.classList.contains(styles.mention)
    ) {
      return;
    }
    // Navigate and pass post data via state
    navigate(`/post/${post.id}`, { state: { post } });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const postUrl = `${window.location.origin}/post/${post.id}`;
    const shareText = `Check out this post by @${post.user.username}: ${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}`;

    // Check if Web Share API is available (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by @${post.user.username}`,
          text: shareText,
          url: postUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback to clipboard for desktop
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n${postUrl}`);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        alert('Failed to copy link');
      }
    }
  };

  const renderContent = () => {
    const parts: React.ReactNode[] = [];
    const regex = /(#[\w]+|@[\w]+)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(post .content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {post .content.substring(lastIndex, match.index)}
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
          <span key={`mention-${match.index}`} className={styles.mention}>
            {matchedText}
          </span>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < post .content.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {post .content.substring(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.header}>
        <Avatar
          src={post .user.avatarUrl}
          alt={post .user.displayName}
          username={post .user.displayName}
          size="md"
        />
        <div className={styles.userInfo}>
          <h3 className={styles.displayName}>{post .user.displayName}</h3>
          <p className={styles.username}>@{post .user.username}</p>
        </div>
        <span className={styles.time}>{formatRelativeTime(new Date(post.created_at))}</span>
      </div>

      <div className={styles.content}>
        <p className={styles.text}>{renderContent()}</p>

        {post.postType === 'image' && post.file && (
          <img
            src={post.file}
            alt="Post media"
            className={styles.media}
          />
        )}

        {post.postType === 'video' && post.file && (
          <video
            src={post.file}
            controls
            className={styles.media}
          />
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.actionButton} ${post .isLiked ? styles.liked : ''}`}
          onClick={() => onLike(post.id)}
        >
          <span className={styles.icon}>{post .isLiked ? '❤️' : '🤍'}</span>
          <span>{formatNumber(post.likes ?? 0)}</span>
        </button>

        <button
          className={styles.actionButton}
          onClick={() => setShowComments(!showComments)}
        >
          <span className={styles.icon}>💬</span>
          <span>{formatNumber(post.commentsCount ?? 0)}</span>
        </button>

        <button className={styles.actionButton} onClick={handleShare}>
          <span className={styles.icon}>🔗</span>
          <span>Share</span>
        </button>
      </div>

      {showComments && (
        <CommentSection
          postId={post.id}
          onComment={(content) => onComment(post.id, content)}
        />
      )}
    </div>
  );
};
