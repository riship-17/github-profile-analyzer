const express = require('express');
const router = express.Router();
const { getUserProfile, getUserRepos, getRepoLanguages, getRepoDetails } = require('../utils/github');

router.get('/user/:username', async (req, res, next) => {
    try {
        const profile = await getUserProfile(req.params.username);
        res.json(profile);
    } catch (error) {
        if (error.response && error.response.status === 404) return res.status(404).json({ error: 'User not found' });

        const isRateLimit = error.response && error.response.status === 403 && 
                           (error.response.headers['x-ratelimit-remaining'] === '0' || 
                            JSON.stringify(error.response.data).toLowerCase().includes('rate limit'));
        
        if (isRateLimit) {
            return res.status(429).json({
                error: 'GitHub API rate limit exceeded.',
                suggestion: 'Please add a valid GITHUB_TOKEN to your environment variables (Render/Vercel) to increase limits.',
                details: 'Unauthenticated requests are limited to 60/hr. Authenticated requests allow 5,000/hr.'
            });
        }

        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            return res.status(error.response.status).json({
                error: 'GitHub Authentication Error.',
                suggestion: 'Verify that your GITHUB_TOKEN is correct and has the necessary permissions.',
                details: error.response.data
            });
        }
        next(error);
    }
});

router.get('/repos/:username', async (req, res, next) => {
    try {
        const repos = await getUserRepos(req.params.username);
        res.json(repos);
    } catch (error) {
        next(error);
    }
});

router.get('/repo-details/:username/:repo', async (req, res, next) => {
    try {
        const details = await getRepoDetails(req.params.username, req.params.repo);

        // Analyze complexity and get metrics natively before sending to frontend
        const fileCount = details.tree.filter(item => item.type === 'blob').length;
        const dirCount = details.tree.filter(item => item.type === 'tree').length;
        const totalSize = details.tree.reduce((acc, item) => acc + (item.size || 0), 0);
        const readmeLength = details.readme.length;

        // Simple complexity score heuristic (1-10)
        let complexityScore = 1;
        if (fileCount > 100) complexityScore += 3;
        else if (fileCount > 50) complexityScore += 2;
        else if (fileCount > 20) complexityScore += 1;

        if (dirCount > 20) complexityScore += 2;
        else if (dirCount > 10) complexityScore += 1;

        if (readmeLength > 2000) complexityScore += 1; // Good documentation doesn't strictly make it complex, but it usually signifies a larger project

        complexityScore = Math.min(10, complexityScore + Math.floor(totalSize / 1000000)); // +1 for every MB

        res.json({
            ...details,
            metrics: {
                fileCount,
                dirCount,
                totalSizeBytes: totalSize,
                complexityScore,
            }
        });
    } catch (error) {
        next(error);
    }
});

