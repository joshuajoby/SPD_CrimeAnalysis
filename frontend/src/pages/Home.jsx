
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, BarChart3, ShieldCheck, MapPin, Bell, Activity, ArrowRight, Shield, Users, FileText } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-grow pt-28">
        {/* Hero Section */}
        <section className="bg-slate-50 py-20 lg:py-32 border-b border-slate-200">
          <div className="container mx-auto px-4 text-center max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-base font-semibold text-blue-800 mb-8">
                <span className="flex h-3 w-3 rounded-full bg-blue-600 mr-3 animate-pulse"></span>
                Official Crime Intelligence Portal
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-900">
                Data-Driven Safety <br />
                <span className="text-blue-600">For Your Community</span>
              </h1>

              <p className="text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Access real-time crime reports, predictive safety analytics, and verified intelligence to keep your neighborhood secure.
              </p>

              {/* Search Box */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16 relative">
                <div className="flex gap-4 p-2 bg-white rounded-xl shadow-xl border border-slate-200">
                  <Input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="Search city, state, or zip code..."
                    className="flex-grow h-16 text-xl border-0 bg-transparent focus-visible:ring-0 shadow-none px-6 text-slate-900 placeholder:text-slate-400"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="h-16 px-10 text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-lg"
                  >
                    Analyze
                  </Button>
                </div>
              </form>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-blue-900">24/7</p>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Monitoring</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-blue-900">98%</p>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Accuracy</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-blue-900">50K+</p>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Reports Analyzed</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-blue-900">100+</p>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Cities Covered</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Core Services Grid */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Intelligence Services</h2>
              <p className="text-xl text-slate-600">Comprehensive tools for citizens and law enforcement.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Card 1 */}
              <Card className="border-slate-200 shadow-md hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-900">Crime Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Detailed statistical breakdown of crime types, trends over time, and severity heatmaps for any region in India.
                  </p>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card className="border-slate-200 shadow-md hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                    <ShieldCheck className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-900">Safety Scores</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    AI-generated safety ratings for neighborhoods, helping you make informed decisions about property and travel.
                  </p>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card className="border-slate-200 shadow-md hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-14 h-14 bg-red-50 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-red-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-900">Incident Reporting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Secure, anonymous reporting channel for citizens to submit evidence and crime tips directly to authorities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-24 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <Shield className="w-16 h-16 text-blue-400 mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Our Mission</h2>
            <p className="text-2xl text-slate-300 leading-relaxed mb-12">
              "To create a transparent, safer society by bridging the gap between citizens and law enforcement through advanced data intelligence and real-time collaboration."
            </p>
            <Button variant="outline" size="lg" className="h-16 px-12 text-xl border-2 border-white text-white hover:bg-white hover:text-slate-900 transition-colors" onClick={() => navigate('/resources')}>
              View Safety Resources
            </Button>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}

export default Home
