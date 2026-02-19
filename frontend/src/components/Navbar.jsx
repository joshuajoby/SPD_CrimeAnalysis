import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShieldAlert, Menu, X, LayoutDashboard, BarChart3, Phone, Lock, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  // Ticker State
  const [tickerIndex, setTickerIndex] = useState(0)
  const tickerItems = [
    "REPORT: Suspicious activity reported in Sector 4...",
    "ALERT: Cyber threat level elevated to MODERATE...",
    "UPDATE: New safety protocols effective immediately...",
    "COMMUNITY: Neighborhood watch meeting at 7 PM...",
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerItems.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const navLinks = [
    { name: 'Home', path: '/', icon: LayoutDashboard },
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Report Crime', path: '/report', icon: ShieldAlert },
    { name: 'Resources', path: '/resources', icon: BookOpen },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Live Intelligence Ticker */}
      {(!isHome || scrolled) && (
        <div className="bg-red-600 text-white px-4 py-1 text-[10px] font-bold tracking-widest flex justify-center items-center overflow-hidden h-6">
          <div className="animate-pulse mr-4 flex items-center"><ShieldAlert className="w-3 h-3 mr-1" /> LIVE INTELLIGENCE:</div>
          <motion.span
            key={tickerIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="font-mono truncate"
          >
            {tickerItems[tickerIndex]}
          </motion.span>
        </div>
      )}

      <nav className={`transition-all duration-300 ${scrolled || !isHome ? 'bg-slate-900/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-4'
        }`}>
        <div className="w-[90%] max-w-[1400px] mx-auto flex justify-between items-center px-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`p-2 rounded-lg transition-colors ${scrolled || !isHome ? 'bg-amber-500 text-slate-900' : 'bg-white/10 text-white group-hover:bg-white group-hover:text-slate-900'
              }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className={`text-lg font-black tracking-tighter ${scrolled || !isHome ? 'text-white' : 'text-white'
              }`}>
              CRIME<span className="text-amber-500">WATCH</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${location.pathname === item.path
                  ? 'text-amber-500'
                  : (scrolled || !isHome ? 'text-slate-400 hover:text-white' : 'text-slate-300 hover:text-white')
                  }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/emergency" className={`flex items-center gap-1.5 text-xs font-bold ${scrolled || !isHome ? 'text-slate-300 hover:text-red-500' : 'text-slate-200 hover:text-red-400'
              } transition-colors mr-2`}>
              <Phone className="w-3.5 h-3.5" /> Emergency
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-md overflow-hidden absolute top-full left-0 w-full"
            >
              <div className="px-4 py-4 space-y-2">
                {[...navLinks, { name: 'Emergency', path: '/emergency', icon: Phone }].map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${location.pathname === link.path
                      ? "bg-amber-500/10 text-amber-500"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    <link.icon className="h-5 w-5" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

export default Navbar
