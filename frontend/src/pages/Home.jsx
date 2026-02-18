
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, BarChart3, ShieldCheck, MapPin, Bell, Activity, ArrowRight, Shield, ChevronRight, TrendingUp, Users } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import IndiaMap from '../components/IndiaMap' // New Component
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
    // Royal Theme: Slate-50 background, Slate-900 text, Blue/Gold accents
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="flex-grow pt-24">

        {/* HERO SECTION: MISSION CONTROL */}
        <section className="relative bg-slate-900 text-white overflow-hidden pb-32 pt-20">
          {/* Background Texture */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 opacity-90"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">

              {/* Hero Text */}
              <div className="lg:w-1/2 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold tracking-wider text-sm mb-8 uppercase animate-pulse">
                    <ShieldCheck className="w-4 h-4" /> Official Intelligence Portal
                  </div>

                  <h1 className="text-6xl lg:text-8xl font-black tracking-tight mb-6 leading-[1.1]">
                    SAFETY <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">RE-IMAGINED.</span>
                  </h1>

                  <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    India’s most advanced predictive crime analytics platform.
                    Providing real-time situational awareness for citizens and law enforcement.
                  </p>

                  <form onSubmit={handleSearch} className="flex max-w-lg mx-auto lg:mx-0 shadow-2xl shadow-blue-900/20 rounded-xl overflow-hidden">
                    <Input
                      className="bg-white text-slate-900 border-none h-16 text-lg px-6 rounded-none focus-visible:ring-0"
                      placeholder="Enter City or Zip Code..."
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    />
                    <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold h-16 px-8 rounded-none text-lg transition-colors">
                      ANALYZE
                    </Button>
                  </form>
                </motion.div>
              </div>

              {/* Interactive Map Integration (Center Stage) */}
              <div className="lg:w-1/2 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <IndiaMap />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS STRIP - "Gold" Branding */}
        <section className="bg-amber-500 py-8 relative z-20 -mt-10 mx-4 lg:mx-20 rounded-xl shadow-xl">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-around items-center gap-8 text-slate-900">
              <div className="text-center">
                <p className="text-4xl font-black">98.2%</p>
                <p className="font-bold text-xs uppercase tracking-widest opacity-80">Accuracy Rate</p>
              </div>
              <div className="h-12 w-px bg-slate-900/20 hidden md:block"></div>
              <div className="text-center">
                <p className="text-4xl font-black">24/7</p>
                <p className="font-bold text-xs uppercase tracking-widest opacity-80">Live Monitoring</p>
              </div>
              <div className="h-12 w-px bg-slate-900/20 hidden md:block"></div>
              <div className="text-center">
                <p className="text-4xl font-black">1.4M+</p>
                <p className="font-bold text-xs uppercase tracking-widest opacity-80">Data Points</p>
              </div>
              <div className="h-12 w-px bg-slate-900/20 hidden md:block"></div>
              <div className="text-center">
                <p className="text-4xl font-black">ZERO</p>
                <p className="font-bold text-xs uppercase tracking-widest opacity-80">Latency</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID - Professional Cards */}
        <section className="py-32 bg-slate-50">
          <div className="container mx-auto px-4">
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
          <div className="container mx-auto px-4">
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
            <h2 className="text-5xl font-black mb-8">READY TO JOIN?</h2>
            <p className="text-2xl text-slate-400 mb-12 max-w-2xl mx-auto">
              Be part of the solution. Report incidents and help us build a safer nation.
            </p>
            <Button size="lg" className="h-20 px-12 text-2xl font-bold bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-full transition-transform hover:scale-105" onClick={() => navigate('/report')}>
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
