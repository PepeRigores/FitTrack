import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
    return (
        <div className={`
      bg-[var(--surface)] 
      rounded-[var(--radius-lg)] 
      p-[var(--spacing-lg)] 
      shadow-[var(--shadow-md)] 
      border 
      border-[var(--border)]
      ${className}
    `}
            style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-lg)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border)',
            }}
        >
            {title && (
                <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    marginBottom: 'var(--spacing-md)',
                    color: 'var(--text)'
                }}>
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
};

export default Card;
