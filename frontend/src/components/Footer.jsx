
import { ShieldAlert, Github, Twitter, Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-200 border-t border-slate-800 mt-auto pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <ShieldAlert className="h-8 w-8 text-blue-500" />
              <span className="font-bold text-2xl text-white">
                Crime<span className="text-blue-500">Watch</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed mb-6">
              India's leading crime intelligence platform. Empowering citizens with data, analytics, and real-time safety alerts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-slate-900 border border-slate-700 rounded-full hover:border-blue-500 hover:text-blue-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-slate-900 border border-slate-700 rounded-full hover:border-blue-500 hover:text-blue-500 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-slate-900 border border-slate-700 rounded-full hover:border-blue-500 hover:text-blue-500 transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white text-lg mb-6">Platform</h3>
            <ul className="space-y-4">
              <li><Link to="/results/All" className="hover:text-blue-400 transition-colors">Live Dashboard</Link></li>
              <li><Link to="/map" className="hover:text-blue-400 transition-colors">Safety Map</Link></li>
              <li><Link to="/report" className="hover:text-blue-400 transition-colors">Report Incident</Link></li>
              <li><Link to="/resources" className="hover:text-blue-400 transition-colors">Community Resources</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-white text-lg mb-6">Legal & Support</h3>
            <ul className="space-y-4">
              <li><Link to="/emergency" className="hover:text-blue-400 transition-colors">Emergency Contacts</Link></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a></li>
              <li><Link to="/admin" className="hover:text-blue-400 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-white text-lg mb-6">Stay Updated</h3>
            <p className="text-slate-400 mb-4">Get the latest crime alerts and safety tips directly to your inbox.</p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-slate-500">
          <p>© {new Date().getFullYear()} CrimeWatch Inc. All rights reserved. | Optimized for Indian States & Territories.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
