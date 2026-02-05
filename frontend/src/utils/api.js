import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:5000/api'

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

export const fetchStatistics = async () => {
  try {
    const response = await api.get('/statistics')
    return response.data
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return { crime_types: [], credibility: [], total_articles: 0 }
  }
}

export const fetchLocations = async () => {
  try {
    const response = await api.get('/locations')
    return response.data
  } catch (error) {
    console.error('Error fetching locations:', error)
    return []
  }
}

export const fetchCredibilityDistribution = async () => {
  try {
    const response = await api.get('/credibility-distribution')
    return response.data
  } catch (error) {
    console.error('Error fetching credibility distribution:', error)
    return []
  }
}
