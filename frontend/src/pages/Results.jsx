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

  const loadData = async (currentFilters = {}, isInitial = false) => {
    try {
      if (isInitial) setLoading(true)

      // Map frontend filter state to API parameters
      const apiFilters = {
        crime_type: currentFilters.crimeType !== 'All' ? currentFilters.crimeType : undefined,
        location: currentFilters.location !== 'All' ? currentFilters.location : (region !== 'All' ? region : undefined),
      }

      const [newsData, statsData, locationsData, credibilityData] = await Promise.all([
        fetchNews({ ...apiFilters, limit: 200 }),
        fetchStatistics(apiFilters),
        fetchLocations(apiFilters),
        fetchCredibilityDistribution(apiFilters)
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
    loadData(statusFilter, true)

    // Refresh interval every 30s instead of 10s to be less aggressive
    const intervalId = setInterval(() => loadData(statusFilter, false), 30000)

    return () => clearInterval(intervalId)
  }, [statusFilter, region])

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
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 selection:bg-red-900/30">
      <Navbar />

      <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 w-full max-w-[1400px] mx-auto pb-20">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all text-slate-400 hover:text-white hover:bg-transparent" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Intelligence Map
            </Button>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-600 rounded-lg shadow-lg shadow-red-900/20">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">
                {region && region !== 'All' ? `Sector: ${decodeURIComponent(region)}` : 'National Command Dashboard'}
              </h1>
              <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-red-950/30 border border-red-500/30 rounded-full">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-red-500 font-black text-[10px] tracking-widest uppercase animate-pulse">Live Intel</span>
              </div>
            </div>
            <p className="text-lg text-slate-400 font-medium">Monitoring active threats and community risk metrics across the sector.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="lg" onClick={handleManualRefresh} className="border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white border-2">
              <RefreshCw className="mr-2 h-5 w-5" /> Refresh Network
            </Button>
            <Button variant="destructive" size="lg" onClick={() => navigate('/verify')} className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-900/40">
              <ShieldCheck className="mr-2 h-5 w-5" /> Verify Alert
            </Button>
          </div>
        </div>

        {/* Charts & KPI Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">

          {/* KPI Cards Column */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-0 shadow-2xl bg-slate-900/80 border-l-4 border-l-blue-500 backdrop-blur-md">
              <CardHeader className="pb-1 pt-4 px-5">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Threat Database</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <div className="text-4xl font-black text-white">{statistics.total_articles}</div>
                <p className="text-[11px] text-slate-500 mt-1 font-bold">Processed Incidents</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl bg-slate-900/80 border-l-4 border-l-emerald-500 backdrop-blur-md">
              <CardHeader className="pb-1 pt-4 px-5">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Intelligence Confidence</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <div className="text-4xl font-black text-white">
                  {statistics.credibility?.find(c => c.name === 'High')?.count || 0}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-bold">High Trust Reports</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl bg-slate-900/80 border-l-4 border-l-red-500 backdrop-blur-md">
              <CardHeader className="pb-1 pt-4 px-5">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">Critical Locations</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <div className="text-4xl font-black text-white">{statistics.articles_with_location}</div>
                <p className="text-[11px] text-slate-500 mt-1 font-bold">Tracked Geolocations</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Columns */}
          <Card className="lg:col-span-2 shadow-2xl bg-slate-900/40 border-slate-800 backdrop-blur-sm">
            <CardHeader className="pb-2 pt-4 px-6">
              <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Crime Classification Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-[280px] px-2 pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statistics.crime_types} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: '#334155', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)', fontSize: '12px', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Incidents" barSize={32}>
                    {statistics.crime_types.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981'][index % 5]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1 shadow-2xl bg-slate-900/40 border-slate-800 backdrop-blur-sm">
            <CardHeader className="pb-2 pt-4 px-6">
              <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Source Reliability</CardTitle>
            </CardHeader>
            <CardContent className="h-[280px] px-0 pb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={credibilityDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                    stroke="none"
                  >
                    {credibilityDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CREDIBILITY_COLORS[entry.name] || '#475569'} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', fontSize: '12px', color: '#f8fafc' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>


        {/* Advanced Filter & Sort */}
        <Card className="mb-12 sticky top-20 z-30 shadow-2xl bg-slate-900 border-slate-700 backdrop-blur-md">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex items-center gap-2 font-black text-red-500 uppercase tracking-widest text-xs whitespace-nowrap">
                <Filter className="h-4 w-4" /> Filter Intelligence:
              </div>

              <select className="input-field shadow-inner" value={statusFilter.crimeType} onChange={(e) => handleFilterChange('crimeType', e.target.value)}>
                {getCrimeTypeOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>

              <select className="input-field shadow-inner" value={statusFilter.credibility} onChange={(e) => handleFilterChange('credibility', e.target.value)}>
                {getCredibilityOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>

              <select className="input-field shadow-inner" value={statusFilter.location} onChange={(e) => handleFilterChange('location', e.target.value)}>
                {getLocationOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>

              <div className="h-8 w-px bg-slate-800 hidden md:block"></div>

              <div className="flex items-center gap-2 font-black text-slate-400 uppercase tracking-widest text-xs whitespace-nowrap">
                Priority:
              </div>
              <select className="input-field w-auto shadow-inner" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date">Newest Incident</option>
                <option value="credibility">Target Confidence</option>
              </select>

              <Button variant="ghost" onClick={() => {
                setStatusFilter({ crimeType: 'All', credibility: 'All', location: 'All' });
                setSortBy('date');
              }} className="ml-auto text-xs font-black text-slate-500 hover:text-red-400 uppercase tracking-widest transition-colors">
                Reset Grid
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Articles List */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-3 uppercase italic">
              <AlertOctagon className="w-8 h-8 text-red-600" /> Active Archive Reports
              <span className="text-sm font-bold bg-slate-800 text-slate-400 px-3 py-1 rounded-full not-italic ml-2 border border-slate-700">
                {filteredNews.length} DISPATCHES
              </span>
            </h2>
          </div>

          {filteredNews.length === 0 ? (
            <Card className="p-20 text-center bg-slate-900/40 border-dashed border-2 border-slate-700 rounded-3xl">
              <ShieldCheck className="w-16 h-16 mx-auto mb-6 text-slate-800" />
              <p className="text-xl font-bold text-slate-500 uppercase tracking-widest">No Intelligence Matching Current Filter Protocol</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((article, idx) => (
                <Card key={idx} className="group hover:shadow-2xl hover:shadow-red-900/10 hover:-translate-y-2 transition-all duration-500 border-slate-800 flex flex-col overflow-hidden bg-slate-900/60 backdrop-blur-sm h-full cursor-pointer ring-1 ring-white/5"
                  onClick={() => setSelectedArticle(article)}>

                  {/* Status Indicator Bar */}
                  <div className={`h-2 w-full ${article.credibility === 'High' ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' :
                    article.credibility === 'Medium' ? 'bg-gradient-to-r from-amber-600 to-amber-400' :
                      'bg-gradient-to-r from-red-600 to-red-400'
                    }`}></div>

                  <CardContent className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em] ${article.credibility === 'High' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        article.credibility === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                        {article.credibility} CONFIDENCE
                      </span>
                      <span className="text-[10px] font-black text-slate-500 tracking-wider">
                        {new Date(article.published_at).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-white mb-4 group-hover:text-red-500 transition-colors line-clamp-2 leading-tight uppercase italic tracking-tight">
                      {article.title}
                    </h3>

                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{article.source}</span>
                      <div className="flex items-center text-red-500 text-[10px] font-black uppercase tracking-widest group-hover:gap-2 transition-all">
                        DEPLOY ANALYSIS <ChevronRight className="w-3 h-3 ml-1" />
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
                  {new Date(selectedArticle.published_at).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
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
            height: 2.75rem;
            border-radius: 0.5rem;
            border: 1px solid #334155;
            padding: 0 1rem;
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            background-color: #0f172a;
            color: #f8fafc;
            outline: 2px solid transparent;
            min-width: 160px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .input-field:hover {
            border-color: #ef4444;
            background-color: #1e293b;
        }
        .input-field:focus {
            outline: 2px solid #ef4444;
            border-color: transparent;
        }
        .input-field option {
            background-color: #0f172a;
            color: #f8fafc;
        }
      `}</style>
    </div>
  )
}

export default Results
