import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchNews, fetchStatistics, fetchLocations, fetchCredibilityDistribution } from '../utils/api'

const COLORS = ['#0f766e', '#1e3a8a', '#7c3aed', '#dc2626', '#f59e0b']
const CREDIBILITY_COLORS = { 'High': '#10b981', 'Medium': '#f59e0b', 'Low': '#dc2626' }

function Results() {
  const { region } = useParams()
  const [allNews, setAllNews] = useState([])
  const [filteredNews, setFilteredNews] = useState([])
  const [statistics, setStatistics] = useState({ crime_types: [], credibility: [], total_articles: 0, articles_with_location: 0 })
  const [locations, setLocations] = useState([])
  const [credibilityDist, setCredibilityDist] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCrimeType, setSelectedCrimeType] = useState('All')
  const [selectedCredibility, setSelectedCredibility] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [newsData, statsData, locationsData, credibilityData] = await Promise.all([
          fetchNews({ limit: 100 }),
          fetchStatistics(),
          fetchLocations(),
          fetchCredibilityDistribution()
        ])
        
        setAllNews(newsData || [])
        setStatistics(statsData || { crime_types: [], credibility: [], total_articles: 0 })
        setLocations(locationsData || [])
        setCredibilityDist(credibilityData || [])
      } catch (err) {
        console.error('Error loading data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = allNews
    
    if (region && region !== 'All') {
      const cleanRegion = decodeURIComponent(region).toLowerCase()
      filtered = filtered.filter(article => 
        article.location?.toLowerCase().includes(cleanRegion) ||
        article.title?.toLowerCase().includes(cleanRegion) ||
        article.description?.toLowerCase().includes(cleanRegion)
      )
    }
    
    if (selectedCrimeType !== 'All') {
      filtered = filtered.filter(article => article.crime_type === selectedCrimeType)
    }
    
    if (selectedCredibility !== 'All') {
      filtered = filtered.filter(article => article.credibility === selectedCredibility)
    }
    
    if (selectedLocation !== 'All') {
      filtered = filtered.filter(article => article.location === selectedLocation)
    }
    
    setFilteredNews(filtered)
  }, [allNews, region, selectedCrimeType, selectedCredibility, selectedLocation])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const getCrimeTypeOptions = () => ['All', ...statistics.crime_types.map(ct => ct.name).filter(Boolean)]
  const getLocationOptions = () => ['All', ...new Set(locations.map(l => l.name))]
  const getCredibilityOptions = () => ['All', 'High', 'Medium', 'Low']

  const getStatCard = (title, value, icon) => (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-md border-l-4 border-blue-600">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">{value || 0}</p>
        </div>
        <div className="text-4xl opacity-30">{icon}</div>
      </div>
    </div>
  )

  const getCredibilityBadge = (credibility) => {
    const colors = {
      'High': 'bg-green-100 text-green-800 border-green-300',
      'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Low': 'bg-red-100 text-red-800 border-red-300'
    }
    return colors[credibility] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <main className="flex-grow">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-8 px-4 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-3">
              📊 Crime Analysis: {decodeURIComponent(region)}
            </h1>
            <p className="text-blue-100 mt-2 text-lg">
              Real-time insights • Location breakdown • Credibility analysis
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-blue-300"></div>
              <p className="mt-6 text-gray-600 text-lg">Analyzing crime data...</p>
            </div>
          ) : (
            <>
              {/* Key Statistics */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">📈 Overview</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {getStatCard('Total Articles', statistics.total_articles, '📰')}
                  {getStatCard('Location Data', statistics.articles_with_location, '📍')}
                  {getStatCard('Crime Types', statistics.crime_types.length, '🔍')}
                  {getStatCard('High Credibility', statistics.credibility?.find(c => c.name === 'High')?.count || 0, '✅')}
                </div>
              </section>

              {/* Charts */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">📊 Analytics</h2>
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Crime Types */}
                  <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Crime Distribution</h3>
                    <ResponsiveContainer width="100%" height={350}>
                      {statistics.crime_types && statistics.crime_types.length > 0 ? (
                        <BarChart data={statistics.crime_types}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#1e3a8a" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">No data</div>
                      )}
                    </ResponsiveContainer>
                  </div>

                  {/* Credibility */}
                  <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Credibility Levels</h3>
                    <ResponsiveContainer width="100%" height={350}>
                      {credibilityDist && credibilityDist.length > 0 ? (
                        <PieChart>
                          <Pie
                            data={credibilityDist}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={110}
                            dataKey="value"
                          >
                            {credibilityDist.map((entry) => (
                              <Cell key={`cell-${entry.name}`} fill={CREDIBILITY_COLORS[entry.name] || '#888'} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">No data</div>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>

              {/* Locations Table */}
              {locations && locations.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">📍 Location Breakdown</h2>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
                          <tr>
                            <th className="px-6 py-4 text-left font-semibold">Location</th>
                            <th className="px-6 py-4 text-left font-semibold">Articles</th>
                            <th className="px-6 py-4 text-left font-semibold">High Credibility</th>
                            <th className="px-6 py-4 text-left font-semibold">Quality %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {locations.map((loc, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                              <td className="px-6 py-4 font-medium text-gray-900">{loc.name}</td>
                              <td className="px-6 py-4">{loc.articles}</td>
                              <td className="px-6 py-4">{loc.high_credibility}</td>
                              <td className="px-6 py-4">
                                <span className="text-green-600 font-semibold">
                                  {((loc.high_credibility / loc.articles) * 100).toFixed(1)}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              )}

              {/* Filters */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">🔍 Smart Filter</h2>
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <div className="grid md:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Crime Type</label>
                      <select 
                        value={selectedCrimeType}
                        onChange={(e) => setSelectedCrimeType(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      >
                        {getCrimeTypeOptions().map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Credibility</label>
                      <select 
                        value={selectedCredibility}
                        onChange={(e) => setSelectedCredibility(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      >
                        {getCredibilityOptions().map(cred => (
                          <option key={cred} value={cred}>{cred}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                      <select 
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      >
                        {getLocationOptions().map(loc => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setSelectedCrimeType('All')
                          setSelectedCredibility('All')
                          setSelectedLocation('All')
                        }}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">Showing {filteredNews.length} of {allNews.length} articles</p>
                </div>
              </section>

              {/* News Articles */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">📰 Articles ({filteredNews.length})</h2>

                {filteredNews.length === 0 ? (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg text-blue-800">
                    <p className="font-semibold">No articles match filters</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredNews.map((article, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-l-4 border-blue-600"
                      >
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-2">
                            {article.title}
                          </h3>
                          <div className="flex gap-2 flex-shrink-0 flex-wrap">
                            {article.crime_type && article.crime_type !== 'unknown' && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold whitespace-nowrap">
                                {article.crime_type}
                              </span>
                            )}
                            {article.credibility && (
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getCredibilityBadge(article.credibility)}`}>
                                {article.credibility}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {article.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-4 pb-4 border-b border-gray-200">
                          <span>📰 {article.source}</span>
                          <span>📅 {formatDate(article.published_at)}</span>
                          {article.location && article.location !== 'Unknown' && (
                            <span>📍 {article.location}</span>
                          )}
                        </div>
                        
                        {article.url && (
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Read Full Story →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Results
