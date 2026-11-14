
const Database = require("better-sqlite3");

const db = new Database("github_portfolio.db");

// Create API cache table
db.exec(`
    CREATE TABLE IF NOT EXISTS api_cache (
        cache_key TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        expires_at INTEGER NOT NULL
    )
`);

// Create user settings table
db.exec(`
    CREATE TABLE IF NOT EXISTS user_settings (
        username TEXT PRIMARY KEY,
        skills TEXT DEFAULT '[]',
        theme TEXT DEFAULT 'dark',
        updated_at INTEGER
    )
`);


// Get cached data
function getCache(key) {

    const row = db.prepare(`
        SELECT data, expires_at
        FROM api_cache
        WHERE cache_key = ?
    `).get(key);

    if (!row) return null;

    if (Date.now() > row.expires_at) {

        db.prepare(`
            DELETE FROM api_cache
            WHERE cache_key = ?
        `).run(key);

        return null;
    }

    return JSON.parse(row.data);
}


// Save data in cache
function setCache(key, data, ttl = 3600000) {

    const expiresAt = Date.now() + ttl;

    db.prepare(`
        INSERT OR REPLACE INTO api_cache
        (cache_key, data, expires_at)
        VALUES (?, ?, ?)
    `).run(
        key,
        JSON.stringify(data),
        expiresAt
    );

}


// Get user settings
function getSettings(username) {

    return db.prepare(`
        SELECT * FROM user_settings
        WHERE username = ?
    `).get(username);

}


// Save user settings
function saveSettings(username, skills, theme) {

    db.prepare(`
        INSERT INTO user_settings
        (username, skills, theme, updated_at)
        VALUES (?, ?, ?, ?)

        ON CONFLICT(username)
        DO UPDATE SET
        skills = excluded.skills,
        theme = excluded.theme,
        updated_at = excluded.updated_at
    `).run(
        username,
        JSON.stringify(skills),
        theme,
        Date.now()
    );

}


module.exports = {
    getCache,
    setCache,
    getSettings,
    saveSettings
};
