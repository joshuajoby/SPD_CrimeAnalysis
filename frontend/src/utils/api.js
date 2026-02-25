import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const fetchNews = async (filters = {}) => {
  try {
    const response = await api.get('/news', { params: filters })
    return response.data
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}

export const fetchStatistics = async (filters = {}) => {
  try {
    const response = await api.get('/statistics', { params: filters })
    return response.data
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return { crime_types: [], credibility: [], total_articles: 0 }
  }
}

export const fetchLocations = async (filters = {}) => {
  try {
    const response = await api.get('/locations', { params: filters })
    return response.data
  } catch (error) {
    console.error('Error fetching locations:', error)
    return []
  }
}

export const fetchCredibilityDistribution = async (filters = {}) => {
  try {
    const response = await api.get('/credibility-distribution', { params: filters })
    return response.data
  } catch (error) {
    console.error('Error fetching credibility distribution:', error)
    return []
  }
}
