import React, { useCallback } from 'react';
import { clsx } from 'clsx';
import type { InputProps } from './Input.types';
import styles from './Input.module.css';

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  error = false,
  errorMessage,
  leftIcon,
  rightIcon,
  size = 'medium',
  fullWidth = false,
  className,
  'aria-label': ariaLabel,
  ...props
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  // Map size prop values to CSS module classes
  const sizeClass = size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'md';

  return (
    <div className={clsx(styles['input-wrapper'], { 'w-full': fullWidth })}>
      {leftIcon && (
        <span className={clsx(styles['input-wrapper__icon'], styles['input-wrapper__icon--left'])} aria-hidden="true">
          {leftIcon}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          styles.input,
          styles[`input--${sizeClass}`],
          {
            [styles['input--error']]: error,
            [styles['input--with-icon-left']]: leftIcon,
            [styles['input--with-icon-right']]: rightIcon,
          },
          className
        )}
        aria-label={ariaLabel}
        aria-invalid={error}
        aria-describedby={errorMessage ? `error-${value}` : undefined}
        {...props}
      />
      {rightIcon && (
        <span className={clsx(styles['input-wrapper__icon'], styles['input-wrapper__icon--right'])} aria-hidden="true">
          {rightIcon}
        </span>
      )}
      {errorMessage && (
        <span 
          id={`error-${value}`}
          className={styles['input-group__error']}
          role="alert"
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
};