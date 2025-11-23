import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Message } from '../types';
import { MessageBubble, MessageInput } from '../components/chat';
import { Avatar, Layout } from '../components/common';
import styles from './ChatWindowPage.module.css';

const mockMessages: Message[] = [
  {
    id: '1',
    chatId: '1',
    senderId: '2',
    sender: { id: '2', username: 'sarahdev', displayName: 'Sarah Developer', email: 'sarah@example.com', createdAt: new Date() },
    type: 'text',
    content: 'Hey! How are you doing?',
    isRead: true,
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: '2',
    chatId: '1',
    senderId: '1',
    sender: { id: '1', username: 'currentuser', displayName: 'Current User', email: 'current@example.com', createdAt: new Date() },
    type: 'text',
    content: "I'm good! Just working on this new project",
    isRead: true,
    createdAt: new Date(Date.now() - 50 * 60 * 1000),
  },
  {
    id: '3',
    chatId: '1',
    senderId: '2',
    sender: { id: '2', username: 'sarahdev', displayName: 'Sarah Developer', email: 'sarah@example.com', createdAt: new Date() },
    type: 'text',
    content: 'Nice! What are you building?',
    isRead: false,
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
  },
];

export const ChatWindowPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [otherUser] = useState({ id: '2', username: 'sarahdev', displayName: 'Sarah Developer', avatarUrl: undefined });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = '1';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageData: { type: string; content: string; file?: File }) => {
    const newMessage: Message = {
      id: String(Date.now()),
      chatId: chatId!,
      senderId: currentUserId,
      sender: { id: currentUserId, username: 'currentuser', displayName: 'Current User', email: 'current@example.com', createdAt: new Date() },
      type: messageData.type as any,
      content: messageData.content,
      mediaUrl: messageData.file ? URL.createObjectURL(messageData.file) : undefined,
      fileName: messageData.file?.name,
      fileSize: messageData.file?.size,
      isRead: false,
      createdAt: new Date(),
    };

    setMessages([...messages, newMessage]);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={() => navigate('/chats')}>
            ←
          </button>
          <Avatar
            src={otherUser.avatarUrl}
            alt={otherUser.displayName}
            username={otherUser.displayName}
            size="sm"
          />
          <div className={styles.userInfo}>
            <span className={styles.name}>{otherUser.displayName}</span>
            <span className={styles.status}>@{otherUser.username}</span>
          </div>
        </div>

        <div className={styles.messagesContainer}>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUserId}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <MessageInput onSend={handleSendMessage} />
      </div>
    </Layout>
  );
};
