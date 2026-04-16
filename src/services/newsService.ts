import { api } from './cloudflareApi';
import type { NewsArticle } from '../types/news.types';

export interface FetchNewsOptions {
  limit?: number;
  categories?: string[];
  urgencyLevel?: string;
  gridSize?: string;
}

export const newsService = {
  async fetchArticles(options: FetchNewsOptions = {}): Promise<NewsArticle[]> {
    const params = new URLSearchParams();

    if (options.limit) {
      params.set('limit', String(options.limit));
    }

    if (options.categories && options.categories.length > 0) {
      params.set('categories', options.categories.join(','));
    }

    if (options.urgencyLevel) {
      params.set('urgencyLevel', options.urgencyLevel);
    }

    if (options.gridSize) {
      params.set('gridSize', options.gridSize);
    }

    const queryString = params.toString();
    const path = queryString ? '/news?' + queryString : '/news';

    const data = await api.get<NewsArticle[]>(path);
    return data || [];
  },

  async getCategories(): Promise<string[]> {
    const data = await api.get<string[]>('/news/categories');
    return data || [];
  },

  async incrementViewCount(articleId: string): Promise<void> {
    await api.post('/news/' + articleId + '/view');
  },

  async incrementContactCount(articleId: string): Promise<void> {
    await api.post('/news/' + articleId + '/contact');
  }
};
