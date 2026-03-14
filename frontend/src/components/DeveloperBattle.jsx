import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Search, Users } from 'lucide-react';
import axios from 'axios';
import { fetchUserProfile, fetchUserAnalysis } from '../api';

const DeveloperBattle = () => {
    const [username1, setUsername1] = useState('');
    const [username2, setUsername2] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [battleData, setBattleData] = useState(null);

    const handleBattle = async (e) => {
        e.preventDefault();
        if (!username1.trim() || !username2.trim()) return;

        setIsLoading(true);
        setError(null);
        setBattleData(null);

        try {
            // Fetch both profiles and their analysis concurrently
            const [profile1, profile2, analysis1, analysis2] = await Promise.all([
                fetchUserProfile(username1),
                fetchUserProfile(username2),
                fetchUserAnalysis(username1),
                fetchUserAnalysis(username2),
            ]);

            setBattleData({
                dev1: { profile: profile1, analysis: analysis1 },
                dev2: { profile: profile2, analysis: analysis2 }
            });
        } catch (err) {
            console.error('Battle failed:', err);
            setError('Failed to fetch data for one or both users. Make sure both usernames are valid.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderWinnerHighlight = (val1, val2) => {
        if (val1 > val2) return "text-emerald-600 font-bold bg-emerald-50";
        if (val2 > val1) return "text-slate-500";
        return "text-slate-600 font-medium";
    };

    const renderWinnerHighlightDev2 = (val1, val2) => {
        if (val2 > val1) return "text-emerald-600 font-bold bg-emerald-50";
        if (val1 > val2) return "text-slate-500";
        return "text-slate-600 font-medium";
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="subtle-border p-6 flex flex-col mt-6 bg-slate-800"
        >
            <div className="flex flex-col items-center mb-8 text-center pt-4">
                <div className="bg-slate-700 p-4 rounded-full mb-4 shadow-lg border border-slate-600">
                    <Swords size={32} className="text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                    Developer Battle
                </h3>
                <p className="text-slate-400 max-w-lg">
                    Enter two GitHub usernames to compare their stats, languages, and Developer Ranks head-to-head.
                </p>
            </div>

            <form onSubmit={handleBattle} className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto w-full mb-8">
                <input
                    type="text"
                    value={username1}
                    onChange={(e) => setUsername1(e.target.value)}
                    placeholder="Enter Username 1..."
                    className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-slate-500"
                    required
                />
                <div className="flex items-center justify-center font-bold text-slate-500">VS</div>
                <input
                    type="text"
                    value={username2}
                    onChange={(e) => setUsername2(e.target.value)}
                    placeholder="Enter Username 2..."
                    className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-slate-500"
                    required
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                >
                    {isLoading ? 'FIGHTING...' : 'BATTLE!'}
                </button>
            </form>

            <AnimatePresence mode="wait">
                {error && (
                    <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-400 bg-red-400/10 p-4 rounded-xl text-center max-w-2xl mx-auto border border-red-500/20">
                        {error}
                    </motion.div>
                )}

                {battleData && !isLoading && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="w-full"
                    >
                        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                            <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 text-sm md:text-base">
                                {/* Dev 1 Header */}
                                <div className="p-6 flex flex-col items-center text-center bg-slate-50">
                                    <img src={battleData.dev1.profile.avatar_url} alt="Dev 1" className="w-20 h-20 rounded-full border-4 border-white shadow-md mb-3" />
                                    <h4 className="font-bold text-slate-800 text-lg">{battleData.dev1.profile.login}</h4>
                                    <p className="text-indigo-600 font-medium text-sm mt-1">{battleData.dev1.analysis?.reputation?.title}</p>
                                </div>

                                <div className="p-6 flex items-center justify-center bg-white font-bold text-slate-300 tracking-widest uppercase">
                                    Metrics
                                </div>

                                <div className="p-6 flex flex-col items-center text-center bg-slate-50">
                                    <img src={battleData.dev2.profile.avatar_url} alt="Dev 2" className="w-20 h-20 rounded-full border-4 border-white shadow-md mb-3" />
                                    <h4 className="font-bold text-slate-800 text-lg">{battleData.dev2.profile.login}</h4>
                                    <p className="text-indigo-600 font-medium text-sm mt-1">{battleData.dev2.analysis?.reputation?.title}</p>
                                </div>
                            </div>

                            {/* Stat Rows */}
                            <div className="divide-y divide-slate-100">
                                {[
                                    { label: 'Developer Score', v1: battleData.dev1.analysis?.developerScore || 0, v2: battleData.dev2.analysis?.developerScore || 0 },
                                    { label: 'Total Repositories', v1: battleData.dev1.analysis?.repositoryActivity?.totalRepositories || 0, v2: battleData.dev2.analysis?.repositoryActivity?.totalRepositories || 0 },
                                    { label: 'Total Stars', v1: battleData.dev1.analysis?.repositoryActivity?.totalStars || 0, v2: battleData.dev2.analysis?.repositoryActivity?.totalStars || 0 },
                                    { label: 'Followers', v1: battleData.dev1.profile?.followers || 0, v2: battleData.dev2.profile?.followers || 0 },
                                    { label: 'Top Language', v1: battleData.dev1.analysis?.languageDistribution?.[0]?.language || 'N/A', v2: battleData.dev2.analysis?.languageDistribution?.[0]?.language || 'N/A', isText: true }
                                ].map((stat, i) => (
                                    <div key={i} className="grid grid-cols-3 divide-x divide-slate-100">
                                        <div className={`p-4 text-center ${!stat.isText ? renderWinnerHighlight(stat.v1, stat.v2) : 'text-slate-600'}`}>
                                            {stat.v1}
                                        </div>
                                        <div className="p-4 flex items-center justify-center text-xs md:text-sm font-semibold text-slate-400 uppercase tracking-wider bg-slate-50">
                                            {stat.label}
                                        </div>
                                        <div className={`p-4 text-center ${!stat.isText ? renderWinnerHighlightDev2(stat.v1, stat.v2) : 'text-slate-600'}`}>
                                            {stat.v2}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-slate-900 p-6 text-center text-white">
                                <h4 className="text-3xl font-black mb-2 flex items-center justify-center gap-3">
                                    <Swords className="text-amber-500" />
                                    {battleData.dev1.analysis.developerScore > battleData.dev2.analysis.developerScore
                                        ? `${battleData.dev1.profile.login} WINS! 🎉`
                                        : battleData.dev2.analysis.developerScore > battleData.dev1.analysis.developerScore
                                            ? `${battleData.dev2.profile.login} WINS! 🎉`
                                            : `IT'S A TIE! 🤝`}
                                    <Swords className="text-amber-500" />
                                </h4>
                                <p className="text-slate-400">Determined by their overall Developer Score</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default DeveloperBattle;
