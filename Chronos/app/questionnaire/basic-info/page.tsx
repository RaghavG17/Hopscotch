"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Calendar, User, ArrowRight, Heart, Briefcase, Home, Star, GraduationCap, Baby, Users, Plane, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface BasicInfoData {
    name: string
    age: string
    // Education details
    graduation: string
    schoolName: string
    graduationYear: string
    // Life milestones
    firstJob: string
    promotion: string
    retirement: string
    relationshipStatus: string
    familyStatus: string
    movedOut: string
    // Personal details
    hobbies: string
    interests: string
    location: string
    occupation: string
}

export default function BasicInfoPage() {
    const router = useRouter()
    const { currentUser, loading } = useAuth()
    const [answers, setAnswers] = useState<BasicInfoData>({
        name: "",
        age: "",
        // Education details
        graduation: "",
        schoolName: "",
        graduationYear: "",
        // Life milestones
        firstJob: "",
        promotion: "",
        retirement: "",
        relationshipStatus: "",
        familyStatus: "",
        movedOut: "",
        // Personal details
        hobbies: "",
        interests: "",
        location: "",
        occupation: "",
    })
    const [isSaving, setIsSaving] = useState(false)

    // Redirect if not authenticated
    useEffect(() => {
        if (!loading && !currentUser) {
            router.push('/')
        }
    }, [currentUser, loading, router])

    const handleInputChange = (field: keyof BasicInfoData, value: string) => {
        const newAnswers = {
            ...answers,
            [field]: value,
        }
        setAnswers(newAnswers)

        // Auto-save to localStorage whenever answers change
        localStorage.setItem('questionnaire_basic_info', JSON.stringify(newAnswers))
    }

    // Load saved data when component mounts
    useEffect(() => {
        const savedAnswers = localStorage.getItem('questionnaire_basic_info')
        if (savedAnswers) {
            setAnswers(JSON.parse(savedAnswers))
        }
    }, [])

    const isFormValid = () => {
        const requiredFields = [
            answers.name.trim(),
            answers.age.trim(),
            answers.occupation.trim(),
            answers.location.trim(),
            answers.graduation.trim(),
        ]
        return requiredFields.every((field) => field !== "")
    }

    const handleNext = async () => {
        if (isFormValid() && currentUser) {
            setIsSaving(true)
            try {
                // Save questionnaire data to database
                const response = await fetch('/api/questionnaire', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firebaseUid: currentUser.uid,
                        questionnaireData: answers
                    }),
                })

                if (response.ok) {
                    // Store in localStorage as backup
                    localStorage.setItem('questionnaire_basic_info', JSON.stringify(answers))
                    router.push('/questionnaire/further-questions')
                } else {
                    console.error('Failed to save questionnaire data')
                    // Still proceed to next step even if save fails
                    localStorage.setItem('questionnaire_basic_info', JSON.stringify(answers))
                    router.push('/questionnaire/further-questions')
                }
            } catch (error) {
                console.error('Error saving questionnaire data:', error)
                // Still proceed to next step even if save fails
                localStorage.setItem('questionnaire_basic_info', JSON.stringify(answers))
                router.push('/questionnaire/further-questions')
            } finally {
                setIsSaving(false)
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-accent/5 via-background to-secondary/5">
            <header className="bg-background/80 backdrop-blur-lg border-b border-border/50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-sm">
                            <Calendar className="w-5 h-5 text-accent-foreground" />
                        </div>
                        <span className="text-xl font-bold text-foreground">Chronos</span>
                    </Link>
                    <div className="text-sm text-muted-foreground">Step 1 of 2</div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                            Let's get to know you
                        </h1>
                        <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
                            Tell us a bit about yourself and where you are in your journey right now
                        </p>
                    </div>

                    <div className="space-y-8">
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
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="occupation" className="text-lg font-medium">
                                            What do you do for work?
                                        </Label>
                                        <Input
                                            id="occupation"
                                            placeholder="Your occupation or field"
                                            value={answers.occupation}
                                            onChange={(e) => handleInputChange("occupation", e.target.value)}
                                            className="text-lg py-3 border-2 focus:border-accent/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-lg font-medium">
                                            Where do you live?
                                        </Label>
                                        <Input
                                            id="location"
                                            placeholder="City, Country"
                                            value={answers.location}
                                            onChange={(e) => handleInputChange("location", e.target.value)}
                                            className="text-lg py-3 border-2 focus:border-accent/50"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Education Details */}
                        <Card className="border-2 border-accent/10 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center text-2xl">
                                    <GraduationCap className="w-6 h-6 mr-3 text-accent" />
                                    Education
                                </CardTitle>
                                <p className="text-muted-foreground">
                                    Tell us about your educational background
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-lg font-medium flex items-center">
                                            <GraduationCap className="w-5 h-5 mr-2 text-accent" />
                                            Graduation Status
                                        </Label>
                                        <Select value={answers.graduation} onValueChange={(value) => handleInputChange("graduation", value)}>
                                            <SelectTrigger className="text-lg py-3 border-2 focus:border-accent/50">
                                                <SelectValue placeholder="Have you graduated?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="high-school">High School Graduate</SelectItem>
                                                <SelectItem value="university">University Graduate</SelectItem>
                                                <SelectItem value="in-progress">Currently Studying</SelectItem>
                                                <SelectItem value="no">Not Yet</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-lg font-medium">
                                            School/University Name
                                        </Label>
                                        <Input
                                            placeholder="e.g., Harvard University, Local High School"
                                            value={answers.schoolName}
                                            onChange={(e) => handleInputChange("schoolName", e.target.value)}
                                            className="text-lg py-3 border-2 focus:border-accent/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-lg font-medium">
                                            Graduation Year
                                        </Label>
                                        <Input
                                            placeholder="e.g., 2020, 2025"
                                            value={answers.graduationYear}
                                            onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                                            className="text-lg py-3 border-2 focus:border-accent/50"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Life Milestones */}
                        <Card className="border-2 border-accent/10 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center text-2xl">
                                    <Star className="w-6 h-6 mr-3 text-accent" />
                                    Life Milestones
                                </CardTitle>
                                <p className="text-muted-foreground">
                                    Tell us about the important moments in your life journey
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-lg font-medium flex items-center">
                                            <Briefcase className="w-5 h-5 mr-2 text-accent" />
                                            First Job
                                        </Label>
                                        <Select value={answers.firstJob} onValueChange={(value) => handleInputChange("firstJob", value)}>
                                            <SelectTrigger className="text-lg py-3 border-2 focus:border-accent/50">
                                                <SelectValue placeholder="Started your first job?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="yes">Yes</SelectItem>
                                                <SelectItem value="no">No</SelectItem>
                                                <SelectItem value="looking">Looking for one</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-lg font-medium flex items-center">
                                            <Star className="w-5 h-5 mr-2 text-accent" />
                                            Promotion
                                        </Label>
                                        <Select value={answers.promotion} onValueChange={(value) => handleInputChange("promotion", value)}>
                                            <SelectTrigger className="text-lg py-3 border-2 focus:border-accent/50">
                                                <SelectValue placeholder="Received a promotion?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="yes">Yes</SelectItem>
                                                <SelectItem value="no">No</SelectItem>
                                                <SelectItem value="multiple">Multiple times</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-lg font-medium flex items-center">
                                            <Heart className="w-5 h-5 mr-2 text-accent" />
                                            Relationship Status
                                        </Label>
                                        <Select value={answers.relationshipStatus} onValueChange={(value) => handleInputChange("relationshipStatus", value)}>
                                            <SelectTrigger className="text-lg py-3 border-2 focus:border-accent/50">
                                                <SelectValue placeholder="What's your relationship status?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="single">Single</SelectItem>
                                                <SelectItem value="dating">Dating</SelectItem>
                                                <SelectItem value="engaged">Engaged</SelectItem>
                                                <SelectItem value="married">Married</SelectItem>
                                                <SelectItem value="divorced">Divorced</SelectItem>
                                                <SelectItem value="widowed">Widowed</SelectItem>
                                                <SelectItem value="separated">Separated</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-lg font-medium flex items-center">
                                            <Users className="w-5 h-5 mr-2 text-accent" />
                                            Family Status
                                        </Label>
                                        <Select value={answers.familyStatus} onValueChange={(value) => handleInputChange("familyStatus", value)}>
                                            <SelectTrigger className="text-lg py-3 border-2 focus:border-accent/50">
                                                <SelectValue placeholder="What's your family status?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="no-children">No children</SelectItem>
                                                <SelectItem value="parent">Parent</SelectItem>
                                                <SelectItem value="expecting">Expecting a child</SelectItem>
                                                <SelectItem value="planning">Planning to have children</SelectItem>
                                                <SelectItem value="grandparent">Grandparent</SelectItem>
                                                <SelectItem value="soon-grandparent">Soon to be grandparent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-lg font-medium flex items-center">
                                            <Home className="w-5 h-5 mr-2 text-accent" />
                                            Moved Out
                                        </Label>
                                        <Select value={answers.movedOut} onValueChange={(value) => handleInputChange("movedOut", value)}>
                                            <SelectTrigger className="text-lg py-3 border-2 focus:border-accent/50">
                                                <SelectValue placeholder="Moved out of parents' home?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="yes">Yes</SelectItem>
                                                <SelectItem value="no">No</SelectItem>
                                                <SelectItem value="back">Moved back</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-lg font-medium flex items-center">
                                            <Plane className="w-5 h-5 mr-2 text-accent" />
                                            Retirement
                                        </Label>
                                        <Select value={answers.retirement} onValueChange={(value) => handleInputChange("retirement", value)}>
                                            <SelectTrigger className="text-lg py-3 border-2 focus:border-accent/50">
                                                <SelectValue placeholder="Are you retired?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="yes">Yes</SelectItem>
                                                <SelectItem value="no">No</SelectItem>
                                                <SelectItem value="planning">Planning for it</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Personal Interests */}
                        <Card className="border-2 border-accent/10 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center text-2xl">
                                    <Star className="w-6 h-6 mr-3 text-accent" />
                                    Personal Interests
                                </CardTitle>
                                <p className="text-muted-foreground">
                                    Tell us about your hobbies and what makes you unique
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <Label htmlFor="hobbies" className="text-lg font-medium">
                                        What are your hobbies and interests?
                                    </Label>
                                    <Textarea
                                        id="hobbies"
                                        placeholder="e.g., Photography, Cooking, Hiking, Reading, Gaming, Sports, Music, Art..."
                                        value={answers.hobbies}
                                        onChange={(e) => handleInputChange("hobbies", e.target.value)}
                                        className="min-h-[100px] text-lg border-2 focus:border-accent/50 resize-none"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <Label htmlFor="interests" className="text-lg font-medium">
                                        What topics or subjects interest you most?
                                    </Label>
                                    <Textarea
                                        id="interests"
                                        placeholder="e.g., Technology, Science, History, Travel, Fashion, Business, Psychology..."
                                        value={answers.interests}
                                        onChange={(e) => handleInputChange("interests", e.target.value)}
                                        className="min-h-[100px] text-lg border-2 focus:border-accent/50 resize-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>


                        <div className="text-center pt-8">
                            <Button
                                onClick={handleNext}
                                size="lg"
                                disabled={!isFormValid() || isSaving}
                                className="px-12 py-4 text-lg shadow-lg disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        Continue to Next Step
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>
                            <p className="text-sm text-muted-foreground mt-4">
                                All fields are required to continue
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
