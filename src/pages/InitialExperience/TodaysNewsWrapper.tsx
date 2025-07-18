import React, { useState, useEffect, useCallback } from 'react';
import { BentoGrid } from '../../components/molecules/BentoGrid';
import { EmailComposer } from '../../components/organisms/EmailComposer/EmailComposer';
import { TagGroup, TagList, Tag } from '../../components/atoms/TagGroup';
import { newsService } from '../../services/newsService';
import type { NewsArticle, NewsHero } from '../../types/news.types';
import type { Mentor } from '../../types/mentor.types';

export const TodaysNewsWrapper: React.FC = () => {
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

  // Convert NewsArticle to NewsHero format for EmailComposer
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

  // Create a default mentor
  const defaultMentor: Mentor = {
    id: 'default-mentor',
    name: 'Tech Mentor',
    title: 'Senior Technical Advisor',
    company: 'System Tycoon',
    avatar: '🧠',
    expertise: ['System Design', 'Social Impact', 'Mentorship'],
    contribution: 'Technology should bridge gaps between problems and solutions',
    message: 'Focus on understanding their real constraints and offer practical, sustainable solutions. Every technical decision should consider the human impact.',
    toastMessage: 'Look for opportunities to connect your technical skills with real-world problems that matter.'
  };

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

  return (
    <>
      <div style={{ 
        minHeight: '100vh',
        background: 'var(--color-surface-primary)',
        padding: 'var(--space-8)'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-8)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-4)'
            }}>
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
          <div style={{ 
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

      {/* Email Composer Modal */}
      {emailToOpen && (
        <EmailComposer
          isOpen={!!emailToOpen}
          onClose={handleCloseEmailComposer}
          hero={convertArticleToHero(emailToOpen)}
          mentor={defaultMentor}
          onSend={handleEmailSend}
        />
      )}
    </>
  );
}; 