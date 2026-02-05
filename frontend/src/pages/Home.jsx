import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Home() {
  const [region, setRegion] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (region.trim()) {
      navigate(`/results/${encodeURIComponent(region.trim())}`)
    }
  }

  const features = [
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Real-time crime statistics, trends, and comprehensive data visualization with interactive charts'
    },
    {
      icon: '🔍',
      title: 'Smart Filtering',
      description: 'Filter news by crime type, location, and credibility to find exactly what matters to you'
    },
    {
      icon: '✅',
      title: 'Credibility Analysis',
      description: 'AI-powered credibility assessment to help you identify reliable news sources and avoid misinformation'
    },
    {
      icon: '📍',
      title: 'Location Intelligence',
      description: 'Analyze crime patterns specific to your region with detailed location-based breakdowns'
    },
    {
      icon: '🚨',
      title: 'Real-Time Updates',
      description: 'Stay informed with latest crime news from trusted sources across India'
    },
    {
      icon: '🛡️',
      title: 'Safety Insights',
      description: 'Make informed decisions based on crime patterns and safety analysis'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 bg-blue-500 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              CrimeWatch Intelligence
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
              Advanced crime analysis and news monitoring platform for informed decision-making
            </p>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="Enter region or state (e.g., Delhi, Mumbai, Karnataka)"
                  className="flex-1 px-6 py-4 text-lg text-gray-900 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-lg"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Analyze
                </button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-lg">
                <p className="text-3xl font-bold">100+</p>
                <p className="text-blue-100">Crime Articles</p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-lg">
                <p className="text-3xl font-bold">15+</p>
                <p className="text-blue-100">Locations Tracked</p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-lg">
                <p className="text-3xl font-bold">5</p>
                <p className="text-blue-100">Crime Categories</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 py-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
            Powerful Features
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto">
            Everything you need to understand crime patterns and make informed safety decisions
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105 border-l-4 border-blue-600"
              >
                <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">How It Works</h2>
            
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { num: '1', title: 'Search Region', desc: 'Enter your area of interest' },
                { num: '2', title: 'View Analytics', desc: 'Explore crime statistics' },
                { num: '3', title: 'Filter Data', desc: 'Refine by type & credibility' },
                { num: '4', title: 'Take Action', desc: 'Make informed decisions' }
              ].map((step, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-300">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Explore Crime Analytics?</h2>
            <p className="text-lg text-blue-100 mb-8">
              Start analyzing crime patterns in your region today. Get insights that matter.
            </p>
            <button
              onClick={() => {
                const searchInput = document.querySelector('input[placeholder*="Enter region"]')
                if (searchInput) searchInput.focus()
              }}
              className="inline-block bg-white text-blue-700 font-bold px-12 py-4 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Get Started Now
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
