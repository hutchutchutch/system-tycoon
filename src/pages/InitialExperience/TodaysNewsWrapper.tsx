import React, { useState, useEffect, useCallback } from 'react';
import { BentoGrid } from '../../components/molecules/BentoGrid';
import { EmailComposer } from '../../components/organisms/EmailComposer/EmailComposer';
import { TagGroup, TagList, Tag } from '../../components/atoms/TagGroup';
import { Globe } from '../../components/ui/globe';
import { useTheme } from '../../contexts/ThemeContext';
import { newsService } from '../../services/newsService';
import type { NewsArticle, NewsHero } from '../../types/news.types';

export const TodaysNewsWrapper: React.FC = () => {
  const { theme } = useTheme();
  const [emailToOpen, setEmailToOpen] = useState<NewsArticle | null>(null);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);



  // Fetch articles and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [articlesData, categoriesData] = await Promise.all([
          newsService.fetchArticles({ limit: 12 }),
          newsService.getCategories()
        ]);
        setArticles(articlesData);
        setCategories(categoriesData);
              } catch (error) {
          console.error('Error fetching news data:', error);
          // Set some default mock data to test the UI
          const mockArticles: NewsArticle[] = [
            {
              id: '1',
              mission_id: 'mission_1',
              headline: 'Community Health Initiative Needs Tech Help',
              subheadline: 'Patient tracking system urgently needed',
              preview_text: 'Local health organization needs system design support for patient tracking',
              full_text: 'A community health organization is looking for help with building a patient tracking system to serve 5000+ community members.',
              author_name: 'Dr. Sarah Johnson',
              author_avatar_url: '👩‍⚕️',
              publication_name: 'Community Health Network',
              category_slug: 'healthcare',
              urgency_level: 'high',
              tags: ['healthcare', 'databases', 'privacy', 'api'],
              impact_stats: { people: 5000, metric: 'patients served' },
              location: 'Seattle, WA',
              grid_size: 'medium',
              sort_weight: 100,
              article_status: 'active',
              view_count: 0,
              contact_count: 0,
              completion_count: 0,
              published_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              created_at: new Date().toISOString()
            }
          ];
          setArticles(mockArticles);
          setCategories(['healthcare', 'education', 'environment']);
        } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter articles when categories change
  useEffect(() => {
    if (selectedCategories.length === 0) {
      // Show all articles if no categories selected
      newsService.fetchArticles({ limit: 12 }).then(setArticles);
    } else {
      // Filter by selected categories
      newsService.fetchArticles({ 
        limit: 12, 
        categories: selectedCategories 
      }).then(setArticles);
    }
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

  const handleContact = useCallback(async (article: NewsArticle) => {
    try {
      await newsService.incrementContactCount(article.id);
      setEmailToOpen(article);
    } catch (error) {
      console.error('Error tracking contact:', error);
      setEmailToOpen(article);
    }
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
    console.log('Email sent:', emailData);
    // TODO: Implement actual email sending logic
    setEmailToOpen(null);
  }, []);

  const formatCategoryName = (slug: string) => {
    return slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading today's news...</div>
      </div>
    );
  }



  const heroToShow = emailToOpen ? convertArticleToHero(emailToOpen) : null;



  return (
    <>
      <div className="relative min-h-screen overflow-hidden" style={{ 
        background: 'var(--color-surface-primary)',
        padding: 'var(--space-8)'
      }}>
                {/* Animated Globe Background */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
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
          maxWidth: '1200px', 
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-8)',
          position: 'relative',
          zIndex: 20
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
              Today's Community News
            </h1>
            <p style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Discover heroes making a difference in their communities
            </p>
          </div>

          {/* Category filters */}
          <div className="relative backdrop-blur-sm bg-white/10 dark:bg-black/10 rounded-lg p-6" style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 'var(--space-4)'
          }}>
            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)'
            }}>
              Filter by Category:
            </h3>
            
            {categories.length > 0 && (
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
            )}
          </div>

          {/* News Grid */}
          <div style={{ flex: 1 }}>
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

      {/* Email Composer */}
      {heroToShow && (
        <EmailComposer
          isOpen={!!emailToOpen}
          onClose={handleCloseEmailComposer}
          hero={heroToShow}
          theme="dark"
          onSend={handleEmailSend}
        />
      )}
    </>
  );
}; 