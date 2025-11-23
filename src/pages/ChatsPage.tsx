import { useState } from 'react';
import { Chat, Message } from '../types';
import { ChatListItem } from '../components/chat';
import { Layout } from '../components/common';
import styles from './ChatsPage.module.css';

// Mock chats
const mockChats: Chat[] = [
  {
    id: '1',
    participants: [
      { id: '1', username: 'currentuser', displayName: 'Current User', email: 'current@example.com', createdAt: new Date() },
      { id: '2', username: 'sarahdev', displayName: 'Sarah Developer', email: 'sarah@example.com', createdAt: new Date() },
    ],
    lastMessage: {
      id: 'm1',
      chatId: '1',
      senderId: '2',
      sender: { id: '2', username: 'sarahdev', displayName: 'Sarah Developer', email: 'sarah@example.com', createdAt: new Date() },
      type: 'text',
      content: 'Hey! How are you?',
      isRead: false,
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
    },
    unreadCount: 2,
    updatedAt: new Date(Date.now() - 10 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    participants: [
      { id: '1', username: 'currentuser', displayName: 'Current User', email: 'current@example.com', createdAt: new Date() },
      { id: '3', username: 'mikecoder', displayName: 'Mike Coder', email: 'mike@example.com', createdAt: new Date() },
    ],
    lastMessage: {
      id: 'm2',
      chatId: '2',
      senderId: '1',
      sender: { id: '1', username: 'currentuser', displayName: 'Current User', email: 'current@example.com', createdAt: new Date() },
      type: 'image',
      content: 'Check this out!',
      mediaUrl: '/placeholder.jpg',
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

export const ChatsPage = () => {
  const [chats] = useState<Chat[]>(mockChats);
  const [searchQuery, setSearchQuery] = useState('');
  const currentUserId = '1';

  const filteredChats = chats.filter((chat) => {
    const otherUser = chat.participants.find(p => p.id !== currentUserId);
    return otherUser?.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           otherUser?.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Messages</h1>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.search}
          />
        </div>

        <div className={styles.chatsList}>
          {filteredChats.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>💬</span>
              <h3>No conversations</h3>
              <p>Start a new conversation by visiting a user's profile</p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                currentUserId={currentUserId}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};
