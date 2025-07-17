import type { ReactNode } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { cn } from "../../lib/utils";
import { Button } from "./button";

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn("bento-grid", className)}
      style={{
        display: 'grid',
        width: '100%',
        gridTemplateRows: 'repeat(3, 22rem)',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--space-4)',
      }}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string;
  className: string;
  background: ReactNode;
  Icon: any;
  description: string;
  href: string;
  cta: string;
}) => (
  <div
    key={name}
    className={cn("bento-card", className)}
    style={{
      position: 'relative',
      gridColumn: 'span 3',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflow: 'hidden',
      borderRadius: 'var(--radius-xl)',
      background: 'var(--card-background)',
      border: 'var(--card-border)',
      boxShadow: 'var(--card-shadow)',
      cursor: 'pointer',
      transition: 'var(--transition-normal)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'var(--card-shadow)';
    }}
  >
    <div>{background}</div>
    
    <div 
      style={{
        pointerEvents: 'none',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-1)',
        padding: 'var(--space-6)',
        transition: 'var(--transition-normal)',
      }}
      className="content-section"
    >
      <Icon 
        style={{
          height: '3rem',
          width: '3rem',
          color: 'var(--color-text-secondary)',
          transition: 'var(--transition-normal)',
        }}
      />
      
      <h3 
        style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-text-primary)',
          margin: 0,
        }}
      >
        {name}
      </h3>
      
      <p 
        style={{
          maxWidth: '28rem',
          color: 'var(--color-text-tertiary)',
          fontSize: 'var(--text-base)',
          lineHeight: 'var(--leading-relaxed)',
          margin: 0,
        }}
      >
        {description}
      </p>
    </div>

    <div
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        bottom: 0,
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 'var(--space-4)',
        transform: 'translateY(2.5rem)',
        opacity: 0,
        transition: 'var(--transition-normal)',
      }}
      className="cta-section"
    >
      <Button 
        variant="ghost" 
        size="sm" 
        style={{
          pointerEvents: 'auto',
          color: 'var(--color-text-primary)',
          background: 'var(--color-surface-tertiary)',
          border: '1px solid var(--color-border-primary)',
        }}
      >
        <a 
          href={href} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          {cta}
          <ArrowRightIcon style={{ marginLeft: 'var(--space-2)', height: '1rem', width: '1rem' }} />
        </a>
      </Button>
    </div>
    
    <div 
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        inset: 0,
        transition: 'var(--transition-normal)',
        background: 'transparent',
      }}
      className="overlay"
    />

    <style>{`
      .bento-card:hover .content-section {
        transform: translateY(-2.5rem);
      }
      
      .bento-card:hover .cta-section {
        transform: translateY(0);
        opacity: 1;
      }
      
      .bento-card:hover .overlay {
        background: rgba(0, 0, 0, 0.03);
      }
      
      .dark .bento-card:hover .overlay {
        background: rgba(255, 255, 255, 0.02);
      }
    `}</style>
  </div>
);

export { BentoCard, BentoGrid }; 