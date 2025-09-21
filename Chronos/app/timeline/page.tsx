"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Sparkles, Target, Clock, Edit3, Save, X, ChevronDown, ChevronUp, Trophy, Calendar, Edit, Check } from "lucide-react"
import { Navbar } from "@/components/ui/navbar"
import {useUserProgress } from "@/context/UserProgressContext";

interface Milestone {
  id: string
  year: string
  title: string
  description: string
  image?: string
  shortTermGoals: string[]
  longTermGoals: string[]
  position: "top" | "bottom"
  category?: string
  completed?: boolean
}

export default function TimelinePage() {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const [viewMode, setViewMode] = useState<"yearly" | "monthly">("yearly")
  const [aiReport, setAiReport] = useState<{ content: string; generatedAt: string } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Check for AI-generated report on component mount
  useEffect(() => {
    const storedReport = localStorage.getItem('ai_generated_timeline_report')
    if (storedReport) {
      setAiReport(JSON.parse(storedReport))
    }
  }, [])

  // Function to generate new timeline using saved questionnaire data
  const generateNewTimeline = async () => {
    // Get saved questionnaire data
    const storedBasicInfo = localStorage.getItem('questionnaire_basic_info')
    const storedAnswers = localStorage.getItem('questionnaire_further_questions')

    if (!storedBasicInfo || !storedAnswers) {
      alert('No questionnaire data found. Please complete the questionnaire first.')
      return
    }

    setIsGenerating(true)

    try {
      const basicInfo = JSON.parse(storedBasicInfo)
      const answers = JSON.parse(storedAnswers)

      const response = await fetch('/api/groq/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: '4', // Using test user ID
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
        setAiReport(reportData)

        // Parse and update timeline with new AI data
        parseAIReportAndUpdateTimeline(data.report.content)

        // Store new report in localStorage
        localStorage.setItem('ai_generated_timeline_report', JSON.stringify(reportData))
      } else {
        console.error('Failed to generate report:', data.error)
        alert('Failed to generate new timeline. Please try again.')
      }
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Error generating new timeline. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: "1",
      year: "Now",
      title: "Current Focus",
      description: "Building my career in software development",
      image: undefined,
      shortTermGoals: ["Complete current project", "Learn React Native"],
      longTermGoals: ["Become a senior developer", "Start my own company"],
      position: "top",
    },
    ...Array.from({ length: 9 }, (_, i) => ({
      id: (i + 2).toString(),
      year: (currentYear + i + 1).toString(),
      title: `Milestone ${currentYear + i + 1}`,
      description: `Goals and aspirations for ${currentYear + i + 1}`,
      image: undefined,
      shortTermGoals: ["Set new goals", "Plan next steps"],
      longTermGoals: ["Achieve long-term vision", "Build lasting impact"],
      position: (i % 2 === 0 ? "bottom" : "top") as "top" | "bottom",
    })),
  ])

  const [monthlyMilestones, setMonthlyMilestones] = useState<Milestone[]>([
    ...Array.from({ length: 12 }, (_, i) => {
      const monthIndex = (currentMonth + i) % 12
      const yearOffset = Math.floor((currentMonth + i) / 12)
      const isCurrentMonth = i === 0
      return {
        id: `m${i + 1}`,
        year: isCurrentMonth ? "Now" : `${monthNames[monthIndex]} ${currentYear + yearOffset}`,
        title: isCurrentMonth ? "Current Month" : `${monthNames[monthIndex]} Goals`,
        description: isCurrentMonth
          ? "Focus on immediate goals and daily progress"
          : `Monthly objectives and milestones for ${monthNames[monthIndex]}`,
        image: undefined,
        shortTermGoals: isCurrentMonth
          ? ["Complete weekly tasks", "Daily skill practice"]
          : ["Weekly targets", "Skill development"],
        longTermGoals: isCurrentMonth
          ? ["Build consistent habits", "Track progress"]
          : ["Monthly achievements", "Progress tracking"],
        position: (i % 2 === 0 ? "top" : "bottom") as "top" | "bottom",
      }
    }),
  ])

  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Milestone | null>(null)

  const currentMilestones = viewMode === "yearly" ? milestones : monthlyMilestones
  const setCurrentMilestones = viewMode === "yearly" ? setMilestones : setMonthlyMilestones

  const handleEditMilestone = (milestone: Milestone) => {
    setSelectedMilestone(milestone)
    setEditForm({ ...milestone })
    setIsEditing(true)
  }

  const handleSaveMilestone = () => {
    if (editForm) {
      setCurrentMilestones((prev) => prev.map((m) => (m.id === editForm.id ? editForm : m)))
      setSelectedMilestone(editForm)
      setIsEditing(false)
    }
  }

  const generateSuggestions = () => {
    // Mock AI suggestions - in real app this would call an AI API
    const suggestions = {
      shortTerm: [
        "Set up weekly progress reviews",
        "Join relevant professional communities",
        "Create a learning schedule",
        "Build a personal brand online",
      ],
      longTerm: [
        "Establish yourself as a thought leader",
        "Build a network of industry connections",
        "Develop expertise in emerging technologies",
        "Create multiple income streams",
      ],
    }

    if (editForm) {
      setEditForm({
        ...editForm,
        shortTermGoals: [...editForm.shortTermGoals, ...suggestions.shortTerm.slice(0, 2)],
        longTermGoals: [...editForm.longTermGoals, ...suggestions.longTerm.slice(0, 2)],
      })
    }
  }


  // Function to parse AI report and update timeline milestones
  const parseAIReportAndUpdateTimeline = (reportContent: string) => {
    // Parse the AI report to extract milestones and update the timeline
    const lines = reportContent.split('\n')
    const aiYearlyMilestones: Milestone[] = []
    const aiMonthlyMilestones: Milestone[] = []

    // Extract yearly milestones from the report
    const yearlyMatches = reportContent.match(/Year (\d+):\s*([\s\S]*?)(?=Year \d+|$)/g)
    if (yearlyMatches) {
      yearlyMatches.forEach((match, index) => {
        const yearMatch = match.match(/Year (\d+):\s*([\s\S]*)/)
        if (yearMatch) {
          const year = yearMatch[1]
          const content = yearMatch[2]

          // Extract the 3 focus items for this year
          const items = content.split('\n').filter(line =>
            line.trim().match(/^\d+\./) && line.trim().length > 0
          ).slice(0, 3)

          if (items.length > 0) {
            aiYearlyMilestones.push({
              id: `ai-year-${index}`,
              year: year,
              title: `Year ${year} Focus Areas`,
              description: items.join(' • '),
              category: "AI Generated",
              completed: false,
              image: undefined,
              shortTermGoals: items.slice(0, 2),
              longTermGoals: items.slice(2, 4),
              position: (index % 2 === 0 ? "bottom" : "top") as "top" | "bottom"
            })
          }
        }
      })
    }

    // Extract monthly milestones from the report
    // Try multiple patterns to catch different AI output formats
    console.log('Parsing report content:', reportContent.substring(0, 500)) // Debug log

    // Pattern 1: "- Month 1 (e.g., "October 2025"):"
    let monthlyMatches = reportContent.match(/- Month \d+ \(.*?\):\s*([\s\S]*?)(?=- Month \d+|Year \d+|$)/g)

    // Pattern 2: "- Month 1: October 2025"
    if (!monthlyMatches || monthlyMatches.length === 0) {
      monthlyMatches = reportContent.match(/- Month \d+:\s*([^:\n]+):\s*([\s\S]*?)(?=- Month \d+|Year \d+|$)/g)
    }

    // Pattern 3: "- October 2025:"
    if (!monthlyMatches || monthlyMatches.length === 0) {
      monthlyMatches = reportContent.match(/- ([^:\n]+ \d{4}):\s*([\s\S]*?)(?=- [^:\n]+ \d{4}|Year \d+|$)/g)
    }

    // Pattern 4: Look for any month names followed by numbered lists
    if (!monthlyMatches || monthlyMatches.length === 0) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
      monthlyMatches = reportContent.match(new RegExp(`- (${monthNames.join('|')}) \\d{4}:\\s*(.*?)(?=- (${monthNames.join('|')}) \\d{4}|Year \\d+|$)`, 'gs'))
    }

    console.log('Found monthly matches:', monthlyMatches?.length || 0) // Debug log

    if (monthlyMatches && monthlyMatches.length > 0) {
      monthlyMatches.forEach((match, index) => {
        let monthName = ''
        let content = ''

        // Try different extraction patterns
        const pattern1 = match.match(/- Month \d+ \(.*?"(.*?)".*?\):\s*([\s\S]*)/)
        const pattern2 = match.match(/- Month \d+:\s*([^:\n]+):\s*([\s\S]*)/)
        const pattern3 = match.match(/- ([^:\n]+ \d{4}):\s*([\s\S]*)/)

        if (pattern1) {
          monthName = pattern1[1]
          content = pattern1[2]
        } else if (pattern2) {
          monthName = pattern2[1]
          content = pattern2[2]
        } else if (pattern3) {
          monthName = pattern3[1]
          content = pattern3[2]
        }

        if (monthName && content) {
          // Extract the 3 actions for this month
          const items = content.split('\n').filter(line =>
            line.trim().match(/^\d+\./) && line.trim().length > 0
          ).slice(0, 3)

          console.log(`Found month: ${monthName}, items: ${items.length}`) // Debug log

          if (items.length > 0) {
            aiMonthlyMilestones.push({
              id: `ai-month-${index}`,
              year: monthName,
              title: `${monthName} Actions`,
              description: items.join(' • '),
              category: "AI Generated",
              completed: false,
              image: undefined,
              shortTermGoals: items.slice(0, 2),
              longTermGoals: items.slice(2, 4),
              position: (index % 2 === 0 ? "bottom" : "top") as "top" | "bottom"
            })
          }
        }
      })
    }

    // Merge AI-generated milestones with existing default milestones
    setMilestones(prevMilestones => {
      const mergedMilestones = [...prevMilestones]

      // Update the "Now" milestone with AI-generated content if available
      if (aiYearlyMilestones.length > 0) {
        const nowIndex = mergedMilestones.findIndex(m => m.year === "Now")
        if (nowIndex !== -1) {
          // Create an AI-generated "Now" milestone using the first year's data
          const firstYearData = aiYearlyMilestones[0]
          mergedMilestones[nowIndex] = {
            ...mergedMilestones[nowIndex],
            title: "Current Focus",
            description: firstYearData.description,
            shortTermGoals: firstYearData.shortTermGoals,
            longTermGoals: firstYearData.longTermGoals,
          }
        }
      }

      // Replace default milestones with AI-generated ones where applicable
      aiYearlyMilestones.forEach(aiMilestone => {
        const existingIndex = mergedMilestones.findIndex(m => m.year === aiMilestone.year)
        if (existingIndex !== -1) {
          // Replace existing milestone with AI-generated one
          mergedMilestones[existingIndex] = aiMilestone
        } else {
          // Add new AI milestone if year doesn't exist
          mergedMilestones.push(aiMilestone)
        }
      })

      return mergedMilestones
    })

    setMonthlyMilestones(prevMilestones => {
      const mergedMilestones = [...prevMilestones]

      // Update the "Now" milestone with AI-generated content if available
      if (aiMonthlyMilestones.length > 0) {
        const nowIndex = mergedMilestones.findIndex(m => m.year === "Now")
        if (nowIndex !== -1) {
          // Create an AI-generated "Now" milestone using the first month's data
          const firstMonthData = aiMonthlyMilestones[0]
          mergedMilestones[nowIndex] = {
            ...mergedMilestones[nowIndex],
            title: "Current Month",
            description: firstMonthData.description,
            shortTermGoals: firstMonthData.shortTermGoals,
            longTermGoals: firstMonthData.longTermGoals,
          }
        }
      }

      // Replace default milestones with AI-generated ones where applicable
      aiMonthlyMilestones.forEach(aiMilestone => {
        const existingIndex = mergedMilestones.findIndex(m => m.year === aiMilestone.year)
        if (existingIndex !== -1) {
          // Replace existing milestone with AI-generated one
          mergedMilestones[existingIndex] = aiMilestone
        }
        // Don't add new months beyond the 12-month limit
      })

      // Ensure we only return exactly 12 months (slice to maintain limit)
      return mergedMilestones.slice(0, 12)
    })
  }

  // Load and parse AI report when component mounts
  useEffect(() => {
    const storedReport = localStorage.getItem('ai_generated_timeline_report')
    if (storedReport) {
      const report = JSON.parse(storedReport)
      setAiReport(report)
      parseAIReportAndUpdateTimeline(report.content)
    }
  }, [])

  // Update timeline when AI report changes
  useEffect(() => {
    if (aiReport) {
      parseAIReportAndUpdateTimeline(aiReport.content)
    }
  }, [aiReport])


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative">
        <Navbar />

        <div className="absolute top-16 right-10">
          <Button
            onClick={() => setViewMode(viewMode === "yearly" ? "monthly" : "yearly")}
            variant="outline"
            size="sm"
            className="group hover:shadow-lg transition-all duration-300 px-4 py-2"
          >
            <div className="flex items-center space-x-2">
              {viewMode === "yearly" ? (
                <>
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                  <span className="text-sm font-medium">Monthly View</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  <span className="text-sm font-medium">Yearly View</span>
                </>
              )}
            </div>
          </Button>
        </div>
      </div>

      {/* Timeline Section */}
      <section className="pt-8 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Your {viewMode === "yearly" ? "Life" : "Monthly"} Timeline
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              {aiReport
                ? (viewMode === "yearly"
                  ? "AI-Generated yearly goals and strategic focus areas"
                  : "AI-Generated monthly actions and milestones")
                : (viewMode === "yearly"
                  ? "Track your journey, set goals, and visualize your path to success"
                  : "Plan your monthly milestones and track short-term progress")
              }
            </p>

            {/* AI Generation Info */}
            {aiReport && (
              <div className="mb-6 flex justify-center">
                <div className="bg-accent/10 px-4 py-2 rounded-full">
                  <span className="text-sm font-medium text-accent">
                    🤖 Generated on {new Date(aiReport.generatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {/* AI Timeline Generation CTA - only show when no AI data */}
            {!aiReport && (
              <Card className="max-w-2xl mx-auto mb-8 border-2 border-accent/20 bg-gradient-to-r from-accent/10 to-secondary/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <Trophy className="w-8 h-8 text-accent mr-3" />
                    <h3 className="text-xl font-semibold">Get Your Personalized AI Timeline</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Generate a detailed, personalized timeline with specific goals and actionable steps based on your aspirations.
                  </p>
                  <Button
                    onClick={() => window.location.href = '/questionnaire/further-questions'}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create My AI Timeline
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="relative">
            <div className="overflow-x-auto pb-8">
              <div className="relative min-w-max px-12">
                {/* Horizontal Timeline Line */}
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-accent/30 rounded-full transform -translate-y-1/2 z-0"></div>

                {/* Staggered Milestones */}
                <div className="flex items-center space-x-32 relative z-10">
                  {currentMilestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex flex-col items-center">
                      <div
                        className={`flex flex-col items-center ${index % 2 === 0 ? "mb-8" : "mt-8 flex-col-reverse"}`}
                      >
                        {/* Year Label */}
                        <h3 className={`text-xl font-bold text-foreground ${index % 2 === 0 ? "mb-4" : "mt-4"}`}>
                          {milestone.year}
                        </h3>

                        {/* Milestone Card */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Card className="w-44 h-44 cursor-pointer hover:shadow-2xl transition-all duration-300 group relative overflow-hidden border-2 border-border hover:border-accent">
                              <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                  backgroundImage: milestone.image ? `url(${milestone.image})` : "none",
                                  backgroundColor: milestone.image ? "transparent" : "#f1f5f9",
                                }}
                              >
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                              </div>
                              <CardContent className="relative z-10 p-4 h-full flex flex-col justify-between text-white">
                                <div>
                                  <h4 className="text-sm font-medium mb-2">{milestone.title}</h4>
                                  <p className="text-xs opacity-90 line-clamp-3">{milestone.description}</p>
                                </div>
                                <Badge variant="secondary" className="self-start text-xs">
                                  {milestone.shortTermGoals.length + milestone.longTermGoals.length} goals
                                </Badge>
                              </CardContent>
                            </Card>
                          </DialogTrigger>
                          <MilestoneModal milestone={milestone} onEdit={() => handleEditMilestone(milestone)} />
                        </Dialog>

                        {/* Connecting Line */}
                        <div
                          className={`w-1 bg-accent/60 ${index % 2 === 0
                            ? "h-12 mb-60" // Top milestones: line goes down to touch middle line
                            : "h-12 mt-60" // Bottom milestones: line goes up to touch middle line
                            }`}
                        ></div>
                      </div>

                      {/* Timeline Dot */}
                      <div className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-accent rounded-full border-2 border-background shadow-lg z-20"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scroll Hint */}
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">← Scroll horizontally to explore your timeline →</p>
            </div>
          </div>

          {/* Action Buttons - only show when AI data is present */}
          {aiReport && (
            <div className="mt-12 flex justify-center gap-4">
              <Button
                onClick={generateNewTimeline}
                variant="outline"
                disabled={isGenerating}
                className="group"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating New {viewMode === "yearly" ? "Yearly" : "Monthly"} Timeline...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                    Generate New Timeline
                  </>
                )}
              </Button>
              <Button
                onClick={() => window.location.href = '/questionnaire/further-questions'}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Edit Goals
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Edit Modal */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit3 className="w-5 h-5" />
              <span>Edit Milestone</span>
            </DialogTitle>
          </DialogHeader>

          {editForm && (
            <div className="p-6">

              {/* All Content */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="year" className="text-base font-medium">
                      Year/Period
                    </Label>
                    <Input
                      id="year"
                      value={editForm.year}
                      onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                      className="mt-2 h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title" className="text-base font-medium">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="mt-2 h-12"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-base font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={4}
                    className="mt-2"
                  />
                </div>

                {/* Goals Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Goals & Next Steps</h3>
                    <Button
                      onClick={generateSuggestions}
                      variant="outline"
                      size="sm"
                      className="px-4 py-2 bg-transparent"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Suggestions
                    </Button>
                  </div>

                  {/* Short Term Goals */}
                  <div>
                    <Label className="flex items-center space-x-2 mb-3 text-base font-medium">
                      <Clock className="w-5 h-5" />
                      <span>Short Term Goals</span>
                    </Label>
                    <div className="space-y-3">
                      {editForm.shortTermGoals.map((goal, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <Input
                            value={goal}
                            onChange={(e) => {
                              const newGoals = [...editForm.shortTermGoals]
                              newGoals[index] = e.target.value
                              setEditForm({ ...editForm, shortTermGoals: newGoals })
                            }}
                            className="h-11"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newGoals = editForm.shortTermGoals.filter((_, i) => i !== index)
                              setEditForm({ ...editForm, shortTermGoals: newGoals })
                            }}
                            className="px-3"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            shortTermGoals: [...editForm.shortTermGoals, ""],
                          })
                        }
                        className="px-4 py-2"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Short Term Goal
                      </Button>
                    </div>
                  </div>

                  {/* Long Term Goals */}
                  <div>
                    <Label className="flex items-center space-x-2 mb-3 text-base font-medium">
                      <Target className="w-5 h-5" />
                      <span>Long Term Goals</span>
                    </Label>
                    <div className="space-y-3">
                      {editForm.longTermGoals.map((goal, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <Input
                            value={goal}
                            onChange={(e) => {
                              const newGoals = [...editForm.longTermGoals]
                              newGoals[index] = e.target.value
                              setEditForm({ ...editForm, longTermGoals: newGoals })
                            }}
                            className="h-11"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newGoals = editForm.longTermGoals.filter((_, i) => i !== index)
                              setEditForm({ ...editForm, longTermGoals: newGoals })
                            }}
                            className="px-3"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            longTermGoals: [...editForm.longTermGoals, ""],
                          })
                        }
                        className="px-4 py-2"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Long Term Goal
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="px-6 py-2">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveMilestone} className="px-6 py-2">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// MilestoneModal component
function MilestoneModal({ milestone, onEdit }: { milestone: Milestone; onEdit: () => void }) {
  const { completedTasks, toggleTask } = useUserProgress()
  
  return (
    <DialogContent className="max-w-3xl p-10">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span className="text-xl">
            {milestone.year} - {milestone.title}
          </span>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">

        <p className="text-muted-foreground text-lg">{milestone.description}</p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold flex items-center space-x-2 mb-3 text-lg">
              <Clock className="w-5 h-5" />
              <span>Short Term Goals</span>
            </h4>
            <div className="space-y-2">
              {milestone.shortTermGoals.map((goal, index) => {
                const taskId = `${milestone.id}-short-${index}`

                return (
                  <div key={taskId} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={!!completedTasks[taskId]}
                      onChange={() => toggleTask(taskId, goal)} // Pass the goal title
                      className="w-4 h-4 accent-accent"
                    />
                    <span className={completedTasks[taskId] ? "line-through text-gray-400" : ""}>
                      {goal}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <h4 className="font-semibold flex items-center space-x-2 mb-3 text-lg">
              <Target className="w-5 h-5" />
              <span>Long Term Goals</span>
            </h4>
            <div className="space-y-2">
              {/* Fixed: Now mapping over longTermGoals instead of shortTermGoals */}
              {milestone.longTermGoals.map((goal, index) => {
                const taskId = `${milestone.id}-long-${index}`

                return (
                  <div key={taskId} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={!!completedTasks[taskId]}
                      onChange={() => toggleTask(taskId, goal)}
                      className="w-4 h-4 accent-accent"
                    />
                    <span className={completedTasks[taskId] ? "line-through text-gray-400" : ""}>
                      {goal}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}
