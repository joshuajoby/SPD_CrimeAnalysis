
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, BarChart3, ShieldCheck, MapPin, Bell, Activity, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent } from '../components/ui/card'

const features = [
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Real-time crime statistics, trends, and comprehensive data visualization with interactive charts.',
    color: 'text-blue-500'
  },
  {
    icon: Search,
    title: 'Smart Filtering',
    description: 'Filter news by crime type, location, and credibility to find exactly what matters to you.',
    color: 'text-purple-500'
  },
  {
    icon: ShieldCheck,
    title: 'Credibility Analysis',
    description: 'AI-powered credibility assessment to help you identify reliable news sources and avoid misinformation.',
    color: 'text-green-500'
  },
  {
    icon: MapPin,
    title: 'Location Intelligence',
    description: 'Analyze crime patterns specific to your region with detailed location-based breakdowns.',
    color: 'text-red-500'
  },
  {
    icon: Bell,
    title: 'Real-Time Updates',
    description: 'Stay informed with latest crime news from trusted sources across India.',
    color: 'text-yellow-500'
  },
  {
    icon: Activity,
    title: 'Safety Insights',
    description: 'Make informed decisions based on crime patterns and safety analysis.',
    color: 'text-orange-500'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

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
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <Navbar />

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px]" />
          </div>

          <div className="relative z-10 w-full max-w-[95%] mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                Live Crime Intelligence Protocol
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Advanced Intelligence <br className="hidden md:block" />
                for <span className="text-primary">Safer Communities</span>
              </h1>

              <p className="text-2xl md:text-3xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
                Empowering citizens and authorities with real-time crime data analysis,
                AI-driven credibility scoring, and predictive insights.
              </p>

              {/* Search Box */}
              <motion.form
                onSubmit={handleSearch}
                className="max-w-2xl mx-auto mb-16 relative group"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative flex gap-2 bg-background p-2 rounded-lg border border-border shadow-2xl">
                  <Input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="Enter region, state, or city (e.g., Delhi, Mumbai)"
                    className="h-14 text-lg border-0 bg-transparent focus-visible:ring-0 shadow-none px-4"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="h-14 px-8 text-lg font-semibold shadow-lg"
                  >
                    Analyze
                  </Button>
                </div>
              </motion.form>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-border/50 py-8 bg-background/50 backdrop-blur-sm">
                {[
                  { label: 'Active Sources', value: '50+' },
                  { label: 'Daily Reports', value: '100+' },
                  { label: 'Cities Tracked', value: '25+' },
                  { label: 'Data Accuracy', value: '98%' },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Comprehensive tools designed for in-depth analysis and monitoring.
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="h-full border-border/50 bg-card hover:border-primary/50 transition-colors duration-300">
                      <CardContent className="p-8">
                        <div className={`mb-6 inline-flex p-3 rounded-xl bg-background border border-border/50 shadow-sm ${feature.color}`}>
                          <Icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 z-0"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to secure your community?</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Join thousands of users leveraging data for safer neighborhoods.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-14 px-8 text-lg" onClick={() => document.querySelector('input')?.focus()}>
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg" onClick={() => navigate('/report')}>
                Report an Incident
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
