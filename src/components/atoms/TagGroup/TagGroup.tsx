"use client"

import React from 'react';
import { XIcon } from "lucide-react"
import {
  Button as AriaButton,
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  type TagGroupProps as AriaTagGroupProps,
  TagList as AriaTagList,
  type TagListProps as AriaTagListProps,
  type TagProps as AriaTagProps,
  composeRenderProps,
  Text,
} from "react-aria-components"

import { Label } from '../Field'

const TagGroup = AriaTagGroup

function TagList<T extends object>({
  style,
  ...props
}: AriaTagListProps<T>) {
  return (
    <AriaTagList
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--space-2)',
        ...style
      }}
      {...props}
    />
  )
}

function Tag({ children, style, ...props }: AriaTagProps) {
  let textValue = typeof children === "string" ? children : undefined
  
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--space-1)',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--color-border-primary)',
    paddingLeft: 'var(--space-2)',
    paddingRight: 'var(--space-2)',
    paddingTop: 'calc(var(--space-1) / 2)',
    paddingBottom: 'calc(var(--space-1) / 2)',
    fontSize: 'var(--text-xs)',
    fontWeight: 'var(--font-weight-semibold)',
    transition: 'all var(--transition-fast)',
    cursor: 'pointer',
    userSelect: 'none' as const,
    outline: 'none',
  }

  return (
    <AriaTag
      textValue={textValue}
      className="tag"
      style={(renderProps) => ({
        ...baseStyles,
        backgroundColor: renderProps.isSelected 
          ? 'var(--color-accent-primary)' 
          : 'var(--color-surface-secondary)',
        color: renderProps.isSelected 
          ? 'var(--color-accent-primary-foreground)' 
          : 'var(--color-text-primary)',
        borderColor: renderProps.isSelected 
          ? 'var(--color-accent-primary)' 
          : 'var(--color-border-primary)',
        opacity: renderProps.isDisabled ? '0.5' : '1',
        transform: renderProps.isHovered ? 'translateY(-1px)' : 'none',
        boxShadow: renderProps.isFocused 
          ? '0 0 0 2px var(--color-accent-primary)' 
          : renderProps.isHovered 
            ? 'var(--shadow-card)' 
            : 'none',
        ...style
      })}
      {...props}
    >
      {composeRenderProps(children, (children, renderProps) => (
        <>
          {children}
          {renderProps.allowsRemoving && (
            <AriaButton 
              slot="remove"
              style={{
                background: 'none',
                border: 'none',
                padding: '0',
                margin: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: 'var(--radius-sm)',
                marginLeft: 'var(--space-1)',
                width: '16px',
                height: '16px',
                color: 'inherit',
                opacity: '0.7',
              }}
            >
              <XIcon size={12} />
            </AriaButton>
          )}
        </>
      ))}
    </AriaTag>
  )
}

export { TagGroup, TagList, Tag }
export type { AriaTagGroupProps as TagGroupProps, AriaTagListProps as TagListProps, AriaTagProps as TagProps } 