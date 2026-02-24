import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Search, AlertTriangle, CheckCircle, XCircle, ArrowRight, Loader2, Link, FileText, Info, AlertOctagon } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent } from '../components/ui/card'



function CredibilityCheck() {
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)

    const handleAnalyze = async (e) => {
        e.preventDefault()
        if (!url.trim()) return

        setLoading(true)
        setResult(null)

        try {
            const response = await fetch('/api/analyze-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            })

            const data = await response.json()

            if (response.ok) {
                setResult(data)
            } else {
                setResult({
                    score: 0,
                    status: 'Error',
                    domain: 'Unknown',
                    sentiment: 'Error',
                    factCheck: data.error || 'Failed to analyze URL.',
                    justification: 'Server encountered an error processing this request.'
                })
            }
        } catch (error) {
            setResult({
                score: 0,
                status: 'Connection Failed',
                domain: 'Unknown',
                sentiment: 'Network Error',
                factCheck: 'Could not connect to analysis server.',
                justification: 'Failed to reach the extensive AI model.'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none"></div>

            <Navbar />

            <main className="flex-grow pt-28 pb-16 px-4 relative z-10">
                <div className="container mx-auto max-w-3xl">

                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center p-2.5 bg-blue-100/80 rounded-xl mb-4 shadow-sm">
                            <Shield className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black mb-3 text-slate-900 tracking-tight">
                            Intelligence Source Verification
                        </h1>
                        <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
                            Analyze any news source with our AI. Detect sensationalism, verify domain reputation, and get an instant summary.
                        </p>
                    </div>

                    <Card className="shadow-xl border-0 overflow-hidden mb-10 bg-white/80 backdrop-blur-sm border-slate-200/50">
                        <CardContent className="p-6 md:p-8">
                            <form onSubmit={handleAnalyze} className="relative">
                                <div className="relative flex items-center group">
                                    <Link className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="url"
                                        placeholder="Paste article URL here..."
                                        className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm transition-all bg-slate-50 focus:bg-white"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={loading}
                                    className="w-full mt-3 h-10 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-lg shadow-slate-900/10 transition-all hover:scale-[1.01]"
                                >
                                    {loading ? (
                                        <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Analyzing...</>
                                    ) : (
                                        <>Verify Credibility <ArrowRight className="w-4 h-4 ml-2" /></>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="space-y-6"
                            >
                                {/* Result Hero Card */}
                                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col md:flex-row">
                                    {/* Image Section */}
                                    {result.image && (
                                        <div className="md:w-1/3 relative h-48 md:h-auto">
                                            <img
                                                src={result.image}
                                                alt="Article Preview"
                                                className="absolute inset-0 w-full h-full object-cover"
                                                onError={(e) => { e.target.style.display = 'none' }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r" />
                                        </div>
                                    )}

                                    {/* Summary & Title Section */}
                                    <div className={`p-6 ${result.image ? 'md:w-2/3' : 'w-full'}`}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-md tracking-wider">
                                                {result.domain}
                                            </span>
                                            <span className="text-slate-400 text-[10px] font-medium">
                                                • Analyzed Just Now
                                            </span>
                                        </div>

                                        <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-3 leading-tight">
                                            {result.title}
                                        </h2>

                                        <div className="bg-slate-50 border-l-4 border-blue-500 p-3 rounded-r-md mb-4">
                                            <div className="flex items-start gap-3">
                                                <FileText className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                                <p className="text-slate-600 leading-relaxed text-xs md:text-sm line-clamp-3">
                                                    {result.summary || "No summary available for this article."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Metrics Dashboard */}
                                <div className="grid md:grid-cols-3 gap-4 mb-6">
                                    {/* Trust Score Card */}
                                    <div className={`rounded-2xl p-6 text-white text-center flex flex-col justify-center items-center shadow-lg transform transition-transform hover:scale-105 ${result.score > 75 ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' :
                                        result.score > 50 ? 'bg-gradient-to-br from-amber-500 to-amber-600' :
                                            'bg-gradient-to-br from-red-500 to-red-600'
                                        }`}>
                                        <div className="mb-1 opacity-90 font-bold uppercase tracking-widest text-[10px]">Trust Score</div>
                                        <div className="text-5xl font-black mb-2 tracking-tighter">{result.score}</div>
                                        <div className="text-xs font-bold opacity-90 bg-white/20 px-3 py-0.5 rounded-full">
                                            {result.status}
                                        </div>
                                    </div>

                                    {/* Domain Info */}
                                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-lg flex flex-col justify-center text-center">
                                        <div className="inline-flex items-center justify-center w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full mx-auto mb-3">
                                            <Info className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Source Analysis</h3>
                                        <p className="text-base font-bold text-slate-900 line-clamp-1">
                                            {result.source || result.domain}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Domain detected.
                                        </p>
                                    </div>

                                    {/* Fact Check / Sentiment */}
                                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-lg flex flex-col justify-center text-center">
                                        <div className="inline-flex items-center justify-center w-10 h-10 bg-rose-50 text-rose-600 rounded-full mx-auto mb-3">
                                            <AlertOctagon className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Fact Check Status</h3>
                                        <p className="text-sm font-bold text-slate-900 leading-snug">
                                            {result.factCheck}
                                        </p>
                                    </div>
                                </div>

                                {/* Extensive AI Logic Block */}
                                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                        <Shield className="w-32 h-32" />
                                    </div>
                                    <h3 className="text-slate-900 font-bold flex items-center gap-2 mb-3">
                                        <Activity className="w-5 h-5 text-blue-500" /> Extensive Model Reasoning
                                    </h3>
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                                        <div className="mb-4">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Sentiment Scan</span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${result.sentiment === 'Negative' ? 'bg-red-100 text-red-800' :
                                                    result.sentiment === 'Positive' ? 'bg-emerald-100 text-emerald-800' :
                                                        'bg-slate-200 text-slate-800'
                                                }`}>
                                                {result.sentiment || 'Neutral'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">AI Logic & Justification</span>
                                            <p className="text-sm text-slate-700 leading-relaxed italic">
                                                "{result.justification || 'Analyzed using baseline Keyword Heuristics.'}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </main>

            <Footer />
        </div>
    )
}

export default CredibilityCheck
