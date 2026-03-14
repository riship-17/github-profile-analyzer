import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import ProfileHeader from '../components/ProfileHeader';
import StatCard from '../components/StatCard';
import { LanguageChart, ActivityChart, SkillRadarChart, GrowthTimelineChart } from '../components/Charts';
import AiInsights from '../components/AiInsights';
import RepoAnalyzer from '../components/RepoAnalyzer';
import ResumeGenerator from '../components/ResumeGenerator';
import OpenSourceFinder from '../components/OpenSourceFinder';
import DeveloperBattle from '../components/DeveloperBattle';
import { fetchUserProfile, fetchUserAnalysis } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { BookMarked, Star, GitFork, Award, Github } from 'lucide-react';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);
    const [analysis, setAnalysis] = useState(null);

    const handleSearch = async (username) => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch both profile and analysis concurrently
            const [profileData, analysisData] = await Promise.all([
                fetchUserProfile(username),
                fetchUserAnalysis(username)
            ]);

            setProfile(profileData);
            setAnalysis(analysisData);

        } catch (err) {
            console.error(err);
            const backendError = err.response?.data;
            setError(backendError || 'Failed to fetch user data. Please try again.');
            setProfile(null);
            setAnalysis(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-slate-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                            <Github size={32} className="text-slate-700" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                GitHub Profile Analyzer
                            </h1>
                            <p className="text-slate-500 text-sm">
                                Clean, minimal insights into developer activity and language diversity.
                            </p>
                        </div>
                    </div>
                </motion.div>

                <SearchBar onSearch={handleSearch} isLoading={isLoading} />

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="max-w-4xl bg-white border-l-4 border-red-500 shadow-sm p-6 rounded-xl mb-8 flex items-start gap-4"
                        >
                            <div className="p-2 bg-red-50 rounded-lg shrink-0">
                                <Award size={20} className="text-red-500" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-900 mb-1">
                                    {typeof error === 'string' ? 'An error occurred' : error.error}
                                </h4>
                                <p className="text-slate-600 text-sm mb-3">
                                    {typeof error === 'string' ? error : error.details}
                                </p>
                                {error.suggestion && (
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">How to fix:</p>
                                        <p className="text-slate-700 text-sm leading-relaxed">{error.suggestion}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {profile && analysis && (
                        <motion.div
                            key="dashboard-content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-8"
                        >
                            <ProfileHeader profile={profile} />

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="subtle-border p-6 relative overflow-hidden group bg-gradient-to-br from-indigo-600 to-purple-700 text-white"
                                >
                                    <div className="absolute -right-6 -top-6 text-white/10 group-hover:text-white/20 transition-all duration-500 transform group-hover:scale-110">
                                        <Award size={120} />
                                    </div>
                                    <div className="relative z-10 flex flex-col h-full justify-between">
                                        <div>
                                            <p className="text-indigo-100 font-medium text-sm mb-1 line-clamp-1">{analysis.reputation?.title || 'Developer Score'}</p>
                                            <h3 className="text-3xl font-bold text-white mb-2">
                                                Top {analysis.reputation?.rankPercentile || '...'}
                                            </h3>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                                            <span className="text-sm text-indigo-100">Score: {analysis.developerScore}/100</span>
                                            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                                                <Award size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                                <StatCard
                                    title="Repositories"
                                    value={analysis.repositoryActivity.totalRepositories}
                                    icon={BookMarked}
                                    delay={0.2}
                                />
                                <StatCard
                                    title="Total Stars"
                                    value={analysis.repositoryActivity.totalStars}
                                    icon={Star}
                                    delay={0.3}
                                />
                                <StatCard
                                    title="Estimated Commits"
                                    value={analysis.commitAnalytics.totalCommits}
                                    icon={GitFork}
                                    delay={0.4}
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <LanguageChart languageData={analysis.languageDistribution} />
                                <ActivityChart commitFrequency={analysis.commitAnalytics.commitFrequency} />
                                <SkillRadarChart skillsRadar={analysis.skillsRadar} />
                                <GrowthTimelineChart growthTimeline={analysis.growthTimeline} />
                            </div>

                            <RepoAnalyzer username={profile.login} repositories={analysis.repositoryActivity.allRepositoriesData || []} />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                                <OpenSourceFinder analysis={analysis} />
                                <ResumeGenerator profile={profile} analysis={analysis} />
                            </div>

                            <AiInsights profile={profile} analysis={analysis} />

                            <DeveloperBattle />

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Dashboard;
