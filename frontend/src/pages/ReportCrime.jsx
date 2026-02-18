
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, AlertTriangle } from 'lucide-react'
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
        // Simulate API call
        // Simulate API call & Save to LocalStorage
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
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow pt-24 px-4 pb-12">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold mb-2">Report an Incident</h1>
                        <p className="text-muted-foreground">
                            Your report helps us track crime patterns and alert the community.
                        </p>
                    </div>

                    <Card className="border-t-4 border-t-primary shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                Incident Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
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
                                    <p className="text-muted-foreground mb-6">
                                        Thank you for your contribution to community safety. Your report ID is #CR-{Math.floor(Math.random() * 10000)}.
                                    </p>
                                    <Button onClick={() => setSubmitted(false)} variant="outline">
                                        Submit Another Report
                                    </Button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Crime Type</label>
                                        <select
                                            name="type"
                                            required
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            value={formData.type}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select a category...</option>
                                            <option value="Theft">Theft / Robbery</option>
                                            <option value="Assault">Assault / Violence</option>
                                            <option value="Fraud">Fraud / Scam</option>
                                            <option value="Vandalism">Vandalism</option>
                                            <option value="Harassment">Harassment</option>
                                            <option value="Suspicious">Suspicious Activity</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Location</label>
                                            <Input
                                                name="location"
                                                placeholder="e.g., Main Street, Downtown"
                                                required
                                                value={formData.location}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Date & Time</label>
                                            <Input
                                                type="datetime-local"
                                                name="date"
                                                required
                                                value={formData.date}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Description</label>
                                        <textarea
                                            name="description"
                                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Please utilize as much detail as possible..."
                                            required
                                            value={formData.description}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="anonymous"
                                            name="anonymous"
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            checked={formData.anonymous}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="anonymous" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Submit anonymously
                                        </label>
                                    </div>

                                    <Button type="submit" className="w-full" size="lg">
                                        <Send className="mr-2 h-4 w-4" /> Submit Report
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default ReportCrime
