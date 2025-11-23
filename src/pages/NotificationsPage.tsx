import { useState, useEffect } from 'react';
import { Notification } from '../types';
import { NotificationItem } from '../components/notifications';
import { Button, Layout } from '../components/common';
import styles from './NotificationsPage.module.css';
import db from '@/lib/cocobase';
import { useAuth } from '@/hooks/useAuth';

export const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications from Cocobase
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      setIsLoading(true);
      setError(null);

      try {
        const fetchedNotifications = await db.listDocuments<Notification>('notifications', {
          populate: ['user_id'], // Populate the user who triggered the notification
          filters: {
            recipient_id: user.id, // Only get notifications for current user
          },
          sort: '-created_at', // Sort by newest first
        });

        setNotifications(fetchedNotifications as any);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        setError('Failed to load notifications. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      // Optimistically update UI
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );

      // Update in database
      await db.updateDocument('notifications', id, {
        isRead: true,
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Revert optimistic update on error
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: false } : notif
        )
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.isRead);

    try {
      // Optimistically update UI
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );

      // Update all unread notifications in database
      await Promise.all(
        unreadNotifications.map((notif) =>
          db.updateDocument('notifications', notif.id, {
            isRead: true,
          })
        )
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      alert('Failed to mark all as read. Please try again.');
      // Revert optimistic update
      setNotifications((prev) =>
        prev.map((notif) => {
          const wasUnread = unreadNotifications.find((n) => n.id === notif.id);
          return wasUnread ? { ...notif, isRead: false } : notif;
        })
      );
    }
  };

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  if (isLoading) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>Notifications</h1>
            </div>
          </div>
          <div className={styles.notifications}>
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>⟳</span>
              <h3>Loading notifications...</h3>
              <p>Please wait</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>Notifications</h1>
            </div>
          </div>
          <div className={styles.notifications}>
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>⚠️</span>
              <h3>Failed to load notifications</h3>
              <p>{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="primary"
                size="sm"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

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
