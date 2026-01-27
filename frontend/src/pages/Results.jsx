import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchNews } from '../utils/api'

const crimeData = [
  { name: 'Theft', count: 45 },
  { name: 'Fraud', count: 32 },
  { name: 'Assault', count: 28 },
  { name: 'Murder', count: 12 },
  { name: 'Other', count: 18 }
]

const pieData = [
  { name: 'Theft', value: 35 },
  { name: 'Fraud', value: 25 },
  { name: 'Assault', value: 20 },
  { name: 'Murder', value: 10 },
  { name: 'Other', value: 10 }
]

const COLORS = ['#dc2626', '#1e3a8a', '#3b82f6', '#ef4444', '#64748b']

const topCrimes = [
  { title: 'Theft', description: 'Most common in urban areas', severity: 'High' },
  { title: 'Fraud', description: 'Increasing cyber crime incidents', severity: 'High' },
  { title: 'Assault', description: 'Requires immediate attention', severity: 'Medium' }
]

function Results() {
  const { region } = useParams()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true)
        const data = await fetchNews()
        setNews(data.slice(0, 5))
        setError(null)
      } catch (err) {
        setError('Failed to load news. Please try again later.')
        console.error('Error loading news:', err)
      } finally {
        setLoading(false)
      }
    }

    loadNews()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        <div className="bg-primary text-white py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold">
              Crime Insights: {decodeURIComponent(region)}
            </h1>
            <p className="text-gray-200 mt-2">
              Comprehensive crime analysis and latest news for your region
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Top Crimes to Look Out For
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {topCrimes.map((crime, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-accent"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-primary">
                      {crime.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      crime.severity === 'High'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {crime.severity}
                    </span>
                  </div>
                  <p className="text-gray-600">{crime.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Crime Statistics
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Crime Categories
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={crimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#1e3a8a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Crime Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Latest Crime News
            </h2>

            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-gray-600">Loading news...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {!loading && !error && news.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
                No news articles available at the moment.
              </div>
            )}

            {!loading && !error && news.length > 0 && (
              <div className="space-y-4 max-h-[800px] overflow-y-auto">
                {news.map((article, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      {article.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <span className="font-semibold mr-1">Source:</span>
                        {article.source}
                      </span>
                      <span className="flex items-center">
                        <span className="font-semibold mr-1">Date:</span>
                        {formatDate(article.published_at)}
                      </span>
                    </div>
                    {article.url && (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-accent hover:text-accent-light font-medium transition-colors"
                      >
                        Read More →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Results
