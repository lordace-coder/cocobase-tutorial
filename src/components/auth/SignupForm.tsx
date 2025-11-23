import { useState, FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword, validateUsername } from '../../utils/validation';
import { Button, Input } from '../common';
import styles from './AuthForm.module.css';

interface SignupFormProps {
  onToggleForm: () => void;
}

export const SignupForm = ({ onToggleForm }: SignupFormProps) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    // Username validation
    const usernameValidation = validateUsername(formData.username);
    if (!usernameValidation.isValid) {
      newErrors.username = usernameValidation.error!;
    }

    // Display name validation
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await signup({
        username: formData.username,
        displayName: formData.displayName,
        email: formData.email,
        password: formData.password,
      });
    } catch (error) {
      setErrors({ email: 'Failed to create account' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create account</h1>
        <p className={styles.subtitle}>Join the community today</p>
      </div>

      <div className={styles.fields}>
        <Input
          id="username"
          type="text"
          label="Username"
          placeholder="johndoe"
          value={formData.username}
          onChange={(e) => handleChange('username', e.target.value)}
          error={errors.username}
        />

        <Input
          id="displayName"
          type="text"
          label="Display Name"
          placeholder="John Doe"
          value={formData.displayName}
          onChange={(e) => handleChange('displayName', e.target.value)}
          error={errors.displayName}
        />

        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
        />

        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="Create a password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          error={errors.password}
        />

        <Input
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
        />
      </div>

      <Button type="submit" fullWidth isLoading={isLoading}>
        Sign Up
      </Button>

      <p className={styles.toggle}>
        Already have an account?{' '}
        <button type="button" onClick={onToggleForm} className={styles.link}>
          Sign in
        </button>
      </p>
    </form>
  );
};
