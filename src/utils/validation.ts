export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUsername = (username: string): {
  isValid: boolean;
  error?: string;
} => {
  if (username.length < 3) {
    return {
      isValid: false,
      error: 'Username must be at least 3 characters',
    };
  }

  if (username.length > 20) {
    return {
      isValid: false,
      error: 'Username must be less than 20 characters',
    };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      isValid: false,
      error: 'Username can only contain letters, numbers, and underscores',
    };
  }

  return { isValid: true };
};

export const validatePostContent = (content: string, type: 'text' | 'image' | 'video'): {
  isValid: boolean;
  error?: string;
} => {
  if (type === 'text' && content.trim().length === 0) {
    return {
      isValid: false,
      error: 'Post content cannot be empty',
    };
  }

  if (content.length > 5000) {
    return {
      isValid: false,
      error: 'Post content is too long (max 5000 characters)',
    };
  }

  return { isValid: true };
};
