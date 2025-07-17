import React from 'react';
import { Database, Cloud, Shield, Briefcase, TrendingUp, Code } from 'lucide-react';
import { BentoCard, BentoGrid } from '../../components/ui/bento-grid';

const techNewsFeatures = [
  {
    Icon: Database,
    name: "New Database Scaling Patterns Released",
    description: "Industry leaders share innovative approaches to horizontal database scaling with microservices architecture. New patterns include auto-sharding, read replicas, and connection pooling strategies that can handle millions of concurrent users.",
    href: "#database-scaling",
    cta: "Learn Patterns",
    background: (
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.1) 50%, transparent 100%)' 
      }} />
    ),
    className: "lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2",
  },
  {
    Icon: Cloud,
    name: "Cloud Architecture Best Practices 2024",
    description: "Updated guidelines for building resilient cloud-native applications with focus on observability and cost optimization.",
    href: "#cloud-practices",
    cta: "Read Guide",
    background: (
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 197, 253, 0.1) 50%, transparent 100%)' 
      }} />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Briefcase,
    name: "System Design Interview Trends",
    description: "What top tech companies are looking for in system design interviews this year. Focus on scalability, reliability, and real-world constraints.",
    href: "#interview-trends",
    cta: "Prep Guide",
    background: (
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 100%)' 
      }} />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3",
  },
  {
    Icon: Shield,
    name: "Kubernetes Security Updates",
    description: "Critical security patches and best practices for container orchestration. New RBAC policies and network security measures.",
    href: "#k8s-security",
    cta: "Security Guide",
    background: (
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(251, 191, 36, 0.1) 50%, transparent 100%)' 
      }} />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: TrendingUp,
    name: "Tech Trends Shaping 2024",
    description: "AI-powered development tools, edge computing adoption, and the rise of WebAssembly in production environments are transforming how we build software.",
    href: "#tech-trends",
    cta: "Explore Trends",
    background: (
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(251, 113, 133, 0.1) 50%, transparent 100%)' 
      }} />
    ),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Code,
    name: "Developer Productivity Revolution",
    description: "New tools and methodologies increasing developer efficiency by 300%. AI pair programming, automated testing, and intelligent code review systems are becoming mainstream.",
    href: "#dev-productivity",
    cta: "Boost Productivity",
    background: (
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(129, 140, 248, 0.1) 50%, transparent 100%)' 
      }} />
    ),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4",
  },
];

export const NewsWrapper: React.FC = () => {
  return (
    <div 
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--color-surface-primary)',
        overflow: 'auto',
        fontFamily: 'var(--font-primary)'
      }}
    >
      <div 
        style={{
          maxWidth: 'var(--layout-content-max-width)',
          margin: '0 auto',
          padding: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-6)',
          minHeight: '100%'
        }}
      >
        {/* Header */}
        <div 
          style={{
            textAlign: 'center',
            marginBottom: 'var(--space-8)'
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, var(--color-accent-primary) 0%, var(--color-accent-tertiary) 100%)',
              color: 'var(--color-text-primary)',
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-bold)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              marginBottom: 'var(--space-4)',
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)'
            }}
          >
            📈 TRENDING
          </div>
          
          <h1 
            style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              margin: '0 0 var(--space-2) 0',
              letterSpacing: '-0.02em'
            }}
          >
            Tech News
          </h1>
          
          <p 
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-tertiary)',
              margin: 0
            }}
          >
            Latest updates in system design and engineering
          </p>
        </div>

        {/* News Grid */}
        <div style={{ flex: 1 }}>
          <BentoGrid className="tech-news-grid">
            {techNewsFeatures.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </div>

        {/* Footer */}
        <div 
          style={{
            textAlign: 'center',
            marginTop: 'var(--space-12)',
            padding: 'var(--space-4)',
            borderTop: '1px solid var(--color-border-primary)',
            color: 'var(--color-text-tertiary)',
            fontSize: 'var(--text-sm)'
          }}
        >
          <p style={{ margin: 0 }}>
            Subscribe for weekly tech insights • Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      <style>{`
        .tech-news-grid {
          grid-template-rows: repeat(3, 22rem);
          grid-template-columns: repeat(3, 1fr);
        }
        
        @media (max-width: 1023px) {
          .tech-news-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: repeat(6, 20rem) !important;
          }
          
          .tech-news-grid .bento-card {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
          }
        }
        
        @media (max-width: 768px) {
          .tech-news-grid {
            grid-template-rows: repeat(6, 16rem) !important;
          }
        }
      `}</style>
    </div>
  );
}; 