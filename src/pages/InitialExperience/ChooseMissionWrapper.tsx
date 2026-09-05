import React, { useState, useEffect, useCallback } from 'react';
import { BentoGrid } from '../../components/molecules/BentoGrid';
import { EmailComposer } from '../../components/organisms/EmailComposer/EmailComposer';
import { TagGroup, TagList, Tag } from '../../components/atoms/TagGroup';
import { Globe } from '../../components/ui/globe';
import { useTheme } from '../../hooks/useTheme';
import { newsService } from '../../services/newsService';
import { CampaignProgress } from '../../components/organisms/CampaignProgress';


import type { NewsArticle, NewsHero } from '../../types/news.types';

export const ChooseMissionWrapper: React.FC = () => {
  const { theme } = useTheme();
  const [emailToOpen, setEmailToOpen] = useState<NewsArticle | null>(null);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [campaignRevision, setCampaignRevision] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Fetch articles and categories on mount
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const [articlesData, categoriesData] = await Promise.all([
          newsService.fetchArticles({
            limit: 12,
            categories: selectedCategories.length > 0 ? selectedCategories : undefined,
          }),
          newsService.getCategories()
        ]);
        if (!cancelled) {
          setArticles(articlesData);
          setCategories(categoriesData);
        }
      } catch (error) {
          console.error('Error fetching news data:', error);
          if (!cancelled) {
            setArticles([]);
            setCategories([]);
            setLoadError('Missions could not be loaded. Check your connection and try again.');
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
    };

    void fetchData();
    return () => { cancelled = true; };
  }, [selectedCategories]);

  // Convert NewsArticle to NewsHero format for components
  const convertArticleToHero = useCallback((article: NewsArticle): NewsHero => {
    return {
      id: article.id,
      name: article.author_name,
      title: 'Community Leader',
      organization: article.publication_name,
      avatar: article.author_avatar_url || '👤',
      location: article.location || 'Unknown Location',
      category: article.category_slug as NewsHero['category'],
      urgency: article.urgency_level,
      headline: article.headline,
      preview: article.preview_text,
      fullDescription: article.full_text,
      impact: {
        people: article.impact_stats?.people || 100,
        metric: article.impact_stats?.metric || 'people affected'
      },
      technicalProblem: article.preview_text,
      skillsNeeded: article.tags.slice(0, 4),
      businessConstraints: {
        budget: '$10,000',
        timeline: '2-4 weeks',
        compliance: ['Data Privacy', 'Security Standards']
      }
    };
  }, []);

  const handleContact = useCallback((article: NewsArticle) => {
    setEmailToOpen(article);
  }, []);



  const handleCloseEmailComposer = useCallback(() => {
    setEmailToOpen(null);
  }, []);

  const handleEmailSend = useCallback((emailData: {
    to: string;
    subject: string;
    body: string;
    hero: NewsHero;
  }) => {
    void emailData;
    setEmailToOpen(null);
    setCampaignRevision(r => r + 1);
  }, []);

  const formatCategoryName = (slug: string) => {
    return slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading missions...</div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col gap-4 items-center justify-center" role="alert">
        <p>{loadError}</p>
        <button type="button" onClick={() => window.location.reload()} className="underline">
          Try again
        </button>
      </div>
    );
  }



  const heroToShow = emailToOpen ? convertArticleToHero(emailToOpen) : null;



  return (
    <>
      <div className="relative h-screen overflow-hidden" style={{ 
        background: 'var(--color-surface-primary)'
      }}>
                {/* Animated Globe Background */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <div style={{ 
            position: 'absolute',
            left: '50%',
            top: '66.67vh', // Bottom third of viewport
            transform: 'translate(-50%, -50%)',
            width: '1800px', // Tripled from ~600px
            height: '1800px',
          }}>
            <Globe className="absolute inset-0" />
          </div>
          <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
        </div>
        
        <div style={{ 
          position: 'relative',
          zIndex: 20,
          height: '100%',
          overflowY: 'auto',
          padding: 'var(--space-8) 0'
        }}>
          <div style={{
            maxWidth: '1200px', 
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-8)',
            padding: '0 var(--space-8) calc(var(--space-8) * 4) var(--space-8)'
          }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <h1 
              className={theme === 'dark' ? 'gradient-text-dark' : 'gradient-text-light'}
              style={{
                fontSize: '6rem',
                fontWeight: '600',
                lineHeight: '1.1',
                marginBottom: 'var(--space-6)',
                padding: '0 1rem',
                textAlign: 'center',
                overflow: 'visible',
                display: 'block'
              }}
            >
              Choose Your Mission
            </h1>
            <p style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
              marginBottom: 'var(--space-3)'
            }}>
              Help a hero who aligns with what you care about
            </p>

            {/* Category filters integrated into header */}
            {categories.length > 0 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <TagGroup 
                  selectionMode="multiple"
                  selectedKeys={new Set(selectedCategories)}
                  onSelectionChange={(keys) => {
                    setSelectedCategories(Array.from(keys) as string[]);
                  }}
                  aria-label="Filter news articles by category"
                >
                  <TagList>
                    {categories.map((categorySlug) => (
                      <Tag 
                        key={categorySlug}
                        id={categorySlug}
                        className="cursor-pointer"
                      >
                        {formatCategoryName(categorySlug)}
                      </Tag>
                    ))}
                  </TagList>
                </TagGroup>
              </div>
            )}
          </div>

          <CampaignProgress refreshKey={campaignRevision} />
          {/* News Grid */}
          <div>
            <div className="relative backdrop-blur-sm bg-white/10 dark:bg-black/10 rounded-lg p-6">
              <BentoGrid
                articles={articles}
                onContact={handleContact}
              >
                {/* Fallback content when no articles */}
                {articles.length === 0 && (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: 'var(--space-12)',
                    color: 'var(--color-text-secondary)'
                  }}>
                    <p>No articles available for the selected categories</p>
                  </div>
                )}
              </BentoGrid>
            </div>
          </div>
          </div>
        </div>
      </div>



      {/* Email Composer */}
      {heroToShow && (
        <EmailComposer
          isOpen={!!emailToOpen}
          onClose={handleCloseEmailComposer}
          hero={heroToShow}
          theme="dark"
          articleId={emailToOpen?.id}
          missionId={emailToOpen?.mission_id}
          onSend={handleEmailSend}
        />
      )}
    </>
  );
};
