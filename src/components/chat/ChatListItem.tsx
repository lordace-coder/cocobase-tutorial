import { useNavigate } from 'react-router-dom';
import { Chat } from '../../types';
import { Avatar } from '../common';
import { formatRelativeTime } from '../../utils/textParser';
import styles from './ChatListItem.module.css';

interface ChatListItemProps {
  chat: Chat;
  currentUserId: string;
}

export const ChatListItem = ({ chat, currentUserId }: ChatListItemProps) => {
  const navigate = useNavigate();
  const otherUser = chat.participants.find(p => p.id !== currentUserId)!;

  const getLastMessagePreview = () => {
    if (!chat.lastMessage) return 'No messages yet';

    const prefix = chat.lastMessage.senderId === currentUserId ? 'You: ' : '';

    switch (chat.lastMessage.type) {
      case 'image':
        return `${prefix}📷 Photo`;
      case 'video':
        return `${prefix}🎥 Video`;
      case 'voice':
        return `${prefix}🎤 Voice message`;
      case 'file':
        return `${prefix}📄 ${chat.lastMessage.fileName}`;
      default:
        return `${prefix}${chat.lastMessage.content}`;
    }
  };

  const isUnread = chat.lastMessage && !chat.lastMessage.isRead && chat.lastMessage.senderId !== currentUserId;

  return (
    <div className={styles.container} onClick={() => navigate(`/chat/${chat.id}`)}>
      <Avatar
        src={otherUser.avatarUrl}
        alt={otherUser.displayName}
        username={otherUser.displayName}
        size="md"
      />

      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.name}>{otherUser.displayName}</span>
          {chat.lastMessage && (
            <span className={styles.time}>
              {formatRelativeTime(chat.lastMessage.createdAt)}
            </span>
          )}
        </div>

        <div className={styles.footer}>
          <span className={`${styles.preview} ${isUnread ? styles.unread : ''}`}>
            {getLastMessagePreview()}
          </span>
          {chat.unreadCount > 0 && (
            <span className={styles.badge}>{chat.unreadCount}</span>
          )}
        </div>
      </div>
    </div>
  );
};
