import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import clsx from 'clsx'
import styles from './Button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  asChild?: boolean
}

const variantClassMap: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: styles.buttonPrimary,
  secondary: styles.buttonSecondary,
  ghost: styles.buttonGhost,
  outline: styles.buttonOutline,
  destructive: styles.buttonDestructive,
  link: styles.buttonLink,
}

const sizeClassMap: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: styles.buttonSm,
  md: styles.buttonMd,
  lg: styles.buttonLg,
  icon: styles.buttonIcon,
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={clsx(
          styles.button,
          variantClassMap[variant],
          sizeClassMap[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }
export type { ButtonProps }
