import React, { useState, useEffect } from 'react';
import { BentoGrid } from '../../components/molecules/BentoGrid';
import { newsService } from '../../services/newsService';
import type { NewsArticle } from '../../types/news.types';

export const NewsDemo: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await newsService.fetchArticles({ limit: 8 });
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleContact = async (article: NewsArticle) => {
    try {
      await newsService.incrementContactCount(article.id);
      console.log('Contact initiated for:', article.headline);
      // You can add more contact handling logic here
    } catch (error) {
      console.error('Error tracking contact:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading news...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-900" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-red-500 uppercase tracking-wider">
                Breaking News
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Community News Hub
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Real stories from communities that need technical solutions. Each story represents an opportunity to make a difference.
            </p>
          </div>

          {/* News Grid */}
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
  );
};

export default NewsDemo; 