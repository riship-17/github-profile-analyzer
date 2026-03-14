import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, FileDown, Upload, Trash2, Edit3, Settings, Eye, X, Code } from 'lucide-react';
import { marked } from 'marked';
import html2pdf from 'html2pdf.js';

// Defined outside the component so React doesn't recreate it on every render
const PDFPreviewModal = ({ show, onClose, html }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden"
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Eye size={20} className="text-indigo-500" /> Resume PDF Preview
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 bg-slate-100 p-4 md:p-8 overflow-y-auto custom-scrollbar flex justify-center">
                    <div className="bg-white shadow-lg w-full max-w-[850px] min-h-[1100px]">
                        <iframe
                            title="Resume Preview"
                            srcDoc={html}
                            style={{ width: '850px', height: '1100px', border: 'none', transform: 'scale(1)', transformOrigin: 'top center' }}
                            className="max-w-full mx-auto shadow-sm"
                        />
                    </div>
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
                        Close Preview
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const Field = ({ label, value, onChange, placeholder, type = 'text', hint }) => (
    <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">{label}</label>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
        {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
    </div>
);

const ResumeConfigurationForm = ({
    email, setEmail, phone, setPhone, linkedIn, setLinkedIn, leetcode, setLeetcode,
    universityName, setUniversityName, universityLocation, setUniversityLocation,
    degree, setDegree, gradYears, setGradYears, collegeMarks, setCollegeMarks,
    highSchoolName, setHighSchoolName, highSchoolBoard, setHighSchoolBoard,
    highSchoolYear, setHighSchoolYear, highSchoolMarks, setHighSchoolMarks,
    skills, setSkills, customAchievements, setCustomAchievements,
    photoDataUri, setPhotoDataUri, handlePhotoUpload,
    allRepos, selectedRepoIds, toggleRepoSelection,
    error, setShowForm, generateResume
}) => (
    <motion.div key="resume-form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        {/* Section 1: Contact Info */}
        <div>
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs flex items-center justify-center font-bold">1</span>
                Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com" type="email" />
                <Field label="Phone Number" value={phone} onChange={setPhone} placeholder="+91 98765 43210" />
                <Field label="LinkedIn URL" value={linkedIn} onChange={setLinkedIn} placeholder="linkedin.com/in/yourname" hint="Paste full URL or just the profile path" />
                <Field label="LeetCode URL" value={leetcode} onChange={setLeetcode} placeholder="leetcode.com/yourname" hint="Optional" />
            </div>
        </div>

        <hr className="border-slate-100" />

        {/* Section 2: Education */}
        <div>
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs flex items-center justify-center font-bold">2</span>
                Education
            </h4>
            <p className="text-xs text-slate-400 mb-3">Leave any field blank to omit it from your resume completely.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="University / College Name" value={universityName} onChange={setUniversityName} placeholder="e.g. SVIT, Vadodara" />
                <Field label="Location" value={universityLocation} onChange={setUniversityLocation} placeholder="e.g. Gujarat, India" />
                <Field label="Degree / Course" value={degree} onChange={setDegree} placeholder="e.g. B.Tech in Computer Engineering" />
                <Field label="Years" value={gradYears} onChange={setGradYears} placeholder="e.g. Aug 2021 – May 2025" />
                <Field label="CGPA / Marks" value={collegeMarks} onChange={setCollegeMarks} placeholder="e.g. 8.5/10 or 78%" />
            </div>
            <div className="mt-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">High School (Optional)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="School Name" value={highSchoolName} onChange={setHighSchoolName} placeholder="e.g. St. Xavier's School" />
                    <Field label="Board" value={highSchoolBoard} onChange={setHighSchoolBoard} placeholder="e.g. CBSE or Gujarat Board" />
                    <Field label="Year of Passing" value={highSchoolYear} onChange={setHighSchoolYear} placeholder="e.g. 2021" />
                    <Field label="Marks / Percentage" value={highSchoolMarks} onChange={setHighSchoolMarks} placeholder="e.g. 92% or 87%" />
                </div>
            </div>
        </div>

        <hr className="border-slate-100" />

        {/* Section 3: Skills */}
        <div>
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs flex items-center justify-center font-bold">3</span>
                Technical Skills
            </h4>
            <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Skills (comma separated)</label>
            <textarea
                rows="2"
                value={skills}
                onChange={e => setSkills(e.target.value)}
                placeholder="e.g. JavaScript, Python, React, Node.js, MongoDB, Docker, AWS"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
            />
            <p className="text-xs text-slate-400 mt-1">Pre-filled from your GitHub languages. Add or remove as needed.</p>
        </div>

        <hr className="border-slate-100" />

        {/* Section 4: Achievements */}
        <div>
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-1 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs flex items-center justify-center font-bold">4</span>
                Achievements <span className="text-slate-400 font-normal normal-case">(Optional)</span>
            </h4>
            <p className="text-xs text-slate-400 mb-2">Leave blank to skip this section entirely.</p>
            <textarea
                rows="3"
                placeholder="e.g. 1st place at XYZ Hackathon, Google DSC Lead, Published research paper on..."
                value={customAchievements}
                onChange={e => setCustomAchievements(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
            />
        </div>

        <hr className="border-slate-100" />

        {/* Section 5: Photo */}
        <div>
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs flex items-center justify-center font-bold">5</span>
                Profile Photo <span className="text-slate-400 font-normal normal-case">(Optional)</span>
            </h4>
            <div className="flex items-center gap-4">
                {photoDataUri ? (
                    <div className="relative shrink-0">
                        <img src={photoDataUri} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-slate-200" />
                        <button onClick={() => setPhotoDataUri(null)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                            <Trash2 size={10} />
                        </button>
                    </div>
                ) : (
                    <label className="flex items-center justify-center w-40 h-14 border-2 border-slate-200 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors shrink-0">
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Upload size={16} /> Upload
                        </div>
                        <input type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handlePhotoUpload} />
                    </label>
                )}
                <p className="text-xs text-slate-400">Max 2MB. PNG or JPG. Will appear at the top of your resume.</p>
            </div>
        </div>

        <hr className="border-slate-100" />

        {/* Section 6: Project Selection */}
        <div>
            <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs flex items-center justify-center font-bold">6</span>
                    Select Projects ({selectedRepoIds.size}/5)
                </h4>
                <span className="text-xs text-slate-400">Top 3 will be used in resume</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto custom-scrollbar pr-2 p-1">
                {allRepos.map(repo => (
                    <div
                        key={repo.id}
                        onClick={() => toggleRepoSelection(repo.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all flex items-start gap-3 ${selectedRepoIds.has(repo.id) ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                        <div className={`mt-0.5 min-w-[16px] h-4 w-4 rounded border flex items-center justify-center shrink-0 ${selectedRepoIds.has(repo.id) ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`}>
                            {selectedRepoIds.has(repo.id) && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                        <div>
                            <p className="font-medium text-slate-800 text-sm leading-tight">{repo.name}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                <span>⭐ {repo.stargazers_count}</span>
                                {repo.language && <><span className="w-1.5 h-1.5 rounded-full bg-slate-300" /><span>{repo.language}</span></>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {error && <p className="text-red-500 text-sm font-medium bg-red-50 px-4 py-2 rounded-lg">{error}</p>}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg font-medium text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                Cancel
            </button>
            <button
                onClick={generateResume}
                disabled={selectedRepoIds.size === 0}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2 shadow-sm"
            >
                <FileText size={16} /> Generate Resume
            </button>
        </div>
    </motion.div>
);

const ResumeGenerator = ({ profile, analysis }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isGeneratingLatex, setIsGeneratingLatex] = useState(false);
    const [resumeData, setResumeData] = useState(null);
    const [error, setError] = useState(null);
    const [showPdfPreview, setShowPdfPreview] = useState(false);
    const [copied, setCopied] = useState(false);
    const [structuredJson, setStructuredJson] = useState(null);
    const printRef = useRef(null);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [atsScore, setAtsScore] = useState(null);

    // --- Contact Info ---
    const [email, setEmail] = useState('john.doe@example.com');
    const [phone, setPhone] = useState('+1 (555) 123-4567');
    const [linkedIn, setLinkedIn] = useState('https://linkedin.com/in/johndoe');
    const [leetcode, setLeetcode] = useState('https://leetcode.com/johndoe');

    // --- Education ---
    const [universityName, setUniversityName] = useState('Stanford University');
    const [universityLocation, setUniversityLocation] = useState('Stanford, CA');
    const [degree, setDegree] = useState('B.S. in Computer Science');
    const [gradYears, setGradYears] = useState('2020 - 2024');
    const [collegeMarks, setCollegeMarks] = useState('3.9/4.0');
    const [highSchoolName, setHighSchoolName] = useState('Lincoln High School');
    const [highSchoolBoard, setHighSchoolBoard] = useState('State Board');
    const [highSchoolYear, setHighSchoolYear] = useState('2016 - 2020');
    const [highSchoolMarks, setHighSchoolMarks] = useState('98%');

    // --- Skills & Achievements ---
    const [skills, setSkills] = useState('React, Node.js, Python, PostgreSQL, Docker, AWS');
    const [customAchievements, setCustomAchievements] = useState('1st Place in Global AI Hackathon\\nPublished a paper on Distributed Systems');

    // --- Photo & Projects ---
    const [photoDataUri, setPhotoDataUri] = useState(null);
    const [selectedRepoIds, setSelectedRepoIds] = useState(new Set());

    // Prefill defaults from GitHub profile
    useEffect(() => {
        if (analysis?.languageDistribution) {
            const topLangs = analysis.languageDistribution.slice(0, 8).map(l => l.language).join(', ');
            setSkills(topLangs);
        }
        if (analysis?.repositoryActivity?.allRepositoriesData) {
            const initialSet = new Set(
                analysis.repositoryActivity.allRepositoriesData.slice(0, 3).map(r => r.id)
            );
            setSelectedRepoIds(initialSet);
        }
        if (profile?.email) setEmail(profile.email);
        if (profile?.blog) setLinkedIn(profile.blog);
    }, [analysis, profile]);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024 * 2) {
                setError('Photo must be less than 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => { setPhotoDataUri(reader.result); setError(null); };
            reader.readAsDataURL(file);
        }
    };

    const toggleRepoSelection = (repoId) => {
        const newSet = new Set(selectedRepoIds);
        if (newSet.has(repoId)) {
            newSet.delete(repoId);
        } else {
            if (newSet.size >= 5) {
                setError("You can select a maximum of 5 projects.");
                setTimeout(() => setError(null), 3000);
                return;
            }
            newSet.add(repoId);
        }
        setSelectedRepoIds(newSet);
    };

    const generateResume = async () => {
        if (!window.puter) { setError('Puter AI Engine unavailable.'); return; }

        setIsLoading(true);
        setError(null);
        setAtsScore(null);

        const allRepos = analysis.repositoryActivity.allRepositoriesData || [];
        const selectedReposDetails = allRepos.filter(r => selectedRepoIds.has(r.id));

        const rawUserData = {
            profile: {
                name: profile.name || profile.login,
                login: profile.login,
                bio: profile.bio || '',
                email: email || profile.email || '',
                phone: phone || '',
                linkedin: linkedIn || profile.blog || '',
                leetcode: leetcode || '',
                githubUrl: `https://github.com/${profile.login}`,
            },
            education: {
                university: universityName || '',
                universityLocation: universityLocation || '',
                degree: degree || '',
                gradYears: gradYears || '',
                marks: collegeMarks || '',
                highSchool: {
                    name: highSchoolName || '',
                    board: highSchoolBoard || '',
                    year: highSchoolYear || '',
                    marks: highSchoolMarks || '',
                }
            },
            skills: skills || '',
            achievements: customAchievements || '',
            stats: {
                totalCommits: analysis.commitAnalytics.totalCommits,
                totalRepos: analysis.repositoryActivity.totalRepositories,
                totalStars: analysis.repositoryActivity.totalStars,
            },
            projects: selectedReposDetails.map(r => ({
                name: r.name,
                description: r.description || '',
                language: r.language || '',
                stars: r.stargazers_count,
                url: r.html_url,
            }))
        };

        // STEP 1: Structured JSON Extraction (Exact FAANG Schema)
        const step1Prompt = `You are an expert FAANG-level technical resume writer and data formatter.

Your task is to generate structured resume data using the provided inputs:
1. GitHub profile analysis data
2. User-provided personal details
3. Repository information

IMPORTANT RULES:

1. Do NOT return formatted text, paragraphs, markdown, or styling.
2. Return ONLY valid JSON.
3. Do NOT include explanations before or after the JSON.
4. Follow the exact schema provided below.
5. All bullet points must be concise and professional.
6. Each project must contain 3–4 bullet points maximum.
7. Bullet points must follow this structure:
   Action Verb + What was built + Technology used + Impact.
   Example: "Developed a movie discovery platform using React and Redux that integrates external APIs to provide AI-powered recommendations."
8. Prioritize the most significant repositories as projects.
   Significance is determined by: commit count, complexity, features, repository size, stars or forks.
9. If user data is missing, leave the field as an empty string rather than inventing information.
10. Ensure the output can be directly used by a frontend application to render a professional resume.

RETURN DATA USING THIS EXACT JSON STRUCTURE:

{
  "header": {
    "name": "",
    "github": "",
    "linkedin": "",
    "email": "",
    "phone": "",
    "location": ""
  },
  "education": {
    "university": "",
    "degree": "",
    "start_year": "",
    "end_year": "",
    "cgpa": "",
    "high_school": {
      "name": "",
      "board": "",
      "year": "",
      "marks": ""
    }
  },
  "skills": {
    "languages": [],
    "frameworks": [],
    "databases": [],
    "tools": [],
    "concepts": []
  },
  "projects": [
    {
      "title": "",
      "repository": "",
      "technologies": [],
      "description_points": []
    }
  ],
  "open_source": {
    "total_repositories": "",
    "total_commits": "",
    "contribution_summary": ""
  },
  "achievements": []
}

INPUT DATA:
${JSON.stringify(rawUserData, null, 2)}

Output must be strictly valid JSON with no additional text.`;

        try {
            const step1Response = await window.puter.ai.chat(step1Prompt);
            const jsonText = step1Response?.message?.content
                .replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim() || '{}';

            let structuredData;
            try {
                structuredData = JSON.parse(jsonText);
            } catch (e) {
                console.error("Step 1 JSON parse failed:", jsonText);
                structuredData = { header: {}, education: {}, skills: {}, projects: [], open_source: {}, achievements: [] };
            }

            // STEP 1.5: FAANG Refinement Pass (Polishing Language)
            try {
                const refinementPrompt = `You are a senior FAANG-level technical resume editor.
Your task is NOT to generate a resume from scratch.
Your task is ONLY to improve the language quality of structured resume data while keeping the exact JSON structure intact.

JSON to improve:
${JSON.stringify(structuredData, null, 2)}

IMPORTANT RULES:
1. DO NOT change the JSON structure.
2. DO NOT remove or add fields.
3. DO NOT reorder keys.
4. DO NOT add markdown formatting.
5. DO NOT return explanations.
6. Return ONLY valid JSON.

CONTENT IMPROVEMENT RULES:
- Project Bullets: Action Verb + What was built + Technology used + Impact.
- Bullet word count: 12-18 words.
- Achievements: Professional and impactful.
- Skills: Only remove duplicates if found.`;

                const refinementResponse = await window.puter.ai.chat(refinementPrompt);
                const refinedJsonText = refinementResponse?.message?.content
                    .replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim() || '';
                
                if (refinedJsonText) {
                    const refinedData = JSON.parse(refinedJsonText);
                    // Minimal validation to ensure we didn't get trash
                    if (refinedData.header || refinedData.projects) {
                        structuredData = refinedData;
                    }
                }
            } catch (err) {
                console.error("Refinement step failed, falling back to original:", err);
            }

            // STEP 2: Build Markdown from Structured JSON (Frontend-side — no AI call needed)
            const hdr = structuredData.header || {};
            const edu = structuredData.education || {};
            const hs = edu.high_school || {};
            const sk = structuredData.skills || {};
            const projects = (structuredData.projects || []).slice(0, 3);
            const os = structuredData.open_source || {};
            const ach = structuredData.achievements || [];

            // Header
            const contactParts = [hdr.github, hdr.linkedin, hdr.email, hdr.phone, hdr.location].filter(Boolean);
            let baseResume = `**${hdr.name || profile.name || profile.login}**\n`;
            if (contactParts.length) baseResume += contactParts.join(' | ') + '\n';

            // Education
            const eduLines = [];
            if (edu.university) {
                let uniLine = `**${edu.university}**`;
                if (edu.location) uniLine += ` — ${edu.location}`;
                eduLines.push(uniLine);
            }
            if (edu.degree) {
                let degLine = `*${edu.degree}*`;
                if (edu.start_year || edu.end_year) degLine += ` | ${edu.start_year || ''}${edu.end_year ? ' – ' + edu.end_year : ''}`;
                eduLines.push(degLine);
            }
            if (edu.cgpa) eduLines.push(`CGPA/Marks: ${edu.cgpa}`);
            if (hs.name) {
                let hsLine = `\n**${hs.name}**`;
                if (hs.board) hsLine += ` — ${hs.board}`;
                if (hs.year) hsLine += ` | ${hs.year}`;
                eduLines.push(hsLine);
                if (hs.marks) eduLines.push(`Marks: ${hs.marks}`);
            }
            if (eduLines.length) {
                baseResume += `\n## EDUCATION\n\n${eduLines.join('\n')}\n`;
            }

            // Technical Skills
            const skillLines = [];
            if (sk.languages?.length) skillLines.push(`Languages: ${sk.languages.join(', ')}`);
            if (sk.frameworks?.length) skillLines.push(`Frameworks: ${sk.frameworks.join(', ')}`);
            if (sk.databases?.length) skillLines.push(`Databases: ${sk.databases.join(', ')}`);
            if (sk.tools?.length) skillLines.push(`Developer Tools: ${sk.tools.join(', ')}`);
            if (sk.concepts?.length) skillLines.push(`Computer Fundamentals: ${sk.concepts.join(', ')}`);
            if (skillLines.length) {
                baseResume += `\n## TECHNICAL SKILLS\n\n${skillLines.join('\n')}\n`;
            }

            // Projects
            if (projects.length) {
                let projSection = '\n## PROJECTS\n';
                projects.forEach(p => {
                    const techStr = p.technologies?.length ? ` — ${p.technologies.join(', ')}` : '';
                    const repoStr = p.repository ? ` | [GitHub](${p.repository})` : '';
                    projSection += `\n**${p.title}**${techStr}${repoStr}\n`;
                    (p.description_points || []).forEach(bp => {
                        projSection += `• ${bp}\n`;
                    });
                });
                baseResume += projSection;
            }

            // Achievements
            if (ach.length) {
                baseResume += `\n## ACHIEVEMENTS\n\n`;
                ach.forEach(a => { baseResume += `• ${a}\n`; });
            }

            // Open Source
            const osLines = [];
            if (os.total_repositories) osLines.push(`• Maintained ${os.total_repositories} public repositories on GitHub.`);
            if (os.total_commits) osLines.push(`• Made ${os.total_commits}+ commits across personal and open-source projects.`);
            if (os.contribution_summary) osLines.push(`• ${os.contribution_summary}`);
            if (osLines.length) {
                baseResume += `\n## OPEN SOURCE CONTRIBUTIONS\n\n${osLines.join('\n')}\n`;
            }

            baseResume = baseResume.trim();
            setStructuredJson(structuredData);

            // STEP 3: FAANG Optimization + ATS Score
            const step3Prompt = `You are a FAANG technical hiring bar raiser reviewing this resume.

Rewrite the bullet points to maximize technical impact and FAANG hiring standards. Make them sound highly professional, specific, and difficult.

Constraints:
1. Keep the EXACT same layout and section headers.
2. Do NOT add any new sections or data that is not in the resume.
3. Each project: MAXIMUM 3 bullet points, 1 must be a clear impact statement.
4. No paragraphs longer than 2 lines.
5. No N/A, no placeholders, no vague language.

After the resume, on a new line write exactly: ---ATS_SCORE---
Then on the next line write a JSON object: {"score": 85, "suggestions": ["suggestion 1", "suggestion 2"]}

Resume to optimize:
${baseResume}`;

            const step3Response = await window.puter.ai.chat(step3Prompt);
            let finalContent = step3Response?.message?.content || '';

            let markdownContent = finalContent;
            let scoreData = null;

            if (finalContent.includes('---ATS_SCORE---')) {
                const parts = finalContent.split('---ATS_SCORE---');
                markdownContent = parts[0].trim();
                try {
                    const scoreJson = parts[1].replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
                    scoreData = JSON.parse(scoreJson);
                } catch (e) {
                    console.error("ATS score parse failed:", e);
                }
            }

            markdownContent = markdownContent.replace(/^```markdown\s*/i, '').replace(/```\s*$/i, '').trim();

            if (photoDataUri) {
                markdownContent = `![Profile Photo](${photoDataUri})\n\n${markdownContent}`;
            }

            setResumeData(markdownContent);
            if (scoreData) setAtsScore(scoreData);
            setShowForm(false);
        } catch (err) {
            console.error('Resume generation failed:', err);
            if (err?.status === 429 || err?.message?.includes('429')) {
                setError('AI rate limit hit. Please wait a moment and try again.');
            } else {
                setError('Failed to generate resume. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (resumeData) {
            navigator.clipboard.writeText(resumeData);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const generateResumeHtml = (data, profile, photoDataUri) => {
        const hdr  = data.header || {};
        const edu  = data.education || {};
        const hs   = edu.high_school || {};
        const sk   = data.skills || {};
        const projs = (data.projects || []).slice(0, 3);
        const ach  = data.achievements || [];

        const photoHtml = photoDataUri
            ? `<img src="${photoDataUri}" class="absolute left-0 w-20 h-20 rounded-full object-cover shadow-sm border border-slate-200" alt="logo" />`
            : '';

        const linkParts = [
            hdr.github   ? `<a href="${hdr.github}">Github</a>`       : '',
            hdr.leetcode ? `<a href="${hdr.leetcode}">Leetcode</a>`   : '',
            hdr.linkedin ? `<a href="${hdr.linkedin}">Linkedin</a>`   : '',
            hdr.email    ? `<a href="mailto:${hdr.email}">Mail Me</a>`: '',
            hdr.phone    ? `<span>${hdr.phone}</span>`                : '',
        ].filter(Boolean).join(' | ');

        const eduRows = () => {
            let rows = '';
            if (edu.university) {
                rows += `
                <div class="flex justify-between items-baseline mb-1">
                    <div>
                        <strong class="text-sm text-slate-900 font-semibold">${edu.university}</strong><br>
                        <em class="text-xs text-slate-700 italic">${edu.degree || ''}</em><br>
                        ${edu.cgpa ? `<span class="text-xs text-slate-800">CGPA: ${edu.cgpa}</span>` : ''}
                    </div>
                    <div class="text-right text-xs text-slate-600">
                        ${edu.location || ''}<br>
                        ${edu.start_year || ''} ${edu.end_year ? '– ' + edu.end_year : ''}
                    </div>
                </div>`;
            }
            if (hs.name) {
                rows += `
                <div class="flex justify-between items-baseline mt-3 mb-1">
                    <div>
                        <strong class="text-sm text-slate-900 font-semibold">${hs.name}</strong><br>
                        <em class="text-xs text-slate-700 italic">${hs.board || ''}</em><br>
                        ${hs.marks ? `<span class="text-xs text-slate-800">Marks: ${hs.marks}</span>` : ''}
                    </div>
                    <div class="text-right text-xs text-slate-600">
                        <br>
                        ${hs.year || ''}
                    </div>
                </div>`;
            }
            return rows;
        };

        const skillRowsHtml = [
            sk.languages?.length  ? ['Languages',              sk.languages.join(', ')]                                      : null,
            sk.frameworks?.length ? ['Frameworks & Databases', [...(sk.frameworks || []), ...(sk.databases || [])].join(', ')] : null,
            sk.tools?.length      ? ['Developer Tools',        sk.tools.join(', ')]                                           : null,
            sk.concepts?.length   ? ['Computer Fundamentals',  sk.concepts.join(', ')]                                        : null,
        ].filter(Boolean).map(([label, val]) => `
            <p class="mb-1 text-[12.5px] leading-relaxed text-slate-800">
                <strong class="font-semibold text-slate-900">${label}:</strong> ${val}
            </p>
        `).join('');

        const projHtml = projs.map(p => `
            <div class="mb-4 last:mb-0">
                <div class="flex justify-between items-baseline mb-1">
                    <strong class="text-[13.5px] text-slate-900 font-semibold">
                        ${p.title} ${p.technologies?.length ? '<span class="text-slate-500 font-normal"> — ' + p.technologies.slice(0, 3).join(', ') + '</span>' : ''}
                    </strong>
                    ${p.repository ? `<a href="${p.repository}" class="text-xs text-blue-600 hover:text-blue-700 transition-colors no-underline">GitHub Link</a>` : ''}
                </div>
                <ul class="list-disc ml-4 space-y-1">
                    ${(p.description_points || []).map(b => `<li class="text-[12.5px] text-slate-800 leading-snug pl-1">${b}</li>`).join('')}
                </ul>
            </div>`).join('');

        const achHtml = ach.length
            ? `<ul class="list-disc ml-4 space-y-1">${ach.map(a => `<li class="text-[12.5px] text-slate-800 leading-snug pl-1">${a}</li>`).join('')}</ul>`
            : '';

        return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<script>
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
      }
    }
  }
</script>
</head>
<body class="bg-white m-0 p-0 antialiased font-sans">
    <div class="max-w-[850px] mx-auto p-[30px_35px] box-border leading-[1.45] text-slate-900">
        <header class="flex items-center justify-center relative mb-5">
            ${photoHtml}
            <div class="text-center">
                <h1 class="text-[28px] font-bold tracking-tight text-slate-900 m-0 leading-tight">
                    ${hdr.name || profile.name || profile.login}
                </h1>
                <div class="mt-2 text-[12.5px] text-slate-600 font-medium">
                    ${linkParts}
                </div>
            </div>
        </header>

        <section class="mt-4">
            <h2 class="text-[13px] font-bold tracking-[0.1em] text-slate-900 uppercase">Education</h2>
            <div class="h-px bg-slate-200 mt-1 mb-3"></div>
            ${eduRows()}
        </section>

        ${projHtml ? `
        <section class="mt-5">
            <h2 class="text-[13px] font-bold tracking-[0.1em] text-slate-900 uppercase">Projects</h2>
            <div class="h-px bg-slate-200 mt-1 mb-3"></div>
            ${projHtml}
        </section>
        ` : ''}

        ${skillRowsHtml ? `
        <section class="mt-5">
            <h2 class="text-[13px] font-bold tracking-[0.1em] text-slate-900 uppercase">Technical Skills</h2>
            <div class="h-px bg-slate-200 mt-1 mb-3"></div>
            <div class="text-[12.5px] space-y-1">
                ${skillRowsHtml}
            </div>
        </section>
        ` : ''}

        ${achHtml ? `
        <section class="mt-5">
            <h2 class="text-[13px] font-bold tracking-[0.1em] text-slate-900 uppercase">Achievements</h2>
            <div class="h-px bg-slate-200 mt-1 mb-3"></div>
            ${achHtml}
        </section>
        ` : ''}
    </div>
</body>
</html>`;
    };

    const downloadPDF = async () => {
        if (!resumeData || !structuredJson) return;
        setIsDownloading(true);

        try {
            const html = generateResumeHtml(structuredJson, profile, photoDataUri);
            const hdr = structuredJson.header || {};

            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'position:fixed;left:-9999px;top:0;width:850px;height:1200px;border:none;';
            document.body.appendChild(iframe);
            iframe.contentDocument.open();
            iframe.contentDocument.write(html);
            iframe.contentDocument.close();

            await new Promise(r => setTimeout(r, 2500));

            const opt = {
                margin: 0,
                filename: `Resume-${hdr.name || profile.login}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 3, useCORS: true, letterRendering: true, backgroundColor: '#ffffff' },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            await html2pdf().set(opt).from(iframe.contentDocument.body).save();
            document.body.removeChild(iframe);
        } catch (err) {
            console.error('PDF export error:', err);
            setError('PDF export failed. You can still Copy Markdown and paste into a Word doc.');
        } finally {
            setIsDownloading(false);
        }
    };

    const downloadLaTeX = async () => {
        if (!resumeData || !structuredJson) return;
        setIsGeneratingLatex(true);
        try {
            const prompt = `You are a professional LaTeX resume generator used in a production software system.

Your task is to generate a complete, compilable LaTeX resume file based on structured JSON resume data.

The output must be a fully functional .tex document that compiles correctly in Overleaf.

IMPORTANT RULES

1. Return ONLY LaTeX code.
2. Do not include explanations or markdown.
3. Do not wrap the code in triple backticks.
4. The output must compile in Overleaf without modification.
5. Use a clean ATS-friendly resume layout.

DOCUMENT STRUCTURE

The resume must contain the following sections:

• Header (name + contact links)
• Education
• Projects
• Technical Skills
• Achievements

LAYOUT REQUIREMENTS

Use these LaTeX settings:

• documentclass: article
• page margin: 0.7 inches
• font size: 11pt
• compact spacing for single-page resume
• bullet points using itemize

Include the following packages:

\\usepackage[margin=0.7in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}

SECTION FORMATTING

Section titles should appear like this:

PROJECTS
--------------------

Use \\titleformat and \\titlerule to create a horizontal divider.

HEADER FORMAT

The header should display:

NAME (large bold)
GitHub | LinkedIn | Email | Phone

Centered at the top.

PROJECT FORMAT

Each project must include:

Project Title — Technologies | GitHub Link

Then bullet points describing the project.

Example:

MoviesHub — React, Redux, Firebase | GitHub

• Developed an AI-powered movie discovery platform using React and Redux.
• Integrated external APIs to fetch movie metadata and trailers.

BULLET POINT RULES

• 12–18 words per bullet point
• start with strong action verbs
• concise technical language

SKILLS FORMAT

Technical skills must be grouped:

Languages:
Frameworks:
Databases:
Developer Tools:
Computer Fundamentals:

INPUT

You will receive structured JSON like this:

{
  "header": {},
  "education": {},
  "skills": {},
  "projects": [],
  "achievements": []
}

Use this data to generate the resume.

INPUT DATA:
${JSON.stringify(structuredJson, null, 2)}

OUTPUT

Return a complete LaTeX document beginning with:

\\documentclass[11pt]{article}

and ending with:

\\end{document}

Ensure the LaTeX compiles successfully in Overleaf.`;

            const response = await window.puter.ai.chat(prompt);
            let latexContent = response?.message?.content || '';
            
            // Clean up any remaining markdown backticks if AI ignores the instruction
            latexContent = latexContent.replace(/^```latex\\s*/i, '').replace(/^```tex\\s*/i, '').replace(/^```\\s*/, '').replace(/```\\s*$/i, '').trim();

            const blob = new Blob([latexContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const hdr = structuredJson.header || {};
            link.download = `Resume-${hdr.name || profile.login || 'Export'}.tex`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('LaTeX export error:', err);
            setError('LaTeX export failed. Please try again.');
        } finally {
            setIsGeneratingLatex(false);
        }
    };

    const allRepos = analysis?.repositoryActivity?.allRepositoriesData || [];



    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="subtle-border p-6 flex flex-col mt-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="text-indigo-500" /> AI Resume Generator
                </h3>
            </div>

            {/* Initial View */}
            {!resumeData && !isLoading && !showForm && (
                <div className="text-center py-8">
                    <p className="text-slate-500 mb-6 max-w-lg mx-auto">
                        Build a FAANG-level ATS resume from your GitHub profile in 3 AI steps. Fill in your details and let AI handle the rest.
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                        <Settings size={18} /> Configure Resume
                    </button>
                </div>
            )}

            {/* === Configuration Form === */}
            {showForm && !isLoading && (
                <ResumeConfigurationForm
                    email={email} setEmail={setEmail}
                    phone={phone} setPhone={setPhone}
                    linkedIn={linkedIn} setLinkedIn={setLinkedIn}
                    leetcode={leetcode} setLeetcode={setLeetcode}
                    universityName={universityName} setUniversityName={setUniversityName}
                    universityLocation={universityLocation} setUniversityLocation={setUniversityLocation}
                    degree={degree} setDegree={setDegree}
                    gradYears={gradYears} setGradYears={setGradYears}
                    collegeMarks={collegeMarks} setCollegeMarks={setCollegeMarks}
                    highSchoolName={highSchoolName} setHighSchoolName={setHighSchoolName}
                    highSchoolBoard={highSchoolBoard} setHighSchoolBoard={setHighSchoolBoard}
                    highSchoolYear={highSchoolYear} setHighSchoolYear={setHighSchoolYear}
                    highSchoolMarks={highSchoolMarks} setHighSchoolMarks={setHighSchoolMarks}
                    skills={skills} setSkills={setSkills}
                    customAchievements={customAchievements} setCustomAchievements={setCustomAchievements}
                    photoDataUri={photoDataUri} setPhotoDataUri={setPhotoDataUri}
                    handlePhotoUpload={handlePhotoUpload}
                    allRepos={allRepos}
                    selectedRepoIds={selectedRepoIds}
                    toggleRepoSelection={toggleRepoSelection}
                    error={error}
                    setShowForm={setShowForm}
                    generateResume={generateResume}
                />
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-14 text-indigo-500">
                    <svg className="animate-spin h-9 w-9 mb-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm font-semibold">Crafting FAANG-level Resume...</span>
                    <span className="text-xs text-indigo-400 mt-1">Running 3-step AI optimization — this may take 15–20 seconds</span>
                </div>
            )}

            {/* Result View */}
            {resumeData && !isLoading && !showForm && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="flex flex-wrap justify-end mb-2 gap-3">
                        <button
                            onClick={() => { setResumeData(null); setShowForm(true); }}
                            className="text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2 mr-auto"
                        >
                            <Edit3 size={16} /> Edit Configuration
                        </button>

                        <button
                            onClick={() => setShowPdfPreview(true)}
                            className="text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2"
                        >
                            <Eye size={16} /> Preview PDF
                        </button>

                        <button
                            onClick={downloadLaTeX}
                            disabled={isGeneratingLatex}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2 ${isGeneratingLatex ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-transparent cursor-pointer'}`}
                        >
                            {isGeneratingLatex ? (
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : <Code size={16} />}
                            {isGeneratingLatex ? 'Generating LaTeX...' : 'Download LaTeX'}
                        </button>

                        <button
                            onClick={downloadPDF}
                            disabled={isDownloading}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2 ${isDownloading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'text-white hover:bg-emerald-600 bg-emerald-500 shadow-sm'}`}
                        >
                            {isDownloading ? (
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : <FileDown size={16} />}
                            {isDownloading ? 'Generating PDF...' : 'Download PDF'}
                        </button>
                        <button
                            onClick={copyToClipboard}
                            className="text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors inline-flex items-center gap-2"
                        >
                            {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <FileText size={16} />}
                            {copied ? 'Copied!' : 'Copy Markdown'}
                        </button>
                    </div>

                    {/* PDF Preview Modal */}
                    {showPdfPreview && (
                        <PDFPreviewModal
                            show={showPdfPreview}
                            onClose={() => setShowPdfPreview(false)}
                            html={generateResumeHtml(structuredJson, profile, photoDataUri)}
                        />
                    )}

                    {/* ATS Score */}
                    {atsScore && (
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <div className="flex flex-col items-center shrink-0">
                                <div className="text-4xl font-extrabold text-indigo-600">{atsScore.score}<span className="text-sm text-indigo-400 font-medium">/100</span></div>
                                <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mt-1">ATS Score</div>
                            </div>
                            <div className="w-px h-16 bg-indigo-200 hidden md:block shrink-0"></div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-indigo-500" /> Suggestions to Improve
                                </h4>
                                <ul className="text-sm text-slate-600 space-y-1 pl-5 list-disc marker:text-indigo-300">
                                    {atsScore.suggestions?.map((s, i) => <li key={i}>{s}</li>)}
                                    {(!atsScore.suggestions || atsScore.suggestions.length === 0) && <li>Looking great! No improvements needed.</li>}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Resume Markdown Preview */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 overflow-x-auto text-sm font-mono text-slate-700 whitespace-pre-wrap max-h-[600px] overflow-y-auto custom-scrollbar">
                        {resumeData}
                    </div>

                    <div ref={printRef} className="hidden"></div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default ResumeGenerator;
