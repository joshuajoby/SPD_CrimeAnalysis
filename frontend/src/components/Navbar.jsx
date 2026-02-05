import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <span className="text-3xl">🚨</span>
            <div>
              <span className="text-2xl font-bold text-white">CrimeWatch</span>
              <p className="text-xs text-blue-200">Crime Intelligence Platform</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-1">
            <Link
              to="/"
              className="px-4 py-2 text-white hover:bg-white hover:text-blue-900 rounded-lg transition-colors font-medium"
            >
              Home
            </Link>
            <a
              href="#features"
              className="px-4 py-2 text-white hover:bg-white hover:text-blue-900 rounded-lg transition-colors font-medium"
            >
              Features
            </a>
            <a
              href="#about"
              className="px-4 py-2 text-white hover:bg-white hover:text-blue-900 rounded-lg transition-colors font-medium"
            >
              About
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
