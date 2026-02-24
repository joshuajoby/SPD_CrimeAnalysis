import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, BarChart3, ShieldCheck, MapPin, Bell, Activity, ArrowRight, Shield, ChevronRight, TrendingUp, Users, ExternalLink, Calendar } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import IndiaMap from '../components/IndiaMap' // New Component
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent } from '../components/ui/card'


function Home() {
  const [region, setRegion] = useState('')
  const navigate = useNavigate()

  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNewsData = () => {
      fetch('/api/news?limit=6')
        .then(res => res.json())
        .then(data => {
          setNews(data)
          setLoading(false)
        })
        .catch(err => {
          console.error("Failed to fetch news", err)
          setLoading(false)
        })
    };

    fetchNewsData(); // Initial load
    const intervalId = setInterval(fetchNewsData, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId); // Cleanup
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (region.trim()) {
      navigate(`/results/${encodeURIComponent(region.trim())}`)
    }
  }

  return (
    // Royal Theme: Slate-50 background, Slate-900 text, Blue/Gold accents
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="flex-grow">

        {/* HERO SECTION: IMMERSIVE MISSION CONTROL */}
        <section className="relative h-screen min-h-[600px] bg-slate-900 text-white overflow-hidden flex flex-col justify-center items-center pb-20">
          {/* Video Background */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-50"
            >
              <source src="/assets/hero_video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/60"></div>
          </div>

          {/* CENTERED HERO CONTENT */}
          <div className="relative z-10 w-[90%] max-w-[900px] mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-[700px] mx-auto"
            >
              <p className="text-amber-400 font-bold tracking-[0.2em] text-xs md:text-sm uppercase mb-4 drop-shadow-md">
                Real-Time Global Surveillance
              </p>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-tight text-white drop-shadow-2xl">
                A growing footprint <br />
                of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">trust.</span>
              </h1>

              <p className="text-base md:text-xl text-slate-200 mb-10 leading-relaxed max-w-2xl mx-auto font-medium drop-shadow-lg">
                Monitoring activity across 1,400+ distinct nodes. <br className="hidden md:block" /> Each data point represents a commitment to public safety.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => document.getElementById('map-section').scrollIntoView({ behavior: 'smooth' })} size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-full h-14 px-8 text-sm md:text-base font-bold shadow-xl shadow-amber-500/20 transition-all hover:scale-105 hover:shadow-amber-500/40">
                  Explore Intelligence Map <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button onClick={() => navigate('/report')} variant="outline" size="lg" className="rounded-full h-14 px-8 text-sm md:text-base font-bold bg-white/10 text-white border border-white/30 hover:bg-white hover:text-slate-900 backdrop-blur-sm transition-all hover:scale-105 shadow-xl">
                  Report Incident
                </Button>
              </div>
            </motion.div>
          </div>

          {/* STATS STRIP - ANCHORED BOTTOM */}
          <div className="absolute bottom-0 left-0 w-full bg-slate-900/80 backdrop-blur-md border-t border-white/10 py-4 z-20">
            <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { label: 'Incidents Today', value: '1,240', color: 'text-amber-400' },
                { label: 'Active Unrest', value: '12', color: 'text-red-400' },
                { label: 'Safety Index', value: '98.2%', color: 'text-emerald-400' },
                { label: 'Nodes Online', value: '1,420', color: 'text-blue-400' },
              ].map((stat, i) => (
                <div key={i}>
                  <h3 className={`text-xl md:text-2xl font-black ${stat.color}`}>{stat.value}</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: LIVE MAP (Dark Themed) */}
        <section id="map-section" className="py-16 bg-slate-900 relative border-t border-slate-800 overflow-hidden">
          {/* Ambient Background Gradient */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/10 to-slate-900 pointer-events-none"></div>

          <div className="w-[92%] max-w-[1200px] mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <div className="lg:w-5/12">
                <div className="inline-block px-3 py-1 mb-4 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <span className="text-blue-400 text-xs font-bold tracking-wider uppercase">Live Intelligence Grid</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                  Real-Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Threat Visualization</span>
                </h2>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Our interactive engine tracks verified incidents across 1,400+ nodes. Zones are color-coded by real-time risk assessment.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {[
                    { label: "High Priority", color: "bg-red-500", shadow: "shadow-red-500/50" },
                    { label: "Verified Incident", color: "bg-amber-500", shadow: "shadow-amber-500/50" },
                    { label: "Community Report", color: "bg-blue-500", shadow: "shadow-blue-500/50" },
                    { label: "Safe Zone", color: "bg-emerald-500", shadow: "shadow-emerald-500/50" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.color} mr-3 shadow-lg ${item.shadow}`}></div>
                      <span className="text-slate-300 text-xs font-bold">{item.label}</span>
                    </div>
                  ))}
                </div>

                <Button onClick={() => navigate('/results/All')} variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 transition-all text-sm h-10 px-6">
                  Open Command Dashboard <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

              <div className="lg:w-7/12 w-full">
                <div className="relative group rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-blue-900/10">
                  <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay z-10 pointer-events-none"></div>
                  <div className="h-[300px] md:h-[400px] lg:h-[500px] w-full bg-slate-800 relative">
                    <IndiaMap />
                  </div>

                  {/* Map Overlay Stats */}
                  <div className="absolute top-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-300">SYSTEM ONLINE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LATEST INTELLIGENCE FEED - RESTORED & INLINED */}
        <section className="py-16 md:py-24 bg-slate-50 relative border-b border-slate-200">
          <div className="w-[95%] md:w-[85%] max-w-[1400px] mx-auto px-4 md:px-6">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Latest Intelligence</h2>
                <div className="h-2 w-24 bg-amber-500 rounded-full"></div>
                <p className="mt-4 text-lg text-slate-600 font-medium max-w-2xl">
                  Real-time reports from across the network.
                </p>
              </div>
              <Button variant="outline" className="hidden md:flex border-2 border-slate-900 text-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-colors">
                View All Archives
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {news.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="block h-full group">
                    <Card className="h-full border-0 shadow-md bg-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <CardContent className="p-0 flex flex-col h-full">
                        {/* Image Section */}
                        <div className="relative h-48 overflow-hidden">
                          <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                          <img
                            src={item.image_url || 'https://images.unsplash.com/photo-1557053503-0c217ca26674?q=80&w=2074&auto=format&fit=crop'}
                            alt="News"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop'}
                          />
                          <div className="absolute bottom-3 left-3 z-20">
                            <span className="bg-amber-500 text-slate-900 text-[10px] font-black px-2 py-0.5 uppercase tracking-widest shadow-sm">
                              {item.crime_type || 'Update'}
                            </span>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-5 flex flex-col flex-grow">
                          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.published_at).toLocaleDateString()}
                            <span className="text-slate-300">•</span>
                            <span className="text-blue-600 truncate max-w-[100px]">{item.source || 'Intel Feed'}</span>
                          </div>

                          <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                            {item.title}
                          </h3>

                          {item.summary && (
                            <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">
                              {item.summary}
                            </p>
                          )}

                          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center text-xs font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                            READ REPORT <ExternalLink className="w-3 h-3 ml-1" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES GRID - Professional Cards */}
        <section className="py-32 bg-slate-50">
          <div className="w-[92%] max-w-[1500px] mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Intelligence Capabilities</h2>
              <div className="h-1 w-20 bg-amber-500 mx-auto rounded-full mb-6"></div>
              <p className="text-xl text-slate-600">
                Leveraging AI and community reporting to build a safer tomorrow.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <Card className="border-0 shadow-lg bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden">
                <div className="h-2 bg-blue-500 w-0 group-hover:w-full transition-all duration-500"></div>
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                    <TrendingUp className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Predictive Analytics</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Our AI models forecast crime trends with unprecedented accuracy, allowing for proactive safety measures.
                  </p>
                  <Button variant="link" className="p-0 text-blue-600 font-bold group-hover:gap-2 transition-all" onClick={() => navigate('/results/All')}>
                    View Dashboard <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="border-0 shadow-lg bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden">
                <div className="h-2 bg-amber-500 w-0 group-hover:w-full transition-all duration-500"></div>
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors">
                    <Users className="w-8 h-8 text-amber-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Community Grid</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    A decentralized network of verified citizen reporters ensures that no incident goes unnoticed.
                  </p>
                  <Button variant="link" className="p-0 text-amber-600 font-bold group-hover:gap-2 transition-all" onClick={() => navigate('/report')}>
                    Join Network <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="border-0 shadow-lg bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden">
                <div className="h-2 bg-slate-900 w-0 group-hover:w-full transition-all duration-500"></div>
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-900 transition-colors">
                    <Shield className="w-8 h-8 text-slate-900 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Secure Infrastructure</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Enterprise-grade encryption and privacy protocols ensure that your identity remains protected.
                  </p>
                  <Button variant="link" className="p-0 text-slate-900 font-bold group-hover:gap-2 transition-all" onClick={() => navigate('/admin')}>
                    Admin Portal <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION (From Previous Plan, now styled nicer) */}
        <section className="py-24 bg-white border-t border-slate-100">
          <div className="container mx-auto px-6 md:px-12 max-w-[1200px]">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="md:w-1/2">
                <h2 className="text-4xl font-bold text-slate-900 mb-6">How It Works</h2>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl">1</div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Data Aggregation</h4>
                      <p className="text-slate-600">We collect data from official police records, verified news feeds, and citizen reports in real-time.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">2</div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">AI Processing</h4>
                      <p className="text-slate-600">Our neural networks analyze patterns, verify credibility, and identify high-risk zones.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xl">3</div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Actionable Alerts</h4>
                      <p className="text-slate-600">You receive instant, location-based safety notifications to keep you and your family safe.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-3xl transform rotate-3 opacity-20"></div>
                <img src="/analytics_feature.png" alt="Process" className="relative rounded-3xl shadow-2xl w-full"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 bg-slate-900 text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-black mb-6">READY TO JOIN?</h2>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              Be part of the solution. Report incidents and help us build a safer nation.
            </p>
            <Button size="lg" className="h-14 px-8 text-lg font-bold bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-full transition-transform hover:scale-105" onClick={() => navigate('/report')}>
              Start Reporting Now
            </Button>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}

export default Home
