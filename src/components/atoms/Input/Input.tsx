import React, { useCallback } from 'react';
import clsx from 'clsx';
import type { InputProps } from './Input.types';
import styles from './Input.module.css';

const sizeClassMap: Record<NonNullable<InputProps['size']>, string> = {
  small: styles.inputSmall,
  medium: styles.inputMedium,
  large: styles.inputLarge,
};

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
  className = '',
  'aria-label': ariaLabel,
  ...props
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div
      className={clsx(
        styles.wrapper,
        fullWidth && styles.wrapperFullWidth,
        className,
      )}
    >
      {leftIcon && (
        <span className={clsx(styles.icon, styles.iconLeft)} aria-hidden="true">
          {leftIcon}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        className={clsx(
          styles.input,
          sizeClassMap[size],
          fullWidth && styles.inputFullWidth,
          error && styles.inputError,
          leftIcon && styles.inputWithLeftIcon,
          rightIcon && styles.inputWithRightIcon,
        )}
        {...props}
      />
      {rightIcon && (
        <span className={clsx(styles.icon, styles.iconRight)} aria-hidden="true">
          {rightIcon}
        </span>
      )}
      {error && errorMessage && (
        <div className={styles.errorMessage}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};
