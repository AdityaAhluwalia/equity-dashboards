# UI Components

This directory contains reusable UI components that form the foundation of the design system.

## Components

- **Button** - Primary, secondary, and variant buttons
- **Card** - Container components for content sections
- **Input** - Form input components with validation
- **Modal** - Dialog and modal components
- **Spinner** - Loading indicators
- **Badge** - Status and category indicators
- **Tooltip** - Contextual help components

## Design Principles

- Follow Apple-inspired design with pastel colors
- Ensure accessibility (WCAG 2.1 compliance)
- Mobile-first responsive design
- Consistent spacing using design tokens
- Support for light/dark themes

## Usage

```tsx
import { Button, Card, Input } from '@/components/ui'

export function Example() {
  return (
    <Card>
      <Input placeholder="Enter company name" />
      <Button variant="primary">Search</Button>
    </Card>
  )
}
``` 