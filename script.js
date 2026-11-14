
const API_URL = "http://localhost:5000/api";

// Enter your GitHub username here
const username = "Debatrayee-bose";

let languageChart = null;


// 1. Fetch GitHub profile and dashboard data
async function fetchProfile() {

    try {

        const response = await fetch(
            `${API_URL}/github/${username}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch GitHub profile");
        }

        const result = await response.json();

        const profile = result.profile;

        document.getElementById("avatar").src =
            profile.avatar_url;

        document.getElementById("name").textContent =
            profile.name || profile.login;

        document.getElementById("username").textContent =
            "@" + profile.login;

        document.getElementById("bio").textContent =
            profile.bio || "Developer";

        document.getElementById("followers").textContent =
            profile.followers;

        document.getElementById("repos").textContent =
            profile.public_repos;

        document.getElementById("stars").textContent =
            result.totalStars;

        document.getElementById("forks").textContent =
            result.totalForks;

        document.getElementById("githubLink").href =
            profile.html_url;

        displayRepositories(result.repositories);

        createLanguageChart(result.repositories);

    } catch (error) {

        console.error(error);
        alert(error.message);

    }

}


// 2. Display repository cards
function displayRepositories(repositories) {

    const container = document.getElementById(
        "repositoryContainer"
    );

    container.innerHTML = "";

    repositories.forEach(repo => {

        const card = document.createElement("div");
        card.className = "repo-card";

        const title = document.createElement("h3");
        title.textContent = repo.name;

        const description = document.createElement("p");

        description.textContent =
            repo.description || "No description available";

        const details = document.createElement("div");
        details.className = "repo-details";

        const language = document.createElement("span");
        language.className = "language-tag";
        language.textContent = repo.language || "Unknown";

        const stars = document.createElement("span");
        stars.textContent = "⭐ " + repo.stargazers_count;

        const forks = document.createElement("span");
        forks.textContent = "🍴 " + repo.forks_count;

        const link = document.createElement("a");
        link.href = repo.html_url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "View Repository →";

        // Generate project interview explanation
        const pitchButton = document.createElement("button");

        pitchButton.textContent = "Generate Interview Pitch";

        pitchButton.addEventListener("click", () => {
            generateProjectPitch(repo.name);
        });

        details.append(language, stars, forks);

        card.append(
            title,
            description,
            details,
            link,
            pitchButton
        );

        container.appendChild(card);

    });

}


// 3. Create programming language chart
function createLanguageChart(repositories) {

    const languageCount = {};

    repositories.forEach(repo => {

        if (repo.language) {

            languageCount[repo.language] =
                (languageCount[repo.language] || 0) + 1;

        }

    });

    const labels = Object.keys(languageCount);
    const values = Object.values(languageCount);

    const colors = [
        "#3b82f6",
        "#22c55e",
        "#eab308",
        "#a855f7",
        "#f97316",
        "#ec4899"
    ];

    const canvas = document.getElementById("languageChart");

    if (languageChart) {
        languageChart.destroy();
    }

    languageChart = new Chart(canvas, {

        type: "pie",

        data: {
            labels: labels,

            datasets: [{
                data: values,
                backgroundColor: colors
            }]
        },

        options: {
            responsive: true,

            plugins: {
                legend: {
                    labels: {
                        color: "#ffffff"
                    }
                }
            }
        }

    });

}


// 4. Fetch actual GitHub contributions
async function createContributionGraph() {

    const graph = document.getElementById(
        "contributionGraph"
    );

    graph.innerHTML = "";

    try {

        const response = await fetch(
            `${API_URL}/contributions/${username}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch contributions");
        }

        const data = await response.json();

        data.weeks.forEach(week => {

            week.contributionDays.forEach(day => {

                const square = document.createElement("div");

                square.className = "heatmap-day";

                square.style.backgroundColor = day.color;

                square.title =
                    `${day.date}: ${day.contributionCount} contributions`;

                graph.appendChild(square);

            });

        });

    } catch (error) {

        console.error(error);

        graph.textContent =
            "Contribution data could not be loaded.";

    }

}


// 5. Vibe Check - Job Description Compatibility
async function runVibeCheck() {

    const jobDescription = document.getElementById(
        "jobDescription"
    ).value;

    const resultContainer = document.getElementById(
        "vibeResult"
    );

    if (!jobDescription.trim()) {
        alert("Please enter a job description");
        return;
    }

    resultContainer.textContent = "Analyzing your profile...";

    try {

        const response = await fetch(
            `${API_URL}/vibe-check`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    jobDescription
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Vibe Check failed");
        }

        resultContainer.innerHTML = `
            <h3>Compatibility Score: ${result.score}%</h3>
            <h4>${result.badge}</h4>
            <p><strong>Matched Skills:</strong> ${result.matchedSkills.join(", ") || "None"}</p>
            <p><strong>Missing Skills:</strong> ${result.missingSkills.join(", ") || "None"}</p>
        `;

    } catch (error) {

        resultContainer.textContent = error.message;

    }

}


// 6. AI Portfolio Chatbot
async function sendChatMessage() {

    const input = document.getElementById("chatInput");

    const message = input.value.trim();

    const chatBox = document.getElementById("chatMessages");

    if (!message) return;

    const userMessage = document.createElement("p");
    userMessage.textContent = "You: " + message;

    chatBox.appendChild(userMessage);

    input.value = "";

    const loadingMessage = document.createElement("p");
    loadingMessage.textContent = "Assistant: Thinking...";

    chatBox.appendChild(loadingMessage);

    try {

        const response = await fetch(
            `${API_URL}/chat`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    message
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Chat request failed");
        }

        loadingMessage.textContent =
            "Assistant: " + result.answer;

    } catch (error) {

        loadingMessage.textContent =
            "Assistant: " + error.message;

    }

}


// 7. Generate project interview explanation
async function generateProjectPitch(repositoryName) {

    const output = document.getElementById("projectPitch");

    output.textContent = "Generating project explanation...";

    try {

        const response = await fetch(
            `${API_URL}/project-pitch`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    repositoryName
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Could not generate pitch");
        }

        output.textContent = result.pitch;

    } catch (error) {

        output.textContent = error.message;

    }

}


// 8. Save user settings
async function saveUserSettings() {

    const skillsInput = document.getElementById("skillsInput");

    const themeInput = document.getElementById("themeInput");

    const skills = skillsInput.value
        .split(",")
        .map(skill => skill.trim())
        .filter(Boolean);

    const theme = themeInput.value;

    try {

        const response = await fetch(
            `${API_URL}/settings`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    skills,
                    theme
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Unable to save settings");
        }

        alert("Settings saved successfully!");

    } catch (error) {

        alert(error.message);

    }

}


// 9. Load saved settings
async function loadUserSettings() {

    try {

        const response = await fetch(
            `${API_URL}/settings/${username}`
        );

        if (!response.ok) {
            throw new Error("Unable to load settings");
        }

        const settings = await response.json();

        document.getElementById("skillsInput").value =
            JSON.parse(settings.skills || "[]").join(", ");

        document.getElementById("themeInput").value =
            settings.theme || "dark";

    } catch (error) {

        console.error(error);

    }

}


// Start dashboard
fetchProfile();
createContributionGraph();
loadUserSettings();
