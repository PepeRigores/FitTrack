import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div style={{ marginBottom: '1rem', width: '100%' }}>
            {label && (
                <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--text-secondary)'
                }}>
                    {label}
                </label>
            )}
            <input
                className={className}
                style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text)',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'}
                {...props}
            />
            {error && (
                <span style={{
                    display: 'block',
                    marginTop: '0.25rem',
                    fontSize: '0.75rem',
                    color: 'var(--danger)'
                }}>
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;
