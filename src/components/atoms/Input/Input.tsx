import React, { useCallback } from 'react';
import type { InputProps } from './Input.types';

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

  const sizeStyles = {
    small: {
      padding: 'var(--spacing-xs) var(--spacing-sm)',
      fontSize: 'var(--text-sm)',
      height: '32px',
    },
    medium: {
      padding: 'var(--spacing-sm) var(--spacing-md)',
      fontSize: 'var(--text-base)',
      height: '40px',
    },
    large: {
      padding: 'var(--spacing-md) var(--spacing-lg)',
      fontSize: 'var(--text-lg)',
      height: '48px',
    },
  };

  const baseInputStyles = {
    width: fullWidth ? '100%' : 'auto',
    border: error ? '1px solid var(--color-accent-error)' : '1px solid var(--color-border-primary)',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'var(--color-text-primary)',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all var(--transition-fast)',
    backdropFilter: 'blur(8px)',
    ...sizeStyles[size],
  };

  const focusStyles = `
    &:focus {
      border-color: var(--color-border-focus);
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }
    &::placeholder {
      color: var(--color-text-placeholder);
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

  const wrapperStyles = {
    position: 'relative' as const,
    display: 'inline-flex',
    alignItems: 'center',
    width: fullWidth ? '100%' : 'auto',
  };

  const iconStyles = {
    position: 'absolute' as const,
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none' as const,
    color: 'var(--color-text-tertiary)',
    zIndex: 1,
  };

  const leftIconStyles = {
    ...iconStyles,
    left: 'var(--spacing-sm)',
  };

  const rightIconStyles = {
    ...iconStyles,
    right: 'var(--spacing-sm)',
  };

  const inputWithIconsStyles = {
    ...baseInputStyles,
    paddingLeft: leftIcon ? 'calc(var(--spacing-xl) + var(--spacing-sm))' : baseInputStyles.padding,
    paddingRight: rightIcon ? 'calc(var(--spacing-xl) + var(--spacing-sm))' : baseInputStyles.padding,
  };

  return (
    <div style={wrapperStyles} className={className}>
      {leftIcon && (
        <span style={leftIconStyles} aria-hidden="true">
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
        style={inputWithIconsStyles}
        {...props}
      />
      {rightIcon && (
        <span style={rightIconStyles} aria-hidden="true">
          {rightIcon}
        </span>
      )}
      {error && errorMessage && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: 'var(--spacing-xs)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-accent-error)',
          }}
        >
          {errorMessage}
        </div>
      )}
      <style>{focusStyles}</style>
    </div>
  );
};