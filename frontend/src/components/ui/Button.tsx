import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    className = '',
    disabled,
    ...props
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: 'var(--primary)',
                    color: '#ffffff',
                };
            case 'secondary':
                return {
                    backgroundColor: 'var(--surface-hover)',
                    color: 'var(--text)',
                };
            case 'danger':
                return {
                    backgroundColor: 'var(--danger)',
                    color: '#ffffff',
                };
            case 'ghost':
                return {
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                };
            default:
                return {};
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return { padding: '0.5rem 1rem', fontSize: '0.875rem' };
            case 'lg':
                return { padding: '1rem 2rem', fontSize: '1.125rem' };
            default:
                return { padding: '0.75rem 1.5rem', fontSize: '1rem' };
        }
    };

    const baseStyles: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        borderRadius: 'var(--radius-md)',
        fontWeight: 600,
        transition: 'all 0.2s',
        opacity: disabled || isLoading ? 0.7 : 1,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        ...getVariantStyles(),
        ...getSizeStyles(),
    };

    return (
        <button
            style={baseStyles}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="animate-spin" size={16} />}
            {!isLoading && icon}
            {children}
        </button>
    );
};

export default Button;
