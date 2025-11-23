import { useState, useRef, ChangeEvent } from 'react';
import { CreatePostData, PostType } from '../../types';
import { validatePostContent } from '../../utils/validation';
import { extractHashtags, extractMentions } from '../../utils/textParser';
import { Button, TextArea } from '../common';
import styles from './CreatePost.module.css';

interface CreatePostProps {
  onSubmit: (data: CreatePostData) => Promise<void>;
}

export const CreatePost = ({ onSubmit }: CreatePostProps) => {
  const [type, setType] = useState<PostType>('text');
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (type === 'image' && !file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (type === 'video' && !file.type.startsWith('video/')) {
      setError('Please select a video file');
      return;
    }

    setMediaFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleTypeChange = (newType: PostType) => {
    setType(newType);
    setMediaFile(null);
    setMediaPreview(null);
    setError('');
  };

  const handleSubmit = async () => {
    // Validate
    const validation = validatePostContent(content, type);
    if (!validation.isValid) {
      setError(validation.error!);
      return;
    }

    if ((type === 'image' || type === 'video') && !mediaFile) {
      setError(`Please select a ${type} file`);
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        type,
        content,
        mediaFile: mediaFile || undefined,
      });

      // Reset form
      setContent('');
      setMediaFile(null);
      setMediaPreview(null);
      setError('');
      setType('text');
    } catch (err) {
      setError('Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  const hashtags = extractHashtags(content);
  const mentions = extractMentions(content);

  return (
    <div className={styles.container}>
      <div className={styles.typeSelector}>
        <button
          type="button"
          className={`${styles.typeButton} ${type === 'text' ? styles.active : ''}`}
          onClick={() => handleTypeChange('text')}
        >
          <span className={styles.icon}>📝</span>
          Text
        </button>
        <button
          type="button"
          className={`${styles.typeButton} ${type === 'image' ? styles.active : ''}`}
          onClick={() => handleTypeChange('image')}
        >
          <span className={styles.icon}>🖼️</span>
          Image
        </button>
        <button
          type="button"
          className={`${styles.typeButton} ${type === 'video' ? styles.active : ''}`}
          onClick={() => handleTypeChange('video')}
        >
          <span className={styles.icon}>🎥</span>
          Video
        </button>
      </div>

      <TextArea
        placeholder={`What's on your mind? Use # for hashtags and @ to mention users...`}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        error={error}
        showCount
        maxCount={5000}
        rows={4}
      />

      {(type === 'image' || type === 'video') && (
        <div className={styles.mediaSection}>
          <input
            ref={fileInputRef}
            type="file"
            accept={type === 'image' ? 'image/*' : 'video/*'}
            onChange={handleMediaSelect}
            className={styles.fileInput}
          />

          {!mediaPreview ? (
            <button
              type="button"
              className={styles.uploadButton}
              onClick={() => fileInputRef.current?.click()}
            >
              <span className={styles.uploadIcon}>
                {type === 'image' ? '📷' : '🎬'}
              </span>
              <span>Click to upload {type}</span>
            </button>
          ) : (
            <div className={styles.preview}>
              {type === 'image' ? (
                <img src={mediaPreview} alt="Preview" className={styles.previewImage} />
              ) : (
                <video src={mediaPreview} controls className={styles.previewVideo} />
              )}
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => {
                  setMediaFile(null);
                  setMediaPreview(null);
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {(hashtags.length > 0 || mentions.length > 0) && (
        <div className={styles.tags}>
          {hashtags.length > 0 && (
            <div className={styles.tagGroup}>
              {hashtags.map((tag, i) => (
                <span key={i} className={styles.hashtag}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
          {mentions.length > 0 && (
            <div className={styles.tagGroup}>
              {mentions.map((mention, i) => (
                <span key={i} className={styles.mention}>
                  @{mention}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <Button
        onClick={handleSubmit}
        isLoading={isLoading}
        disabled={!content.trim()}
        fullWidth
        variant="secondary"
      >
        Post
      </Button>
    </div>
  );
};
