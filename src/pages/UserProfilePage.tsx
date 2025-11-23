import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserProfile, Post } from '../types';
import { Layout, Avatar, Button } from '../components/common';
import { PostCard } from '../components/post';
import styles from './UserProfilePage.module.css';

const mockUser: UserProfile = {
  id: '2',
  username: 'sarahdev',
  displayName: 'Sarah Developer',
  email: 'sarah@example.com',
  bio: 'Full-stack developer | React enthusiast | Coffee lover ☕',
  postsCount: 42,
  followersCount: 1234,
  followingCount: 567,
  isFollowing: false,
  createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
};

const mockPosts: Post[] = [
  {
    id: '1',
    userId: '2',
    user: mockUser,
    type: 'text',
    content: 'Just shipped a new feature! #react #typescript',
    hashtags: ['react', 'typescript'],
    mentions: [],
    likes: 24,
    commentsCount: 5,
    isLiked: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

export const UserProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [posts] = useState<Post[]>(mockPosts);
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');

  const handleFollow = () => {
    setUser({ ...user, isFollowing: !user.isFollowing });
  };

  const handleMessage = () => {
    navigate(`/chat/new?user=${user.id}`);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <Avatar
            src={user.avatarUrl}
            alt={user.displayName}
            username={user.displayName}
            size="xl"
          />

          <div className={styles.userInfo}>
            <h1 className={styles.displayName}>{user.displayName}</h1>
            <p className={styles.username}>@{user.username}</p>
            {user.bio && <p className={styles.bio}>{user.bio}</p>}

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>{user.postsCount}</span>
                <span className={styles.statLabel}>Posts</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{user.followersCount}</span>
                <span className={styles.statLabel}>Followers</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{user.followingCount}</span>
                <span className={styles.statLabel}>Following</span>
              </div>
            </div>

            <div className={styles.actions}>
              <Button
                onClick={handleFollow}
                variant={user.isFollowing ? 'outline' : 'primary'}
                fullWidth
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button onClick={handleMessage} variant="secondary" fullWidth>
                Message
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'posts' ? styles.active : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'about' ? styles.active : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'posts' ? (
            <div className={styles.posts}>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={() => {}}
                  onComment={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className={styles.about}>
              <div className={styles.aboutCard}>
                <h3>About</h3>
                <p>{user.bio || 'No bio yet'}</p>
                <p className={styles.joined}>
                  Joined {user.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
