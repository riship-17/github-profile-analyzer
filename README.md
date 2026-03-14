# GitHub Profile Analyzer 🚀



GitHub Profile Analyzer is a high-performance, full-stack application designed to provide deep analytical insights into GitHub profiles. Using the GitHub REST API, it aggregates data to calculate developer scores, visualize skill sets, and generate professional resumes in real-time.

---

## 🌟 Key Features

### 📊 Comprehensive Developer Dashboard
- **Developer Score & Reputation**: Custom-built algorithm to rank developers from "Novice" to "Legendary" based on stars, forks, repo count, and language diversity.
- **Skill Radar**: A hexagonal visualization map that highlights a developer's expertise across domains like Frontend, Backend, DevOps, Data Science, and Mobile.
- **Contribution Growth Timeline**: A data-driven view of repository growth and simulated commit activity over time.

### 🔍 Deep Repository Analysis
- **Complexity Scoring**: Analyze codebases to determine complexity based on file density, directory depth, and documentation size.
- **Interactive File Tree**: Browse repository structures directly within the web app.
- **README Insights**: Native rendering of project documentation with markdown support.

### 🛠️ Developer Utility Suite
- **Dynamic Resume Generator**: Transform a GitHub profile into a sleek, printable PDF resume with a single click.
- **Developer Battle**: Side-by-side comparison of two developers to compare metrics, stars, and growth.
- **Open Source Finder**: Smart suggestions for repositories to contribute to based on the user's analyzed skill set.

---

## 🏗️ Architecture & Technology Stack

### Frontend (Modern React Ecosystem)
- **Framework**: [React 19](https://react.dev/) for high-performance UI rendering.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for fluid, glassmorphic transitions and micro-animations.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a utility-first, responsive design system.
- **Data Visualization**: [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/) for interactive radar and line charts.
- **Icons**: [Lucide React](https://lucide.dev/) for consistent, scalable vector icons.

### Backend (Robust Node.js API)
- **Runtime**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/).
- **API Integration**: [GitHub REST API (v3)](https://docs.github.com/en/rest) with `axios` for optimized data fetching and interceptors for authentication.
- **Security**: Environment-based GITHUB_TOKEN handling to maximize rate limits (up to 5,000 requests/hour).
- **Error Handling**: Custom middleware for rate-limit detection and user-friendly authentication feedback.

---

## 🔄 Data Flow Analysis

1. **User Input**: A user enters a GitHub username in the Search component.
2. **API Handshake**: The React frontend sends a request to the Node.js backend.
3. **Data Aggregation**: The backend concurrently fetches user profile, repository list, and language distribution data.
4. **Metric Calculation**: The scoring engine processes the raw data into developer scores, skill vectors, and growth timelines.
5. **Visualization**: The processed JSON is sent back to the frontend, where Framer Motion and Chart.js create an interactive, animated report.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A GitHub Personal Access Token (PAT) for higher rate limits.

### Installation

1. **Clone the Repo**
   ```bash
   git clone https://github.com/your-username/github-profile-analyzer.git
   cd github-profile-analyzer
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file and add your GITHUB_TOKEN
   echo "GITHUB_TOKEN=your_token_here" > .env
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 📈 Future Roadmap
- [ ] GraphQL integration for faster, more granular data fetching.
- [ ] Comparison "League" for top developers globally.
- [ ] Integration with LinkedIn for automatic resume syncing.
- [ ] AI-powered code quality analysis using LLM integrations.

---

Crafted with ❤️.
