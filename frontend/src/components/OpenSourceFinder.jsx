import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ExternalLink, GitPullRequest } from 'lucide-react';
import axios from 'axios';

const OpenSourceFinder = ({ analysis }) => {
    const [issues, setIssues] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    const findIssues = async () => {
        setIsLoading(true);
        setError(null);
        setHasSearched(true);

        // Grab top 2 languages to search for
        const topLangs = analysis.languageDistribution.slice(0, 2).map(l => l.language);
        if (topLangs.length === 0) {
            setError("No primary languages found to search by.");
            setIsLoading(false);
            return;
        }

        try {
            // Build GitHub Search API query for "good first issues" in the user's top language
            const query = `label:"good first issue" language:${encodeURIComponent(topLangs[0])} state:open stars:>50`;
            const { data } = await axios.get(`https://api.github.com/search/issues?q=${query}&sort=updated&order=desc&per_page=5`);

            setIssues(data.items || []);
        } catch (err) {
            console.error('Failed to fetch OS issues', err);
            setError('Failed to query GitHub for open source issues. API limit may be reached.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="subtle-border p-6 flex flex-col mt-6"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <GitPullRequest className="text-emerald-500" /> Open Source Matcher
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Find beginner-friendly "good first issues" based on your top language ({analysis.languageDistribution[0]?.language || 'N/A'}).
                    </p>
                </div>
                {!hasSearched && !isLoading && (
                    <button
                        onClick={findIssues}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2 shadow-sm whitespace-nowrap"
                    >
                        <Search size={16} /> Find Issues
                    </button>
                )}
            </div>

            {isLoading && (
                <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                </div>
            )}

            {error && (
                <div className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-100 text-sm">
                    {error}
                </div>
            )}

            {hasSearched && !isLoading && !error && issues.length === 0 && (
                <div className="text-center py-6 text-slate-500">
                    No relevant easy issues found at the moment. Try again later!
                </div>
            )}

            {issues.length > 0 && (
                <div className="space-y-3">
                    {issues.map(issue => (
                        <a
                            key={issue.id}
                            href={issue.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-4 border border-slate-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all group bg-white"
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h4 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-1">{issue.title}</h4>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {issue.repository_url.replace('https://api.github.com/repos/', '')} • #{issue.number}
                                    </p>
                                </div>
                                <ExternalLink size={16} className="text-slate-400 group-hover:text-emerald-500 shrink-0" />
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default OpenSourceFinder;
