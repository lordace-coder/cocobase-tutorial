import { useState } from 'react';
import { Notification } from '../types';
import { NotificationItem } from '../components/notifications';
import { Button, Layout } from '../components/common';
import styles from './NotificationsPage.module.css';

// Mock notifications for demonstration
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'mention',
    userId: '2',
    user: {
      id: '2',
      username: 'sarahdev',
      displayName: 'Sarah Developer',
      email: 'sarah@example.com',
      createdAt: new Date(),
    },
    postId: '1',
    message: 'mentioned you in a post',
    isRead: false,
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: '2',
    type: 'like',
    userId: '3',
    user: {
      id: '3',
      username: 'mikecoder',
      displayName: 'Mike Coder',
      email: 'mike@example.com',
      createdAt: new Date(),
    },
    postId: '2',
    message: 'liked your post',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '3',
    type: 'comment',
    userId: '4',
    user: {
      id: '4',
      username: 'jennytech',
      displayName: 'Jenny Tech',
      email: 'jenny@example.com',
      createdAt: new Date(),
    },
    postId: '3',
    commentId: '1',
    message: 'commented on your post',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '4',
    type: 'mention',
    userId: '2',
    user: {
      id: '2',
      username: 'sarahdev',
      displayName: 'Sarah Developer',
      email: 'sarah@example.com',
      createdAt: new Date(),
    },
    postId: '4',
    message: 'mentioned you in a comment',
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: '5',
    type: 'follow',
    userId: '5',
    user: {
      id: '5',
      username: 'alexui',
      displayName: 'Alex UI',
      email: 'alex@example.com',
      createdAt: new Date(),
    },
    message: 'started following you',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Notifications</h1>
          {unreadCount > 0 && (
            <span className={styles.badge}>{unreadCount}</span>
          )}
        </div>

        <div className={styles.actions}>
          <div className={styles.filters}>
            <button
              className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`${styles.filterButton} ${filter === 'unread' ? styles.active : ''}`}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>
          </div>

          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              variant="ghost"
              size="sm"
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <div className={styles.notifications}>
        {filteredNotifications.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>🔔</span>
            <h3>No notifications</h3>
            <p>
              {filter === 'unread'
                ? "You're all caught up!"
                : "You don't have any notifications yet"}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
            />
          ))
        )}
      </div>
      </div>
    </Layout>
  );
};
