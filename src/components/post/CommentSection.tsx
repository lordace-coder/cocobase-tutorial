import { useState } from 'react';
import { Button, TextArea } from '../common';
import styles from './CommentSection.module.css';

interface CommentSectionProps {
  postId: string;
  onComment: (content: string) => void;
}

export const CommentSection = ({ onComment }: CommentSectionProps) => {
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    setIsLoading(true);
    try {
      await onComment(comment);
      setComment('');
    } catch (error) {
      console.error('Failed to post comment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputSection}>
        <TextArea
          placeholder="Write a comment... Use @ to mention users"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
        />
        <Button
          onClick={handleSubmit}
          isLoading={isLoading}
          disabled={!comment.trim()}
          size="sm"
          variant="primary"
        >
          Comment
        </Button>
      </div>

      {/* TODO: Display existing comments here */}
      <div className={styles.comments}>
        <p className={styles.emptyState}>No comments yet. Be the first to comment!</p>
      </div>
    </div>
  );
};
