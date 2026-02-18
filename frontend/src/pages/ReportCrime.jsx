
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
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow pt-28 px-4 pb-20 w-full max-w-[95%] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Context & Safety */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="mb-8">
                            <h1 className="text-5xl font-bold mb-4">Report an <span className="text-primary">Incident</span></h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Your vigilance helps keep our community safe. All reports are reviewed by intelligence officers immediately.
                            </p>
                        </div>

                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center text-2xl">
                                    <Shield className="mr-3 h-6 w-6 text-primary" />
                                    Why Report?
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-lg space-y-4">
                                <p>• <strong>Real-time Analysis:</strong> Your data feeds into our live crime mapping system.</p>
                                <p>• <strong>Resource Allocation:</strong> Helps police deploy patrols where needed most.</p>
                                <p>• <strong>Community Awareness:</strong> Alerts neighbors to potential threats.</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-orange-500/5 border-orange-500/20">
                            <CardHeader>
                                <CardTitle className="flex items-center text-2xl text-orange-700 dark:text-orange-400">
                                    <EyeOff className="mr-3 h-6 w-6" />
                                    Anonymity Guaranteed
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-lg">
                                <p>
                                    You can choose to remain completely anonymous. We do not track IP addresses for anonymous submissions.
                                </p>
                            </CardContent>
                        </Card>

                        <div className="p-4 bg-muted rounded-lg border border-border">
                            <h4 className="flex items-center font-bold text-lg mb-2">
                                <Info className="mr-2 h-5 w-5" /> false Reporting
                            </h4>
                            <p className="text-base text-muted-foreground">
                                Intentionally filing a false police report is a crime punishable by law. Please ensure all information is accurate.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: The Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-t-8 border-t-primary shadow-2xl h-full">
                            <CardHeader className="pb-6 border-b">
                                <CardTitle className="flex items-center gap-3 text-3xl">
                                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                                    Incident Details Form
                                </CardTitle>
                                <p className="text-lg text-muted-foreground mt-2">
                                    Please provide as much detail as possible. Fields marked * are required.
                                </p>
                            </CardHeader>
                            <CardContent className="p-8">
                                {submitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-20"
                                    >
                                        <div className="inline-flex items-center justify-center w-32 h-32 bg-green-100 rounded-full mb-8">
                                            <CheckCircle className="h-16 w-16 text-green-600" />
                                        </div>
                                        <h3 className="text-4xl font-bold mb-4">Report Submitted Successfully</h3>
                                        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                                            Thank you for your contribution to community safety. Your report ID is <span className="font-mono font-bold text-foreground">#CR-{Math.floor(Math.random() * 10000)}</span>.
                                        </p>
                                        <Button onClick={() => setSubmitted(false)} variant="outline" size="lg" className="text-xl h-16 px-10">
                                            Submit Another Report
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-lg font-semibold flex items-center">
                                                    Crime Type <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        name="type"
                                                        required
                                                        className="flex h-14 w-full rounded-md border border-input bg-background px-4 py-3 text-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none"
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
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-lg font-semibold flex items-center">
                                                    Date & Time <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <Input
                                                    type="datetime-local"
                                                    name="date"
                                                    required
                                                    value={formData.date}
                                                    onChange={handleChange}
                                                    className="h-14 text-lg"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-lg font-semibold flex items-center">
                                                Location <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <Input
                                                name="location"
                                                placeholder="e.g., 123 Main Street, near Central Station"
                                                required
                                                value={formData.location}
                                                onChange={handleChange}
                                                className="h-14 text-lg"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-lg font-semibold flex items-center">
                                                Description <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <textarea
                                                name="description"
                                                className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-4 py-4 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Please describe the incident in detail (what happened, suscription of suspects, vehicle details, etc.)"
                                                required
                                                value={formData.description}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                                            <input
                                                type="checkbox"
                                                id="anonymous"
                                                name="anonymous"
                                                className="h-6 w-6 rounded border-gray-300 text-primary focus:ring-primary"
                                                checked={formData.anonymous}
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="anonymous" className="text-lg font-medium leading-none cursor-pointer select-none">
                                                Submit this report anonymously
                                            </label>
                                        </div>

                                        <Button type="submit" className="w-full text-xl font-bold h-16 shadow-lg shadow-primary/20" size="lg">
                                            <Send className="mr-3 h-6 w-6" /> Submit Official Report
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default ReportCrime
