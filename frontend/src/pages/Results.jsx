
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Loader2, Filter, Download, ArrowLeft, RefreshCw, ShieldCheck, AlertOctagon } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchNews, fetchStatistics, fetchLocations, fetchCredibilityDistribution } from '../utils/api'
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']
const CREDIBILITY_COLORS = { 'High': '#10b981', 'Medium': '#f59e0b', 'Low': '#ef4444' }

function Results() {
  const { region } = useParams()
  const navigate = useNavigate()
  const [allNews, setAllNews] = useState([])
  const [filteredNews, setFilteredNews] = useState([])
  const [statistics, setStatistics] = useState({ crime_types: [], credibility: [], total_articles: 0, articles_with_location: 0 })
  const [locations, setLocations] = useState([])
  const [credibilityDist, setCredibilityDist] = useState([])
  const [loading, setLoading] = useState(true)

  // Filter states
  const [statusFilter, setStatusFilter] = useState({
    crimeType: 'All',
    credibility: 'All',
    location: 'All'
  })

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

    // Region Filter (from URL)
    if (region && region !== 'All') {
      const cleanRegion = decodeURIComponent(region).toLowerCase()
      filtered = filtered.filter(article =>
        article.location?.toLowerCase().includes(cleanRegion) ||
        article.title?.toLowerCase().includes(cleanRegion) ||
        article.description?.toLowerCase().includes(cleanRegion)
      )
    }

    // Manual Filters
    if (statusFilter.crimeType !== 'All') {
      filtered = filtered.filter(article => article.crime_type === statusFilter.crimeType)
    }
    if (statusFilter.credibility !== 'All') {
      filtered = filtered.filter(article => article.credibility === statusFilter.credibility)
    }
    if (statusFilter.location !== 'All') {
      filtered = filtered.filter(article => article.location === statusFilter.location)
    }

    setFilteredNews(filtered)
  }, [allNews, region, statusFilter])

  const handleFilterChange = (key, value) => {
    setStatusFilter(prev => ({ ...prev, [key]: value }))
  }

  const getCrimeTypeOptions = () => ['All', ...statistics.crime_types.map(ct => ct.name).filter(Boolean)]
  const getLocationOptions = () => ['All', ...new Set(locations.map(l => l.name))]
  const getCredibilityOptions = () => ['All', 'High', 'Medium', 'Low']

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Analyzing crime data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 w-full max-w-[95%] mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Button variant="ghost" className="mb-2 pl-0 hover:pl-2 transition-all text-base" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Search
            </Button>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold tracking-tight">Crime Dashboard: {decodeURIComponent(region)}</h1>
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
              </span>
              <span className="text-red-500 font-bold text-sm tracking-widest uppercase animate-pulse">Live Feed</span>
            </div>
            <p className="text-xl text-muted-foreground">Real-time intelligence and community safety metrics.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="lg" onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 h-5 w-5" /> Refresh Intelligence
            </Button>
            <Button variant="default" size="lg">
              <Download className="mr-2 h-5 w-5" /> Export Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.total_articles}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Locations Tracked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.articles_with_location}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Verified High Trust</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {statistics.credibility?.find(c => c.name === 'High')?.count || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Crime Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.crime_types.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Crime Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statistics.crime_types}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {statistics.crime_types.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Credibility Analysis</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={credibilityDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {credibilityDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CREDIBILITY_COLORS[entry.name] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Filter */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" /> Filter Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-3 text-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={statusFilter.crimeType}
                onChange={(e) => handleFilterChange('crimeType', e.target.value)}
              >
                {getCrimeTypeOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <select
                className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-3 text-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={statusFilter.credibility}
                onChange={(e) => handleFilterChange('credibility', e.target.value)}
              >
                {getCredibilityOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <select
                className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-3 text-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={statusFilter.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              >
                {getLocationOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <Button
                variant="secondary"
                onClick={() => setStatusFilter({ crimeType: 'All', credibility: 'All', location: 'All' })}
              >
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Articles List */}
        <div className="grid grid-cols-1 gap-4 mb-20">
          <h2 className="text-2xl font-bold">Latest Intelligence Reports</h2>
          {filteredNews.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              No reports found matching your criteria.
            </Card>
          ) : (
            filteredNews.map((article, idx) => (
              <Card key={idx} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${article.credibility === 'High' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          article.credibility === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                            'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}>
                          {article.credibility} Confidence
                        </span>
                        <span className="text-xs text-muted-foreground">{article.source} • {new Date(article.published_at).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">{article.description}</p>
                    </div>
                    <div className="flex flex-col justify-between items-end gap-2">
                      {article.crime_type && (
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
                          {article.crime_type}
                        </span>
                      )}
                      <Button asChild size="sm" variant="outline">
                        <a href={article.url} target="_blank" rel="noopener noreferrer">Read Source</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Results
