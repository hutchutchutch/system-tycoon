import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    render(<Button loading>Loading...</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(<Button variant="primary">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--primary');
    
    rerender(<Button variant="danger">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--danger');
  });

  it('renders icon in correct position', () => {
    const icon = <span data-testid="icon">🚀</span>;
    
    const { rerender } = render(
      <Button icon={icon} iconPosition="left">Text</Button>
    );
    const button = screen.getByRole('button');
    expect(button.firstElementChild).toHaveClass('btn__icon');
    
    rerender(<Button icon={icon} iconPosition="right">Text</Button>);
    expect(button.lastElementChild).toHaveClass('btn__icon');
  });
});