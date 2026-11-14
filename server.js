
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {
    getGitHubData,
    getContributions
} = require("./github");

const {
    getSettings,
    saveSettings
} = require("./database");

const calculateCompatibility =
    require("./vibeCheck");

const app = express();

app.use(cors());
app.use(express.json({ limit: "100kb" }));


// 1. GitHub Profile API
app.get("/api/github/:username", async (req, res) => {

    try {
        const data = await getGitHubData(req.params.username);
        res.json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});


// 2. GitHub Contributions API
app.get("/api/contributions/:username", async (req, res) => {

    try {
        const data = await getContributions(req.params.username);
        res.json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});


// 3. Vibe Check API
app.post("/api/vibe-check", async (req, res) => {

    try {

        const { username, jobDescription } = req.body;

        if (
            typeof username !== "string" ||
            !username.trim() ||
            typeof jobDescription !== "string" ||
            !jobDescription.trim() ||
            jobDescription.length > 15000
        ) {
            return res.status(400).json({
                error: "Valid username and job description are required"
            });
        }

        const githubData = await getGitHubData(username);

        const settings = getSettings(username);

        const savedSkills = settings
            ? JSON.parse(settings.skills)
            : [];

        const result = calculateCompatibility(
            jobDescription,
            githubData.repositories,
            savedSkills
        );

        res.json(result);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

});


// 4. Get User Settings
app.get("/api/settings/:username", (req, res) => {

    try {

        const settings = getSettings(req.params.username);

        res.json(settings || {
            username: req.params.username,
            skills: "[]",
            theme: "dark"
        });

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

});


// 5. Save User Settings
app.post("/api/settings", (req, res) => {

    try {

        const { username, skills, theme } = req.body;

        if (
            typeof username !== "string" ||
            !username.trim() ||
            !Array.isArray(skills) ||
            skills.length > 100 ||
            !skills.every(skill =>
                typeof skill === "string" && skill.length <= 50
            ) ||
            !["dark", "light"].includes(theme)
        ) {
            return res.status(400).json({
                error: "Invalid settings"
            });
        }

        saveSettings(username, skills, theme);

        res.json({
            message: "Settings saved successfully"
        });

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

});


// 6. AI API helper
async function askAI(instructions, input) {

    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OpenAI API key is not configured");
    }

    const response = await fetch(
        "https://api.openai.com/v1/responses",
        {
            method: "POST",

            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                model: process.env.OPENAI_MODEL || "gpt-5.5",
                instructions,
                input
            })
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error("AI service request failed");
    }

    return result.output_text;
}


// 7. AI Portfolio Chatbot
app.post("/api/chat", async (req, res) => {

    try {

        const { username, message } = req.body;

        if (
            typeof username !== "string" ||
            typeof message !== "string" ||
            !message.trim() ||
            message.length > 3000
        ) {
            return res.status(400).json({
                error: "Valid username and message are required"
            });
        }

        const githubData = await getGitHubData(username);

        const context = {
            name: githubData.profile.name,
            bio: githubData.profile.bio,

            repositories: githubData.repositories.map(repo => ({
                name: repo.name,
                description: repo.description,
                language: repo.language,
                stars: repo.stargazers_count
            }))
        };

        const answer = await askAI(
            "You are a helpful developer portfolio assistant. " +
            "Answer using the supplied GitHub information. " +
            "Do not invent skills or achievements. " +
            "Clearly state when information is unavailable.",

            `Developer information:\n${JSON.stringify(context)}\n\n` +
            `User question: ${message}`
        );

        res.json({ answer });

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

});


// 8. AI Project Explainer
app.post("/api/project-pitch", async (req, res) => {

    try {

        const { username, repositoryName } = req.body;

        if (
            typeof username !== "string" ||
            !username.trim() ||
            typeof repositoryName !== "string" ||
            !repositoryName.trim()
        ) {
            return res.status(400).json({
                error: "Username and repository name are required"
            });
        }

        const githubData = await getGitHubData(username);

        const repo = githubData.repositories.find(
            item => item.name === repositoryName
        );

        if (!repo) {
            return res.status(404).json({
                error: "Repository not found"
            });
        }

        const pitch = await askAI(
            "You are a technical interview coach. " +
            "Create an honest professional project explanation. " +
            "Do not invent project features or technologies.",

            JSON.stringify({
                name: repo.name,
                description: repo.description,
                language: repo.language,
                stars: repo.stargazers_count,
                url: repo.html_url
            })
        );

        res.json({ pitch });

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

});


// Start backend server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
