"use client"

import React from 'react'
import {
  FieldError as AriaFieldError,
  type FieldErrorProps as AriaFieldErrorProps,
  Group as AriaGroup,
  type GroupProps as AriaGroupProps,
  Label as AriaLabel,
  type LabelProps as AriaLabelProps,
  Text as AriaText,
  type TextProps as AriaTextProps,
} from "react-aria-components"

interface LabelProps extends AriaLabelProps {
  className?: string
}

const Label: React.FC<LabelProps> = ({ className = '', style, ...props }) => (
  <AriaLabel 
    className={`field-label ${className}`}
    style={{
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-weight-medium)',
      lineHeight: '1',
      color: 'var(--color-text-primary)',
      marginBottom: 'var(--space-1)',
      display: 'block',
      ...style
    }}
    {...props} 
  />
)

interface FormDescriptionProps extends AriaTextProps {
  className?: string
}

function FormDescription({ className = '', style, ...props }: FormDescriptionProps) {
  return (
    <AriaText
      className={`field-description ${className}`}
      style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-secondary)',
        marginTop: 'var(--space-1)',
        ...style
      }}
      {...props}
      slot="description"
    />
  )
}

interface FieldErrorProps extends AriaFieldErrorProps {
  className?: string
}

function FieldError({ className = '', style, ...props }: FieldErrorProps) {
  return (
    <AriaFieldError
      className={`field-error ${className}`}
      style={{
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-weight-medium)',
        color: 'var(--color-accent-error)',
        marginTop: 'var(--space-1)',
        ...style
      }}
      {...props}
    />
  )
}

interface FieldGroupProps extends AriaGroupProps {
  className?: string
}

function FieldGroup({ className = '', style, ...props }: FieldGroupProps) {
  return (
    <AriaGroup
      className={`field-group ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        ...style
      }}
      {...props}
    />
  )
}

export { Label, FormDescription, FieldError, FieldGroup }
export type { LabelProps, FormDescriptionProps, FieldErrorProps, FieldGroupProps } 