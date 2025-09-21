"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthModal } from "@/components/auth/auth-modal"
import { SimpleUserMenu } from "@/components/auth/simple-user-menu"
import { useAuth } from "@/lib/auth-context"
import { ArrowRight, Calendar, Users, Target, Heart, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export default function LandingPage() {
  const { currentUser } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 shadow-cherry-soft">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-cherry-soft">
              <Image
                src="/logo.png"
                alt="Chronos Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-foreground hover:translate-x-1 transition-transform duration-300 cursor-pointer">
              Chronos
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-accent transition-all duration-300 font-medium"
            >
              Features
            </Link>
            <Link
              href="#community"
              className="text-muted-foreground hover:text-accent transition-all duration-300 font-medium"
            >
              Community
            </Link>
            <Link
              href="timeline"
              className="text-muted-foreground hover:text-accent transition-all duration-300 font-medium"
            >
              Timeline
            </Link>
          </nav>
          {currentUser ? (
            <SimpleUserMenu />
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="border-accent/30 hover:bg-accent hover:border-accent transition-all duration-300 bg-transparent"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative py-24 lg:py-40 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/gradient.png')" }}
        aria-label="Hero background image"
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-background/40 via-accent/5 to-background/30"
          aria-hidden="true"
        ></div>

        {/* Floating cherry blossom petals */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {/* Large floating petals */}
          <div className="absolute top-20 left-10 w-4 h-4 bg-accent/20 rounded-full blur-sm animate-pulse"></div>
          <div className="absolute top-32 right-20 w-3 h-3 bg-accent/15 rounded-full blur-sm animate-pulse delay-1000"></div>
          <div className="absolute top-60 left-1/4 w-2 h-2 bg-accent/25 rounded-full blur-sm animate-pulse delay-2000"></div>
          <div className="absolute top-80 right-1/3 w-5 h-5 bg-accent/10 rounded-full blur-sm animate-pulse delay-3000"></div>
          <div className="absolute bottom-40 left-1/3 w-3 h-3 bg-accent/20 rounded-full blur-sm animate-pulse delay-4000"></div>
          <div className="absolute bottom-60 right-10 w-4 h-4 bg-accent/15 rounded-full blur-sm animate-pulse delay-500"></div>

          {/* Subtle geometric shapes for depth */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-accent/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/5 w-40 h-40 bg-gradient-to-tl from-accent/3 to-transparent rounded-full blur-3xl"></div>

          {/* Delicate line patterns */}
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent"></div>
          <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/8 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative">
          <div className="max-w-5xl mx-auto text-center">
            <div className="relative mb-8">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-40 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-70 shadow-sm"></div>
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-50 blur-sm"></div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-50"></div>
              <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-40 blur-sm"></div>

              <h1 className="text-5xl md:text-7xl font-bold mb-0 text-balance leading-tight relative">
                <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground bg-clip-text text-transparent">
                  Turn Your Life Into a
                </span>
                <br />
                <span className="bg-gradient-to-r from-foreground/95 via-accent to-foreground/95 bg-clip-text text-transparent relative">
                  Visual Story
                  {/* Multiple blur layers for enhanced glow effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-accent to-foreground/95 bg-clip-text text-transparent blur-2xl opacity-15 -z-10">
                    Visual Story
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-accent to-foreground/95 bg-clip-text text-transparent blur-xl opacity-25 -z-10">
                    Visual Story
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-accent to-foreground/95 bg-clip-text text-transparent blur-lg opacity-35 -z-10">
                    Visual Story
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-accent to-foreground/95 bg-clip-text text-transparent blur-md opacity-40 -z-10">
                    Visual Story
                  </span>
                </span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 text-pretty max-w-3xl mx-auto leading-relaxed">
              Build interactive timelines of your milestones, get AI-powered goal suggestions, and connect with others
              who share your aspirations.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {currentUser ? (
                <Link href="/timeline">
                  <Button
                    size="lg"
                    className="text-lg px-10 py-7 shadow-cherry-glow hover:shadow-cherry-soft transition-all duration-300 gradient-cherry-accent border-0 hover:bg-gradient-to-r hover:from-[#f8b4c7] hover:to-[#f4a6ba]"
                  >
                    Go to Timeline
                    <ArrowRight className="ml-3 w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <Button
                  size="lg"
                  className="group text-lg px-10 py-7 shadow-cherry-glow gradient-cherry-accent border-0 hover:bg-gradient-to-r hover:from-[#f8b4c7] hover:to-[#f4a6ba] transition-all duration-300"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Get Started Free
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-500 ease-in-out" />
                </Button>
              )}
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-10 py-7 bg-background/80 backdrop-blur-sm border-accent/30 hover:bg-accent/25 hover:border-accent/50 transition-all duration-300"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Preview */}
      <section id="timeline" className="py-24 gradient-cherry-subtle">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Your Journey, Visualized
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              See how your milestones come together in a beautiful, scrollable timeline
            </p>
          </div>
        </div>

        {/* Timeline Demo */}
        <div className="text-center py-16 bg-card/50 rounded-3xl mx-6 shadow-cherry-soft">
          <p className="text-muted-foreground text-lg">Replace with a screenshot of our timeline</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Everything You Need to Document Your Journey
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Powerful features designed to help you track, plan, and share your life's most important moments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Timeline Builder */}
            <Card className="border-2 border-border/50 hover:border-accent/50 hover:shadow-cherry-soft transition-all duration-300 bg-card/80 backdrop-blur-sm rounded-2xl">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 gradient-cherry-accent rounded-2xl flex items-center justify-center mb-6 shadow-cherry-soft">
                  <Calendar className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-xl mb-3">Interactive Timeline Builder</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Create beautiful, scrollable timelines with your key milestones. Add photos, descriptions, and context
                  to each moment.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* AI Goals */}
            <Card className="border-2 border-border/50 hover:border-accent/50 hover:shadow-cherry-soft transition-all duration-300 bg-card/80 backdrop-blur-sm rounded-2xl">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 gradient-cherry-accent rounded-2xl flex items-center justify-center mb-6 shadow-cherry-soft">
                  <Target className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-xl mb-3">AI-Powered Goal Suggestions</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Get personalized short-term and long-term goal recommendations based on your milestones and
                  aspirations.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Community */}
            <Card className="border-2 border-border/50 hover:border-accent/50 hover:shadow-cherry-soft transition-all duration-300 bg-card/80 backdrop-blur-sm rounded-2xl">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 gradient-cherry-accent rounded-2xl flex items-center justify-center mb-6 shadow-cherry-soft">
                  <Users className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-xl mb-3">Connect with Like-Minded People</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Find and connect with others who share similar goals, experiences, and aspirations in your journey.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-24 gradient-cherry-subtle">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Join a Community of Achievers
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Connect with others who share your goals and get inspired by their journeys
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Sarah Chen",
                goal: "Software Engineering Career",
                milestone: "Just landed my dream job at Google!",
                avatar: "/sarah-chen.jpg",
              },
              {
                name: "Marcus Johnson",
                goal: "Study Abroad Experience",
                milestone: "Completed semester in Barcelona - life changing!",
                avatar: "/marcus-johnson.jpg",
              },
              {
                name: "Emily Rodriguez",
                goal: "Graduate School",
                milestone: "Accepted to MIT for my Master's degree!",
                avatar: "/emily-rodriguez.jpg",
              },
            ].map((person, index) => (
              <Card
                key={index}
                className="text-center bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-cherry-soft transition-all duration-300 rounded-2xl"
              >
                <CardHeader className="pb-4">
                  <img
                    src={person.avatar || "/placeholder.svg"}
                    alt={person.name}
                    className="w-20 h-20 rounded-full mx-auto mb-6 object-cover shadow-cherry-soft"
                  />
                  <CardTitle className="text-xl mb-3">{person.name}</CardTitle>
                  <Badge variant="secondary" className="mx-auto bg-secondary/80 text-secondary-foreground px-4 py-1">
                    {person.goal}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 text-base leading-relaxed">"{person.milestone}"</p>
                  <div className="flex justify-center space-x-6 text-muted-foreground">
                    <button className="flex items-center space-x-2 hover:text-accent transition-colors duration-300">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm font-medium">24</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-accent transition-colors duration-300">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">8</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative py-24 bg-cover bg-center bg-no-repeat text-accent-foreground shadow-cherry-glow"
        style={{ backgroundImage: "url('/gradient.png')" }}
      >
        <div className="absolute inset-0 bg-background/30" aria-hidden="true"></div>
        <div className="container mx-auto px-6 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-12 text-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Join thousands of users who are already documenting their milestones and achieving their goals with Chronos.
          </p>
          {currentUser ? (
            <Link href="/timeline">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-10 py-7 bg-background text-foreground hover:bg-background/90 shadow-cherry-soft transition-all duration-300"
              >
                Start Building Your Timeline
                <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <Button
              size="lg"
              variant="secondary"
              className="group text-lg px-10 py-7 bg-background text-foreground hover:bg-background/90 shadow-cherry-soft transition-all duration-300"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Sign Up & Take Our Questionnaire
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border/50 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-cherry-soft">
                  <Image
                    src="/logo.png"
                    alt="Chronos Icon"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-2xl font-bold text-foreground">Chronos</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Document your journey, achieve your goals, and connect with your community.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-foreground">Product</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-accent transition-colors duration-300">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-accent transition-colors duration-300">
                    Timeline Builder
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-accent transition-colors duration-300">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-accent transition-colors duration-300">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-foreground">Company</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-accent transition-colors duration-300">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-accent transition-colors duration-300">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-accent transition-colors duration-300">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-accent transition-colors duration-300">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-foreground">Support</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-accent transition-colors duration-300">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-accent transition-colors duration-300">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-accent transition-colors duration-300">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 Chronos. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}
