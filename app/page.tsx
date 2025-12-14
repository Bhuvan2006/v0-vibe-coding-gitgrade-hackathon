import { AnalyzeForm } from "@/components/analyze-form"
import { GitBranch, Code2, TrendingUp, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold font-mono">GitGrade</h1>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How it works
            </a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            {/* Login/Logout Buttons */}
            {user ? (
              <form action="/auth/logout" method="post">
                <Button variant="ghost" size="sm" type="submit">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </form>
            ) : (
              <Link href="/auth/login">
                <Button variant="default" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Code2 className="h-4 w-4" />
            AI-Powered Repository Analysis
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Turn Your GitHub Into a<span className="text-primary"> Grade Report</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 text-balance max-w-2xl mx-auto leading-relaxed">
            Get instant feedback on code quality, documentation, and best practices. Receive a personalized roadmap to
            level up your projects.
          </p>

          {/* Analyze Form */}
          <AnalyzeForm />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-start gap-4 p-6 rounded-lg bg-card border border-border">
              <div className="p-3 rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Smart Scoring</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get a comprehensive 0-100 score based on code quality, structure, documentation, and Git practices.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 p-6 rounded-lg bg-card border border-border">
              <div className="p-3 rounded-lg bg-secondary/10">
                <Code2 className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">Honest Feedback</h3>
              <p className="text-muted-foreground leading-relaxed">
                Receive clear, actionable insights about what's working and what needs improvement in your codebase.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 p-6 rounded-lg bg-card border border-border">
              <div className="p-3 rounded-lg bg-accent/10">
                <GitBranch className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Growth Roadmap</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get a personalized action plan with specific steps to improve your repository and coding skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-20 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">How It Works</h3>
          <p className="text-muted-foreground mb-12 text-lg leading-relaxed">
            Our AI analyzes your repository across multiple dimensions to give you comprehensive feedback.
          </p>
          <div className="grid gap-6 text-left">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Paste Your Repo URL</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Simply paste any public GitHub repository URL into the input field above.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">AI Analysis</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Our system fetches repository data and evaluates code quality, structure, documentation, tests, and
                  Git practices.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">Get Your Results</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Receive your score, detailed summary, and a personalized roadmap to improve your project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <GitBranch className="h-5 w-5" />
              <span className="text-sm">Built for developers, by developers</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 GitGrade. Empowering coders everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
