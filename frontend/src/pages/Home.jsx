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
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (region.trim()) {
      navigate(`/results/${encodeURIComponent(region.trim())}`)
    }
  }

  return (
    // Crime Dark Theme: Slate-950 background, Slate-50 text, Amber/Blue accents
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar />

      <main className="flex-grow">

        {/* HERO SECTION: IMMERSIVE MISSION CONTROL */}
        <section className="relative h-screen min-h-[600px] bg-slate-950 text-white overflow-hidden flex flex-col justify-center items-center pb-20">
          {/* Video Background */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-40 grayscale contrast-125"
            >
              <source src="/assets/hero_video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80"></div>
            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          </div>

          {/* CENTERED HERO CONTENT */}
          <div className="relative z-10 w-[90%] max-w-[900px] mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-[700px] mx-auto"
            >
              <p className="text-amber-500 font-black tracking-[0.3em] text-[10px] md:text-xs uppercase mb-4 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                Real-Time Situational Awareness
              </p>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-6 leading-tight text-white drop-shadow-2xl">
                Securing the future with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">uncompromising data.</span>
              </h1>

              <p className="text-sm text-slate-400 mb-8 leading-relaxed max-w-md mx-auto font-medium">
                Scanning 1,400+ distinct intelligence nodes. <br className="hidden md:block" /> Every report is an asset in the fight for public safety.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => document.getElementById('map-section').scrollIntoView({ behavior: 'smooth' })} size="lg" className="bg-amber-600 hover:bg-amber-700 text-slate-950 rounded-full h-12 px-8 text-sm font-black shadow-xl shadow-amber-600/20 transition-all hover:scale-105">
                  Access Intelligence Map <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button onClick={() => navigate('/report')} variant="outline" size="lg" className="rounded-full h-12 px-8 text-sm font-black bg-white/5 text-white border-white/20 hover:bg-white/10 backdrop-blur-md transition-all hover:scale-105">
                  File Incident Report
                </Button>
              </div>
            </motion.div>
          </div>

          {/* STATS STRIP - ANCHORED BOTTOM */}
          <div className="absolute bottom-0 left-0 w-full bg-slate-950/90 backdrop-blur-xl border-t border-white/5 py-6 z-20">
            <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { label: 'Active Incidents', value: '1,240', color: 'text-amber-500' },
                { label: 'High Priority', value: '12', color: 'text-rose-500' },
                { label: 'Network Safety', value: '98.2%', color: 'text-emerald-500' },
                { label: 'Live Nodes', value: '1,420', color: 'text-blue-500' },
              ].map((stat, i) => (
                <div key={i} className="group cursor-default">
                  <h3 className={`text-2xl md:text-3xl font-black ${stat.color} group-hover:scale-110 transition-transform`}>{stat.value}</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: LIVE MAP (Dark Themed) */}
        <section id="map-section" className="py-24 bg-slate-950 relative border-t border-white/5 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-950/20 to-slate-950 pointer-events-none"></div>

          <div className="w-[92%] max-w-[1200px] mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              <div className="lg:w-5/12">
                <div className="inline-block px-3 py-1 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <span className="text-blue-400 text-[10px] font-black tracking-[0.2em] uppercase">Intelligence Matrix</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                  Situational <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-500">Visualization</span>
                </h2>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">
                  Our live engine processes multi-source data to identify high-risk zones across the subcontinent. Color-coded by severity of verified reports.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {[
                    { label: "Critical Priority", color: "bg-rose-500", glow: "shadow-rose-500/40" },
                    { label: "Verified Threat", color: "bg-amber-500", glow: "shadow-amber-500/40" },
                    { label: "Data Pipeline", color: "bg-blue-500", glow: "shadow-blue-500/40" },
                    { label: "Secure Sector", color: "bg-emerald-500", glow: "shadow-emerald-500/40" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                      <div className={`w-3 h-3 rounded-full ${item.color} mr-4 shadow-[0_0_12px_rgba(0,0,0,0.5)] ${item.glow}`}></div>
                      <span className="text-slate-300 text-xs font-black uppercase tracking-wider">{item.label}</span>
                    </div>
                  ))}
                </div>

                <Button onClick={() => navigate('/results/All')} className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs h-12 px-8 rounded-full border-0 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                  Launch Surveillance Command <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

              <div className="lg:w-7/12 w-full">
                <div className="relative group rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-950/20">
                  <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay z-10 pointer-events-none"></div>
                  <div className="h-[300px] md:h-[450px] lg:h-[550px] w-full bg-slate-900/50 relative">
                    <IndiaMap />
                  </div>

                  {/* Map Overlay Stats */}
                  <div className="absolute top-6 right-6 z-20 bg-slate-950/90 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full flex items-center gap-3 shadow-2xl">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-black text-slate-300 tracking-[0.2em]">UPLINK ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LATEST INTELLIGENCE FEED */}
        <section className="py-24 bg-slate-900 relative border-y border-white/5">
          <div className="w-[95%] md:w-[85%] max-w-[1400px] mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="text-amber-500 w-5 h-5" />
                  <span className="text-amber-500 text-xs font-black tracking-[0.3em] uppercase">Intelligence Stream</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Verified Reports</h2>
                <div className="h-1.5 w-24 bg-gradient-to-r from-amber-500 to-transparent rounded-full"></div>
              </div>
              <Button onClick={() => navigate('/results/All')} variant="outline" className="border-white/10 text-white font-black hover:bg-white hover:text-slate-950 transition-all border-2">
                View Full Archive
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="block h-full group">
                    <Card className="h-full border border-white/5 bg-slate-950/50 hover:bg-slate-950 overflow-hidden transition-all duration-500 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/5">
                      <CardContent className="p-0 flex flex-col h-full">
                        {/* Image Section */}
                        <div className="relative h-56 overflow-hidden">
                          <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-transparent transition-colors z-10"></div>
                          <img
                            src={item.image_url || 'https://images.unsplash.com/photo-1557053503-0c217ca26674?q=80&w=2074&auto=format&fit=crop'}
                            alt="News"
                            className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-1000"
                            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop'}
                          />
                          <div className="absolute bottom-4 left-4 z-20">
                            <span className="bg-amber-600 text-slate-950 text-[10px] font-black px-3 py-1 uppercase tracking-widest shadow-2xl">
                              {item.crime_type || 'Update'}
                            </span>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex items-center gap-3 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <Calendar className="w-3 h-3 text-amber-500/50" />
                            {new Date(item.published_at).toLocaleDateString()}
                            <span className="text-white/10">•</span>
                            <span className="text-blue-400 truncate max-w-[120px]">{item.source || 'Intel Feed'}</span>
                          </div>

                          <h3 className="text-xl font-black text-white mb-3 leading-tight group-hover:text-amber-500 transition-colors line-clamp-2">
                            {item.title}
                          </h3>

                          {item.summary && (
                            <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-6 font-medium">
                              {item.summary}
                            </p>
                          )}

                          <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">DECRYPT REPORT</span>
                            <ExternalLink className="w-4 h-4 text-amber-500 group-hover:rotate-12 transition-transform" />
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

        {/* FEATURES GRID - Intelligence Capabilities */}
        <section className="py-32 bg-slate-950">
          <div className="w-[92%] max-w-[1500px] mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <h2 className="text-4xl font-black text-white mb-6">Matrix Capabilities</h2>
              <div className="h-1.5 w-20 bg-amber-500 mx-auto rounded-full mb-8"></div>
              <p className="text-lg text-slate-400 font-medium">
                Autonomous surveillance and high-fidelity intelligence for national security.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {/* Feature 1 */}
              <Card className="border border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 group cursor-default">
                <CardContent className="p-10">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 group-hover:bg-blue-500 transition-all duration-500">
                    <TrendingUp className="w-8 h-8 text-blue-400 group-hover:text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">Tactical Analytics</h3>
                  <p className="text-slate-400 mb-8 leading-relaxed font-medium">
                    Neural network forecasting identifies high-probability unrest vectors before escalation.
                  </p>
                  <Button variant="link" className="p-0 text-blue-400 font-black uppercase tracking-widest text-xs group-hover:gap-2 transition-all" onClick={() => navigate('/results/All')}>
                    Launch Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="border border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 group cursor-default">
                <CardContent className="p-10">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-8 border border-amber-500/20 group-hover:bg-amber-500 transition-all duration-500">
                    <Users className="w-8 h-8 text-amber-400 group-hover:text-slate-950" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">Signal Grid</h3>
                  <p className="text-slate-400 mb-8 leading-relaxed font-medium">
                    Multi-node crowdsourced intel pipeline with real-time verification and spoofing protection.
                  </p>
                  <Button variant="link" className="p-0 text-amber-500 font-black uppercase tracking-widest text-xs group-hover:gap-2 transition-all" onClick={() => navigate('/report')}>
                    Register Signal <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="border border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 group cursor-default">
                <CardContent className="p-10">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-white transition-all duration-500">
                    <Shield className="w-8 h-8 text-white group-hover:text-slate-950" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">Encrypted Core</h3>
                  <p className="text-slate-400 mb-8 leading-relaxed font-medium">
                    Air-gapped security protocols ensuring data integrity and informant anonymity at all times.
                  </p>
                  <Button variant="link" className="p-0 text-white font-black uppercase tracking-widest text-xs group-hover:gap-2 transition-all" onClick={() => navigate('/admin')}>
                    Admin Access <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-32 bg-slate-950 border-t border-white/10">
          <div className="container mx-auto px-6 md:px-12 max-w-[1200px]">
            <div className="flex flex-col md:flex-row items-center gap-20">
              <div className="md:w-1/2">
                <div className="flex items-center gap-2 mb-6">
                  <ShieldCheck className="text-emerald-500 w-5 h-5" />
                  <span className="text-emerald-500 text-xs font-black tracking-[0.3em] uppercase">Operations Protocol</span>
                </div>
                <h2 className="text-4xl font-black text-white mb-10 leading-tight">Architecture of <span className="text-amber-500">Defense</span></h2>
                <div className="space-y-12">
                  <div className="flex gap-8 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center font-black text-xl group-hover:bg-white group-hover:text-slate-950 transition-all">01</div>
                    <div>
                      <h4 className="text-xl font-black text-white mb-3 uppercase tracking-wider">Aggregation</h4>
                      <p className="text-slate-400 font-medium">Harvesting raw signals from municipal databases, open-source intelligence, and citizen reports.</p>
                    </div>
                  </div>
                  <div className="flex gap-8 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-black text-xl group-hover:bg-blue-500 group-hover:text-white transition-all">02</div>
                    <div>
                      <h4 className="text-xl font-black text-white mb-3 uppercase tracking-wider">Processing</h4>
                      <p className="text-slate-400 font-medium">Tier-1 AI analysis filters noise and quantifies credibility across all metadata parameters.</p>
                    </div>
                  </div>
                  <div className="flex gap-8 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-black text-xl group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">03</div>
                    <div>
                      <h4 className="text-xl font-black text-white mb-3 uppercase tracking-wider">Deployment</h4>
                      <p className="text-slate-400 font-medium">Real-time vector alerts delivered to critical nodes and registered safety personnel.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 relative group">
                <div className="absolute inset-0 bg-blue-500/20 rounded-3xl transform rotate-3 blur-2xl group-hover:rotate-6 transition-all duration-700"></div>
                <div className="relative rounded-3xl overflow-hidden border border-white/10 p-2 bg-white/5">
                  <img src="/analytics_feature.png" alt="Process" className="rounded-2xl shadow-2xl w-full grayscale contrast-125 opacity-80"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-32 bg-slate-950 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-5xl font-black mb-10 tracking-tight">ENLIST IN THE SIGNAL</h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium">
              Join the decentralized network of verified intelligence. <br />Every report counts in the architecture of national safety.
            </p>
            <Button size="lg" className="h-16 px-12 text-lg font-black bg-amber-600 hover:bg-amber-700 text-slate-950 rounded-full transition-all focus:ring-4 focus:ring-amber-500/50 hover:scale-110 shadow-2xl shadow-amber-600/30" onClick={() => navigate('/report')}>
              REGISTER SIGNAL DEPLOYMENT
            </Button>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}

export default Home
