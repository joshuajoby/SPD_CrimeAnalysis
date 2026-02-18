
import { ShieldAlert, Github, Twitter, Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border mt-auto">
      <div className="w-full px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <ShieldAlert className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl text-foreground">
                Crime<span className="text-primary">Watch</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              Empowering citizens with real-time crime intelligence and safety analytics. Making communities safer through data transparency.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/results/All" className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-muted-foreground hover:text-primary transition-colors">
                  Live Map
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-muted-foreground hover:text-primary transition-colors">
                  Report Incident
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="text-muted-foreground hover:text-primary transition-colors">
                  Emergency Contacts
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal/Social */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Connect</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="p-2 bg-background border border-border rounded-full hover:border-primary hover:text-primary transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-background border border-border rounded-full hover:border-primary hover:text-primary transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-background border border-border rounded-full hover:border-primary hover:text-primary transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CrimeWatch Inc.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
