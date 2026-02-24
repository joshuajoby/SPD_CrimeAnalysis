import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Loader2, Filter, Download, ArrowLeft, RefreshCw, ShieldCheck, AlertOctagon, ChevronRight, X, ExternalLink, Shield } from 'lucide-react'
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
  const [sortBy, setSortBy] = useState('date') // 'date', 'credibility'
  const [selectedArticle, setSelectedArticle] = useState(null) // For Modal

  // Filter states
  const [statusFilter, setStatusFilter] = useState({
    crimeType: 'All',
    credibility: 'All',
    location: 'All'
  })

  const loadData = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true)
      const [newsData, statsData, locationsData, credibilityData] = await Promise.all([
        fetchNews({ limit: 200 }), // Increased limit for better population
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
      if (isInitial) setLoading(false)
    }
  }

  useEffect(() => {
    loadData(true)
    const intervalId = setInterval(() => loadData(false), 10000)

    return () => clearInterval(intervalId)
  }, [])

  const handleManualRefresh = async () => {
    try {
      await fetch('/api/fetch-news-now', { method: 'POST' });
      await loadData(false);
    } catch (e) {
      console.error("Failed manual refresh:", e);
    }
  }

  // Apply filters and sorting
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

    // Sorting
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
    } else if (sortBy === 'credibility') {
      const score = { 'High': 3, 'Medium': 2, 'Low': 1, 'Unknown': 0 }
      filtered.sort((a, b) => score[b.credibility] - score[a.credibility])
    }

    setFilteredNews(filtered)
  }, [allNews, region, statusFilter, sortBy])

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

      <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 w-full max-w-[1400px] mx-auto">
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
            <Button variant="outline" size="lg" onClick={handleManualRefresh}>
              <RefreshCw className="mr-2 h-5 w-5" /> Refresh Intelligence
            </Button>
            <Button variant="default" size="lg" onClick={() => navigate('/verify')}>
              <ShieldCheck className="mr-2 h-5 w-5" /> Verify Credibility
            </Button>
          </div>
        </div>

        {/* Charts & KPI Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">

          {/* KPI Cards Column - Made cleaner and more colorful */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative">
              <div className="absolute -right-6 -top-6 bg-white/10 w-24 h-24 rounded-full blur-2xl"></div>
              <CardHeader className="pb-1 pt-4 px-5">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-blue-100">Total Analytics</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <div className="text-3xl font-black">{statistics.total_articles}</div>
                <p className="text-[10px] text-blue-100 mt-1 opacity-80">Processed Reports</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white overflow-hidden relative">
              <div className="absolute -right-6 -top-6 bg-white/10 w-24 h-24 rounded-full blur-2xl"></div>
              <CardHeader className="pb-1 pt-4 px-5">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-100">Verified Trust</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <div className="text-3xl font-black">
                  {statistics.credibility?.find(c => c.name === 'High')?.count || 0}
                </div>
                <p className="text-[10px] text-emerald-100 mt-1 opacity-80">High Credibility Sources</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white overflow-hidden relative">
              <div className="absolute -right-6 -top-6 bg-white/10 w-24 h-24 rounded-full blur-2xl"></div>
              <CardHeader className="pb-1 pt-4 px-5">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-amber-100">Hot Zones</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <div className="text-3xl font-black">{statistics.articles_with_location}</div>
                <p className="text-[10px] text-amber-100 mt-1 opacity-80">Active Geolocations</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Columns - Reduced height to 250px */}
          <Card className="lg:col-span-2 shadow-sm border-slate-200">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">Crime Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[250px] px-2 pb-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statistics.crime_types} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 9, fill: '#64748b' }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={40}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: '11px', padding: '4px 8px' }}
                  />
                  <Bar dataKey="value" radius={[3, 3, 0, 0]} name="Incidents" barSize={24}>
                    {statistics.crime_types.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1 shadow-sm border-slate-200">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">Credibility Split</CardTitle>
            </CardHeader>
            <CardContent className="h-[250px] px-0 pb-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={credibilityDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    stroke="none"
                  >
                    {credibilityDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CREDIBILITY_COLORS[entry.name] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: '11px', padding: '4px 8px' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>


        {/* Advanced Filter & Sort */}
        <Card className="mb-8 sticky top-20 z-30 shadow-md border-slate-200">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-2 font-bold text-slate-700 whitespace-nowrap">
                <Filter className="h-4 w-4" /> Filters:
              </div>

              <select className="input-field" value={statusFilter.crimeType} onChange={(e) => handleFilterChange('crimeType', e.target.value)}>
                {getCrimeTypeOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>

              <select className="input-field" value={statusFilter.credibility} onChange={(e) => handleFilterChange('credibility', e.target.value)}>
                {getCredibilityOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>

              <select className="input-field" value={statusFilter.location} onChange={(e) => handleFilterChange('location', e.target.value)}>
                {getLocationOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>

              <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

              <div className="flex items-center gap-2 font-bold text-slate-700 whitespace-nowrap">
                Sort By:
              </div>
              <select className="input-field w-auto" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date">Newest First</option>
                <option value="credibility">Highest Credibility</option>
              </select>

              <Button variant="ghost" onClick={() => {
                setStatusFilter({ crimeType: 'All', credibility: 'All', location: 'All' });
                setSortBy('date');
              }} className="ml-auto text-sm text-slate-500 hover:text-slate-900">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Articles List - Masonry Grid */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Latest Intelligence Reports <span className="text-lg font-normal text-slate-500 ml-2">({filteredNews.length} reports)</span>
            </h2>
          </div>

          {filteredNews.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground bg-slate-50 border-dashed border-2">
              <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>No reports found matching your criteria.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((article, idx) => (
                <Card key={idx} className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-slate-200 flex flex-col overflow-hidden bg-white h-full cursor-pointer"
                  onClick={() => setSelectedArticle(article)}>
                  {/* Trust Indicator Strip */}
                  <div className={`h-1.5 w-full ${article.credibility === 'High' ? 'bg-emerald-500' :
                    article.credibility === 'Medium' ? 'bg-amber-500' :
                      'bg-rose-500'
                    }`}></div>

                  <CardContent className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${article.credibility === 'High' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        article.credibility === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                        {article.credibility} Trust
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {new Date(article.published_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors line-clamp-3">
                      {article.title}
                    </h3>

                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
                      <span className="text-xs font-bold text-slate-500 uppercase">{article.source}</span>
                      <div className="flex items-center text-blue-600 text-xs font-bold">
                        Read Analysis <ChevronRight className="w-3 h-3 ml-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setSelectedArticle(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}>

            <button className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
              onClick={() => setSelectedArticle(null)}>
              <X className="w-5 h-5 text-slate-600" />
            </button>

            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${selectedArticle.credibility === 'High' ? 'bg-emerald-100 text-emerald-800' :
                  selectedArticle.credibility === 'Medium' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                  {selectedArticle.credibility} Confidence Score
                </span>
                <span className="text-slate-500 text-sm font-medium">
                  {new Date(selectedArticle.published_at).toLocaleString()}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 leading-tight">
                {selectedArticle.title}
              </h2>

              <div className="prose prose-slate max-w-none mb-8">
                <p className="text-lg text-slate-600 leading-relaxed">
                  {selectedArticle.description ? selectedArticle.description.replace(/<[^>]+>/g, '') : 'No detailed description available for this report.'}
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" /> AI Credibility Analysis
                </h4>
                <p className="text-sm text-slate-600 mb-4">
                  Our system has analyzed this report's source, sentiment, and cross-referenced facts.
                </p>
                <div className="flex gap-4 text-sm">
                  <div className="flex flex-col">
                    <span className="text-slate-400 uppercase text-xs font-bold">Source</span>
                    <span className="font-semibold text-slate-900">{selectedArticle.source}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-400 uppercase text-xs font-bold">Crime Type</span>
                    <span className="font-semibold text-slate-900 capitalize">{selectedArticle.crime_type || 'Unclassified'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-400 uppercase text-xs font-bold">Location</span>
                    <span className="font-semibold text-slate-900 capitalize">{selectedArticle.location || 'Unknown'}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white" asChild>
                  <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer">
                    Read Original Source <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => navigate('/verify')}>
                  Verify Another Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style>{`
        .input-field {
            height: 2.5rem;
            border-radius: 0.375rem;
            border: 1px solid #e2e8f0;
            padding: 0 1rem;
            font-size: 0.875rem;
            background-color: white;
            color: #0f172a;
            outline: 2px solid transparent;
            min-width: 140px;
        }
        .input-field:focus {
            outline: 2px solid #2563eb;
            border-color: transparent;
        }
      `}</style>
    </div>
  )
}

export default Results
