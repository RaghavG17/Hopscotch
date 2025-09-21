"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function QuestionnairePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to basic info page
    router.push('/questionnaire/basic-info')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/5 via-background to-secondary/5 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent mx-auto"></div>
        <p className="mt-4 text-lg text-muted-foreground">Redirecting to questionnaire...</p>
      </div>
    </div>
  )
}