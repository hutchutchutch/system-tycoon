import React, { useState, useEffect } from 'react';
import { BentoGrid } from '../../components/molecules/BentoGrid';
import { TagGroup, TagList, Tag } from '../../components/atoms/TagGroup';
import { newsService } from '../../services/newsService';
import type { NewsArticle } from '../../types/news.types';

export const TodaysNewsWrapper: React.FC = () => {
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

  const handleContact = async (article: NewsArticle) => {
    try {
      await newsService.incrementContactCount(article.id);
      console.log('Contact initiated for:', article.headline);
      // You can add more contact handling logic here
    } catch (error) {
      console.error('Error tracking contact:', error);
    }
  };

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
            Latest stories from communities seeking technical solutions
          </p>
        </div>

        {/* Category Filter */}
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
  );
}; 