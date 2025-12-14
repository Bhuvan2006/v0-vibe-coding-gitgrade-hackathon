Here is the strictly professional version without emojis, formatted for immediate use.

````markdown
# GitGrade

**AI-Powered GitHub Repository Evaluator**

GitGrade is an intelligent analysis tool that evaluates GitHub projects using GPT-4o. It provides developers with actionable feedback, scoring metrics, and personalized roadmaps to improve code quality, documentation, and best practices.

[**View Live Demo**](https://v0-vibe-coding-gitgrade-hackathon.vercel.app/)

---

## Overview

GitGrade analyzes public GitHub repositories to generate comprehensive reports. By fetching real-time data via the GitHub API and processing it through an AI evaluation engine, the system offers detailed insights across five key dimensions of software development to help developers elevate their code standards.

### Key Features

* **Comprehensive Scoring:** Generates an overall quality score (0-100) and specific metrics for Code Quality, Documentation, Project Structure, Git Practices, and Test Coverage.
* **AI-Driven Insights:** Uses OpenAI GPT-4o to provide context-aware summaries and natural language feedback.
* **Actionable Roadmaps:** Creates a prioritized list of specific steps to improve the repository.
* **Secure & Fast:** Built with Supabase Auth for security and in-memory caching for performance.
* **Modern UI:** A responsive, professional dashboard built with Tailwind CSS v4 and React 19.

---

## Technology Stack

* **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons
* **AI Engine:** Vercel AI SDK, OpenAI GPT-4o, Vercel AI Gateway
* **Backend & Data:** GitHub REST API, Supabase Auth
* **Infrastructure:** Vercel

---

## Architecture & Data Flow

The system follows a streamlined flow to ensure fast and accurate analysis:

```mermaid
graph TD
    A[User Input URL] --> B[GitHub REST API]
    B -->|Raw Metadata & File Structure| C[AI Analysis Engine]
    C -->|GPT-4o Evaluation| D{Analysis Success?}
    D -- Yes --> E[Generate AI Score & Roadmap]
    D -- No --> F[Fallback Rule-Based Scoring]
    E --> G[Results Dashboard]
    F --> G
````

1.  **Data Collection:** Fetches repository metadata, file structure, and commit history via GitHub API.
2.  **AI Processing:** Structured data is sent to GPT-4o via Vercel AI Gateway to evaluate quality dimensions.
3.  **Fallback Logic:** Implements rule-based scoring if AI services are unavailable.
4.  **Presentation:** Results are parsed into JSON and rendered on the client dashboard.

-----

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

  * Node.js 18+
  * Vercel Account (for AI Gateway)
  * Supabase Account

### Installation

1.  **Clone the repository**

    ```bash
    git clone [https://github.com/yourusername/gitgrade.git](https://github.com/yourusername/gitgrade.git)
    cd gitgrade
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file in the root directory:

    ```env
    # Supabase Authentication
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

    # Development
    NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
    ```

4.  **Run the development server**

    ```bash
    npm run dev
    ```

5.  **Access the app**
    Open `http://localhost:3000` in your browser.

-----

## Evaluation Methodology

GitGrade assesses repositories based on the following weighted criteria:

| Dimension | Focus Areas |
| :--- | :--- |
| **Code Quality** | Language consistency, file organization, readability metrics. |
| **Documentation** | README completeness, setup instructions, usage examples. |
| **Project Structure** | Folder hierarchy, configuration files, license presence. |
| **Git Practices** | Commit message quality, frequency, branching strategy. |
| **Test Coverage** | CI/CD pipelines, test file presence, testing framework usage. |

-----

## Limitations

  * Currently supports **public repositories** only.
  * Analysis is limited to the **100 most recent commits** to optimize performance.
  * Subject to **GitHub API rate limits** (60 requests/hr for unauthenticated calls).

-----

## License

This project is licensed under the MIT License.

-----
```
```
