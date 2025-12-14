import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

// Types for GitHub API responses
interface GitHubRepo {
  name: string
  description: string
  language: string
  languages_url: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  size: number
  created_at: string
  updated_at: string
  pushed_at: string
  has_issues: boolean
  has_wiki: boolean
  default_branch: string
}

interface GitHubCommit {
  commit: {
    author: {
      date: string
    }
    message: string
  }
}

interface GitHubContent {
  name: string
  path: string
  type: string
  size?: number
}

interface AnalysisResult {
  id: string
  repoUrl: string
  owner: string
  repo: string
  score: number
  category: string
  summary: string
  roadmap: string[]
  metrics: {
    codeQuality: number
    documentation: number
    structure: number
    gitPractices: number
    testCoverage: number
  }
  repoData: {
    language: string
    stars: number
    forks: number
    lastUpdated: string
    totalCommits: number
    fileCount: number
  }
  timestamp: string
}

// In-memory storage (in production, use a database)
const analysisCache = new Map<string, AnalysisResult>()

async function fetchGitHubData(owner: string, repo: string) {
  const baseUrl = "https://api.github.com"
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GitGrade-App",
  }

  try {
    // Fetch repository details
    const repoResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}`, { headers })
    if (!repoResponse.ok) {
      throw new Error("Repository not found or is private")
    }
    const repoData: GitHubRepo = await repoResponse.json()

    // Fetch languages
    const languagesResponse = await fetch(repoData.languages_url, { headers })
    const languages = await languagesResponse.json()

    // Fetch commits (last 100)
    const commitsResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}/commits?per_page=100`, { headers })
    const commits: GitHubCommit[] = await commitsResponse.json()

    // Fetch repository contents
    const contentsResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}/contents`, { headers })
    const contents: GitHubContent[] = await contentsResponse.json()

    // Check for README
    const hasReadme = contents.some((item) => item.name.toLowerCase().startsWith("readme"))

    // Check for common files
    const hasGitignore = contents.some((item) => item.name === ".gitignore")
    const hasLicense = contents.some((item) => item.name.toLowerCase().startsWith("license"))
    const hasTests = contents.some(
      (item) =>
        item.name.toLowerCase().includes("test") ||
        item.name.toLowerCase().includes("spec") ||
        item.name === "__tests__",
    )
    const hasCICD = contents.some((item) => item.name === ".github" || item.name === ".gitlab-ci.yml")

    // Count files recursively (approximate)
    const countFiles = (items: GitHubContent[]) => {
      return items.filter((item) => item.type === "file").length
    }

    return {
      repoInfo: repoData,
      languages,
      commits,
      contents,
      metrics: {
        hasReadme,
        hasGitignore,
        hasLicense,
        hasTests,
        hasCICD,
        fileCount: countFiles(contents),
        commitCount: commits.length,
        primaryLanguage: repoData.language || "Unknown",
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
      },
    }
  } catch (error) {
    throw error
  }
}

async function analyzeWithAI(owner: string, repo: string, githubData: any) {
  const { repoInfo, languages, commits, metrics } = githubData

  // Calculate commit consistency
  const commitDates = commits.map((c: GitHubCommit) => new Date(c.commit.author.date))
  const daysBetweenCommits =
    commitDates.length > 1
      ? (commitDates[0].getTime() - commitDates[commitDates.length - 1].getTime()) /
        (1000 * 60 * 60 * 24 * commitDates.length)
      : 0

  const prompt = `You are an expert code reviewer evaluating a GitHub repository. Analyze the following repository data and provide a comprehensive evaluation.

Repository: ${owner}/${repo}
Description: ${repoInfo.description || "No description"}
Primary Language: ${metrics.primaryLanguage}
Stars: ${metrics.stars}
Forks: ${metrics.forks}
Total Commits: ${metrics.commitCount}

Repository Metrics:
- Has README: ${metrics.hasReadme ? "Yes" : "No"}
- Has .gitignore: ${metrics.hasGitignore ? "Yes" : "No"}
- Has License: ${metrics.hasLicense ? "Yes" : "No"}
- Has Tests: ${metrics.hasTests ? "Yes" : "No"}
- Has CI/CD: ${metrics.hasCICD ? "Yes" : "No"}
- File Count: ${metrics.fileCount}
- Average Days Between Commits: ${daysBetweenCommits.toFixed(1)}

Languages Used: ${Object.keys(languages).join(", ")}

Based on this data, provide:

