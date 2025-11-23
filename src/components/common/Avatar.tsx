import styles from './Avatar.module.css';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  username?: string;
}

export const Avatar = ({ src, alt, size = 'md', username }: AvatarProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const classNames = [styles.avatar, styles[size]].join(' ');

  return (
    <div className={classNames}>
      {src ? (
        <img src={src} alt={alt} className={styles.image} />
      ) : (
        <div className={styles.initials}>
          {username ? getInitials(username) : '?'}
        </div>
      )}
    </div>
  );
};
