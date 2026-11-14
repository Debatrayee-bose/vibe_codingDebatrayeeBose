
# GitHub Developer Portfolio Dashboard

## Overview

The GitHub Developer Portfolio Dashboard is a web-based application designed to provide developers with a comprehensive overview of their GitHub profiles, repositories, programming languages, and coding activity.

The application integrates GitHub APIs with AI-powered functionality to analyse developer skills, evaluate compatibility with job descriptions, and generate personalised project suggestions. It aims to transform raw GitHub data into meaningful insights through an interactive and user-friendly dashboard.

## Key Features

### 1. GitHub Profile Overview
- Fetches public GitHub profile information.
- Displays profile details, followers, and public repository statistics.
- Provides an overview of a developer's GitHub presence.

### 2. Contribution Activity Analysis
- Retrieves GitHub contribution data.
- Presents coding activity through a visual contribution graph.
- Helps developers understand their contribution patterns and consistency.

### 3. Programming Language Analysis
- Identifies programming languages used across repositories.
- Displays language distribution through interactive charts.
- Provides insights into a developer's technology preferences.

### 4. Repository Explorer
- Displays public GitHub repositories.
- Provides relevant repository information, including stars and forks.
- Allows users to explore a developer's projects in one place.

### 5. AI-Powered Vibe Check
- Evaluates a developer's compatibility with a given job description.
- Analyses repository information and saved technical skills.
- Generates a compatibility score and improvement suggestions.

### 6. AI Chat Assistant
- Provides an interactive AI-powered chat interface.
- Allows users to ask questions related to their developer profile, skills, and projects.

### 7. AI Project Pitch Generator
- Generates project ideas based on a developer's interests and technical skills.
- Helps developers explore potential project opportunities.

### 8. Developer Settings
- Allows users to save their technical skills and preferences.
- Stores developer settings using an SQLite database.

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Styling and user interface |
| JavaScript | Frontend functionality and API communication |
| Node.js | Backend runtime environment |
| Express.js | Backend server and API routing |
| GitHub REST API | Retrieving profile and repository information |
| GitHub GraphQL API | Retrieving contribution activity |
| OpenAI API | AI-powered analysis and assistance |
| SQLite | Local data storage and caching |
| Chart.js | Data visualisation |

## Project Structure

```text
vibe_coding/
│
├── backend/
│   ├── database.js
│   ├── github.js
│   ├── server.js
│   ├── vibeCheck.js
│   ├── package.json
│   └── package-lock.json
│
├── index.html
├── style.css
├── script.js
└── .gitignore
```

## Installation and Setup

### Prerequisites

Ensure that the following are installed:

- Node.js
- npm
- Visual Studio Code
- A GitHub account
- An OpenAI API key

### 1. Clone the Repository

```bash
git clone https://github.com/Debatrayee-bose/vibe_codingDebatrayeeBose.git
```

### 2. Navigate to the Project Directory

```bash
cd vibe_codingDebatrayeeBose
```

### 3. Install Dependencies

Navigate to the backend directory:

```bash
cd backend
```

Install the required dependencies:

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `backend` directory and configure the following variables:

```env
GITHUB_TOKEN=your_github_personal_access_token
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=your_available_openai_model
PORT=5000
```

Replace the placeholder values with valid credentials.

**Note:** API keys and other sensitive credentials must be stored in the `.env` file and must never be committed to the public repository.

### 5. Start the Backend Server

From the backend directory, execute:

```bash
npm start
```

The backend server will be available at:

```text
http://localhost:5000
```

### 6. Run the Frontend

Open the project directory in Visual Studio Code and launch `index.html` using the Live Server extension.

The frontend communicates with the backend server through the configured API endpoints.

## API Endpoints

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/github/:username` | Retrieves GitHub profile and repository information |
| GET | `/api/contributions/:username` | Retrieves GitHub contribution activity |
| POST | `/api/vibe-check` | Performs AI-powered developer compatibility analysis |
| GET | `/api/settings/:username` | Retrieves saved developer settings |
| POST | `/api/settings` | Stores developer settings |
| POST | `/api/chat` | Handles AI assistant conversations |
| POST | `/api/project-pitch` | Generates AI-based project suggestions |

## Environment Configuration

The application uses environment variables to securely manage API credentials and server configuration.

| Variable | Description |
|---|---|
| `GITHUB_TOKEN` | Authenticates requests to GitHub APIs |
| `OPENAI_API_KEY` | Provides access to OpenAI services |
| `OPENAI_MODEL` | Specifies the OpenAI API model |
| `PORT` | Defines the backend server port |

## Project Objective

The primary objective of this project is to develop a centralised platform that combines GitHub analytics with artificial intelligence to provide meaningful insights into a developer's technical profile.

By integrating repository analysis, contribution tracking, programming language visualisation, and AI-powered assistance, the dashboard helps developers better understand their technical strengths and identify opportunities for improvement.

## Future Enhancements

- Support for multiple GitHub profiles.
- Advanced repository and coding activity analytics.
- More detailed developer skill assessments.
- Enhanced AI-powered career recommendations.
- Cloud deployment and public dashboard access.

## Author

**GitHub Developer Portfolio Dashboard**

Developed using HTML, CSS, JavaScript, Node.js, Express.js, GitHub APIs, SQLite, and OpenAI API.