1. A numerical score from 0-100 evaluating overall repository quality
2. Scores for these dimensions (0-100 each):
   - Code Quality & Readability
   - Documentation & Clarity
   - Project Structure & Organization
   - Git Practices & Consistency
   - Test Coverage & Maintainability

3. A 2-3 sentence summary of the repository's strengths and weaknesses
4. A list of 4-6 specific, actionable improvements the developer should make

Format your response as JSON:
{
  "overallScore": <number>,
  "dimensions": {
    "codeQuality": <number>,
    "documentation": <number>,
    "structure": <number>,
    "gitPractices": <number>,
    "testCoverage": <number>
  },
  "summary": "<string>",
  "roadmap": ["<action 1>", "<action 2>", ...]
}

Be honest but constructive. Focus on practical improvements.`

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o",
      prompt,
    })

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response")
    }

    const analysis = JSON.parse(jsonMatch[0])
    return analysis
  } catch (error) {
    console.error("AI Analysis Error:", error)
    // Fallback to basic scoring if AI fails
    return generateFallbackAnalysis(metrics)
  }
}

function generateFallbackAnalysis(metrics: any) {
  let score = 50 // Base score

  // Adjust based on metrics
  if (metrics.hasReadme) score += 10
  if (metrics.hasGitignore) score += 5
  if (metrics.hasLicense) score += 5
  if (metrics.hasTests) score += 15
  if (metrics.hasCICD) score += 10
  if (metrics.commitCount > 50) score += 5

  const category = score >= 80 ? "Advanced" : score >= 60 ? "Intermediate" : "Beginner"

  return {
    overallScore: Math.min(score, 100),
    dimensions: {
      codeQuality: metrics.hasTests ? 70 : 50,
      documentation: metrics.hasReadme ? 80 : 30,
      structure: metrics.fileCount > 5 ? 70 : 50,
      gitPractices: metrics.commitCount > 20 ? 75 : 55,
      testCoverage: metrics.hasTests ? 70 : 20,
    },
    summary: `Repository shows ${category.toLowerCase()} level development practices. ${
      metrics.hasReadme ? "Good documentation present." : "Documentation needs improvement."
    } ${metrics.hasTests ? "Has test coverage." : "Missing test coverage."}`,
    roadmap: [
      !metrics.hasReadme && "Add comprehensive README.md with setup instructions",
      !metrics.hasTests && "Implement unit and integration tests",
      !metrics.hasCICD && "Set up CI/CD pipeline with GitHub Actions",
      !metrics.hasLicense && "Add an appropriate open-source license",
      "Improve code documentation and comments",
      "Follow consistent Git commit message conventions",
    ].filter(Boolean) as string[],
  }
}

export async function POST(request: NextRequest) {
  try {
    const { owner, repo } = await request.json()

    if (!owner || !repo) {
      return NextResponse.json({ error: "Owner and repo are required" }, { status: 400 })
    }

    // Fetch GitHub data
    const githubData = await fetchGitHubData(owner, repo)

    // Analyze with AI
    const analysis = await analyzeWithAI(owner, repo, githubData)

    // Determine category
    const score = analysis.overallScore
    const category = score >= 80 ? "Advanced" : score >= 60 ? "Intermediate" : "Beginner"

    // Create result object
    const result: AnalysisResult = {
      id: `${owner}-${repo}-${Date.now()}`,
      repoUrl: `https://github.com/${owner}/${repo}`,
      owner,
      repo,
      score: analysis.overallScore,
      category,
      summary: analysis.summary,
      roadmap: analysis.roadmap,
      metrics: {
        codeQuality: analysis.dimensions.codeQuality,
        documentation: analysis.dimensions.documentation,
        structure: analysis.dimensions.structure,
        gitPractices: analysis.dimensions.gitPractices,
        testCoverage: analysis.dimensions.testCoverage,
      },
      repoData: {
        language: githubData.metrics.primaryLanguage,
        stars: githubData.metrics.stars,
        forks: githubData.metrics.forks,
        lastUpdated: githubData.repoInfo.updated_at,
        totalCommits: githubData.metrics.commitCount,
        fileCount: githubData.metrics.fileCount,
      },
      timestamp: new Date().toISOString(),
    }

    // Store in cache
    analysisCache.set(result.id, result)

    return NextResponse.json({ id: result.id })
  } catch (error) {
    console.error("Analysis Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze repository" },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 })
  }

  const result = analysisCache.get(id)

  if (!result) {
    return NextResponse.json({ error: "Analysis not found" }, { status: 404 })
  }

  return NextResponse.json(result)
}
