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

  // Initial load for News only (or base options)
  useEffect(() => {
    const loadInitialNews = async () => {
      try {
        setLoading(true)
        const newsData = await fetchNews({ limit: 200 })
        setAllNews(newsData || [])
      } catch (err) {
        console.error('Error loading initial news:', err)
      } finally {
        setLoading(false)
      }
    }
    loadInitialNews()
  }, [])

  // Reactive load for Dashboard Stats
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Prepare current filters
        const filters = {
          crime_type: statusFilter.crimeType !== 'All' ? statusFilter.crimeType : undefined,
          credibility: statusFilter.credibility !== 'All' ? statusFilter.credibility : undefined,
          location: statusFilter.location !== 'All' ? statusFilter.location : (region && region !== 'All' ? region : undefined)
        }

        const [statsData, locationsData, credibilityData] = await Promise.all([
          fetchStatistics(filters),
          fetchLocations(filters),
          fetchCredibilityDistribution(filters)
        ])

        setStatistics(statsData || { crime_types: [], credibility: [], total_articles: 0, articles_with_location: 0 })
        setLocations(locationsData || [])
        setCredibilityDist(credibilityData || [])
      } catch (err) {
        console.error('Error loading dashboard data:', err)
      }
    }

    loadDashboardData()
  }, [statusFilter, region])

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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <Navbar />

      <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 w-full max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all text-sm font-black uppercase tracking-widest text-slate-400 hover:text-white" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Command Center
            </Button>
            <div className="flex items-center gap-4 mb-3">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase italic">
                Dash<span className="text-amber-500">board</span>: {decodeURIComponent(region)}
              </h1>
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
              </span>
              <span className="text-blue-500 font-black text-xs tracking-[0.3em] uppercase animate-pulse">Live Link</span>
            </div>
            <p className="text-lg text-slate-400 font-medium">Situational intelligence and verified community metrics.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="lg" onClick={() => window.location.reload()} className="border-white/10 bg-white/5 font-black text-xs uppercase tracking-widest hover:bg-white/10">
              <RefreshCw className="mr-2 h-4 w-4" /> Re-Scan Matrix
            </Button>
            <Button variant="default" size="lg" onClick={() => navigate('/verify')} className="bg-amber-600 hover:bg-amber-700 text-slate-950 font-black text-xs uppercase tracking-widest">
              <ShieldCheck className="mr-2 h-4 w-4" /> Verify Protocol
            </Button>
          </div>
        </div>

        {/* Charts & KPI Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">

          {/* KPI Cards Column */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border border-blue-500/20 shadow-2xl bg-slate-900/50 backdrop-blur-md text-white overflow-hidden relative group">
              <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
              <CardHeader className="pb-1 pt-6 px-6 relative z-10">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Total Intel</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 relative z-10">
                <div className="text-4xl font-black group-hover:scale-105 transition-transform">{statistics.total_articles}</div>
                <p className="text-[10px] text-slate-500 mt-2 font-black uppercase tracking-widest">Aggregated Units</p>
              </CardContent>
            </Card>

            <Card className="border border-emerald-500/20 shadow-2xl bg-slate-900/50 backdrop-blur-md text-white overflow-hidden relative group">
              <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors"></div>
              <CardHeader className="pb-1 pt-6 px-6 relative z-10">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Trust Factor</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 relative z-10">
                <div className="text-4xl font-black group-hover:scale-105 transition-transform">
                  {statistics.credibility?.find(c => c.name === 'High')?.count || 0}
                </div>
                <p className="text-[10px] text-slate-500 mt-2 font-black uppercase tracking-widest">High Confidence Nodes</p>
              </CardContent>
            </Card>

            <Card className="border border-amber-500/20 shadow-2xl bg-slate-900/50 backdrop-blur-md text-white overflow-hidden relative group">
              <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors"></div>
              <CardHeader className="pb-1 pt-6 px-6 relative z-10">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Vector Nodes</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 relative z-10">
                <div className="text-4xl font-black group-hover:scale-105 transition-transform">{statistics.articles_with_location}</div>
                <p className="text-[10px] text-slate-500 mt-2 font-black uppercase tracking-widest">Active Geotrackers</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Columns */}
          <Card className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md border-white/5 shadow-2xl">
            <CardHeader className="pb-2 pt-6 px-6">
              <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Crime Distribution Matrix</CardTitle>
            </CardHeader>
            <CardContent className="h-[280px] px-4 pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statistics.crime_types} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', fontSize: '11px', color: '#fff' }}
                    itemStyle={{ color: '#fbbf24' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Reports" barSize={32}>
                    {statistics.crime_types.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1 bg-slate-900/40 backdrop-blur-md border-white/5 shadow-2xl">
            <CardHeader className="pb-2 pt-6 px-6">
              <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Credibility Variance</CardTitle>
            </CardHeader>
            <CardContent className="h-[280px] px-0 pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={credibilityDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    stroke="none"
                  >
                    {credibilityDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CREDIBILITY_COLORS[entry.name] || '#94a3b8'} fillOpacity={0.8} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', color: '#fff' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', tracking: '0.1em' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>


        {/* Advanced Filter & Sort */}
        <Card className="mb-12 sticky top-20 z-30 shadow-2xl bg-slate-900 border-white/10">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex items-center gap-2 font-black text-slate-400 text-xs uppercase tracking-widest whitespace-nowrap">
                <Filter className="h-4 w-4 text-amber-500" /> Matrix Filters:
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

              <div className="h-8 w-px bg-white/10 hidden md:block"></div>

              <div className="flex items-center gap-2 font-black text-slate-400 text-xs uppercase tracking-widest whitespace-nowrap">
                Sequence:
              </div>
              <select className="input-field w-auto" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date">Temporal Baseline</option>
                <option value="credibility">Confidence Priority</option>
              </select>

              <Button variant="ghost" onClick={() => {
                setStatusFilter({ crimeType: 'All', credibility: 'All', location: 'All' });
                setSortBy('date');
              }} className="ml-auto text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white">
                Purge Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Articles List */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">
              Intelligence Stream <span className="text-lg font-normal text-slate-500 ml-4 lowercase not-italic">// {filteredNews.length} verified packets</span>
            </h2>
          </div>

          {filteredNews.length === 0 ? (
            <Card className="p-20 text-center text-slate-500 bg-slate-900/30 border-dashed border-2 border-white/5">
              <ShieldCheck className="w-16 h-16 mx-auto mb-6 opacity-20" />
              <p className="font-black uppercase tracking-[0.2em]">No intelligence found matching search parameters.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((article, idx) => (
                <Card key={idx} className="group hover:shadow-[0_0_50px_rgba(37,99,235,0.1)] hover:-translate-y-2 transition-all duration-500 border-white/5 flex flex-col overflow-hidden bg-slate-900/50 backdrop-blur-sm h-full cursor-pointer"
                  onClick={() => setSelectedArticle(article)}>
                  {/* Trust Indicator Strip */}
                  <div className={`h-1.5 w-full ${article.credibility === 'High' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' :
                    article.credibility === 'Medium' ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' :
                      'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                    }`}></div>

                  <CardContent className="p-8 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${article.credibility === 'High' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        article.credibility === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                        {article.credibility} Truth
                      </span>
                      <span className="text-[10px] font-black text-slate-500 tracking-widest">
                        {new Date(article.published_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-white mb-6 group-hover:text-amber-500 transition-colors leading-tight line-clamp-3">
                      {article.title}
                    </h3>

                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{article.source}</span>
                      <div className="flex items-center text-blue-400 text-[10px] font-black uppercase tracking-widest">
                        Decrypt <ChevronRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={() => setSelectedArticle(null)}>
          <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)] w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-300"
            onClick={e => e.stopPropagation()}>

            <button className="absolute top-6 right-6 p-3 bg-white/5 rounded-full hover:bg-rose-500/20 hover:text-rose-500 transition-all z-10"
              onClick={() => setSelectedArticle(null)}>
              <X className="w-6 h-6 text-slate-400" />
            </button>

            <div className="p-10">
              <div className="flex items-center gap-4 mb-8">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${selectedArticle.credibility === 'High' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  selectedArticle.credibility === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                  {selectedArticle.credibility} Confidence Protocol
                </span>
                <span className="text-slate-500 text-xs font-black tracking-widest uppercase">
                  {new Date(selectedArticle.published_at).toLocaleString()}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-white mb-8 leading-tight italic">
                {selectedArticle.title}
              </h2>

              <div className="prose prose-invert max-w-none mb-10">
                <p className="text-xl text-slate-400 leading-relaxed font-medium">
                  {selectedArticle.description ? selectedArticle.description.replace(/<[^>]+>/g, '') : 'No detailed telemetry available for this report.'}
                </p>
              </div>

              <div className="bg-slate-950/50 p-8 rounded-2xl border border-white/5 mb-10 shadow-inner">
                <h4 className="text-xs font-black text-white mb-6 flex items-center gap-3 uppercase tracking-[0.3em]">
                  <Activity className="w-4 h-4 text-blue-500" /> Matrix Analysis
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <div className="flex flex-col">
                    <span className="text-slate-500 uppercase text-[10px] font-black tracking-widest mb-1">Source</span>
                    <span className="font-black text-white uppercase text-sm tracking-wider">{selectedArticle.source}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-500 uppercase text-[10px] font-black tracking-widest mb-1">Vector Type</span>
                    <span className="font-black text-amber-500 uppercase text-sm tracking-wider">{selectedArticle.crime_type || 'Unclassified'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-500 uppercase text-[10px] font-black tracking-widest mb-1">Sector</span>
                    <span className="font-black text-blue-400 uppercase text-sm tracking-wider">{selectedArticle.location || 'Dark Node'}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs border-0" asChild>
                  <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer">
                    Access Primary Source <ExternalLink className="w-4 h-4 ml-3" />
                  </a>
                </Button>
                <Button variant="outline" className="flex-1 h-14 border-white/10 bg-white/5 text-slate-400 font-black uppercase tracking-widest text-xs hover:bg-white/10 hover:text-white" onClick={() => navigate('/verify')}>
                  Cross-Reference Intel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style>{`
        .input-field {
            height: 3rem;
            border-radius: 0.75rem;
            border: 1px solid rgba(255,255,255,0.1);
            padding: 0 1.25rem;
            font-size: 0.75rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            background-color: rgba(255,255,255,0.02);
            color: white;
            outline: none;
            min-width: 160px;
            transition: all 0.2s;
            cursor: pointer;
        }
        .input-field:hover {
            border-color: rgba(255,255,255,0.2);
            background-color: rgba(255,255,255,0.05);
        }
        .input-field:focus {
            border-color: #2563eb;
            background-color: rgba(255,255,255,0.08);
            box-shadow: 0 0 15px rgba(37,99,235,0.2);
        }
        option {
            background-color: #0f172a;
            color: white;
            padding: 10px;
        }
      `}</style>
    </div>
  )
}

export default Results
