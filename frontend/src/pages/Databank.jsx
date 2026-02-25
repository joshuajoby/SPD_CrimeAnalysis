import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Loader2, Filter, Database, Calendar, Shield, ExternalLink, X, MapPin, Search, ChevronRight
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchNews, fetchStatistics, fetchLocations } from '../utils/api'
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'

function Databank() {
    const navigate = useNavigate()
    const [allNews, setAllNews] = useState([])
    const [filteredNews, setFilteredNews] = useState([])
    const [statistics, setStatistics] = useState({ crime_types: [] })
    const [locations, setLocations] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedArticle, setSelectedArticle] = useState(null)

    // Advanced Filter state
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        crimeType: 'All',
        credibility: 'All',
        location: '',
        searchQuery: ''
    })

    // Load baseline statistics for dropdowns, then load news with filters
    useEffect(() => {
        const initData = async () => {
            setLoading(true)
            try {
                const [statsData, locationsData] = await Promise.all([
                    fetchStatistics(),
                    fetchLocations()
                ])
                setStatistics(statsData || { crime_types: [] })
                setLocations(locationsData || [])

                // Initial deep fetch (last 500 records)
                const newsData = await fetchNews({ limit: 500 })
                setAllNews(newsData || [])
            } catch (err) {
                console.error('Error loading databank baseline:', err)
            } finally {
                setLoading(false)
            }
        }
        initData()
    }, [])

    // Apply filters to display list and API queries if date changes
    const applyFilters = async () => {
        setLoading(true)
        try {
            // Build API query parameters
            const apiFilters = { limit: 1000 }
            if (filters.startDate) apiFilters.start_date = filters.startDate
            if (filters.endDate) apiFilters.end_date = filters.endDate
            if (filters.crimeType !== 'All') apiFilters.crime_type = filters.crimeType
            if (filters.credibility !== 'All') apiFilters.credibility = filters.credibility

            const newsData = await fetchNews(apiFilters)
            let processedList = newsData || []

            // Perform local filtering for exact search and location strings
            if (filters.location) {
                const searchLoc = filters.location.toLowerCase()
                processedList = processedList.filter(n => n.location?.toLowerCase().includes(searchLoc))
            }

            if (filters.searchQuery) {
                const q = filters.searchQuery.toLowerCase()
                processedList = processedList.filter(n =>
                    n.title?.toLowerCase().includes(q) ||
                    n.description?.toLowerCase().includes(q) ||
                    n.source?.toLowerCase().includes(q)
                )
            }

            setAllNews(processedList)
            setFilteredNews(processedList)
        } catch (e) {
            console.error("Filter error:", e)
        } finally {
            setLoading(false)
        }
    }

    // Trigger search when "Apply" is clicked
    const handleSearch = (e) => {
        e.preventDefault()
        applyFilters()
    }

    // Helper arrays for UI
    const getCrimeTypeOptions = () => ['All', ...statistics.crime_types.map(ct => ct.name).filter(Boolean)]
    const getCredibilityOptions = () => ['All', 'High', 'Medium', 'Low']

    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafc]">
            <Navbar />

            <main className="flex-grow pt-28 px-4 sm:px-6 lg:px-8 w-full max-w-[1500px] mx-auto pb-20">

                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-slate-900 rounded-xl text-white shadow-xl">
                            <Database className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">National Crime Databank</h1>
                            <p className="text-lg text-slate-500 mt-1">Comprehensive historical repository of verified crime intelligence across India.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar / Topbar Filters */}
                    <div className="lg:col-span-3">
                        <Card className="sticky top-24 border-slate-200 shadow-xl shadow-slate-200/50 bg-white">
                            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Filter className="w-5 h-5 text-blue-600" /> Advanced Search
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5">
                                <form onSubmit={handleSearch} className="space-y-5">

                                    {/* Text Search */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Keyword Search</label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                            <Input
                                                placeholder="Search headlines..."
                                                className="pl-9 bg-slate-50"
                                                value={filters.searchQuery}
                                                onChange={e => setFilters({ ...filters, searchQuery: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="h-px bg-slate-100 w-full" />

                                    {/* Date Range */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" /> Date Range
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <span className="text-[10px] text-slate-400 font-semibold uppercase">From</span>
                                                <Input
                                                    type="date"
                                                    className="text-xs bg-slate-50"
                                                    value={filters.startDate}
                                                    onChange={e => setFilters({ ...filters, startDate: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] text-slate-400 font-semibold uppercase">To</span>
                                                <Input
                                                    type="date"
                                                    className="text-xs bg-slate-50"
                                                    value={filters.endDate}
                                                    onChange={e => setFilters({ ...filters, endDate: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-slate-100 w-full" />

                                    {/* Dropdowns */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5" /> Location / State
                                        </label>
                                        <Input
                                            placeholder="e.g. Maharashtra, Delhi..."
                                            className="bg-slate-50"
                                            value={filters.location}
                                            onChange={e => setFilters({ ...filters, location: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1.5 mt-4">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Crime Type</label>
                                        <select
                                            className="w-full h-10 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            value={filters.crimeType}
                                            onChange={e => setFilters({ ...filters, crimeType: e.target.value })}
                                        >
                                            {getCrimeTypeOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5 mt-4">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Trust Score</label>
                                        <select
                                            className="w-full h-10 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                            value={filters.credibility}
                                            onChange={e => setFilters({ ...filters, credibility: e.target.value })}
                                        >
                                            {getCredibilityOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>

                                    <Button type="submit" className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold h-11" disabled={loading}>
                                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Apply Filters"}
                                    </Button>

                                    <Button type="button" variant="ghost" className="w-full text-xs text-slate-500 hover:text-slate-800"
                                        onClick={() => {
                                            setFilters({ startDate: '', endDate: '', crimeType: 'All', credibility: 'All', location: '', searchQuery: '' })
                                            setTimeout(() => applyFilters(), 100)
                                        }}
                                    >
                                        Clear All
                                    </Button>

                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Results Area */}
                    <div className="lg:col-span-9">

                        <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-4">
                            <h3 className="text-xl font-bold text-slate-800">
                                Found Results <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-sm ml-2">{filteredNews.length}</span>
                            </h3>
                        </div>

                        {loading ? (
                            <div className="h-64 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-slate-200">
                                <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                                <p className="text-slate-500 font-medium animate-pulse">Querying massive databank...</p>
                            </div>
                        ) : filteredNews.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
                                <Database className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                                <h3 className="text-xl font-bold text-slate-700 mb-2">No Records Found</h3>
                                <p className="text-slate-500">Try adjusting your dates or expanding your search filters.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {filteredNews.map((article, idx) => (
                                    <Card key={idx} className="group hover:-translate-y-1 hover:shadow-xl transition-all duration-200 border-slate-200 flex flex-col overflow-hidden bg-white cursor-pointer"
                                        onClick={() => setSelectedArticle(article)}>

                                        <div className={`h-1 w-full ${article.credibility === 'High' ? 'bg-emerald-500' :
                                            article.credibility === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'
                                            }`}></div>

                                        <CardContent className="p-5 flex flex-col flex-grow">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${article.credibility === 'High' ? 'bg-emerald-50 text-emerald-700' :
                                                    article.credibility === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                                                    }`}>
                                                    {article.credibility} Score
                                                </span>
                                                <div className="text-right">
                                                    <div className="text-[11px] font-bold text-slate-500">
                                                        {new Date(article.published_at).toLocaleDateString('en-IN', {
                                                            day: '2-digit', month: 'short', year: 'numeric'
                                                        })}
                                                    </div>
                                                    <div className="text-[9px] text-slate-400">
                                                        {new Date(article.published_at).toLocaleTimeString('en-IN', {
                                                            hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-3 leading-snug">
                                                {article.title}
                                            </h3>

                                            <div className="flex items-center gap-1 mb-4">
                                                <MapPin className="w-3 h-3 text-slate-400" />
                                                <span className="text-[11px] font-semibold text-slate-500 capitalize truncate">{article.location || 'Unknown'}</span>
                                            </div>

                                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase truncate max-w-[120px]">{article.source}</span>
                                                <div className="flex items-center text-blue-600 text-xs font-bold group-hover:translate-x-1 transition-transform">
                                                    View Case <ChevronRight className="w-3 h-3 ml-0.5" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Article Detail Modal (Reused styling from Results) */}
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
                                    selectedArticle.credibility === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>
                                    {selectedArticle.credibility} Confidence Score
                                </span>
                                <span className="text-slate-500 text-sm font-medium">
                                    {new Date(selectedArticle.published_at).toLocaleString('en-IN', {
                                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
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
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}

export default Databank
