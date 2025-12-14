"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function AnalyzeForm() {
  const [repoUrl, setRepoUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate GitHub URL
    const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/
    if (!githubUrlPattern.test(repoUrl.trim())) {
      setError("Please enter a valid GitHub repository URL")
      return
    }

    setIsLoading(true)

    try {
      // Extract owner and repo from URL
      const match = repoUrl.match(/github\.com\/([\w-]+)\/([\w.-]+)/)
      if (!match) {
        throw new Error("Invalid GitHub URL format")
      }

      const [, owner, repo] = match
      const cleanRepo = repo.replace(/\.git$/, "")

      // Call the analyze API
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ owner, repo: cleanRepo }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to analyze repository")
      }

      const data = await response.json()

      // Navigate to results page with the analysis data
      router.push(`/results?id=${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row gap-3">
        <Input
          type="url"
          placeholder="https://github.com/username/repository"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="flex-1 h-12 text-base"
          disabled={isLoading}
        />
        <Button type="submit" size="lg" disabled={isLoading || !repoUrl.trim()} className="h-12 px-8">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Repository"
          )}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive mt-2 text-left">{error}</p>}
      <p className="text-sm text-muted-foreground mt-3 text-left">
        Enter any public GitHub repository URL to get started
      </p>
    </form>
  )
}
