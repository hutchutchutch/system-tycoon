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
  return (
    <AriaTag
      textValue={textValue}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--color-border-primary)',
        padding: 'var(--space-1) var(--space-3)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-weight-medium)',
        backgroundColor: 'var(--color-surface-secondary)',
        color: 'var(--color-text-secondary)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        userSelect: 'none',
        ...style
      }}
      {...props}
    >
      {composeRenderProps(children, (children, renderProps) => (
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            ...(renderProps.isSelected && {
              backgroundColor: 'var(--color-accent-primary)',
              color: 'var(--color-text-primary)',
              borderColor: 'var(--color-accent-primary)'
            }),
            ...(renderProps.isHovered && !renderProps.isSelected && {
              backgroundColor: 'var(--color-surface-interactive)',
              borderColor: 'var(--color-border-secondary)'
            })
          }}
        >
          {children}
          {renderProps.allowsRemoving && (
            <AriaButton
              slot="remove"
              style={{
                borderRadius: 'var(--radius-sm)',
                opacity: 0.7,
                padding: 'var(--space-1)',
                background: 'transparent',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease'
              }}
            >
              <XIcon style={{ width: '12px', height: '12px' }} aria-hidden />
            </AriaButton>
          )}
        </div>
      ))}
    </AriaTag>
  )
}

interface DesignSystemTagGroupProps<T>
  extends Omit<AriaTagGroupProps, "children">,
    Pick<AriaTagListProps<T>, "items" | "children" | "renderEmptyState"> {
  label?: string
  description?: string
  errorMessage?: string
}

function DesignSystemTagGroup<T extends object>({
  label,
  description,
  style,
  errorMessage,
  items,
  children,
  renderEmptyState,
  ...props
}: DesignSystemTagGroupProps<T>) {
  return (
    <TagGroup 
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        ...style
      }} 
      {...props}
    >
      {label && (
        <div style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-1)'
        }}>
          {label}
        </div>
      )}
      <TagList items={items} renderEmptyState={renderEmptyState}>
        {children}
      </TagList>
      {description && (
        <Text 
          slot="description"
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-tertiary)'
          }}
        >
          {description}
        </Text>
      )}
      {errorMessage && (
        <Text 
          slot="errorMessage"
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-accent-error)'
          }}
        >
          {errorMessage}
        </Text>
      )}
    </TagGroup>
  )
}

export { TagGroup, TagList, Tag, DesignSystemTagGroup }
export type { DesignSystemTagGroupProps } 