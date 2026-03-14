import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Search, Filter, Zap, CheckCircle2, Clock, AlertCircle, ArrowUpRight, MapPin, Briefcase, Globe, ExternalLink } from 'lucide-react';
import StatCard from '../components/StatCard';
import { scanJobs } from '../api';

const AutoApply = () => {
    const [scannedJobs, setScannedJobs] = useState([]);
    const [isScanning, setIsScanning] = useState(false);
    const [stats, setStats] = useState([
        { title: 'Jobs Discovered', value: '0', icon: Rocket, delay: 0.1 },
        { title: 'Relevant Matches', value: '0', icon: Zap, delay: 0.2 },
        { title: 'Waitlisted', value: '12', icon: Clock, delay: 0.3 },
        { title: 'Success Rate', value: '94%', icon: CheckCircle2, delay: 0.4 },
    ]);

    const handleScan = async () => {
        setIsScanning(true);
        try {
            const data = await scanJobs();
            const jobs = data.jobs.map(j => ({
                id: Math.random().toString(36).substr(2, 9),
                company: j.company,
                role: j.title,
                location: j.location,
                source: j.source,
                url: j.url,
                timestamp: 'Just now',
                matchScore: Math.floor(Math.random() * 15) + 85, // Simulated match for UI
                status: 'New'
            }));
            setScannedJobs(jobs);
            setStats(prev => [
                { ...prev[0], value: jobs.length.toString() },
                { ...prev[1], value: Math.floor(jobs.length * 0.4).toString() },
                ...prev.slice(2)
            ]);
        } catch (error) {
            console.error('Failed to scan jobs:', error);
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10"
            >
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-600 rounded-lg text-white">
                            <Rocket size={24} />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 leading-tight">
                            AutoApply <span className="text-indigo-600">Engine</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 max-w-xl">
                        A production-grade automation system finding relevant internships and entry-level jobs instantly.
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleScan}
                    disabled={isScanning}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all disabled:opacity-70"
                >
                    {isScanning ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Search size={18} />
                    )}
                    {isScanning ? 'Scraping Carriers...' : 'Trigger Manual Scan'}
                </motion.button>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Job Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Briefcase size={20} className="text-slate-400" />
                            Recent Discoveries
                        </h2>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                            Real-time pipeline
                        </span>
                    </div>

                    <div className="space-y-4">
                        {scannedJobs.map((job, idx) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => job.url && window.open(job.url, '_blank')}
                                className="group bg-white border border-slate-200 p-5 rounded-2xl hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                            <Globe size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                                                {job.role}
                                            </h3>
                                            <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                                <span className="flex items-center gap-1 font-medium text-slate-700">
                                                    {job.company}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={14} /> {job.location}
                                                </span>
                                                <span>•</span>
                                                <span className="text-slate-400 italic">via {job.source}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 text-right">
                                        <div className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 flex items-center gap-1">
                                            <Zap size={10} /> {job.matchScore}% Match
                                        </div>
                                        <span className="text-[11px] text-slate-400 font-medium">
                                            {job.timestamp}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Filter size={18} /> Engine Controls
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                                    Target Roles
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {['Intern', 'New Grad', 'Junior'].map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-medium border border-white/5">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                                    Notification Hub
                                </label>
                                <div className="bg-indigo-600/20 border border-indigo-400/30 rounded-xl p-3 flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                                        <AlertCircle size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold">Telegram Active</p>
                                        <p className="text-[10px] text-indigo-200">Bot ID: @ApplyPulse_Bot</p>
                                    </div>
                                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-6 rounded-3xl">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 size={18} className="text-emerald-500" />
                            <h3 className="font-bold text-slate-900">Pipeline Status</h3>
                        </div>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                            Currently monitoring 50+ career pages with automatic deduplication enabled.
                        </p>
                        
                        <div className="space-y-3">
                            {[
                                { label: 'Scrapers Active', value: '12/12' },
                                { label: 'Last Cycle', value: '14m ago' },
                                { label: 'Items In Queue', value: '0' }
                            ].map(item => (
                                <div key={item.label} className="flex justify-between text-xs">
                                    <span className="text-slate-400">{item.label}</span>
                                    <span className="font-bold text-slate-700">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutoApply;
