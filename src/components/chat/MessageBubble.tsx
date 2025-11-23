import { Message } from '../../types';
import { formatRelativeTime } from '../../utils/textParser';
import { Avatar } from '../common';
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className={styles.mediaContainer}>
            <img src={message.mediaUrl} alt="Shared image" className={styles.image} />
            {message.content && <p className={styles.caption}>{message.content}</p>}
          </div>
        );

      case 'video':
        return (
          <div className={styles.mediaContainer}>
            <video src={message.mediaUrl} controls className={styles.video} />
            {message.content && <p className={styles.caption}>{message.content}</p>}
          </div>
        );

      case 'voice':
        return (
          <div className={styles.voiceContainer}>
            <span className={styles.voiceIcon}>🎤</span>
            <audio src={message.mediaUrl} controls className={styles.audio} />
            <span className={styles.duration}>{message.duration}s</span>
          </div>
        );

      case 'file':
        return (
          <div className={styles.fileContainer}>
            <span className={styles.fileIcon}>📄</span>
            <div className={styles.fileInfo}>
              <span className={styles.fileName}>{message.fileName}</span>
              <span className={styles.fileSize}>{formatFileSize(message.fileSize!)}</span>
            </div>
            <button className={styles.downloadButton}>⬇️</button>
          </div>
        );

      default:
        return <p className={styles.text}>{message.content}</p>;
    }
  };

  return (
    <div className={`${styles.container} ${isOwn ? styles.own : styles.other}`}>
      {!isOwn && (
        <Avatar
          src={message.sender.avatarUrl}
          alt={message.sender.displayName}
          username={message.sender.displayName}
          size="sm"
        />
      )}

      <div className={styles.bubble}>
        {renderContent()}
        <span className={styles.time}>{formatRelativeTime(message.createdAt)}</span>
      </div>
    </div>
  );
};
