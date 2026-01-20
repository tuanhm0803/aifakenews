import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const newsApi = {
  // Get all news articles
  getAllNews: async (skip = 0, limit = 20, category = null) => {
    const params = { skip, limit };
    if (category) params.category = category;
    const response = await axios.get(`${API_BASE_URL}/news`, { params });
    return response.data;
  },

  // Get featured news
  getFeaturedNews: async (limit = 5) => {
    const response = await axios.get(`${API_BASE_URL}/news/featured`, {
      params: { limit }
    });
    return response.data;
  },

  // Get single article
  getArticle: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/news/${id}`);
    return response.data;
  },

  // Generate new news article
  generateNews: async (topic = null, category = 'general', includeBillionaire = false) => {
    const response = await axios.post(`${API_BASE_URL}/news/generate`, {
      topic,
      category,
      include_billionaire: includeBillionaire
    });
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data.categories;
  },

  // Get stats
  getStats: async () => {
    const response = await axios.get(`${API_BASE_URL}/stats`);
    return response.data;
  }
};
