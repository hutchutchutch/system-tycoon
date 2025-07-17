import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap' as const,
      borderRadius: 'var(--radius-md)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-weight-medium)',
      transition: 'all var(--transition-fast)',
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      textDecoration: 'none',
    }

    const variantStyles = {
      primary: {
        background: 'var(--color-accent-primary)',
        color: 'var(--color-accent-primary-foreground)',
      },
      secondary: {
        background: 'var(--color-surface-secondary)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border-primary)',
      },
      ghost: {
        background: 'transparent',
        color: 'var(--color-text-primary)',
      },
      outline: {
        background: 'transparent',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border-primary)',
      },
      destructive: {
        background: 'var(--color-accent-error)',
        color: 'var(--color-accent-error-foreground)',
      },
      link: {
        background: 'transparent',
        color: 'var(--color-accent-primary)',
        textDecoration: 'underline',
        textUnderlineOffset: '4px',
      }
    }

    const sizeStyles = {
      sm: {
        height: 'var(--space-6)',
        paddingLeft: 'var(--space-2)',
        paddingRight: 'var(--space-2)',
        fontSize: 'var(--text-sm)',
      },
      md: {
        height: 'var(--space-8)',
        paddingLeft: 'var(--space-3)',
        paddingRight: 'var(--space-3)',
        fontSize: 'var(--text-base)',
      },
      lg: {
        height: '44px',
        paddingLeft: 'var(--space-4)',
        paddingRight: 'var(--space-4)',
        fontSize: 'var(--text-lg)',
      },
      icon: {
        height: 'var(--space-8)',
        width: 'var(--space-8)',
        padding: '0',
      }
    }

    const hoverStyles = variant === 'ghost' ? {
      ':hover': {
        background: 'var(--color-surface-secondary)',
      }
    } : variant === 'outline' ? {
      ':hover': {
        background: 'var(--color-surface-secondary)',
      }
    } : {
      ':hover': {
        opacity: '0.9',
        transform: 'translateY(-1px)',
      }
    }

    return (
      <Comp
        className={`button button--${variant} button--${size} ${className}`}
        style={{
          ...baseStyles,
          ...variantStyles[variant],
          ...sizeStyles[size],
          ...(props.disabled && {
            opacity: '0.5',
            cursor: 'not-allowed',
            pointerEvents: 'none',
          }),
        }}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }
export type { ButtonProps }