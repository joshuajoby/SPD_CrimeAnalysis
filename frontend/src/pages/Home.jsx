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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        <div className="relative bg-gradient-to-br from-primary to-primary-light text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                CrimeWatch
              </h1>
              <p className="text-xl md:text-2xl text-gray-100">
                Structured Crime News & Safety Insights
              </p>
            </div>

            <div className="mt-12">
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="Enter region or state (e.g., Delhi, Mumbai, Karnataka)"
                    className="flex-1 px-6 py-4 text-lg text-gray-900 rounded-lg focus:outline-none focus:ring-4 focus:ring-accent shadow-lg"
                  />
                  <button
                    type="submit"
                    className="bg-accent hover:bg-accent-light text-white font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-accent text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Crime Analytics
              </h3>
              <p className="text-gray-600">
                View comprehensive crime statistics and trends across different regions
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-accent text-3xl mb-4">📰</div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Latest News
              </h3>
              <p className="text-gray-600">
                Stay updated with real-time crime news from trusted sources
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-accent text-3xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Safety Insights
              </h3>
              <p className="text-gray-600">
                Get informed about crime patterns to make better safety decisions
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Home
