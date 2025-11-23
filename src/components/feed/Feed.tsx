import { useState } from 'react';
import { Post, CreatePostData } from '../../types';
import { CreatePost, PostCard } from '../post';
import styles from './Feed.module.css';

// Mock data for demonstration
const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    user: {
      id: '1',
      username: 'johndoe',
      displayName: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
    },
    type: 'text',
    content: 'Just deployed my first app with #react and #typescript! Thanks @sarahdev for the help 🚀',
    hashtags: ['react', 'typescript'],
    mentions: ['sarahdev'],
    likes: 42,
    commentsCount: 5,
    isLiked: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    userId: '2',
    user: {
      id: '2',
      username: 'sarahdev',
      displayName: 'Sarah Developer',
      email: 'sarah@example.com',
      createdAt: new Date(),
    },
    type: 'text',
    content: 'Working on a new #opensource project. Check it out! #coding #webdev',
    hashtags: ['opensource', 'coding', 'webdev'],
    mentions: [],
    likes: 128,
    commentsCount: 12,
    isLiked: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
];

export const Feed = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  const handleCreatePost = async (data: CreatePostData) => {
    // TODO: Replace with actual API call
    console.log('Creating post:', data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For now, just show success
    alert('Post created! (This will be replaced with actual API integration)');
  };

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleComment = async (postId: string, content: string) => {
    // TODO: Replace with actual API call
    console.log('Adding comment to post:', postId, content);

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, commentsCount: post.commentsCount + 1 }
          : post
      )
    );
  };

  return (
    <div className={styles.container}>
      <CreatePost onSubmit={handleCreatePost} />

      <div className={styles.posts}>
        {posts.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No posts yet</h3>
            <p>Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
            />
          ))
        )}
      </div>
    </div>
  );
};
