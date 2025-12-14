import { Suspense } from "react"
import { ResultsDashboard } from "@/components/results-dashboard"
import { Loader2 } from "lucide-react"

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <ResultsDashboard />
      </Suspense>
    </div>
  )
}
