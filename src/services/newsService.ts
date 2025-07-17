import { supabase } from './supabase';
import type { NewsArticle } from '../types/news.types';

export interface FetchNewsOptions {
  limit?: number;
  categories?: string[];
  urgencyLevel?: string;
  gridSize?: string;
}

export const newsService = {
  async fetchArticles(options: FetchNewsOptions = {}): Promise<NewsArticle[]> {
    let query = supabase
      .from('news_articles')
      .select('*')
      .eq('article_status', 'active')
      .order('published_at', { ascending: false });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.categories && options.categories.length > 0) {
      query = query.in('category_slug', options.categories);
    }

    if (options.urgencyLevel) {
      query = query.eq('urgency_level', options.urgencyLevel);
    }

    if (options.gridSize) {
      query = query.eq('grid_size', options.gridSize);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching news articles:', error);
      throw error;
    }

    return data as NewsArticle[] || [];
  },

  async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('news_articles')
      .select('category_slug')
      .eq('article_status', 'active');

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    // Get unique category slugs with proper typing
    const categories = data?.map((item: { category_slug: string }) => item.category_slug) || [];
    const uniqueCategories = [...new Set(categories)];
    return uniqueCategories.sort();
  },

  async incrementViewCount(articleId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_view_count', { article_id: articleId });

    if (error) {
      console.error('Error incrementing view count:', error);
    }
  },

  async incrementContactCount(articleId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_contact_count', { article_id: articleId });

    if (error) {
      console.error('Error incrementing contact count:', error);
    }
  }
}; 