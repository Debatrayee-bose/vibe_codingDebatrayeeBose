
function calculateCompatibility(jobDescription, repositories, savedSkills = []) {

    // Extract skills from repositories
    const detectedSkills = new Set(
        savedSkills.map(skill => skill.toLowerCase())
    );

    repositories.forEach(repo => {

        if (repo.language) {
            detectedSkills.add(repo.language.toLowerCase());
        }

        if (repo.name) {
            detectedSkills.add(repo.name.toLowerCase());
        }

        if (repo.description) {
            detectedSkills.add(repo.description.toLowerCase());
        }

        if (repo.topics) {
            repo.topics.forEach(topic => {
                detectedSkills.add(topic.toLowerCase());
            });
        }

    });

    // Technologies to identify in job descriptions
    const skillKeywords = [
        "java",
        "javascript",
        "python",
        "c++",
        "react",
        "node.js",
        "node",
        "express",
        "mongodb",
        "sql",
        "mysql",
        "html",
        "css",
        "php",
        "kotlin",
        "android",
        "git",
        "rest api",
        "machine learning",
        "tensorflow",
        "docker",
        "aws"
    ];

    const jobText = jobDescription.toLowerCase();

    // Identify required skills
    const requiredSkills = skillKeywords.filter(skill => {

        const regex = new RegExp(
            `(^|[^a-z0-9+#.])${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[^a-z0-9+#.])`,
            "i"
        );

        return regex.test(jobText);

    });

    const matchedSkills = requiredSkills.filter(skill =>
        detectedSkills.has(skill)
    );

    const missingSkills = requiredSkills.filter(skill =>
        !detectedSkills.has(skill)
    );

    const score = requiredSkills.length === 0
        ? 0
        : Math.round(
            (matchedSkills.length / requiredSkills.length) * 100
        );

    let badge;

    if (score >= 80) {
        badge = "Excellent Match";
    } else if (score >= 60) {
        badge = "Good Match";
    } else if (score >= 40) {
        badge = "Moderate Match";
    } else {
        badge = "Needs Improvement";
    }

    return {
        score,
        badge,
        matchedSkills,
        missingSkills,
        requiredSkills
    };

}

module.exports = calculateCompatibility;
