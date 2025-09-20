"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowRight, ArrowLeft, Calendar, CheckCircle, Sparkles, Target, Users } from "lucide-react"
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

const questions = [
  {
    id: "name",
    title: "What's your name?",
    subtitle: "Let's start with the basics",
    type: "text",
    placeholder: "Enter your name",
    icon: Users,
  },
  {
    id: "age",
    title: "What's your age?",
    subtitle: "This helps us tailor your timeline",
    type: "text",
    placeholder: "Enter your age",
    icon: Calendar,
  },
  {
    id: "futureMatters",
    title: "What matters most to you when thinking about your future?",
    subtitle: "Choose what resonates with your aspirations",
    type: "radio",
    icon: Target,
    options: [
      "Building a successful career",
      "Growing meaningful relationships",
      "Traveling & exploring the world",
      "Achieving financial independence",
      "Personal growth & learning",
      "Making a lasting impact",
    ],
  },
  {
    id: "journeyStage",
    title: "Where are you in your journey right now?",
    subtitle: "Understanding your current stage helps us personalize your experience",
    type: "radio",
    icon: Target,
    options: [
      "High school / College",
      "Starting my career",
      "Growing in my career",
      "Established in my career",
      "Focused more on personal life than work",
    ],
  },
  {
    id: "yearPriority",
    title: "Looking ahead to just the next year, which area is your top priority?",
    subtitle: "Your short-term focus shapes your immediate goals",
    type: "radio",
    icon: Sparkles,
    options: [
      "Advancing in school or work",
      "Health & wellness",
      "Relationships & community",
      "Travel & new experiences",
      "Developing a skill or hobby",
    ],
  },
  {
    id: "guidingValue",
    title: "What's one value or principle that guides your choices in life?",
    subtitle: "This helps us understand what drives your decisions",
    type: "textarea",
    placeholder: "Share the value or principle that guides you...",
    icon: Sparkles,
  },
  {
    id: "bigGoal",
    title: "If you could accomplish one big goal in the next 10 years, what would it be?",
    subtitle: "Dream big - this shapes your long-term timeline",
    type: "textarea",
    placeholder: "Describe your biggest 10-year goal...",
    icon: Target,
  },
]

export default function QuestionnairePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<QuestionnaireData>({
    name: "",
    age: "",
    futureMatters: "",
    journeyStage: "",
    yearPriority: "",
    guidingValue: "",
    bigGoal: "",
  })
  const [isComplete, setIsComplete] = useState(false)

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100
  const IconComponent = currentQuestion.icon

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
  }

  const canProceed = () => {
    const currentAnswer = answers[currentQuestion.id as keyof QuestionnaireData]
    return currentAnswer && currentAnswer.trim() !== ""
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsComplete(true)
      console.log("Questionnaire completed:", answers)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
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
                  <ArrowRight className="ml-2 w-5 h-5" />
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-sm">
              <Calendar className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LifeLine</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              {currentStep + 1} of {questions.length}
            </div>
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-accent/70 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="pt-20 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <IconComponent className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              {currentQuestion.title}
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">{currentQuestion.subtitle}</p>
          </div>

          <Card className="border-2 border-accent/10 shadow-xl bg-card/95 backdrop-blur mb-12">
            <CardContent className="p-8">
              {currentQuestion.type === "text" && (
                <Input
                  placeholder={currentQuestion.placeholder}
                  value={answers[currentQuestion.id as keyof QuestionnaireData]}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="text-xl py-6 border-2 focus:border-accent/50 transition-colors"
                />
              )}

              {currentQuestion.type === "radio" && (
                <RadioGroup
                  value={answers[currentQuestion.id as keyof QuestionnaireData]}
                  onValueChange={handleAnswer}
                  className="space-y-4"
                >
                  {currentQuestion.options?.map((option, index) => (
                    <div key={index} className="group relative">
                      <div className="flex items-center space-x-4 p-6 rounded-xl border-2 border-border hover:border-accent/30 hover:bg-accent/5 transition-all duration-200 cursor-pointer">
                        <RadioGroupItem value={option} id={`option-${index}`} className="text-accent" />
                        <label
                          htmlFor={`option-${index}`}
                          className="flex-1 cursor-pointer text-lg font-medium text-foreground"
                        >
                          {option}
                        </label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentQuestion.type === "textarea" && (
                <Textarea
                  placeholder={currentQuestion.placeholder}
                  value={answers[currentQuestion.id as keyof QuestionnaireData]}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="min-h-[150px] text-lg border-2 focus:border-accent/50 transition-colors resize-none"
                />
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center px-6 py-3 text-lg border-2 hover:border-accent/30 disabled:opacity-50 bg-transparent"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? "bg-accent" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center px-8 py-3 text-lg shadow-lg disabled:opacity-50"
            >
              {currentStep === questions.length - 1 ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Complete
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              Your responses help us create a personalized timeline with AI-powered goals and milestones
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
