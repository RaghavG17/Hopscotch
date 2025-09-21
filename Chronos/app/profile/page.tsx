"use client"
import Image from "next/image"
import type React from "react"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Heart,
  Mail,
  FileText,
  User,
  LogIn,
  Loader2,
  Camera,
  Upload,
} from "lucide-react"
import { AppNavbar } from "@/components/ui/app-navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "@/components/auth/auth-modal"

interface QuestionnaireData {
  name?: string
  age?: string
  graduation?: string
  school_name?: string
  graduation_year?: string
  first_job?: string
  promotion?: string
  retirement?: string
  relationship_status?: string
  family_status?: string
  moved_out?: string
  hobbies?: string
  interests?: string
  location?: string
  occupation?: string
}

const ProfilePage = () => {
  const { currentUser, loading } = useAuth()
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null)
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [isUploadingPicture, setIsUploadingPicture] = useState(false)

  useEffect(() => {
    const fetchQuestionnaireData = async () => {
      if (!currentUser) {
        setIsLoadingData(false)
        return
      }

      try {
        const response = await fetch(`/api/questionnaire?uid=${currentUser.uid}`)
        if (response.ok) {
          const data = await response.json()
          setQuestionnaireData(data.questionnaireData)
          setHasCompletedQuestionnaire(data.hasCompletedQuestionnaire)
        }
      } catch (error) {
        console.error("Error fetching questionnaire data:", error)
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchQuestionnaireData()
  }, [currentUser])

  useEffect(() => {
    const savedProfilePic = localStorage.getItem("chronos-profile-picture")
    if (savedProfilePic) {
      setProfilePicture(savedProfilePic)
    }
  }, [])

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploadingPicture(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProfilePicture(result)
        localStorage.setItem("chronos-profile-picture", result)
        setIsUploadingPicture(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeProfilePicture = () => {
    setProfilePicture(null)
    localStorage.removeItem("chronos-profile-picture")
  }

  const user = {
    username: questionnaireData?.name || currentUser?.displayName || "User",
    displayName: currentUser?.displayName || questionnaireData?.name || "User",
    bio: questionnaireData?.hobbies
      ? `Passionate about ${questionnaireData.hobbies}. ${questionnaireData.interests || "Always exploring new interests and opportunities."}`
      : "Welcome to your Chronos profile! Complete the questionnaire to personalize your experience.",
    profilePic: profilePicture || currentUser?.photoURL || "/placeholder.svg",
    location: questionnaireData?.location || "Location not set",
    joinDate: new Date(currentUser?.metadata?.creationTime || Date.now()).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    occupation: questionnaireData?.occupation || "Occupation not set",
    education:
      questionnaireData?.school_name && questionnaireData?.graduation_year
        ? `${questionnaireData.graduation}, ${questionnaireData.school_name} (${questionnaireData.graduation_year})`
        : "Education not set",
    interests: questionnaireData?.interests
      ? questionnaireData.interests
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i)
      : ["Complete questionnaire to see interests"],
    email: currentUser?.email || "",
    stats: {
      timelineEvents: 0, // TODO: Get from database
      friends: 0, // TODO: Get from database
      achievements: 0, // TODO: Get from database
    },
  }

  return (
    <div>
      <AppNavbar />
      <div className="min-h-screen bg-gradient-cherry-subtle p-4">
        <div className="max-w-4xl mx-auto pt-8">
          {loading || isLoadingData ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : !currentUser ? (
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-16 h-16 bg-secondary/30 rounded-full blur-xl"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-muted/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-accent/25 rounded-full blur-xl"></div>
              </div>

              <div className="max-w-4xl mx-auto pt-8 relative">
                <Card className="bg-card/80 backdrop-blur-sm shadow-cherry-medium border-border">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground mb-2">
                      Sign In to View Your Profile
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mb-6">
                      Create an account or sign in to access your personal timeline, manage your goals, and connect with
                      friends.
                    </CardDescription>
                    <Button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="w-full sm:w-auto gradient-cherry-accent hover:gradient-cherry-accent-hover text-primary-foreground shadow-cherry-soft"
                      size="lg"
                    >
                      <LogIn className="w-5 h-5 mr-2" />
                      Sign In / Sign Up
                    </Button>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Join thousands of users building their life stories with Chronos
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 left-20 w-32 h-32 bg-secondary/20 rounded-full blur-3xl"></div>
                <div className="absolute top-60 right-10 w-40 h-40 bg-muted/15 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-accent/20 rounded-full blur-3xl"></div>

                <div className="absolute top-32 right-1/4 w-2 h-16 bg-gradient-to-b from-accent/40 to-transparent rounded-full rotate-12"></div>
                <div className="absolute bottom-40 left-1/5 w-2 h-20 bg-gradient-to-b from-primary/40 to-transparent rounded-full -rotate-12"></div>
              </div>

              <div className="max-w-4xl mx-auto pt-8 relative">
                <div className="bg-card/80 backdrop-blur-sm shadow-cherry-medium rounded-2xl overflow-hidden border border-border">
                  <div className="h-32 gradient-cherry-accent relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"></div>
                  </div>

                  <div className="relative px-6 pb-6">
                    <div className="absolute -top-16 left-6">
                      <div className="relative group">
                        <div className="w-32 h-32 relative border-4 border-card rounded-full overflow-hidden shadow-cherry-soft ring-4 ring-secondary">
                          <Image
                            src={user.profilePic || "/placeholder.svg"}
                            alt={`${user.username}'s profile picture`}
                            fill
                            className="object-cover"
                          />
                          {isUploadingPicture && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="w-6 h-6 animate-spin text-white" />
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full flex items-center justify-center">
                          <label htmlFor="profile-picture-upload" className="cursor-pointer">
                            <Camera className="w-6 h-6 text-white" />
                          </label>
                        </div>
                        <input
                          id="profile-picture-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureUpload}
                          className="hidden"
                        />
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 gradient-cherry-accent hover:gradient-cherry-accent-hover shadow-cherry-soft"
                          onClick={() => document.getElementById("profile-picture-upload")?.click()}
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="pt-20">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h1 className="text-3xl font-bold text-foreground mb-1">{user.username}</h1>
                          <div className="flex items-center text-muted-foreground mb-4">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{user.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          {profilePicture && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={removeProfilePicture}
                              className="border-border text-muted-foreground hover:bg-secondary bg-transparent"
                            >
                              Remove Photo
                            </Button>
                          )}
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm">{user.email}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-foreground mb-3">About</h2>
                        <p className="text-card-foreground leading-relaxed">{user.bio}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-secondary rounded-lg border border-border">
                          <div className="text-2xl font-bold text-primary">{user.stats.timelineEvents}</div>
                          <div className="text-sm text-muted-foreground">Timeline Events</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg border border-border">
                          <div className="text-2xl font-bold text-accent">{user.stats.friends}</div>
                          <div className="text-sm text-muted-foreground">Friends</div>
                        </div>
                        <div className="text-center p-4 bg-secondary rounded-lg border border-border">
                          <div className="text-2xl font-bold text-primary">{user.stats.achievements}</div>
                          <div className="text-sm text-muted-foreground">Achievements</div>
                        </div>
                      </div>

                      <div className="mb-6">
                        {hasCompletedQuestionnaire ? (
                          <div className="gradient-cherry-subtle rounded-lg p-6 border border-border">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                                  <FileText className="w-5 h-5 mr-2 text-primary" />
                                  Profile Complete
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                  Your profile is personalized with questionnaire data. You can update it anytime.
                                </p>
                              </div>
                              <Link href="/questionnaire">
                                <Button
                                  variant="outline"
                                  className="border-border text-primary hover:bg-secondary bg-transparent"
                                >
                                  <FileText className="w-4 h-4 mr-2" />
                                  Update Profile
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div className="gradient-cherry-subtle rounded-lg p-6 border border-border">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                                  <FileText className="w-5 h-5 mr-2 text-accent" />
                                  Complete Your Profile
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                  Take our questionnaire to personalize your experience and get better recommendations.
                                </p>
                              </div>
                              <Link href="/questionnaire">
                                <Button className="gradient-cherry-accent hover:gradient-cherry-accent-hover text-primary-foreground">
                                  <FileText className="w-4 h-4 mr-2" />
                                  Start Questionnaire
                                </Button>
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                            <Briefcase className="w-5 h-5 mr-2 text-primary" />
                            Professional
                          </h3>
                          <p className="text-card-foreground mb-2">{user.occupation}</p>
                          <div className="flex items-center text-muted-foreground text-sm">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>Joined {user.joinDate}</span>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                            <GraduationCap className="w-5 h-5 mr-2 text-accent" />
                            Education
                          </h3>
                          <p className="text-card-foreground">{user.education}</p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                          <Heart className="w-5 h-5 mr-2 text-primary" />
                          Interests
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {user.interests.map((interest, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium border border-border"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {isAuthModalOpen && <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  )
}

export default ProfilePage
