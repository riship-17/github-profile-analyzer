import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, UserCircle2 } from 'lucide-react';

const AiInsights = ({ profile, analysis }) => {
    const [activeTab, setActiveTab] = useState('career'); // 'career', 'roast', 'personality'

    // States for caching AI responses so we don't refetch on tab switch
    const [aiResponses, setAiResponses] = useState({
        career: null,
        roast: null,
        personality: null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch initial career advice on mount
    useEffect(() => {
        if (profile && analysis && !aiResponses.career) {
            handleGenerate('career');
        }
    }, [profile, analysis]);

    const handleGenerate = async (type) => {
        // If we already have the response for this tab, just switch to it (no refetch)
        if (aiResponses[type]) {
            setActiveTab(type);
            return;
        }

        if (!window.puter) {
            setError('Puter.js not loaded.');
            return;
        }

        setActiveTab(type);
        setIsLoading(true);
        setError(null);

        const baseContext = `
Name: ${profile.name || profile.login}
Bio: ${profile.bio || 'None'}
Followers: ${profile.followers}
Total Repos: ${analysis.repositoryActivity.totalRepositories}
Total Stars: ${analysis.repositoryActivity.totalStars}
Developer Score: ${analysis.developerScore}
Top Language: ${analysis.languageDistribution[0]?.language || 'None'}
`;

        let prompt = '';
        if (type === 'career') {
            prompt = `Analyze this GitHub developer and provide exactly 3 short, actionable tips (1-2 sentences each) to improve their performance, profile, or skills.
${baseContext}
Return ONLY a perfectly valid JSON array of strings. Do not use markdown backticks. Example: ["tip 1", "tip 2", "tip 3"]`;
        } else if (type === 'roast') {
            prompt = `You are a sarcastic, ruthless, but hilarious senior developer. Roast this GitHub profile based on their stats. Be funny and brutal, but keep it clean (no extreme profanity). Mention their top language and repo count if relevant.
${baseContext}
Return ONLY a perfectly valid JSON array containing exactly 1 string (the roast paragraph). Do not use markdown backticks. Example: ["Your roast text here."]`;
        } else if (type === 'personality') {
            prompt = `Analyze this developer's GitHub stats and assign them a "Developer Personality Type" (e.g., "The Perfectionist", "The Copy-Paster", "The Weekend Warrior", "The 10x Engineer"). 
${baseContext}
Provide a short, fun explanation of WHY they have this personality type.
Return ONLY a perfectly valid JSON array containing exactly 2 strings: [ "The Personality Title", "The explanation paragraph" ]. Do not use markdown backticks.`;
        }

        try {
            const response = await window.puter.ai.chat(prompt);
            let resultData = [];

            try {
                const cleanedResponse = response?.message?.content.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
                resultData = JSON.parse(cleanedResponse);
            } catch (parseError) {
                console.error('Failed to parse AI response:', response?.message?.content);
                throw new Error("AI returned invalid format");
            }

            setAiResponses(prev => ({
                ...prev,
                [type]: resultData
            }));

        } catch (err) {
            console.error(`AI Error (${type}):`, err);
            if (err?.error?.code === 'too_many_requests' || err?.status === 429 || err?.message?.includes('429')) {
                setError('AI quota exceeded. Please wait a few seconds.');
            } else {
                setError(`Failed to generate ${type} insight.`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="subtle-border overflow-hidden"
        >
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-wrap gap-2">
                <button
                    onClick={() => handleGenerate('career')}
                    disabled={isLoading && activeTab !== 'career'}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'career' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                >
                    <Sparkles size={18} className={activeTab === 'career' ? 'text-indigo-200' : 'text-indigo-500'} />
                    Career Advice
                </button>
                <button
                    onClick={() => handleGenerate('roast')}
                    disabled={isLoading && activeTab !== 'roast'}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'roast' ? 'bg-rose-500 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                >
                    <Flame size={18} className={activeTab === 'roast' ? 'text-rose-200' : 'text-rose-500'} />
                    Roast Me
                </button>
                <button
                    onClick={() => handleGenerate('personality')}
                    disabled={isLoading && activeTab !== 'personality'}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'personality' ? 'bg-purple-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                >
                    <UserCircle2 size={18} className={activeTab === 'personality' ? 'text-purple-200' : 'text-purple-500'} />
                    Personality Type
                </button>
            </div>

            <div className="p-8 min-h-[200px]">
                {isLoading && !aiResponses[activeTab] ? (
                    <div className="flex justify-center items-center h-full py-8">
                        <div className="flex flex-col items-center gap-4 text-indigo-500">
                            <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-sm font-medium">Generating AI Insights...</span>
                        </div>
                    </div>
                ) : error && activeTab === 'career' && !aiResponses.career ? (
                    <div className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-100 text-sm">
                        {error}
                    </div>
                ) : (
                    <div className="h-full">
                        {activeTab === 'career' && aiResponses.career && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-slate-800 mb-4 ">Actionable Suggestions</h3>
                                {aiResponses.career.map((suggestion, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.1 * index }}
                                        className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-4 items-start"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="text-slate-600 text-xs font-medium">{index + 1}</span>
                                        </div>
                                        <p className="text-slate-600">{suggestion}</p>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'roast' && aiResponses.roast && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-6 bg-rose-50 rounded-xl border border-rose-100"
                            >
                                <h3 className="text-xl font-bold text-rose-800 mb-4 flex items-center gap-2">
                                    <Flame className="text-rose-500" /> Brutal AI Roast
                                </h3>
                                <p className="text-rose-900 text-lg leading-relaxed italic">
                                    "{aiResponses.roast[0]}"
                                </p>
                            </motion.div>
                        )}

                        {activeTab === 'personality' && aiResponses.personality && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-6 bg-purple-50 rounded-xl border border-purple-100 text-center"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-200 text-purple-600 mb-4">
                                    <UserCircle2 size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-purple-900 mb-2">
                                    {aiResponses.personality[0]}
                                </h3>
                                <p className="text-purple-800 text-lg max-w-2xl mx-auto leading-relaxed">
                                    {aiResponses.personality[1]}
                                </p>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AiInsights;
