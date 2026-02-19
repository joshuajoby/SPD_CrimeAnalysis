
import { useState, useEffect } from 'react'
import { LayoutDashboard, Users, FileText, Settings, ShieldAlert, LogOut, BadgeCheck, CheckCircle, Trash2, Download, Menu, X } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useNavigate } from 'react-router-dom'

function Admin() {
    const [activeTab, setActiveTab] = useState('overview')
    const [userProfile, setUserProfile] = useState(null)
    const [reports, setReports] = useState([])
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        // Load user profile
        const storedUser = localStorage.getItem('admin_user')
        if (storedUser) {
            setUserProfile(JSON.parse(storedUser))
        }

        // Load reports
        const savedReports = JSON.parse(localStorage.getItem('reported_crimes') || '[]')
        setReports(savedReports)
    }, [])

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

    const handleLogout = () => {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('user_role')
        localStorage.removeItem('admin_user')
        navigate('/login')
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

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`w-64 bg-slate-900 text-white flex flex-col fixed h-full z-40 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="w-8 h-8 text-amber-500" />
                        <div>
                            <h1 className="text-xl font-black tracking-tighter">SPD<span className="text-amber-500">ADMIN</span></h1>
                            <p className="text-[10px] text-slate-400 font-mono">SECURE ACCESS v2.4</p>
                        </div>
                    </div>
                    <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* User Mini Profile in Sidebar */}
                {userProfile && (
                    <div className="p-4 bg-slate-800/50 mx-4 mt-4 rounded-lg flex items-center gap-3 border border-slate-700">
                        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center font-bold text-slate-900 text-lg">
                            {userProfile.full_name?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{userProfile.full_name || 'Officer'}</p>
                            <p className="text-[10px] text-slate-400 truncate">{userProfile.rank || 'N/A'} • {userProfile.badge_number || '000'}</p>
                        </div>
                    </div>
                )}

                <nav className="flex-1 p-4 space-y-2 mt-2">
                    {['overview', 'users', 'reports', 'settings'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab)
                                setIsSidebarOpen(false)
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === tab
                                ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {tab === 'overview' && <LayoutDashboard className="w-4 h-4" />}
                            {tab === 'users' && <Users className="w-4 h-4" />}
                            {tab === 'reports' && <FileText className="w-4 h-4" />}
                            {tab === 'settings' && <Settings className="w-4 h-4" />}
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-4 md:p-8">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            className="p-2 bg-white rounded-lg border border-slate-200 lg:hidden shadow-sm"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6 text-slate-600" />
                        </button>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                                {activeTab === 'overview' && 'Command Center'}
                                {activeTab === 'users' && 'Personnel Management'}
                                {activeTab === 'reports' && 'Incident Reports'}
                                {activeTab === 'settings' && 'System Configuration'}
                            </h2>
                            <p className="text-slate-500 mt-1 hidden md:block">
                                Welcome back, {userProfile ? `${userProfile.rank} ${userProfile.full_name}` : 'Officer'}.
                            </p>
                        </div>
                    </div>

                    {userProfile && (
                        <div className="flex gap-4">
                            <div className="bg-white p-2 md:p-3 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3 md:pr-6">
                                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg hidden sm:block">
                                    <BadgeCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Department</p>
                                    <p className="text-xs md:text-sm font-bold text-slate-900">{userProfile.department || 'General'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </header>

                {/* Dashboard Content */}
                {activeTab === 'reports' || activeTab === 'overview' ? (
                    <>
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <Card className="bg-white border-slate-200 shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-bold text-slate-500 uppercase">Total Reports</h3>
                                            <FileText className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <p className="text-3xl font-black text-slate-900">{reports.length}</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white border-slate-200 shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-bold text-slate-500 uppercase">Pending Review</h3>
                                            <ShieldAlert className="w-5 h-5 text-amber-500" />
                                        </div>
                                        <p className="text-3xl font-black text-slate-900">{reports.filter(r => r.status !== 'Resolved').length}</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white border-slate-200 shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-bold text-slate-500 uppercase">Resolved Cases</h3>
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        </div>
                                        <p className="text-3xl font-black text-slate-900">{reports.filter(r => r.status === 'Resolved').length}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Recent Incident Reports</h3>
                            <Button variant="outline" size="sm" onClick={exportCSV}>
                                <Download className="mr-2 h-4 w-4" /> Export CSV
                            </Button>
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
                            <div className="grid grid-cols-1 gap-4">
                                {reports.map((report) => (
                                    <Card key={report.id} className={`border-l-4 hover:shadow-md transition-shadow ${report.status === 'Resolved' ? 'border-l-green-500' : 'border-l-red-500'}`}>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col lg:flex-row justify-between gap-6">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${report.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {report.status || 'Pending'}
                                                        </span>
                                                        <span className="text-sm text-slate-400 font-mono">#{report.id}</span>
                                                        <span className="text-sm text-slate-400">• {new Date(report.submittedAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-slate-900">{report.type} at {report.location}</h3>
                                                    <p className="text-slate-600 bg-slate-50 p-3 rounded-lg text-sm border border-slate-100">
                                                        "{report.description}"
                                                    </p>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    {report.status !== 'Resolved' && (
                                                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleResolve(report.id)}>
                                                            <CheckCircle className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    <Button size="sm" variant="destructive" onClick={() => handleDelete(report.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-96 text-slate-400">
                        <div className="text-center">
                            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">Module Under Development</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default Admin
