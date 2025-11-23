import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Post, User } from '../types';
import { Layout, Avatar } from '../components/common';
import { PostCard } from '../components/post';
import styles from './SearchPage.module.css';

const mockUsers: User[] = [
  {
    id: '2',
    username: 'sarahdev',
    displayName: 'Sarah Developer',
    email: 'sarah@example.com',
    bio: 'Full-stack developer',
    createdAt: new Date(),
  },
];

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';
  const initialType = (searchParams.get('type') || 'all') as 'all' | 'posts' | 'users' | 'hashtags';

  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState<'all' | 'posts' | 'users' | 'hashtags'>(initialType);
  const [users] = useState<User[]>(mockUsers);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query, type: searchType });
  };

  const filteredUsers = users.filter(u =>
    u.displayName.toLowerCase().includes(query.toLowerCase()) ||
    u.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Layout>
      <div className={styles.container}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Search for posts, users, or hashtags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
            autoFocus
          />
          <div className={styles.filters}>
            {(['all', 'posts', 'users', 'hashtags'] as const).map((type) => (
              <button
                key={type}
                type="button"
                className={`${styles.filterButton} ${searchType === type ? styles.active : ''}`}
                onClick={() => setSearchType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </form>

        <div className={styles.results}>
          {query && (
            <>
              {(searchType === 'all' || searchType === 'users') && filteredUsers.length > 0 && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Users</h2>
                  <div className={styles.usersList}>
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className={styles.userCard}
                        onClick={() => navigate(`/user/${user.username}`)}
                      >
                        <Avatar
                          src={user.avatarUrl}
                          alt={user.displayName}
                          username={user.displayName}
                          size="md"
                        />
                        <div className={styles.userInfo}>
                          <span className={styles.displayName}>{user.displayName}</span>
                          <span className={styles.username}>@{user.username}</span>
                          {user.bio && <span className={styles.bio}>{user.bio}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredUsers.length === 0 && (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>🔍</span>
                  <h3>No results found</h3>
                  <p>Try searching for something else</p>
                </div>
              )}
            </>
          )}

          {!query && (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🔍</span>
              <h3>Search Cocopow</h3>
              <p>Search for users, posts, or hashtags</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
