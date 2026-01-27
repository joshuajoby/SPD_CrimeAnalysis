import axios from 'axios'

const API_BASE_URL = '/api'

export const fetchNews = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/news`)
    return response.data
  } catch (error) {
    console.error('Error fetching news:', error)
    throw error
  }
}
