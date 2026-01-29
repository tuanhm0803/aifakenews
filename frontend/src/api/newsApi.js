import axios from 'axios';

// Use relative path so nginx can proxy in production
// In dev, Vite proxy handles it (see vite.config.js)
const API_BASE_URL = '/api';

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
  },

  // Get about content
  getAbout: async () => {
    const response = await axios.get(`${API_BASE_URL}/about`);
    return response.data;
  },

  // Update about content
  updateAbout: async (content) => {
    const response = await axios.put(`${API_BASE_URL}/about`, { content });
    return response.data;
  },

  // Features API
  // Characters
  getCharacters: async () => {
    const response = await axios.get(`${API_BASE_URL}/features/characters`);
    return response.data;
  },
  createCharacter: async (name, description) => {
    const response = await axios.post(`${API_BASE_URL}/features/characters`, { name, description });
    return response.data;
  },
  updateCharacter: async (id, name, description) => {
    const response = await axios.put(`${API_BASE_URL}/features/characters/${id}`, { name, description });
    return response.data;
  },
  deleteCharacter: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/features/characters/${id}`);
    return response.data;
  },

  // Places
  getPlaces: async () => {
    const response = await axios.get(`${API_BASE_URL}/features/places`);
    return response.data;
  },
  createPlace: async (name, description) => {
    const response = await axios.post(`${API_BASE_URL}/features/places`, { name, description });
    return response.data;
  },
  updatePlace: async (id, name, description) => {
    const response = await axios.put(`${API_BASE_URL}/features/places/${id}`, { name, description });
    return response.data;
  },
  deletePlace: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/features/places/${id}`);
    return response.data;
  },

  // Weather
  getWeather: async () => {
    const response = await axios.get(`${API_BASE_URL}/features/weather`);
    return response.data;
  },
  createWeather: async (name, description) => {
    const response = await axios.post(`${API_BASE_URL}/features/weather`, { name, description });
    return response.data;
  },
  updateWeather: async (id, name, description) => {
    const response = await axios.put(`${API_BASE_URL}/features/weather/${id}`, { name, description });
    return response.data;
  },
  deleteWeather: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/features/weather/${id}`);
    return response.data;
  },

  // Events
  getEvents: async () => {
    const response = await axios.get(`${API_BASE_URL}/features/events`);
    return response.data;
  },
  createEvent: async (name, description) => {
    const response = await axios.post(`${API_BASE_URL}/features/events`, { name, description });
    return response.data;
  },
  updateEvent: async (id, name, description) => {
    const response = await axios.put(`${API_BASE_URL}/features/events/${id}`, { name, description });
    return response.data;
  },
  deleteEvent: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/features/events/${id}`);
    return response.data;
  }
};
