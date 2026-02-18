
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, BarChart3, ShieldCheck, MapPin, Bell, Activity, ArrowRight, Shield, Users, FileText, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent } from '../components/ui/card'

function Home() {
  const [region, setRegion] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (region.trim()) {
      navigate(`/results/${encodeURIComponent(region.trim())}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      <Navbar />

      <main className="flex-grow pt-28">

        {/* HERO SECTION: MASSIVE IMPACT */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
          {/* Background Gradient/Image Fallback */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black opacity-80 z-0"></div>
          <div className="absolute inset-0 bg-[url('/hero_background.png')] bg-cover bg-center opacity-40 mix-blend-overlay z-0"></div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-block mb-6 px-6 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md">
                <span className="text-blue-400 font-mono tracking-widest uppercase font-bold animate-pulse">● Live Intelligence System Online</span>
              </div>

              <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                SECURING <br />
                THE FUTURE.
              </h1>

              <p className="text-2xl md:text-3xl text-slate-300 max-w-4xl mx-auto mb-12 font-light leading-relaxed">
                The world's most advanced <span className="text-blue-400 font-semibold">predictive crime analytics</span> platform.
                Empowering citizens with real-time data.
              </p>

              <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative flex p-2 bg-white rounded-xl">
                  <Input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="Start Intelligence Scan (Enter City)..."
                    className="h-20 text-2xl border-0 bg-transparent text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 px-6 rounded-l-xl"
                  />
                  <Button type="submit" className="h-20 px-12 text-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-transform active:scale-95">
                    SCAN
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Scrolling Ticker at Bottom of Hero */}
          <div className="absolute bottom-0 left-0 right-0 bg-blue-600/20 backdrop-blur border-t border-blue-500/30 py-4 overflow-hidden">
            <div className="whitespace-nowrap animate-marquee flex gap-12 text-blue-200 font-mono text-lg font-bold uppercase tracking-widest">
              <span>⚡ System Status: Nominal</span>
              <span>⚡ Active Agents: 1,402</span>
              <span>⚡ New Reports: +14%</span>
              <span>⚡ Global Alert Level: Low</span>
              <span>⚡ Data Sources: Verified</span>
              <span>⚡ System Status: Nominal</span>
              <span>⚡ Active Agents: 1,402</span>
            </div>
          </div>
        </section>

        {/* FEATURE 1: ZIG (Text Left, Image Right) */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="md:w-1/2">
                <div className="mb-6 p-4 bg-blue-50 w-fit rounded-2xl">
                  <BarChart3 className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-6xl font-black text-slate-900 mb-6 leading-none">
                  DATA THAT <br /> <span className="text-blue-600">SPEAKS.</span>
                </h2>
                <p className="text-2xl text-slate-600 leading-relaxed mb-8">
                  Raw data is useless. We turn chaos into clarity. Our advanced visualization engine processes millions of data points to give you actionable insights instantly.
                </p>
                <Button
                  variant="outline"
                  className="text-xl h-14 px-8 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all"
                  onClick={() => navigate('/results/All')}
                >
                  Explore Analytics <ChevronRight className="ml-2" />
                </Button>
              </div>
              <div className="md:w-1/2 relative">
                <div className="absolute inset-0 bg-blue-600 rounded-3xl transform rotate-3 opacity-10"></div>
                <img
                  src="/analytics_feature.png"
                  alt="Analytics Dashboard"
                  className="relative rounded-3xl shadow-2xl border border-slate-200 w-full object-cover h-[500px]"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop' }} // Fallback
                />
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE 2: ZAG (Image Left, Text Right) */}
        <section className="py-32 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row-reverse items-center gap-16">
              <div className="md:w-1/2">
                <div className="mb-6 p-4 bg-purple-50 w-fit rounded-2xl">
                  <ShieldCheck className="w-12 h-12 text-purple-600" />
                </div>
                <h2 className="text-6xl font-black text-slate-900 mb-6 leading-none">
                  UNCOMPROMISED <br /> <span className="text-purple-600">SAFETY.</span>
                </h2>
                <p className="text-2xl text-slate-600 leading-relaxed mb-8">
                  Safety isn't a privilege, it's a right. Our predictive algorithms identify high-risk zones before incidents occur, keeping you and your loved ones one step ahead.
                </p>
                <Button
                  variant="outline"
                  className="text-xl h-14 px-8 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all"
                  onClick={() => navigate('/map')}
                >
                  Check Safety Score <ChevronRight className="ml-2" />
                </Button>
              </div>
              <div className="md:w-1/2 relative">
                <div className="absolute inset-0 bg-purple-600 rounded-3xl transform -rotate-3 opacity-10"></div>
                <img
                  src="/community_safety.png"
                  alt="Community Safety"
                  className="relative rounded-3xl shadow-2xl border border-slate-200 w-full object-cover h-[500px]"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop' }} // Fallback
                />
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS (Realism/Education) */}
        <section className="py-20 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">How CrimeWatch Works</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                We combine official data with community reports to create a verified safety network.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {/* Step 1 */}
              <div className="text-center relative">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                  <Activity className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">1. Data Aggregation</h3>
                <p className="text-slate-600 leading-relaxed">
                  Our system continuously scans official police records, verified news outlets, and trusted NGO reports.
                </p>
                <div className="hidden md:block absolute top-10 left-[60%] w-full h-1 border-t-2 border-dashed border-slate-300 -z-0"></div>
              </div>

              {/* Step 2 */}
              <div className="text-center relative">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                  <ShieldCheck className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">2. AI Verification</h3>
                <p className="text-slate-600 leading-relaxed">
                  Advanced algorithms cross-reference incidents to filter out misinformation and assign credibility scores.
                </p>
                <div className="hidden md:block absolute top-10 left-[60%] w-full h-1 border-t-2 border-dashed border-slate-300 -z-0"></div>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                  <Bell className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">3. Real-Time Alerts</h3>
                <p className="text-slate-600 leading-relaxed">
                  Citizens receive instant notifications about high-risk events in their vicinity to take precautionary action.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LATEST ALERTS GRID */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-2">Latest Community Alerts</h2>
                <p className="text-xl text-slate-500">Real-time updates from your local network.</p>
              </div>
              <Button variant="link" className="text-blue-600 font-bold text-lg hidden md:flex">View All Alerts <ArrowRight className="ml-2 w-5 h-5" /></Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-slate-100 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group">
                  <div className="h-48 bg-slate-200 relative overflow-hidden">
                    <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase rounded-full animate-pulse">Critical</span>
                    {/* Abstract Image Placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400 group-hover:scale-110 transition-transform duration-700"></div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                      <MapPin className="w-4 h-4" /> <span>Sector {i + 4}, Cyber City</span>
                      <span className="mx-2">•</span>
                      <span>2 hrs ago</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Suspicious Activity Reported Near Metro Station</h3>
                    <p className="text-slate-600 mb-4 line-clamp-2">
                      Local authorities have been notified of unusual large gathering. Citizens are advised to maintain distance and report any...
                    </p>
                    <div className="flex items-center text-blue-600 font-semibold cursor-pointer">
                      Read Full Report <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* SAFETY SCORE "SHOCK" SECTION */}
        <section className="py-40 bg-slate-900 text-white relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="relative z-10 container mx-auto px-4">
            <Shield className="w-32 h-32 text-green-500 mx-auto mb-8 animate-bounce" />
            <h2 className="text-8xl font-black mb-8">98% SAFE</h2>
            <p className="text-3xl text-slate-300 max-w-3xl mx-auto mb-16">
              Join the fastest growing safety network. <br />
              <span className="text-green-500">Your community needs you.</span>
            </p>
            <Button
              size="lg"
              className="h-24 px-16 text-3xl font-bold bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-[0_0_50px_rgba(22,163,74,0.5)] transition-all hover:scale-105"
              onClick={() => navigate('/report')}
            >
              REPORT INCIDENT NOW
            </Button>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}

export default Home