// Calculate Profile Analytics
router.get('/analyze/:username', async (req, res, next) => {
    try {
        const username = req.params.username;

        // 1. Fetch repositories
        const repos = await getUserRepos(username);
        const originalRepos = repos.filter(repo => !repo.fork);

        // 2. Fetch language details concurrently
        const langPromises = originalRepos.map(repo => getRepoLanguages(username, repo.name).catch(() => ({})));
        const repoLanguages = await Promise.all(langPromises);

        // 3. Aggregate language data
        let totalBytes = 0;
        const languageMap = {};

        repoLanguages.forEach(langs => {
            Object.entries(langs).forEach(([lang, bytes]) => {
                languageMap[lang] = (languageMap[lang] || 0) + bytes;
                totalBytes += bytes;
            });
        });

        // Calculate percentages
        const languageDistribution = Object.entries(languageMap)
            .map(([lang, bytes]) => ({
                language: lang,
                percentage: parseFloat(((bytes / totalBytes) * 100).toFixed(1)),
                bytes
            }))
            .sort((a, b) => b.bytes - a.bytes); // Sort descending

        // 4. Calculate Aggregate Metrics
        const totalRepos = repos.length;
        const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        const totalForks = repos.reduce((acc, repo) => acc + repo.forks_count, 0);
        const totalLanguages = Object.keys(languageMap).length;

        // Mocking commits using a heuristic (GitHub API doesn't easily provide total user commits across repos without GraphQL)
        const mockCommits = totalRepos * 15 + totalStars * Math.floor(Math.random() * 5 + 1);

        // Formula: repos * 2 + commits + stars * 3 + languages * 5
        const developerScoreAbsolute = (totalRepos * 2) + mockCommits + (totalStars * 3) + (totalLanguages * 5);

        // Normalize score to 1-100 logic
        const normalizedScore = Math.min(Math.round((developerScoreAbsolute / 1500) * 100), 100);

        // 5. Calculate Skill Radar (Heuristics based on language usage)
        const skillsRadar = {
            'Frontend': 0,
            'Backend': 0,
            'DevOps / Systems': 0,
            'Data Science': 0,
            'Mobile': 0
        };

        const frontendLangs = ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Vue', 'Svelte'];
        const backendLangs = ['Java', 'C#', 'PHP', 'Ruby', 'Go', 'Python', 'Rust', 'JavaScript', 'TypeScript'];
        const devopsLangs = ['Shell', 'Makefile', 'Dockerfile', 'HCL', 'Go', 'Rust', 'C', 'C++'];
        const dataLangs = ['Python', 'Jupyter Notebook', 'R', 'MATLAB', 'Julia'];
        const mobileLangs = ['Swift', 'Kotlin', 'Objective-C', 'Java', 'Dart'];

        Object.entries(languageMap).forEach(([lang, bytes]) => {
            if (frontendLangs.includes(lang)) skillsRadar['Frontend'] += bytes;
            if (backendLangs.includes(lang)) skillsRadar['Backend'] += bytes;
            if (devopsLangs.includes(lang)) skillsRadar['DevOps / Systems'] += bytes;
            if (dataLangs.includes(lang)) skillsRadar['Data Science'] += bytes;
            if (mobileLangs.includes(lang)) skillsRadar['Mobile'] += bytes;
        });

        // Normalize skills to 1-100 scale based on the max skill
        const maxSkillBytes = Math.max(...Object.values(skillsRadar), 1); // prevent div by 0
        const normalizedSkills = Object.entries(skillsRadar).map(([skill, bytes]) => ({
            subject: skill,
            score: Math.round((bytes / maxSkillBytes) * 100) || Math.floor(Math.random() * 20) + 5 // give a small base to empty skills so the chart draws
        }));


        // 6. Calculate Growth Timeline (Repos created by year + simulated commit growth)
        const reposByYear = {};
        originalRepos.forEach(repo => {
            const year = new Date(repo.created_at).getFullYear();
            reposByYear[year] = (reposByYear[year] || 0) + 1;
        });

        // Create a sorted array of years from their earliest repo to current year
        const years = Object.keys(reposByYear).sort();
        const growthTimeline = years.map(year => {
            // Mocking exponential/linear commit growth based on repos that year
            return {
                year: year,
                repos: reposByYear[year],
                commits: (reposByYear[year] * 45) + Math.floor(Math.random() * 100)
            }
        });

        // 7. Developer Reputation Metric
        // score out of 100
        const totalScore = Math.max(1, normalizedScore);
        let rankPercentile = Math.max(1, 100 - totalScore); // Inverse scale, higher score = lower percentile
        let title = "Novice Developer";
        if (totalScore > 80) title = "Legendary Developer";
        else if (totalScore > 60) title = "Senior Developer";
        else if (totalScore > 40) title = "Solid Contributor";
        else if (totalScore > 20) title = "Active Developer";

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const commitFrequency = days.map(day => ({
            day,
            commits: Math.floor(Math.random() * (totalRepos * 3 + 1)) // Mock distribution
        }));

        res.json({
            languageDistribution,
            repositoryActivity: {
                totalRepositories: totalRepos,
                originalRepositories: originalRepos.length,
                totalStars,
                totalForks,
                allRepositoriesData: originalRepos
            },
            commitAnalytics: {
                totalCommits: mockCommits,
                commitFrequency
            },
            developerScore: totalScore,
            reputation: {
                title,
                rankPercentile: `${rankPercentile}%`,
                score: totalScore
            },
            skillsRadar: normalizedSkills,
            growthTimeline
        });

    } catch (error) {
        const isRateLimit = error.response && error.response.status === 403 && 
                           (error.response.headers['x-ratelimit-remaining'] === '0' || 
                            JSON.stringify(error.response.data).toLowerCase().includes('rate limit'));

        if (isRateLimit) {
            return res.status(429).json({
                error: 'GitHub API rate limit exceeded during analysis.',
                suggestion: 'Please add a valid GITHUB_TOKEN to your environment variables (Render/Vercel) to increase limits.',
                details: 'Analysis requires many parallel requests. Unauthenticated limits (60/hr) are insufficient.'
            });
        }

        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            return res.status(error.response.status).json({
                error: 'GitHub Authentication Error.',
                suggestion: 'Verify that your GITHUB_TOKEN is correct and has the necessary permissions.',
                details: error.response.data
            });
        }
        next(error);
    }
});

module.exports = router;
