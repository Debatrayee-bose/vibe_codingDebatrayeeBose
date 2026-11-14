
const { getCache, setCache } = require("./database");

const REST_URL = "https://api.github.com";
const GRAPHQL_URL = "https://api.github.com/graphql";

async function githubRequest(url) {

    const headers = {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
    };

    if (process.env.GITHUB_TOKEN) {
        headers.Authorization =
            `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
}


// Fetch profile and repositories
async function getGitHubData(username) {

    const cacheKey = `github:${username}`;

    const cached = getCache(cacheKey);

    if (cached) {
        return { ...cached, cached: true };
    }

    const [profile, repositories] = await Promise.all([

        githubRequest(`${REST_URL}/users/${username}`),

        githubRequest(
            `${REST_URL}/users/${username}/repos?per_page=100&sort=updated`
        )

    ]);

    const totalStars = repositories.reduce(
        (sum, repo) => sum + repo.stargazers_count,
        0
    );

    const totalForks = repositories.reduce(
        (sum, repo) => sum + repo.forks_count,
        0
    );

    const result = {
        profile,
        repositories,
        totalStars,
        totalForks
    };

    setCache(cacheKey, result);

    return { ...result, cached: false };
}


// Fetch contribution calendar using GraphQL
async function getContributions(username) {

    const cacheKey = `contributions:${username}`;

    const cached = getCache(cacheKey);

    if (cached) {
        return { ...cached, cached: true };
    }

    if (!process.env.GITHUB_TOKEN) {
        throw new Error("GitHub token required for GraphQL");
    }

    const query = `
        query($username: String!) {
            user(login: $username) {
                contributionsCollection {
                    contributionCalendar {
                        totalContributions
                        weeks {
                            contributionDays {
                                date
                                contributionCount
                                color
                            }
                        }
                    }
                }
            }
        }
    `;

    const response = await fetch(GRAPHQL_URL, {
        method: "POST",

        headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            query,
            variables: { username }
        })
    });

    const result = await response.json();

    if (!response.ok || result.errors) {
        throw new Error("Unable to fetch contribution data");
    }

    if (!result.data.user) {
        throw new Error("GitHub user not found");
    }

    const calendar =
        result.data.user.contributionsCollection.contributionCalendar;

    const data = {
        totalContributions: calendar.totalContributions,
        weeks: calendar.weeks
    };

    // Cache contribution data for 6 hours
    setCache(cacheKey, data, 21600000);

    return { ...data, cached: false };
}

module.exports = {
    getGitHubData,
    getContributions
};
