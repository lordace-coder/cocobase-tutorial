import { useNavigate } from 'react-router-dom';
import { Notification } from '../../types';
import { formatRelativeTime } from '../../utils/textParser';
import { Avatar } from '../common';
import styles from './NotificationItem.module.css';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
  const navigate = useNavigate();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'mention':
        return '@';
      case 'follow':
        return '👤';
      default:
        return '🔔';
    }
  };

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    if (notification.postId) {
      navigate(`/post/${notification.postId}`);
    }
  };

  return (
    <div
      className={`${styles.notification} ${!notification.isRead ? styles.unread : ''}`}
      onClick={handleClick}
    >
      <div className={styles.iconWrapper}>
        <span className={styles.typeIcon}>{getNotificationIcon(notification.type)}</span>
      </div>

      <Avatar
        src={notification.user.avatarUrl}
        alt={notification.user.displayName}
        username={notification.user.displayName}
        size="md"
      />

      <div className={styles.content}>
        <p className={styles.message}>
          <span className={styles.username}>@{notification.user.username}</span>{' '}
          {notification.message}
        </p>
        <span className={styles.time}>{formatRelativeTime(notification.createdAt)}</span>
      </div>

      {!notification.isRead && <div className={styles.unreadDot} />}
    </div>
  );
};
