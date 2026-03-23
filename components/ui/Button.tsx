'use client';

import { ReactNode, CSSProperties } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'small' | 'medium' | 'large' | 'block';
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const variantStyles: Record<string, CSSProperties> = {
  primary: {
    backgroundColor: '#FF6600',
    color: '#FFFFFF',
    border: 'none',
  },
  secondary: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    border: '2px solid #FFFFFF',
  },
  success: {
    backgroundColor: '#00C853',
    color: '#FFFFFF',
    border: 'none',
  },
  danger: {
    backgroundColor: '#FF3D00',
    color: '#FFFFFF',
    border: 'none',
  },
};

const sizeStyles: Record<string, CSSProperties> = {
  small: { padding: '6px 12px', fontSize: '13px' },
  medium: { padding: '10px 20px', fontSize: '14px' },
  large: { padding: '14px 28px', fontSize: '16px' },
  block: { padding: '16px', fontSize: '16px', width: '100%', display: 'block' },
};

export default function Button({
  variant = 'primary',
  size = 'medium',
  children,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const baseStyle: CSSProperties = {
    borderRadius: '12px',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    opacity: disabled ? 0.6 : 1,
    ...variantStyles[variant],
    ...sizeStyles[size],
  };

  return (
    <button
      style={baseStyle}
      className={className}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
