"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthModal } from "@/components/auth/auth-modal"
import { SimpleUserMenu } from "@/components/auth/simple-user-menu"
import { DebugAuth } from "@/components/auth/debug-auth"
import { useAuth } from "@/lib/auth-context"
import {
  ArrowRight,
  Calendar,
  Users,
  Target,
  Camera,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function LandingPage() {
  const { currentUser } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LifeLine</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#community" className="text-muted-foreground hover:text-foreground transition-colors">
              Community
            </Link>
            <Link href="#timeline" className="text-muted-foreground hover:text-foreground transition-colors">
              Timeline
            </Link>
          </nav>
          {currentUser ? (
            <SimpleUserMenu />
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-secondary/5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              ✨ Craft Your Journey, Connect with Your Community
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Turn Your Life Into a<span className="text-accent"> Visual Story</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              Build interactive timelines of your milestones, get AI-powered goal suggestions, and connect with others
              who share your aspirations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6"
                onClick={() => setIsAuthModalOpen(true)}
              >
                {currentUser ? 'Go to Dashboard' : 'Get Started Free'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Timeline Preview */}
      <section id="timeline" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Your Journey, Visualized</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how your milestones come together in a beautiful, scrollable timeline
            </p>
          </div>

          {/* Timeline Demo */}
          <div className="relative max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6">
              <div className="flex space-x-6 overflow-x-auto pb-4">
                {/* Timeline Items */}
                {[
                  {
                    title: "Started College",
                    date: "Sep 2020",
                    description: "Began Computer Science at State University",
                    image: "/vibrant-college-campus.png",
                  },
                  {
                    title: "First Internship",
                    date: "Jun 2022",
                    description: "Software Engineering Intern at TechCorp",
                    image: "/modern-office-workspace.png",
                  },
                  {
                    title: "Studied Abroad",
                    date: "Jan 2023",
                    description: "Semester in Tokyo, Japan",
                    image: "/tokyo-skyline.png",
                  },
                  {
                    title: "Graduation",
                    date: "May 2024",
                    description: "BS in Computer Science, Magna Cum Laude",
                    image: "/graduation-ceremony.png",
                  },
                ].map((milestone, index) => (
                  <div key={index} className="flex-shrink-0 w-80">
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{milestone.date}</Badge>
                          <Camera className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-lg">{milestone.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <img
                          src={milestone.image || "/placeholder.svg"}
                          alt={milestone.title}
                          className="w-full h-32 object-cover rounded-md mb-3"
                        />
                        <CardDescription className="text-sm">{milestone.description}</CardDescription>
                        <div className="mt-3 flex flex-wrap gap-1">
                          <Badge variant="secondary" className="text-xs">
                            Goal: Land Full-time Role
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Document Your Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you track, plan, and share your life's most important moments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Timeline Builder */}
            <Card className="border-2 hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Interactive Timeline Builder</CardTitle>
                <CardDescription>
                  Create beautiful, scrollable timelines with your key milestones. Add photos, descriptions, and context
                  to each moment.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* AI Goals */}
            <Card className="border-2 hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>AI-Powered Goal Suggestions</CardTitle>
                <CardDescription>
                  Get personalized short-term and long-term goal recommendations based on your milestones and
                  aspirations.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Community */}
            <Card className="border-2 hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Connect with Like-Minded People</CardTitle>
                <CardDescription>
                  Find and connect with others who share similar goals, experiences, and aspirations in your journey.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Join a Community of Achievers</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with others who share your goals and get inspired by their journeys
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Sarah Chen",
                goal: "Software Engineering Career",
                milestone: "Just landed my dream job at Google!",
                avatar: "/professional-woman-smiling.png",
              },
              {
                name: "Marcus Johnson",
                goal: "Study Abroad Experience",
                milestone: "Completed semester in Barcelona - life changing!",
                avatar: "/young-man-smiling.png",
              },
              {
                name: "Emily Rodriguez",
                goal: "Graduate School",
                milestone: "Accepted to MIT for my Master's degree!",
                avatar: "/graduate-student-smiling.jpg",
              },
            ].map((person, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <img
                    src={person.avatar || "/placeholder.svg"}
                    alt={person.name}
                    className="w-16 h-16 rounded-full mx-auto mb-4"
                  />
                  <CardTitle className="text-lg">{person.name}</CardTitle>
                  <Badge variant="secondary" className="mx-auto">
                    {person.goal}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">"{person.milestone}"</p>
                  <div className="flex justify-center space-x-4 text-muted-foreground">
                    <button className="flex items-center space-x-1 hover:text-accent transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">24</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-accent transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">8</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent text-accent-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-accent-foreground/90 max-w-2xl mx-auto">
            Join thousands of users who are already documenting their milestones and achieving their goals with
            LifeLine.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6"
            onClick={() => setIsAuthModalOpen(true)}
          >
            {currentUser ? 'Start Building Your Timeline' : 'Sign Up & Take Our Questionnaire'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-sm mt-4 text-accent-foreground/70">
            Free to start • No credit card required • 5-minute setup
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="text-xl font-bold">LifeLine</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Document your journey, achieve your goals, and connect with your community.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Timeline Builder
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 LifeLine. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Debug Component */}
      <DebugAuth />
    </div>
  )
}
