import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BentoGrid } from '../../components/molecules/BentoGrid';
import { EmailComposer } from '../../components/organisms/EmailComposer/EmailComposer';
import { TagGroup, TagList, Tag } from '../../components/atoms/TagGroup';
import { newsService } from '../../services/newsService';
import type { NewsArticle } from '../../types/news.types';
import type { Mentor } from '../../types/mentor.types';

interface NewsWrapperProps {
  hero?: {
    headline: string;
    subheadline: string;
    tags: string[];
  };
  mentor?: Mentor;
}

export const NewsWrapper: React.FC<NewsWrapperProps> = ({ hero, mentor }) => {
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

  const handleContact = useCallback(async (article: NewsArticle) => {
    try {
      await newsService.incrementContactCount(article.id);
      setEmailToOpen(article);
    } catch (error) {
      console.error('Error tracking contact:', error);
      setEmailToOpen(article);
    }
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

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        {/* Gradient background */}
        <div className="fixed inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-900" />
        
        {/* Content */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            {hero && (
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 mb-4">
                  <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-red-500 uppercase tracking-wider">
                    Breaking News
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {hero.headline}
                </h1>
                
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                  {hero.subheadline}
                </p>
              </div>
            )}

            {/* Category Tags */}
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

      {/* Email Composer Modal - Simplified for now */}
      {emailToOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setEmailToOpen(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4 text-black">Contact About: {emailToOpen.headline}</h3>
            <p className="text-gray-700 mb-6">{emailToOpen.preview_text}</p>
            <div className="flex gap-4">
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                onClick={() => {
                  console.log('Contact initiated for article:', emailToOpen.id);
                  setEmailToOpen(null);
                }}
              >
                Send Message
              </button>
              <button 
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                onClick={() => setEmailToOpen(null)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}; 