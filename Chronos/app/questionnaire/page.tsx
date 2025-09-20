"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Calendar, CheckCircle, Sparkles, Target, User, MapPin, Clock, Heart, Trophy } from "lucide-react"
import Link from "next/link"

interface QuestionnaireData {
  name: string
  age: string
  futureMatters: string
  journeyStage: string
  yearPriority: string
  guidingValue: string
  bigGoal: string
}

export default function QuestionnairePage() {
  const [answers, setAnswers] = useState<QuestionnaireData>({
    name: "",
    age: "",
    futureMatters: "",
    journeyStage: "",
    yearPriority: "",
    guidingValue: "",
    bigGoal: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleInputChange = (field: keyof QuestionnaireData, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const isFormValid = () => {
    return Object.values(answers).every((value) => value.trim() !== "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("Questionnaire completed:", answers)
    setIsComplete(true)
    setIsSubmitting(false)
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent/10 via-background to-secondary/10 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl text-center">
          <Card className="border-2 border-accent/20 shadow-2xl bg-card/95 backdrop-blur">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="w-10 h-10 text-accent-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">Welcome to your journey, {answers.name}!</h1>
              <p className="text-lg text-muted-foreground mb-8 text-pretty">
                We're crafting your personalized timeline with AI-powered insights based on your unique path and
                aspirations.
              </p>
              <div className="space-y-4">
                <Button size="lg" className="w-full text-lg py-6 shadow-lg">
                  <Sparkles className="mr-2 w-5 h-5" />
                  Generate My Timeline
                </Button>
                <p className="text-sm text-muted-foreground">
                  This will take just a moment as we analyze your responses
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/5 via-background to-secondary/5">
      <header className="bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-sm">
              <Calendar className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LifeLine</span>
          </Link>
          <div className="text-sm text-muted-foreground">Tell us about yourself</div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Let's build your timeline together
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Answer these questions to help us create a personalized timeline with AI-powered goals and milestones
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card className="border-2 border-accent/10 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <User className="w-6 h-6 mr-3 text-accent" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-lg font-medium">
                      What's your name?
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={answers.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="text-lg py-3 border-2 focus:border-accent/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-lg font-medium">
                      What's your age?
                    </Label>
                    <Input
                      id="age"
                      placeholder="Enter your age"
                      value={answers.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      className="text-lg py-3 border-2 focus:border-accent/50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Future Aspirations */}
            <Card className="border-2 border-accent/10 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Target className="w-6 h-6 mr-3 text-accent" />
                  Your Future Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-lg font-medium">
                    What matters most to you when thinking about your future?
                  </Label>
                  <RadioGroup
                    value={answers.futureMatters}
                    onValueChange={(value) => handleInputChange("futureMatters", value)}
                    className="space-y-3"
                  >
                    {[
                      "Building a successful career",
                      "Growing meaningful relationships",
                      "Traveling & exploring the world",
                      "Achieving financial independence",
                      "Personal growth & learning",
                      "Making a lasting impact",
                    ].map((option) => (
                      <div
                        key={option}
                        className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/5 transition-colors"
                      >
                        <RadioGroupItem value={option} id={`future-${option}`} />
                        <Label htmlFor={`future-${option}`} className="flex-1 cursor-pointer font-medium">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Current Journey Stage */}
            <Card className="border-2 border-accent/10 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <MapPin className="w-6 h-6 mr-3 text-accent" />
                  Where You Are Now
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-lg font-medium">Where are you in your journey right now?</Label>
                  <RadioGroup
                    value={answers.journeyStage}
                    onValueChange={(value) => handleInputChange("journeyStage", value)}
                    className="space-y-3"
                  >
                    {[
                      "High school / College",
                      "Starting my career",
                      "Growing in my career",
                      "Established in my career",
                      "Focused more on personal life than work",
                    ].map((option) => (
                      <div
                        key={option}
                        className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/5 transition-colors"
                      >
                        <RadioGroupItem value={option} id={`journey-${option}`} />
                        <Label htmlFor={`journey-${option}`} className="flex-1 cursor-pointer font-medium">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Next Year Priority */}
            <Card className="border-2 border-accent/10 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Clock className="w-6 h-6 mr-3 text-accent" />
                  Your Next Year Focus
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-lg font-medium">
                    Looking ahead to just the next year, which area is your top priority?
                  </Label>
                  <RadioGroup
                    value={answers.yearPriority}
                    onValueChange={(value) => handleInputChange("yearPriority", value)}
                    className="space-y-3"
                  >
                    {[
                      "Advancing in school or work",
                      "Health & wellness",
                      "Relationships & community",
                      "Travel & new experiences",
                      "Developing a skill or hobby",
                    ].map((option) => (
                      <div
                        key={option}
                        className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/5 transition-colors"
                      >
                        <RadioGroupItem value={option} id={`priority-${option}`} />
                        <Label htmlFor={`priority-${option}`} className="flex-1 cursor-pointer font-medium">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Personal Values & Goals */}
            <Card className="border-2 border-accent/10 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Heart className="w-6 h-6 mr-3 text-accent" />
                  Your Values & Dreams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="guidingValue" className="text-lg font-medium">
                    What's one value or principle that guides your choices in life?
                  </Label>
                  <Textarea
                    id="guidingValue"
                    placeholder="Share the value or principle that guides you..."
                    value={answers.guidingValue}
                    onChange={(e) => handleInputChange("guidingValue", e.target.value)}
                    className="min-h-[120px] text-lg border-2 focus:border-accent/50 resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="bigGoal" className="text-lg font-medium">
                    If you could accomplish one big goal in the next 10 years, what would it be?
                  </Label>
                  <Textarea
                    id="bigGoal"
                    placeholder="Describe your biggest 10-year goal..."
                    value={answers.bigGoal}
                    onChange={(e) => handleInputChange("bigGoal", e.target.value)}
                    className="min-h-[120px] text-lg border-2 focus:border-accent/50 resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="text-center pt-8">
              <Button
                type="submit"
                size="lg"
                disabled={!isFormValid() || isSubmitting}
                className="px-12 py-4 text-lg shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Creating Your Timeline...
                  </>
                ) : (
                  <>
                    <Trophy className="w-5 h-5 mr-2" />
                    Create My Timeline
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                All fields are required to generate your personalized timeline
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
