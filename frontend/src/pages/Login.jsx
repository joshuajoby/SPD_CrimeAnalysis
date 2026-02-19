import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, ArrowRight, User, Key, Eye, EyeOff, Loader2, Fingerprint, BadgeCheck, Briefcase, Phone, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Form States
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        full_name: '',
        badge_number: '',
        rank: '',
        department: '',
        contact: '',
        email: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const endpoint = isRegistering ? '/api/register' : '/api/login';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                if (isRegistering) {
                    setSuccess('Officer registered successfully. Please login.');
                    setIsRegistering(false);
                    setFormData(prev => ({ ...prev, password: '' })); // Clear password
                } else {
                    localStorage.setItem('admin_token', data.token);
                    localStorage.setItem('user_role', data.user.role);
                    localStorage.setItem('admin_user', JSON.stringify(data.user)); // Store full profile
                    navigate('/admin');
                }
            } else {
                setError(data.error || 'Authentication failed');
            }
        } catch (err) {
            setError('Connection failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-900 font-sans selection:bg-amber-500/30">
            {/* Left Side - Visuals */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-950 items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/80 to-transparent"></div>

                <div className="relative z-10 max-w-lg px-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center justify-center p-4 bg-amber-500/10 rounded-2xl mb-8 ring-1 ring-amber-500/50"
                    >
                        <Shield className="w-12 h-12 text-amber-500" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl font-black text-white mb-6 tracking-tight leading-tight"
                    >
                        Restricted Access <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Intelligence Portal</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-slate-400 text-lg leading-relaxed"
                    >
                        Authorized personnel only. Monitor real-time threats, manage incident reports, and oversee global surveillance operations.
                    </motion.p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 overflow-y-auto max-h-screen">
                <div className="w-full max-w-md space-y-6 my-auto">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                            {isRegistering ? 'Officer Registration' : 'Welcome Back'}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                            {isRegistering ? 'Enter valid credentials to create a new personnel record.' : 'Please authenticate to access the admin dashboard.'}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <AnimatePresence mode='wait'>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100 flex items-center gap-2"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                        {error}
                                    </motion.div>
                                )}
                                {success && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="p-3 bg-green-50 text-green-600 text-sm font-medium rounded-lg border border-green-100 flex items-center gap-2"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                        {success}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Registration Fields */}
                            <AnimatePresence>
                                {isRegistering && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-4 overflow-hidden"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                                                <Input name="full_name" placeholder="John Doe" value={formData.full_name} onChange={handleInputChange} className="h-9 bg-slate-50" required={isRegistering} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Badge Number</label>
                                                <Input name="badge_number" placeholder="ID-XXXX" value={formData.badge_number} onChange={handleInputChange} className="h-9 bg-slate-50" required={isRegistering} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Rank</label>
                                                <Select onValueChange={(val) => handleSelectChange('rank', val)} value={formData.rank}>
                                                    <SelectTrigger className="h-9 bg-slate-50"><SelectValue placeholder="Select Rank" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Officer">Officer</SelectItem>
                                                        <SelectItem value="Detective">Detective</SelectItem>
                                                        <SelectItem value="Sergeant">Sergeant</SelectItem>
                                                        <SelectItem value="Lieutenant">Lieutenant</SelectItem>
                                                        <SelectItem value="Captain">Captain</SelectItem>
                                                        <SelectItem value="Chief">Chief</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Department</label>
                                                <Select onValueChange={(val) => handleSelectChange('department', val)} value={formData.department}>
                                                    <SelectTrigger className="h-9 bg-slate-50"><SelectValue placeholder="Select Dept" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Patrol">Patrol</SelectItem>
                                                        <SelectItem value="Homicide">Homicide</SelectItem>
                                                        <SelectItem value="Cyber Crime">Cyber Crime</SelectItem>
                                                        <SelectItem value="Narcotics">Narcotics</SelectItem>
                                                        <SelectItem value="Intelligence">Intelligence</SelectItem>
                                                        <SelectItem value="Administration">Administration</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Official Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                <Input name="email" type="email" placeholder="officer@spd.gov" value={formData.email} onChange={handleInputChange} className="pl-9 h-9 bg-slate-50" required={isRegistering} />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Contact Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                <Input name="contact" placeholder="+1 (555) 000-0000" value={formData.contact} onChange={handleInputChange} className="pl-9 h-9 bg-slate-50" required={isRegistering} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Common Fields */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Username / ID</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <Input
                                        name="username"
                                        type="text"
                                        placeholder="System ID"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className="pl-10 h-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
                                <div className="relative group">
                                    <Key className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <Input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="pl-10 pr-10 h-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 mt-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                                ) : (
                                    <>{isRegistering ? 'Register Officer' : 'Secure Login'} <ArrowRight className="ml-2 h-4 w-4" /></>
                                )}
                            </Button>
                        </form>

                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs">
                            <button
                                onClick={() => setIsRegistering(!isRegistering)}
                                className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
                            >
                                {isRegistering ? 'Back to Login' : 'Register New Officer'}
                            </button>

                            <button
                                onClick={() => navigate('/')}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                Access Public Portal
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-[10px] text-slate-400 mt-6">
                        Authorized Use Only • Secure Connection • v2.4.0
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
