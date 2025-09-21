"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, Sparkles, Target, Clock, Heart, Trophy, ArrowLeft, User, Briefcase, Users, Brain, BookOpen, MessageCircle, Plus, Minus, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface BasicInfoData {
  name: string
  age: string
  journeyStage: string
  journeyStageOther: string
}

interface FurtherQuestionsData {
  // Personal Growth
  personalShortTermGoal: string
  personalShortTermHurdles: string
  personalShortTermTimeline: string
  personalLongTermGoal: string
  personalLongTermHurdles: string
  personalLongTermTimeline: string

  // Professional Growth
  professionalShortTermGoal: string
  professionalShortTermHurdles: string
  professionalShortTermTimeline: string
  professionalLongTermGoal: string
  professionalLongTermHurdles: string
  professionalLongTermTimeline: string

  // Social Growth
  socialShortTermGoal: string
  socialShortTermHurdles: string
  socialShortTermTimeline: string
  socialLongTermGoal: string
  socialLongTermHurdles: string
  socialLongTermTimeline: string
}


export default function FurtherQuestionsPage() {
  const router = useRouter()
  const { currentUser, loading } = useAuth()
  const [basicInfo, setBasicInfo] = useState<BasicInfoData | null>(null)
  const [answers, setAnswers] = useState<FurtherQuestionsData>({
    // Personal Growth
    personalShortTermGoal: "",
    personalShortTermHurdles: "",
    personalShortTermTimeline: "",
    personalLongTermGoal: "",
    personalLongTermHurdles: "",
    personalLongTermTimeline: "",

    // Professional Growth
    professionalShortTermGoal: "",
    professionalShortTermHurdles: "",
    professionalShortTermTimeline: "",
    professionalLongTermGoal: "",
    professionalLongTermHurdles: "",
    professionalLongTermTimeline: "",

    // Social Growth
    socialShortTermGoal: "",
    socialShortTermHurdles: "",
    socialShortTermTimeline: "",
    socialLongTermGoal: "",
    socialLongTermHurdles: "",
    socialLongTermTimeline: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [report, setReport] = useState<{ content: string; generatedAt: string } | null>(null)
  const [showReport, setShowReport] = useState(false)
  const [isCreatingTimeline, setIsCreatingTimeline] = useState(false)
  const handleInputChange = (field: keyof FurtherQuestionsData, value: string) => {
    const newAnswers = {
      ...answers,
      [field]: value
    }
    setAnswers(newAnswers)

    // Save to localStorage whenever answers change
    localStorage.setItem('questionnaire_further_questions', JSON.stringify(newAnswers))
  }

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !currentUser) {
      router.push('/')
      return
    }

    // Load basic info from localStorage
    const storedBasicInfo = localStorage.getItem('questionnaire_basic_info')
    if (storedBasicInfo) {
      setBasicInfo(JSON.parse(storedBasicInfo))
    } else {
      // If no basic info, redirect back to basic info page
      router.push('/questionnaire/basic-info')
    }

    // Load further questions answers from localStorage
    const storedAnswers = localStorage.getItem('questionnaire_further_questions')
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers))
    }
  }, [router, currentUser, loading])



  // Helper function to parse timeline strings and compare dates
  const parseTimeline = (timeline: string): Date | null => {
    if (!timeline.trim()) return null

    // Try to parse common timeline formats
    const now = new Date()
    const lowerTimeline = timeline.toLowerCase()

    // Handle "X months" format
    const monthsMatch = lowerTimeline.match(/(\d+)\s*months?/)
    if (monthsMatch) {
      const months = parseInt(monthsMatch[1])
      return new Date(now.getFullYear(), now.getMonth() + months, now.getDate())
    }

    // Handle "X years" format
    const yearsMatch = lowerTimeline.match(/(\d+)\s*years?/)
    if (yearsMatch) {
      const years = parseInt(yearsMatch[1])
      return new Date(now.getFullYear() + years, now.getMonth(), now.getDate())
    }

    // Handle "by end of year" format
    if (lowerTimeline.includes('end of year') || lowerTimeline.includes('end of this year')) {
      return new Date(now.getFullYear(), 11, 31)
    }

    // Handle "by next year" format
    if (lowerTimeline.includes('next year')) {
      return new Date(now.getFullYear() + 1, 11, 31)
    }

    // Try to parse as a date
    const parsedDate = new Date(timeline)
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate
    }

    return null
  }

  // Helper function to check completion status of each area
  const getCompletionStatus = () => {
    const personalComplete = answers.personalShortTermGoal.trim() !== "" &&
      answers.personalShortTermTimeline.trim() !== "" &&
      answers.personalLongTermGoal.trim() !== "" &&
      answers.personalLongTermTimeline.trim() !== ""

    const professionalComplete = answers.professionalShortTermGoal.trim() !== "" &&
      answers.professionalShortTermTimeline.trim() !== "" &&
      answers.professionalLongTermGoal.trim() !== "" &&
      answers.professionalLongTermTimeline.trim() !== ""

    const socialComplete = answers.socialShortTermGoal.trim() !== "" &&
      answers.socialShortTermTimeline.trim() !== "" &&
      answers.socialLongTermGoal.trim() !== "" &&
      answers.socialLongTermTimeline.trim() !== ""

    return { personalComplete, professionalComplete, socialComplete }
  }

  const isFormValid = () => {
    const { personalComplete, professionalComplete, socialComplete } = getCompletionStatus()

    // At least one area must be complete
    if (!personalComplete && !professionalComplete && !socialComplete) {
      return false
    }

    // Check timeline validation for completed areas only
    if (personalComplete) {
      const personalShortTerm = parseTimeline(answers.personalShortTermTimeline)
      const personalLongTerm = parseTimeline(answers.personalLongTermTimeline)
      if (personalShortTerm && personalLongTerm && personalLongTerm <= personalShortTerm) {
        return false
      }
    }

    if (professionalComplete) {
      const professionalShortTerm = parseTimeline(answers.professionalShortTermTimeline)
      const professionalLongTerm = parseTimeline(answers.professionalLongTermTimeline)
      if (professionalShortTerm && professionalLongTerm && professionalLongTerm <= professionalShortTerm) {
        return false
      }
    }

    if (socialComplete) {
      const socialShortTerm = parseTimeline(answers.socialShortTermTimeline)
      const socialLongTerm = parseTimeline(answers.socialLongTermTimeline)
      if (socialShortTerm && socialLongTerm && socialLongTerm <= socialShortTerm) {
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid() || !currentUser) return

    setIsSubmitting(true)
    setIsCreatingTimeline(true)

    try {
      // Save further questions data to database
      const response = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUid: currentUser.uid,
          questionnaireData: {
            ...basicInfo,
            ...answers
          }
        }),
      })

      if (response.ok) {
        // Generate AI report and create timeline
        await generateReportAndCreateTimeline()
      } else {
        console.error('Failed to save questionnaire data')
        // Still proceed with timeline creation
        await generateReportAndCreateTimeline()
      }
    } catch (error) {
      console.error('Error saving questionnaire data:', error)
      // Still proceed with timeline creation
      await generateReportAndCreateTimeline()
    } finally {
      setIsSubmitting(false)
      setIsCreatingTimeline(false)
    }
  }

  const generateReportAndCreateTimeline = async () => {
    if (!basicInfo || !currentUser) return

    setIsGeneratingReport(true)

    try {
      // Generate AI report
      const response = await fetch('/api/groq/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.uid,
          questionnaireData: {
            basicInfo,
            furtherQuestions: answers
          }
        }),
      })

      const data = await response.json()

      if (data.success) {
        const reportData = {
          content: data.report.content,
          generatedAt: data.report.generatedAt
        }

        // Store report in localStorage for timeline page access
        localStorage.setItem('ai_generated_timeline_report', JSON.stringify(reportData))

        // Create timeline in database
        await createTimelineFromReport(reportData)

        // Redirect to timeline page
        router.push('/timeline')
      } else {
        console.error('Failed to generate report:', data.error)
        // Still redirect to timeline page
        router.push('/timeline')
      }
    } catch (error) {
      console.error('Error generating report:', error)
      // Still redirect to timeline page
      router.push('/timeline')
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const createTimelineFromReport = async (reportData: any) => {
    try {
      // Create timeline via API
      const timelineResponse = await fetch('/api/timelines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUid: currentUser?.uid,
          title: 'My AI-Generated Timeline',
          description: 'Timeline created from questionnaire responses',
          isPublic: false
        }),
      })

      if (timelineResponse.ok) {
        console.log('Timeline created successfully')
      } else {
        console.error('Failed to create timeline')
      }
    } catch (error) {
      console.error('Error creating timeline:', error)
    }
  }

  const generateReport = async () => {
    if (!basicInfo) return

    setIsGeneratingReport(true)

    // Save answers to localStorage before generating report
    localStorage.setItem('questionnaire_further_questions', JSON.stringify(answers))

    try {
      const response = await fetch('/api/groq/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser?.uid || '4', // Use current user ID or fallback
          questionnaireData: {
            basicInfo,
            furtherQuestions: answers
          }
        }),
      })

      const data = await response.json()

      if (data.success) {
        const reportData = {
          content: data.report.content,
          generatedAt: data.report.generatedAt
        }
        setReport(reportData)
        setShowReport(true)

        // Store report in localStorage for timeline page access
        localStorage.setItem('ai_generated_timeline_report', JSON.stringify(reportData))
      } else {
        console.error('Failed to generate report:', data.error)
      }
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setIsGeneratingReport(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent/10 via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />
          <p className="mt-4 text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!basicInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent/10 via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent/15 via-background to-secondary/15 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl text-center">
          <Card className="border-2 border-accent/20 shadow-2xl bg-card/95 backdrop-blur">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="w-10 h-10 text-accent-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">Welcome to your journey, {basicInfo.name}!</h1>
              <p className="text-lg text-muted-foreground mb-8 text-pretty">
                We're crafting your personalized timeline with AI-powered insights based on your unique path and
                aspirations.
              </p>
              <div className="space-y-4">
                <Button
                  size="lg"
                  className="w-full text-lg py-6 shadow-lg"
                  onClick={generateReport}
                  disabled={isGeneratingReport}
                >
                  {isGeneratingReport ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating Your Report...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 w-5 h-5" />
                      Generate My Timeline Plan
                    </>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Get a structured timeline with yearly focus areas and monthly actions
                </p>
              </div>
            </CardContent>
          </Card>

          {showReport && report && (
            <Card className="mt-8 border-2 border-accent/20 shadow-2xl bg-card/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Trophy className="w-6 h-6 mr-3 text-accent" />
                  Your Personal Timeline Plan
                </CardTitle>
                <p className="text-muted-foreground">
                  Generated on {new Date(report.generatedAt).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none text-left">
                  <div
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: report.content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')
                    }}
                  />
                </div>
                <div className="mt-6 flex justify-center gap-4">
                  <Button
                    onClick={() => router.push('/timeline')}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    View Timeline
                  </Button>
                  <Button
                    onClick={() => setShowReport(false)}
                    variant="outline"
                  >
                    Close Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 via-background to-secondary/10">
      <header className="bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-sm">
              <Calendar className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Chronos</span>
          </Link>
          <div className="text-sm text-muted-foreground">Step 2 of 2</div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Let's build your timeline together
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto mb-4">
              Choose one or more areas of growth to focus on. You only need to complete one area to get started!
            </p>
            <div className="bg-accent/20 border border-accent/40 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-sm text-accent-foreground font-medium">
                💡 Tip: Complete at least one growth area (Personal, Professional, or Social) to generate your timeline. The others are optional add-ons!
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Growth */}
            <Card className="border-2 border-accent/10 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-2xl">
                  <div className="flex items-center">
                    <User className="w-6 h-6 mr-3 text-accent" />
                    Personal Growth
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Optional
                  </Badge>
                </CardTitle>
                <p className="text-muted-foreground">
                  Developing self-awareness, confidence, emotional intelligence, discipline, and a stronger sense of identity
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="personalShortTermGoal" className="text-lg font-medium">
                    What's your short-term personal growth goal?
                  </Label>
                  <Textarea
                    id="personalShortTermGoal"
                    placeholder="e.g., Build better morning routine, improve emotional regulation, develop confidence in public speaking..."
                    value={answers.personalShortTermGoal}
                    onChange={(e) => handleInputChange("personalShortTermGoal", e.target.value)}
                    className="min-h-[100px] text-lg border-2 focus:border-accent/50 resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label htmlFor="personalShortTermHurdles" className="text-lg font-medium">
                      What hurdles or challenges do you face?
                    </Label>
                    <Textarea
                      id="personalShortTermHurdles"
                      placeholder="e.g., Lack of time, self-doubt, old habits, fear of failure..."
                      value={answers.personalShortTermHurdles}
                      onChange={(e) => handleInputChange("personalShortTermHurdles", e.target.value)}
                      className="min-h-[80px] text-lg border-2 focus:border-accent/50 resize-none"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="personalShortTermTimeline" className="text-lg font-medium">
                      When do you want to complete this by?
                    </Label>
                    <Input
                      id="personalShortTermTimeline"
                      placeholder="e.g., 3 months, 6 months, by end of year"
                      value={answers.personalShortTermTimeline}
                      onChange={(e) => handleInputChange("personalShortTermTimeline", e.target.value)}
                      className="text-lg py-3 border-2 focus:border-accent/50"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="personalLongTermGoal" className="text-lg font-medium">
                    What's your long-term personal growth vision?
                  </Label>
                  <Textarea
                    id="personalLongTermGoal"
                    placeholder="e.g., Become a confident leader, master emotional intelligence, develop a strong sense of purpose..."
                    value={answers.personalLongTermGoal}
                    onChange={(e) => handleInputChange("personalLongTermGoal", e.target.value)}
                    className="min-h-[100px] text-lg border-2 focus:border-accent/50 resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="personalLongTermHurdles" className="text-lg font-medium">
                    What are the main obstacles to your long-term personal growth?
                  </Label>
                  <Textarea
                    id="personalLongTermHurdles"
                    placeholder="e.g., Limiting beliefs, past experiences, external pressures, lack of support..."
                    value={answers.personalLongTermHurdles}
                    onChange={(e) => handleInputChange("personalLongTermHurdles", e.target.value)}
                    className="min-h-[80px] text-lg border-2 focus:border-accent/50 resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="personalLongTermTimeline" className="text-lg font-medium">
                    When do you want to achieve your long-term personal growth goal?
                  </Label>
                  <Input
                    id="personalLongTermTimeline"
                    placeholder="e.g., 2 years, 5 years, by 2026, in 3 years"
                    value={answers.personalLongTermTimeline}
                    onChange={(e) => handleInputChange("personalLongTermTimeline", e.target.value)}
                    className="text-lg py-3 border-2 focus:border-accent/50"
                  />
                  {answers.personalShortTermTimeline && answers.personalLongTermTimeline &&
                    parseTimeline(answers.personalShortTermTimeline) && parseTimeline(answers.personalLongTermTimeline) &&
                    parseTimeline(answers.personalLongTermTimeline)! <= parseTimeline(answers.personalShortTermTimeline)! && (
                      <p className="text-sm text-red-500 mt-1">
                        Long-term goal timeline must be after short-term goal timeline
                      </p>
                    )}
                </div>
              </CardContent>
            </Card>

            {/* Professional Growth */}
            <Card className="border-2 border-accent/10 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-2xl">
                  <div className="flex items-center">
                    <Briefcase className="w-6 h-6 mr-3 text-accent" />
                    Professional Growth
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Optional
                  </Badge>
                </CardTitle>
                <p className="text-muted-foreground">
                  Expanding knowledge, skills, and experiences in education, career, or creative pursuits
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="professionalShortTermGoal" className="text-lg font-medium">
                    What's your short-term professional goal?
                  </Label>
                  <Textarea
                    id="professionalShortTermGoal"
                    placeholder="e.g., Learn a new skill, get a promotion, start a side project, complete a certification..."
                    value={answers.professionalShortTermGoal}
                    onChange={(e) => handleInputChange("professionalShortTermGoal", e.target.value)}
                    className="min-h-[100px] text-lg border-2 focus:border-accent/50 resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label htmlFor="professionalShortTermHurdles" className="text-lg font-medium">
                      What hurdles or challenges do you face?
                    </Label>
                    <Textarea
                      id="professionalShortTermHurdles"
                      placeholder="e.g., Time constraints, lack of resources, competition, skill gaps..."
                      value={answers.professionalShortTermHurdles}
                      onChange={(e) => handleInputChange("professionalShortTermHurdles", e.target.value)}
                      className="min-h-[80px] text-lg border-2 focus:border-accent/50 resize-none"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="professionalShortTermTimeline" className="text-lg font-medium">
                      When do you want to complete this by?
                    </Label>
                    <Input
                      id="professionalShortTermTimeline"
                      placeholder="e.g., 6 months, 1 year, by next quarter"
                      value={answers.professionalShortTermTimeline}
                      onChange={(e) => handleInputChange("professionalShortTermTimeline", e.target.value)}
                      className="text-lg py-3 border-2 focus:border-accent/50"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="professionalLongTermGoal" className="text-lg font-medium">
                    What's your long-term professional vision?
                  </Label>
                  <Textarea
                    id="professionalLongTermGoal"
                    placeholder="e.g., Become an expert in your field, start your own business, lead a team, make a significant impact..."
                    value={answers.professionalLongTermGoal}
                    onChange={(e) => handleInputChange("professionalLongTermGoal", e.target.value)}
                    className="min-h-[100px] text-lg border-2 focus:border-accent/50 resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="professionalLongTermHurdles" className="text-lg font-medium">
                    What are the main obstacles to your long-term professional growth?
                  </Label>
                  <Textarea
                    id="professionalLongTermHurdles"
                    placeholder="e.g., Market competition, changing industry, financial constraints, work-life balance..."
                    value={answers.professionalLongTermHurdles}
                    onChange={(e) => handleInputChange("professionalLongTermHurdles", e.target.value)}
                    className="min-h-[80px] text-lg border-2 focus:border-accent/50 resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="professionalLongTermTimeline" className="text-lg font-medium">
                    When do you want to achieve your long-term professional goal?
                  </Label>
                  <Input
                    id="professionalLongTermTimeline"
                    placeholder="e.g., 3 years, 5 years, by 2027, in 4 years"
                    value={answers.professionalLongTermTimeline}
                    onChange={(e) => handleInputChange("professionalLongTermTimeline", e.target.value)}
                    className="text-lg py-3 border-2 focus:border-accent/50"
                  />
                  {answers.professionalShortTermTimeline && answers.professionalLongTermTimeline &&
                    parseTimeline(answers.professionalShortTermTimeline) && parseTimeline(answers.professionalLongTermTimeline) &&
                    parseTimeline(answers.professionalLongTermTimeline)! <= parseTimeline(answers.professionalShortTermTimeline)! && (
                      <p className="text-sm text-red-500 mt-1">
                        Long-term goal timeline must be after short-term goal timeline
                      </p>
                    )}
                </div>
              </CardContent>
            </Card>

            {/* Social Growth */}
            <Card className="border-2 border-accent/10 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-2xl">
                  <div className="flex items-center">
                    <Users className="w-6 h-6 mr-3 text-accent" />
                    Social Growth
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Optional
                  </Badge>
                </CardTitle>
                <p className="text-muted-foreground">
                  Strengthening relationships, communication, empathy, and teamwork. Building community and contributing positively to society
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="socialShortTermGoal" className="text-lg font-medium">
                    What's your short-term social growth goal?
                  </Label>
                  <Textarea
                    id="socialShortTermGoal"
                    placeholder="e.g., Improve communication skills, build deeper friendships, join a community group, volunteer regularly..."
                    value={answers.socialShortTermGoal}
                    onChange={(e) => handleInputChange("socialShortTermGoal", e.target.value)}
                    className="min-h-[100px] text-lg border-2 focus:border-accent/50 resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label htmlFor="socialShortTermHurdles" className="text-lg font-medium">
                      What hurdles or challenges do you face?
                    </Label>
                    <Textarea
                      id="socialShortTermHurdles"
                      placeholder="e.g., Social anxiety, time constraints, difficulty meeting people, communication barriers..."
                      value={answers.socialShortTermHurdles}
                      onChange={(e) => handleInputChange("socialShortTermHurdles", e.target.value)}
                      className="min-h-[80px] text-lg border-2 focus:border-accent/50 resize-none"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="socialShortTermTimeline" className="text-lg font-medium">
                      When do you want to complete this by?
                    </Label>
                    <Input
                      id="socialShortTermTimeline"
                      placeholder="e.g., 3 months, 6 months, by end of year"
                      value={answers.socialShortTermTimeline}
                      onChange={(e) => handleInputChange("socialShortTermTimeline", e.target.value)}
                      className="text-lg py-3 border-2 focus:border-accent/50"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="socialLongTermGoal" className="text-lg font-medium">
                    What's your long-term social growth vision?
                  </Label>
                  <Textarea
                    id="socialLongTermGoal"
                    placeholder="e.g., Build a strong support network, become a community leader, mentor others, create positive social impact..."
                    value={answers.socialLongTermGoal}
                    onChange={(e) => handleInputChange("socialLongTermGoal", e.target.value)}
                    className="min-h-[100px] text-lg border-2 focus:border-accent/50 resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="socialLongTermHurdles" className="text-lg font-medium">
                    What are the main obstacles to your long-term social growth?
                  </Label>
                  <Textarea
                    id="socialLongTermHurdles"
                    placeholder="e.g., Maintaining relationships, finding like-minded people, balancing social and personal time..."
                    value={answers.socialLongTermHurdles}
                    onChange={(e) => handleInputChange("socialLongTermHurdles", e.target.value)}
                    className="min-h-[80px] text-lg border-2 focus:border-accent/50 resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="socialLongTermTimeline" className="text-lg font-medium">
                    When do you want to achieve your long-term social growth goal?
                  </Label>
                  <Input
                    id="socialLongTermTimeline"
                    placeholder="e.g., 2 years, 4 years, by 2026, in 3 years"
                    value={answers.socialLongTermTimeline}
                    onChange={(e) => handleInputChange("socialLongTermTimeline", e.target.value)}
                    className="text-lg py-3 border-2 focus:border-accent/50"
                  />
                  {answers.socialShortTermTimeline && answers.socialLongTermTimeline &&
                    parseTimeline(answers.socialShortTermTimeline) && parseTimeline(answers.socialLongTermTimeline) &&
                    parseTimeline(answers.socialLongTermTimeline)! <= parseTimeline(answers.socialShortTermTimeline)! && (
                      <p className="text-sm text-red-500 mt-1">
                        Long-term goal timeline must be after short-term goal timeline
                      </p>
                    )}
                </div>
              </CardContent>
            </Card>


            {/* Completion Status */}
            {(() => {
              const { personalComplete, professionalComplete, socialComplete } = getCompletionStatus()
              const completedAreas = [personalComplete && 'Personal', professionalComplete && 'Professional', socialComplete && 'Social'].filter(Boolean)

              return (
                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Completion Status:</p>
                  <div className="flex flex-wrap gap-2">
                    {completedAreas.length > 0 ? (
                      completedAreas.map((area, index) => (
                        <Badge key={index} variant="default" className="text-xs">
                          ✓ {area} Complete
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        No areas completed yet
                      </Badge>
                    )}
                  </div>
                  {completedAreas.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Ready to create your timeline! {completedAreas.length === 1 ? 'You can add more areas later.' : 'Great job completing multiple areas!'}
                    </p>
                  )}
                </div>
              )
            })()}

            <div className="flex justify-between pt-8">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.push('/questionnaire/basic-info')}
                className="px-8 py-4 text-lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Basic Info
              </Button>

              <Button
                type="submit"
                size="lg"
                disabled={!isFormValid() || isSubmitting || isCreatingTimeline}
                className="px-12 py-4 text-lg shadow-lg disabled:opacity-50"
              >
                {isSubmitting || isCreatingTimeline ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Your Timeline...
                  </>
                ) : (
                  <>
                    <Trophy className="w-5 h-5 mr-2" />
                    Create My Timeline
                  </>
                )}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Complete at least one growth area (Personal, Professional, or Social) to generate your personalized timeline
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
