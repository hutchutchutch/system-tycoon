import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BentoGrid } from '../../components/molecules/BentoGrid';
import { EmailComposer } from '../../components/organisms/EmailComposer/EmailComposer';
import { TagGroup, TagList, Tag } from '../../components/atoms/TagGroup';
import { newsService } from '../../services/newsService';
import type { NewsArticle, NewsHero } from '../../types/news.types';
interface NewsWrapperProps {
  hero?: {
    headline: string;
    subheadline: string;
    tags: string[];
  };
}

export const NewsWrapper: React.FC<NewsWrapperProps> = ({ hero }) => {
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
          newsService.fetchArticles({ limit: 6 }),
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
      newsService.fetchArticles({ limit: 6 }).then(setArticles);
    } else {
      // Filter by selected categories
      newsService.fetchArticles({ 
        limit: 6, 
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

  const handleTagClick = useCallback((categorySlug: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categorySlug)) {
        return prev.filter(cat => cat !== categorySlug);
      } else {
        return [...prev, categorySlug];
      }
    });
  }, []);

  const formatCategoryName = (slug: string) => {
    return slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading news...</div>
      </div>
    );
  }

  const heroToShow = emailToOpen ? convertArticleToHero(emailToOpen) : null;

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        {/* Gradient background */}
        <div className="fixed inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-900" />
        
        {/* Content */}
        <div className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Today's News
              </h1>
              <p className="text-gray-400 text-lg">
                Discover heroes making a difference in their communities
              </p>
            </div>

            {/* Category filters */}
            {categories.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Filter by Category:</h3>
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
                        className="cursor-pointer hover:scale-105 transition-transform"
                      >
                        {formatCategoryName(categorySlug)}
                      </Tag>
                    ))}
                  </TagList>
                </TagGroup>
              </div>
            )}

            {/* News Grid with real data */}
            <BentoGrid 
              articles={articles}
              onContact={handleContact}
            >
              {/* Fallback content when no articles */}
              {articles.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">No articles available</p>
                </div>
              )}
            </BentoGrid>
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