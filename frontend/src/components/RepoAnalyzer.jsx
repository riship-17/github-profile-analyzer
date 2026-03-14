import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitMerge, FileCode2, HardDrive, ListTree, Sparkles, ChevronDown } from 'lucide-react';
import axios from 'axios';

const RepoAnalyzer = ({ username, repositories }) => {
    const [selectedRepo, setSelectedRepo] = useState('');
    const [repoDetails, setRepoDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // AI State
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);

    // Sort repos by stars descending to put best ones at the top of the dropdown
    const sortedRepos = [...(repositories || [])].sort((a, b) => b.stargazers_count - a.stargazers_count);

    const fetchRepoDetails = async (repoName) => {
        if (!repoName) return;
        setIsLoading(true);
        setError(null);
        setAiAnalysis(null);

        try {
            const { data } = await axios.get(`http://localhost:5001/api/repo-details/${username}/${repoName}`);
            setRepoDetails(data);
            generateAiCodebaseAnalysis(data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch detailed repository analytics.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectChange = (e) => {
        const repoName = e.target.value;
        setSelectedRepo(repoName);
        if (repoName) {
            fetchRepoDetails(repoName);
        } else {
            setRepoDetails(null);
            setAiAnalysis(null);
        }
    };

    const generateAiCodebaseAnalysis = async (details) => {
        if (!window.puter) {
            setAiError('AI Engine unavailable.');
            return;
        }

        setIsAiLoading(true);
        setAiError(null);

        // We map out the top files to give the AI context of what this project actually *is*
        const fileNames = details.tree.slice(0, 30).map(item => item.path).join(', ');

        const prompt = `Analyze this GitHub repository metadata and provide a short technical review. This is for an "AI Codebase Analyzer" feature. 
Repo Name: ${details.meta.name}
Description: ${details.meta.description || 'None'}
Primary Language: ${details.meta.language}
File Count: ${details.metrics.fileCount}
Approximate Files List: ${fileNames}

Provide your response strictly as a JSON array with exactly two elements:
[
  "A short 1-2 sentence summary evaluating the architecture or tech stack based on the file extensions",
  "Exactly 2 bullet points suggesting concrete improvements (e.g., adding tests if missing, adding a CI/CD pipeline, modularizing)"
]
Ensure the output is perfectly valid JSON. Do not use markdown backticks.`;

        try {
            const response = await window.puter.ai.chat(prompt);
            try {
                const cleanedResponse = response?.message?.content.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
                const result = JSON.parse(cleanedResponse);
                setAiAnalysis(result);
            } catch (e) {
                console.error("AI parse error:", response?.message?.content);
                setAiAnalysis(["Analysis completed, but format was unexpected.", "Review your repository structure.", "Consider adding standard configuration files."]);
            }
        } catch (err) {
            console.error(err);
            if (err?.error?.code === 'too_many_requests' || err?.status === 429 || err?.message?.includes('429')) {
                setAiError('AI quota exceeded (Too Many Requests). Please wait a few seconds and try again.');
            } else {
                setAiError('Failed to analyze codebase.');
            }
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="subtle-border p-6 flex flex-col mt-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <ListTree className="text-indigo-500" /> Deep Repository Insights
                </h3>
            </div>

            <div className="relative mb-8">
                <select
                    value={selectedRepo}
                    onChange={handleSelectChange}
                    className="w-full appearance-none bg-white border border-slate-300 text-slate-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                >
                    <option value="">Select a repository to analyze...</option>
                    {sortedRepos.filter(r => !r.fork).map(repo => (
                        <option key={repo.id} value={repo.name}>
                            {repo.name} ({repo.stargazers_count} ★)
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <ChevronDown size={16} />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {isLoading && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    </motion.div>
                )}

                {error && (
                    <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">
                        {error}
                    </motion.div>
                )}

                {repoDetails && !isLoading && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        {/* Quality Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-1"><FileCode2 size={14} /> File Count</div>
                                <div className="text-2xl font-bold text-slate-800">{repoDetails.metrics.fileCount}</div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-1"><HardDrive size={14} /> Size (KB)</div>
                                <div className="text-2xl font-bold text-slate-800">{Math.round(repoDetails.metrics.totalSizeBytes / 1024)}</div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-1"><GitMerge size={14} /> Complexity</div>
                                <div className="text-2xl font-bold text-slate-800">{repoDetails.metrics.complexityScore}/10</div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-1"> README</div>
                                <div className="text-2xl font-bold text-slate-800">{repoDetails.readme.length > 500 ? 'Detailed' : repoDetails.readme.length > 0 ? 'Basic' : 'Missing'}</div>
                            </div>
                        </div>

                        {/* AI Codebase Analyzer */}
                        <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100 relative overflow-hidden text-sm md:text-base">
                            <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                                <Sparkles className="text-indigo-500" size={18} /> AI Codebase Review
                            </h4>
                            {isAiLoading ? (
                                <div className="flex items-center gap-3 text-indigo-600">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                                    Scanning repository architecture...
                                </div>
                            ) : aiError ? (
                                <div className="text-red-500">{aiError}</div>
                            ) : aiAnalysis && aiAnalysis.length >= 2 ? (
                                <div className="space-y-4">
                                    <p className="text-indigo-900 font-medium leading-relaxed">
                                        {aiAnalysis[0]}
                                    </p>
                                    <div className="bg-white/60 p-4 rounded-lg border border-indigo-100/50">
                                        <h5 className="font-semibold text-indigo-800 mb-2">Suggested Improvements:</h5>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-700">
                                            {aiAnalysis[1].split('\n').filter(Boolean).map((bullet, i) => (
                                                <li key={i}>{bullet.replace(/^[-\*]\s*/, '')}</li>
                                            ))}
                                            {/* Fallback if it didn't send a single string with newlines */}
                                            {typeof aiAnalysis[1] === 'string' && !aiAnalysis[1].includes('\n') && (
                                                <li>{aiAnalysis[1].replace(/^[-\*]\s*/, '')}</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default RepoAnalyzer;
