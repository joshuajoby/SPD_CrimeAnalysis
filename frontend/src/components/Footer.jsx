
import { ShieldAlert, Github, Twitter, Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-200 border-t border-slate-800 mt-auto pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-8">
              <ShieldAlert className="h-8 w-8 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]" />
              <span className="font-black text-2xl text-white uppercase italic tracking-tighter">
                Crime<span className="text-amber-500">Watch</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
              India's premier tactical crime intelligence platform. Deploying advanced telemetry and community data to secure the digital and physical frontiers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-3 bg-slate-900 border border-white/5 rounded-xl hover:border-amber-500/50 hover:text-amber-500 transition-all hover:-translate-y-1 shadow-xl">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-3 bg-slate-900 border border-white/5 rounded-xl hover:border-amber-500/50 hover:text-amber-500 transition-all hover:-translate-y-1 shadow-xl">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="p-3 bg-slate-900 border border-white/5 rounded-xl hover:border-amber-500/50 hover:text-amber-500 transition-all hover:-translate-y-1 shadow-xl">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-black text-white text-[10px] uppercase tracking-[0.2em] mb-8">Navigation Node</h3>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/results/All" className="text-slate-400 hover:text-amber-500 transition-colors">Tactical Dashboard</Link></li>
              <li><Link to="/map" className="text-slate-400 hover:text-amber-500 transition-colors">Sector Map</Link></li>
              <li><Link to="/report" className="text-slate-400 hover:text-amber-500 transition-colors">Log Intelligence</Link></li>
              <li><Link to="/resources" className="text-slate-400 hover:text-amber-500 transition-colors">Field Manuals</Link></li>
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
            <h3 className="font-black text-white text-[10px] uppercase tracking-[0.2em] mb-8">Sync Intelligence</h3>
            <p className="text-slate-400 text-sm mb-6 font-medium">Register for encrypted situational updates and tactical advisories.</p>
            <form className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="OPERATOR_EMAIL"
                className="bg-slate-900/50 border border-white/5 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:bg-slate-900 transition-all font-mono"
              />
              <button className="bg-amber-600 hover:bg-amber-700 text-slate-950 font-black py-4 rounded-xl transition-all uppercase tracking-widest text-xs shadow-[0_10px_20px_rgba(217,119,6,0.2)]">
                Secure Uplink
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center text-slate-600">
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">© {new Date().getFullYear()} CrimeWatch Tactical. Restricted Access. | Sector: India (All Regions)</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
