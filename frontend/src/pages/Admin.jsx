
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Lock, Trash2, CheckCircle, Download, FileText } from 'lucide-react'
import { Input } from '../components/ui/input'
import { useNavigate } from 'react-router-dom'

function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [passcode, setPasscode] = useState('')
    const [reports, setReports] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        // Load reports from localStorage
        const savedReports = JSON.parse(localStorage.getItem('reported_crimes') || '[]')
        setReports(savedReports)
    }, [])

    const handleLogin = (e) => {
        e.preventDefault()
        if (passcode === '1234') { // Simple hardcoded password
            setIsAuthenticated(true)
            setError('')
        } else {
            setError('Invalid Access Code')
        }
    }

    const handleDelete = (id) => {
        const updatedReports = reports.filter(r => r.id !== id)
        setReports(updatedReports)
        localStorage.setItem('reported_crimes', JSON.stringify(updatedReports))
    }

    const handleResolve = (id) => {
        const updatedReports = reports.map(r =>
            r.id === id ? { ...r, status: 'Resolved' } : r
        )
        setReports(updatedReports)
        localStorage.setItem('reported_crimes', JSON.stringify(updatedReports))
    }

    const exportCSV = () => {
        try {
            const headers = ["ID", "Type", "Location", "Date", "Description", "Status"]
            const csvContent = [
                headers.join(","),
                ...reports.map(r => [
                    r.id,
                    r.type,
                    `"${r.location}"`,
                    r.date,
                    `"${r.description}"`,
                    r.status || 'Pending'
                ].join(","))
            ].join("\n")

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const link = document.createElement("a")
            const url = URL.createObjectURL(blob)
            link.setAttribute("href", url)
            link.setAttribute("download", "crime_reports.csv")
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.error("Export failed", err)
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <main className="flex-grow flex items-center justify-center pt-24 pb-12">
                    <Card className="w-full max-w-md mx-4 shadow-2xl border-primary/20 bg-background/95 backdrop-blur">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Lock className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">Admin Access</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <Input
                                    type="password"
                                    placeholder="Enter Access Code"
                                    value={passcode}
                                    onChange={(e) => setPasscode(e.target.value)}
                                    className="text-center text-lg tracking-widest h-12"
                                />
                                {error && <p className="text-red-500 text-center text-sm font-medium">{error}</p>}
                                <Button type="submit" className="w-full h-12 text-lg font-bold">
                                    Unlock Dashboard
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className="flex-grow pt-28 px-4 pb-12 w-full max-w-[95%] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-card p-6 rounded-lg border shadow-sm">
                    <div>
                        <h1 className="text-4xl font-bold mb-1">Admin Dashboard</h1>
                        <p className="text-xl text-muted-foreground">Manage user reports and intelligence.</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" size="lg" onClick={exportCSV}>
                            <Download className="mr-2 h-5 w-5" /> Export Data
                        </Button>
                        <Button variant="secondary" size="lg" onClick={() => setIsAuthenticated(false)}>
                            Logout
                        </Button>
                    </div>
                </div>

                {reports.length === 0 ? (
                    <Card className="text-center py-20 border-dashed">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-muted/50 rounded-full mb-6">
                            <FileText className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <h2 className="text-3xl font-semibold mb-2">No Reports Found</h2>
                        <p className="text-xl text-muted-foreground">Citizen reports will appear here once submitted.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {reports.map((report) => (
                            <Card key={report.id} className={`border-l-8 hover:shadow-md transition-shadow ${report.status === 'Resolved' ? 'border-l-green-500' : 'border-l-red-500'
                                }`}>
                                <CardContent className="p-8">
                                    <div className="flex flex-col lg:flex-row justify-between gap-8">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex flex-wrap items-center gap-4 mb-2">
                                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${report.status === 'Resolved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {report.status || 'Pending'}
                                                </span>
                                                <span className="text-base text-muted-foreground font-mono">ID: #{report.id}</span>
                                                <span className="text-base text-muted-foreground">• {new Date(report.submittedAt).toLocaleString()}</span>
                                            </div>
                                            <h3 className="text-3xl font-bold">{report.type} at {report.location}</h3>
                                            <p className="text-xl text-muted-foreground leading-relaxed bg-muted/20 p-4 rounded-md">
                                                "{report.description}"
                                            </p>
                                            <div className="flex gap-6 text-base mt-4 font-medium">
                                                <span><strong>Date of Incident:</strong> {report.date}</span>
                                                {report.anonymous && <span className="text-purple-600 font-bold">• Anonymous Submission</span>}
                                            </div>
                                        </div>
                                        <div className="flex flex-row lg:flex-col justify-center gap-3 min-w-[180px]">
                                            {report.status !== 'Resolved' && (
                                                <Button
                                                    className="bg-green-600 hover:bg-green-700 text-white h-12 text-lg"
                                                    onClick={() => handleResolve(report.id)}
                                                >
                                                    <CheckCircle className="mr-2 h-5 w-5" /> Mark Resolved
                                                </Button>
                                            )}
                                            <Button
                                                variant="destructive"
                                                className="h-12 text-lg"
                                                onClick={() => handleDelete(report.id)}
                                            >
                                                <Trash2 className="mr-2 h-5 w-5" /> Delete Report
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    )
}

export default Admin
