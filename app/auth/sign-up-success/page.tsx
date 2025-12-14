import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GitBranch, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <GitBranch className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold font-mono">GitGrade</h1>
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Check your email</CardTitle>
              <CardDescription className="text-center">We&apos;ve sent you a confirmation link</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                You&apos;ve successfully signed up! Please check your email to confirm your account before signing in.
              </p>
              <Link href="/auth/login" className="w-full">
                <Button variant="outline" className="w-full bg-transparent">
                  Back to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
