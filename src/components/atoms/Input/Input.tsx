import React, { useCallback } from 'react';
import { clsx } from 'clsx';
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
  className,
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
  ...props
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className={clsx('input-wrapper', { 'w-full': fullWidth })}>
      <div className={clsx(
        'input-container',
        `input-container--${size}`,
        {
          'input-container--error': error,
          'input-container--disabled': disabled,
          'input-container--with-left-icon': leftIcon,
          'input-container--with-right-icon': rightIcon,
        }
      )}>
        {leftIcon && (
          <span className="input__icon input__icon--left" aria-hidden="true">
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
            'input',
            `input--${size}`,
            {
              'input--error': error,
              'input--with-left-icon': leftIcon,
              'input--with-right-icon': rightIcon,
            },
            className
          )}
          aria-label={ariaLabel}
          aria-invalid={error}
          aria-describedby={errorMessage ? `${dataTestId}-error` : undefined}
          data-testid={dataTestId}
          {...props}
        />
        {rightIcon && (
          <span className="input__icon input__icon--right" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>
      {errorMessage && (
        <span 
          id={`${dataTestId}-error`}
          className="input__error-message"
          role="alert"
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
};