import { TextareaHTMLAttributes, forwardRef } from 'react';
import styles from './TextArea.module.css';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
  maxCount?: number;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, showCount, maxCount, className = '', value, ...props }, ref) => {
    const currentCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className={styles.textAreaWrapper}>
        {label && (
          <label className={styles.label} htmlFor={props.id}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`${styles.textArea} ${error ? styles.error : ''} ${className}`}
          value={value}
          {...props}
        />
        <div className={styles.footer}>
          <div>
            {error && <span className={styles.errorText}>{error}</span>}
            {!error && helperText && (
              <span className={styles.helperText}>{helperText}</span>
            )}
          </div>
          {showCount && maxCount && (
            <span className={styles.count}>
              {currentCount}/{maxCount}
            </span>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
