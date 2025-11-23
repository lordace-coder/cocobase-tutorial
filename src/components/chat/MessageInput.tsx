import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '../common';
import styles from './MessageInput.module.css';

interface MessageInputProps {
  onSend: (message: { type: string; content: string; file?: File }) => void;
  disabled?: boolean;
}

export const MessageInput = ({ onSend, disabled }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | 'file' | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'file') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setFileType(type);
    setShowAttachMenu(false);

    if (type === 'image' || type === 'video') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    if (!message.trim() && !selectedFile) return;

    const messageType = selectedFile ? fileType || 'file' : 'text';

    onSend({
      type: messageType,
      content: message,
      file: selectedFile || undefined,
    });

    // Reset
    setMessage('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileType(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearAttachment = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileType(null);
  };

  return (
    <div className={styles.container}>
      {/* File preview */}
      {selectedFile && (
        <div className={styles.preview}>
          {fileType === 'image' && previewUrl && (
            <img src={previewUrl} alt="Preview" className={styles.previewImage} />
          )}
          {fileType === 'video' && previewUrl && (
            <video src={previewUrl} className={styles.previewVideo} controls />
          )}
          {fileType === 'file' && (
            <div className={styles.filePreview}>
              <span className={styles.fileIcon}>📄</span>
              <span className={styles.fileName}>{selectedFile.name}</span>
            </div>
          )}
          <button className={styles.clearButton} onClick={clearAttachment}>
            ✕
          </button>
        </div>
      )}

      {/* Input area */}
      <div className={styles.inputArea}>
        {/* Attach button with menu */}
        <div className={styles.attachWrapper}>
          <button
            className={styles.attachButton}
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            disabled={disabled}
          >
            📎
          </button>

          {showAttachMenu && (
            <div className={styles.attachMenu}>
              <button
                className={styles.menuItem}
                onClick={() => imageInputRef.current?.click()}
              >
                <span>🖼️</span>
                <span>Image</span>
              </button>
              <button
                className={styles.menuItem}
                onClick={() => videoInputRef.current?.click()}
              >
                <span>🎥</span>
                <span>Video</span>
              </button>
              <button
                className={styles.menuItem}
                onClick={() => fileInputRef.current?.click()}
              >
                <span>📄</span>
                <span>File</span>
              </button>
            </div>
          )}
        </div>

        {/* Hidden file inputs */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e, 'image')}
          className={styles.hiddenInput}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={(e) => handleFileSelect(e, 'video')}
          className={styles.hiddenInput}
        />
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => handleFileSelect(e, 'file')}
          className={styles.hiddenInput}
        />

        {/* Text input */}
        <textarea
          className={styles.input}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          rows={1}
        />

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={(!message.trim() && !selectedFile) || disabled}
          variant="primary"
          size="sm"
        >
          ➤
        </Button>
      </div>
    </div>
  );
};
