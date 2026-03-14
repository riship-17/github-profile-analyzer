const axios = require('axios');

const getAuthHeaders = () => {
    return process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {};
};

const githubApi = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'github-profile-analyzer-app',
    },
});

githubApi.interceptors.request.use(config => {
    const authHeaders = getAuthHeaders();
    if (authHeaders.Authorization) {
        config.headers.Authorization = authHeaders.Authorization;
    }
    return config;
});

const getUserProfile = async (username) => {
    const { data } = await githubApi.get(`/users/${username}`);
    return data;
};

const getUserRepos = async (username) => {
    // Fetch up to 100 repositories sorted by latest updates
    const { data } = await githubApi.get(`/users/${username}/repos?per_page=100&sort=updated`);
    return data;
};

const getRepoLanguages = async (username, repoName) => {
    const { data } = await githubApi.get(`/repos/${username}/${repoName}/languages`);
    return data;
};

const getRepoDetails = async (username, repoName) => {
    try {
        // Fetch README
        let readmeContent = '';
        try {
            const readmeResponse = await githubApi.get(`/repos/${username}/${repoName}/readme`, {
                headers: { Accept: 'application/vnd.github.v3.raw' }
            });
            readmeContent = readmeResponse.data;
        } catch (readmeErr) {
            // Repo might not have a README
            readmeContent = '';
        }

        // Fetch the default branch to get tree
        const repoData = await githubApi.get(`/repos/${username}/${repoName}`);
        const defaultBranch = repoData.data.default_branch;

        // Fetch tree recursively (up to a limit, truncates automatically by GitHub API if too large)
        let fileTree = [];
        try {
            // ?recursive=1 fetches the whole tree
            const treeResponse = await githubApi.get(`/repos/${username}/${repoName}/git/trees/${defaultBranch}?recursive=1`);
            fileTree = treeResponse.data.tree || [];
        } catch (treeErr) {
            console.error(`Failed to fetch tree for ${repoName}`);
            fileTree = [];
        }

        return {
            readme: readmeContent,
            tree: fileTree,
            meta: repoData.data
        };
    } catch (err) {
        throw new Error(`Failed to fetch extended details for ${repoName}`);
    }
};

module.exports = {
    getUserProfile,
    getUserRepos,
    getRepoLanguages,
    getRepoDetails
};
