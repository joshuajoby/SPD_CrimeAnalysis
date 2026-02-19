
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, AlertTriangle, Shield, EyeOff, Info } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'

function ReportCrime() {
    const [formData, setFormData] = useState({
        type: '',
        location: '',
        date: '',
        description: '',
        anonymous: false
    })
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()

        // Save to LocalStorage
        const newReport = {
            id: Math.floor(Math.random() * 100000),
            ...formData,
            status: 'Pending',
            submittedAt: new Date().toISOString()
        }

        const existingReports = JSON.parse(localStorage.getItem('reported_crimes') || '[]')
        localStorage.setItem('reported_crimes', JSON.stringify([newReport, ...existingReports]))

        setTimeout(() => {
            setSubmitted(true)
        }, 800)
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            <Navbar />

            <main className="flex-grow pt-20 px-4 pb-4 w-full max-w-6xl mx-auto h-[calc(100vh-80px)]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">

                    {/* Left Column: Context & Safety - Compact Mode */}
                    <div className="lg:col-span-4 flex flex-col justify-center space-y-4">
                        <div className="mb-2">
                            <h1 className="text-3xl font-black mb-2 text-slate-900">Report an <span className="text-blue-600">Incident</span></h1>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Your vigilance helps keep our community safe. All reports are reviewed immediately.
                            </p>
                        </div>

                        <Card className="bg-blue-50/50 border-blue-100 shadow-sm">
                            <CardHeader className="pb-2 pt-4">
                                <CardTitle className="flex items-center text-sm font-bold text-blue-800">
                                    <Shield className="mr-2 h-4 w-4" />
                                    Why Report?
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs space-y-2 text-slate-600 pb-4">
                                <p>• <strong>Real-time Analysis:</strong> Feeds into live crime mapping.</p>
                                <p>• <strong>Resource Allocation:</strong> Helps deploy patrols effectively.</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-orange-50/50 border-orange-100 shadow-sm">
                            <CardHeader className="pb-2 pt-4">
                                <CardTitle className="flex items-center text-sm font-bold text-orange-800">
                                    <EyeOff className="mr-2 h-4 w-4" />
                                    Anonymity Guaranteed
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-slate-600 pb-4">
                                <p>
                                    You can remain anonymous. We do not track IP addresses for anonymous submissions.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: The Form - Compact */}
                    <div className="lg:col-span-8 h-full flex flex-col justify-center">
                        <Card className="border-t-4 border-t-blue-600 shadow-xl bg-white">
                            <CardHeader className="pb-4 pt-6 border-b px-6">
                                <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
                                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                                    Incident Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {submitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-10"
                                    >
                                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                                            <CheckCircle className="h-10 w-10 text-green-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">Report Submitted</h3>
                                        <p className="text-sm text-slate-500 mb-6">
                                            ID: <span className="font-mono font-bold text-slate-900">#CR-{Math.floor(Math.random() * 10000)}</span>
                                        </p>
                                        <Button onClick={() => setSubmitted(false)} variant="outline" size="sm" className="h-10 px-6">
                                            Submit Another
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
                                                    Crime Type <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        name="type"
                                                        required
                                                        className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 appearance-none"
                                                        value={formData.type}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="">Select Category...</option>
                                                        <option value="Theft">Theft / Robbery</option>
                                                        <option value="Assault">Assault / Violence</option>
                                                        <option value="Fraud">Fraud / Scam</option>
                                                        <option value="Vandalism">Vandalism</option>
                                                        <option value="Harassment">Harassment</option>
                                                        <option value="Suspicious">Suspicious Activity</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
                                                    Time of Incident <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <Input
                                                    type="datetime-local"
                                                    name="date"
                                                    required
                                                    value={formData.date}
                                                    onChange={handleChange}
                                                    className="h-10 text-sm bg-slate-50 w-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
                                                Location <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Input
                                                name="location"
                                                placeholder="Enter accurate address or landmark..."
                                                required
                                                value={formData.location}
                                                onChange={handleChange}
                                                className="h-10 text-sm bg-slate-50"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
                                                Description <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <textarea
                                                name="description"
                                                className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                                placeholder="Provide details about the incident..."
                                                required
                                                value={formData.description}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="anonymous"
                                                    name="anonymous"
                                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                    checked={formData.anonymous}
                                                    onChange={handleChange}
                                                />
                                                <label htmlFor="anonymous" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                                                    Submit Anonymously
                                                </label>
                                            </div>

                                            <Button type="submit" className="text-sm font-bold h-10 px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all hover:scale-105">
                                                <Send className="mr-2 h-4 w-4" /> Submit Report
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ReportCrime
