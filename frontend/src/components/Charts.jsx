import React from 'react';
import { Doughnut, Bar, Radar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler
);

const CHART_COLORS = [
    '#4f46e5', // Indigo 600
    '#9333ea', // Purple 600
    '#db2777', // Pink 600
    '#dc2626', // Red 600
    '#d97706', // Amber 600
    '#059669', // Emerald 600
    '#2563eb', // Blue 600
    '#475569', // Slate 600
];

export const LanguageChart = ({ languageData }) => {
    if (!languageData || languageData.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-slate-400">
                No language data available
            </div>
        );
    }

    const topLanguages = languageData.slice(0, 5);
    const otherLanguagesBytes = languageData.slice(5).reduce((acc, lang) => acc + lang.bytes, 0);

    const labels = topLanguages.map(l => l.language);
    const dataValues = topLanguages.map(l => l.percentage);

    if (otherLanguagesBytes > 0) {
        labels.push('Others');
    }

    const data = {
        labels: topLanguages.map(l => l.language),
        datasets: [
            {
                data: topLanguages.map(l => l.percentage),
                backgroundColor: CHART_COLORS.slice(0, topLanguages.length),
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverOffset: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: '#475569', // slate-600
                    font: {
                        family: "'Inter', sans-serif",
                        size: 13,
                        weight: '500'
                    },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#0f172a',
                bodyColor: '#475569',
                padding: 12,
                borderColor: '#e2e8f0',
                borderWidth: 1,
                titleFont: { weight: 'bold' },
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                callbacks: {
                    label: function (context) {
                        return ` ${context.label}: ${context.raw}%`;
                    }
                }
            },
        },
        cutout: '70%',
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="subtle-border p-6 h-full flex flex-col"
        >
            <h3 className="text-xl font-bold text-slate-800 mb-6">Language Distribution</h3>
            <div className="flex-1 relative min-h-[250px]">
                <Doughnut data={data} options={options} />
            </div>
        </motion.div>
    );
};

export const ActivityChart = ({ commitFrequency }) => {
    if (!commitFrequency || commitFrequency.length === 0) return null;

    const data = {
        labels: commitFrequency.map(c => c.label),
        datasets: [
            {
                label: 'Commits',
                data: commitFrequency.map(c => c.value),
                backgroundColor: 'rgba(79, 70, 229, 0.9)', // Indigo 600
                borderColor: '#4f46e5',
                borderWidth: 1,
                borderRadius: 4,
                barThickness: 'flex',
                maxBarThickness: 40,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#0f172a',
                bodyColor: '#475569',
                padding: 12,
                borderColor: '#e2e8f0',
                borderWidth: 1,
                displayColors: false,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f1f5f9', // slate-100
                    drawBorder: false,
                },
                ticks: {
                    color: '#64748b', // slate-500
                    font: {
                        family: "'Inter', sans-serif",
                        weight: '500'
                    }
                }
            },
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    color: '#64748b', // slate-500
                    font: {
                        family: "'Inter', sans-serif",
                        weight: '500'
                    }
                }
            }
        },
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="subtle-border p-6 h-full flex flex-col"
        >
            <h3 className="text-xl font-bold text-slate-800 mb-6">Recent Activity</h3>
            <div className="flex-1 min-h-[250px]">
                <Bar data={data} options={options} />
            </div>
        </motion.div>
    );
};

export const SkillRadarChart = ({ skillsRadar }) => {
    if (!skillsRadar || skillsRadar.length === 0) return null;

    const data = {
        labels: skillsRadar.map(s => s.subject),
        datasets: [
            {
                label: 'Skill Emphasis',
                data: skillsRadar.map(s => s.score),
                backgroundColor: 'rgba(99, 102, 241, 0.2)', // Indigo 500
                borderColor: 'rgba(99, 102, 241, 0.8)',
                pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#0f172a',
                bodyColor: '#475569',
                padding: 12,
                borderColor: '#e2e8f0',
                borderWidth: 1,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
        },
        scales: {
            r: {
                angleLines: { color: '#e2e8f0' },
                grid: { color: '#f1f5f9' },
                pointLabels: {
                    color: '#64748b',
                    font: { family: "'Inter', sans-serif", weight: '500' }
                },
                ticks: {
                    display: false,
                    min: 0,
                    max: 100,
                    stepSize: 20
                }
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="subtle-border p-6 h-full flex flex-col"
        >
            <h3 className="text-xl font-bold text-slate-800 mb-6">Developer Skill Area</h3>
            <div className="flex-1 relative min-h-[250px]">
                <Radar data={data} options={options} />
            </div>
        </motion.div>
    );
};

export const GrowthTimelineChart = ({ growthTimeline }) => {
    if (!growthTimeline || growthTimeline.length === 0) return null;

    const data = {
        labels: growthTimeline.map(g => g.year),
        datasets: [
            {
                label: 'Simulated Growth Matrix',
                data: growthTimeline.map(g => g.commits),
                // Smooth line using filler
                fill: true,
                backgroundColor: 'rgba(5, 150, 105, 0.05)', // Emerald 600
                borderColor: '#059669',
                tension: 0.4,
                pointBackgroundColor: '#059669',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#0f172a',
                bodyColor: '#475569',
                padding: 12,
                borderColor: '#e2e8f0',
                borderWidth: 1,
                displayColors: false,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f1f5f9',
                    drawBorder: false,
                },
                ticks: {
                    color: '#64748b',
                    font: { family: "'Inter', sans-serif", weight: '500' }
                }
            },
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    color: '#64748b',
                    font: { family: "'Inter', sans-serif", weight: '500' }
                }
            }
        },
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="subtle-border p-6 h-full flex flex-col"
        >
            <h3 className="text-xl font-bold text-slate-800 mb-6">Growth Timeline</h3>
            <div className="flex-1 min-h-[250px]">
                <Line data={data} options={options} />
            </div>
        </motion.div>
    );
};
