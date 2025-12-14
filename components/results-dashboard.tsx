"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  GitBranch,
  Star,
  GitFork,
  Code2,
  FileText,
  Box,
  GitCommit,
  TestTube,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  Calendar,
} from "lucide-react"

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

export function ResultsDashboard() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const id = searchParams.get("id")
    if (!id) {
      setError("No analysis ID provided")
      setIsLoading(false)
      return
    }

    // Fetch analysis result
    fetch(`/api/analyze?id=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Analysis not found")
        return res.json()
      })
      .then((data) => {
        setResult(data)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setIsLoading(false)
      })
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Code2 className="h-12 w-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Analyzing repository...</p>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || "Analysis not found"}</p>
          <Button onClick={() => router.push("/")}>Go Back</Button>
        </div>
      </div>
    )
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Advanced":
        return "bg-accent text-accent-foreground"
      case "Intermediate":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent"
    if (score >= 60) return "text-secondary"
    return "text-muted-foreground"
  }

  const metrics = [
    { label: "Code Quality", value: result.metrics.codeQuality, icon: Code2 },
    { label: "Documentation", value: result.metrics.documentation, icon: FileText },
    { label: "Structure", value: result.metrics.structure, icon: Box },
    { label: "Git Practices", value: result.metrics.gitPractices, icon: GitCommit },
    { label: "Test Coverage", value: result.metrics.testCoverage, icon: TestTube },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Analyze Another Repo
        </Button>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GitBranch className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold font-mono">{result.repo}</h1>
            </div>
            <p className="text-muted-foreground">by {result.owner}</p>
          </div>
          <Button variant="outline" asChild>
            <a href={result.repoUrl} target="_blank" rel="noopener noreferrer">
              View on GitHub
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      {/* Score Card */}
      <Card className="p-8 mb-8 bg-gradient-to-br from-card to-muted/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Overall Score</span>
            </div>
            <div className={`text-7xl font-bold ${getScoreColor(result.score)}`}>{result.score}</div>
            <div className="text-muted-foreground text-sm mt-1">out of 100</div>
            <Badge className={`mt-4 ${getCategoryColor(result.category)}`}>{result.category}</Badge>
          </div>

          <div className="flex-1 w-full max-w-md">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Code2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{result.repoData.language}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{result.repoData.stars} stars</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <GitFork className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{result.repoData.forks} forks</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <GitCommit className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{result.repoData.totalCommits} commits</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{result.repoData.fileCount} files</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {new Date(result.repoData.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Summary
        </h2>
        <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
      </Card>

      {/* Metrics */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Detailed Metrics
        </h2>
        <div className="space-y-6">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{metric.label}</span>
                </div>
                <span className={`font-semibold ${getScoreColor(metric.value)}`}>{metric.value}/100</span>
              </div>
              <Progress value={metric.value} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* Roadmap */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Personalized Roadmap
        </h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Follow these actionable steps to improve your repository:
        </p>
        <div className="space-y-3">
          {result.roadmap.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold mt-0.5">
                {index + 1}
              </div>
              <p className="text-sm leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Analysis completed on {new Date(result.timestamp).toLocaleString()}
        </p>
        <Button onClick={() => router.push("/")} size="lg">
          Analyze Another Repository
        </Button>
      </div>
    </div>
  )
}
