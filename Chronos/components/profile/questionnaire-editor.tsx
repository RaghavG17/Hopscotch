"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-context";
import { Save, User, Briefcase, Users, Target, Calendar } from "lucide-react";

interface BasicInfoData {
    name: string;
    age: string;
    journeyStage: string;
    journeyStageOther: string;
    graduation: string;
    schoolName: string;
    graduationYear: string;
    firstJob: string;
    promotion: string;
    retirement: string;
    relationshipStatus: string;
    familyStatus: string;
    movedOut: string;
    hobbies: string;
    interests: string;
    location: string;
    occupation: string;
}

interface FurtherQuestionsData {
    // Personal Growth
    personalShortTermGoal: string;
    personalShortTermHurdles: string;
    personalShortTermTimeline: string;
    personalLongTermGoal: string;
    personalLongTermHurdles: string;
    personalLongTermTimeline: string;

    // Professional Growth
    professionalShortTermGoal: string;
    professionalShortTermHurdles: string;
    professionalShortTermTimeline: string;
    professionalLongTermGoal: string;
    professionalLongTermHurdles: string;
    professionalLongTermTimeline: string;

    // Social Growth
    socialShortTermGoal: string;
    socialShortTermHurdles: string;
    socialShortTermTimeline: string;
    socialLongTermGoal: string;
    socialLongTermHurdles: string;
    socialLongTermTimeline: string;
}

export function QuestionnaireEditor() {
    const { currentUser } = useAuth();
    const [basicInfo, setBasicInfo] = useState<BasicInfoData>({
        name: "",
        age: "",
        journeyStage: "",
        journeyStageOther: "",
        graduation: "",
        schoolName: "",
        graduationYear: "",
        firstJob: "",
        promotion: "",
        retirement: "",
        relationshipStatus: "",
        familyStatus: "",
        movedOut: "",
        hobbies: "",
        interests: "",
        location: "",
        occupation: "",
    });

    const [furtherQuestions, setFurtherQuestions] = useState<FurtherQuestionsData>({
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
    });

    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (currentUser) {
            loadQuestionnaireData();
        }
    }, [currentUser]);

    const loadQuestionnaireData = () => {
        // Load basic info from localStorage
        const storedBasicInfo = localStorage.getItem('questionnaire_basic_info');
        if (storedBasicInfo) {
            setBasicInfo(JSON.parse(storedBasicInfo));
        }

        // Load further questions from localStorage
        const storedFurtherQuestions = localStorage.getItem('questionnaire_further_questions');
        if (storedFurtherQuestions) {
            setFurtherQuestions(JSON.parse(storedFurtherQuestions));
        }
    };

    const handleBasicInfoChange = (field: keyof BasicInfoData, value: string) => {
        setBasicInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFurtherQuestionsChange = (field: keyof FurtherQuestionsData, value: string) => {
        setFurtherQuestions(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Save to localStorage
            localStorage.setItem('questionnaire_basic_info', JSON.stringify(basicInfo));
            localStorage.setItem('questionnaire_further_questions', JSON.stringify(furtherQuestions));

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Error saving questionnaire:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Questionnaire</CardTitle>
                    <CardDescription>Please sign in to manage your questionnaire</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Questionnaire Settings
                </CardTitle>
                <CardDescription>
                    Edit your basic information and growth goals
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="basic">Basic Information</TabsTrigger>
                        <TabsTrigger value="goals">Growth Goals</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={basicInfo.name}
                                    onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="age">Age</Label>
                                <Input
                                    id="age"
                                    value={basicInfo.age}
                                    onChange={(e) => handleBasicInfoChange('age', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="occupation">Occupation</Label>
                                <Input
                                    id="occupation"
                                    value={basicInfo.occupation}
                                    onChange={(e) => handleBasicInfoChange('occupation', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={basicInfo.location}
                                    onChange={(e) => handleBasicInfoChange('location', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="journeyStage">Current Journey Stage</Label>
                            <Input
                                id="journeyStage"
                                value={basicInfo.journeyStage}
                                onChange={(e) => handleBasicInfoChange('journeyStage', e.target.value)}
                                placeholder="e.g., College Student, Young Professional"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="graduation">Education</Label>
                                <Input
                                    id="graduation"
                                    value={basicInfo.graduation}
                                    onChange={(e) => handleBasicInfoChange('graduation', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="schoolName">School/University</Label>
                                <Input
                                    id="schoolName"
                                    value={basicInfo.schoolName}
                                    onChange={(e) => handleBasicInfoChange('schoolName', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="hobbies">Hobbies</Label>
                            <Textarea
                                id="hobbies"
                                value={basicInfo.hobbies}
                                onChange={(e) => handleBasicInfoChange('hobbies', e.target.value)}
                                rows={3}
                                placeholder="What do you enjoy doing in your free time?"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="interests">Interests</Label>
                            <Textarea
                                id="interests"
                                value={basicInfo.interests}
                                onChange={(e) => handleBasicInfoChange('interests', e.target.value)}
                                rows={3}
                                placeholder="What topics or activities interest you?"
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="goals" className="space-y-6">
                        {/* Personal Growth */}
                        <Card className="border-2 border-accent/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-accent" />
                                    Personal Growth
                                    <Badge variant="secondary" className="text-xs">Optional</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="personalShortTermGoal">Short-term Personal Goal</Label>
                                    <Textarea
                                        id="personalShortTermGoal"
                                        value={furtherQuestions.personalShortTermGoal}
                                        onChange={(e) => handleFurtherQuestionsChange('personalShortTermGoal', e.target.value)}
                                        rows={3}
                                        placeholder="e.g., Build better morning routine, improve emotional regulation..."
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="personalShortTermHurdles">Challenges</Label>
                                        <Textarea
                                            id="personalShortTermHurdles"
                                            value={furtherQuestions.personalShortTermHurdles}
                                            onChange={(e) => handleFurtherQuestionsChange('personalShortTermHurdles', e.target.value)}
                                            rows={2}
                                            placeholder="What hurdles do you face?"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="personalShortTermTimeline">Timeline</Label>
                                        <Input
                                            id="personalShortTermTimeline"
                                            value={furtherQuestions.personalShortTermTimeline}
                                            onChange={(e) => handleFurtherQuestionsChange('personalShortTermTimeline', e.target.value)}
                                            placeholder="e.g., 3 months, 6 months"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="personalLongTermGoal">Long-term Personal Vision</Label>
                                    <Textarea
                                        id="personalLongTermGoal"
                                        value={furtherQuestions.personalLongTermGoal}
                                        onChange={(e) => handleFurtherQuestionsChange('personalLongTermGoal', e.target.value)}
                                        rows={3}
                                        placeholder="e.g., Become a confident leader, master emotional intelligence..."
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="personalLongTermHurdles">Long-term Challenges</Label>
                                        <Textarea
                                            id="personalLongTermHurdles"
                                            value={furtherQuestions.personalLongTermHurdles}
                                            onChange={(e) => handleFurtherQuestionsChange('personalLongTermHurdles', e.target.value)}
                                            rows={2}
                                            placeholder="What are the main obstacles?"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="personalLongTermTimeline">Long-term Timeline</Label>
                                        <Input
                                            id="personalLongTermTimeline"
                                            value={furtherQuestions.personalLongTermTimeline}
                                            onChange={(e) => handleFurtherQuestionsChange('personalLongTermTimeline', e.target.value)}
                                            placeholder="e.g., 2 years, 5 years"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Professional Growth */}
                        <Card className="border-2 border-accent/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-accent" />
                                    Professional Growth
                                    <Badge variant="secondary" className="text-xs">Optional</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="professionalShortTermGoal">Short-term Professional Goal</Label>
                                    <Textarea
                                        id="professionalShortTermGoal"
                                        value={furtherQuestions.professionalShortTermGoal}
                                        onChange={(e) => handleFurtherQuestionsChange('professionalShortTermGoal', e.target.value)}
                                        rows={3}
                                        placeholder="e.g., Learn a new skill, get a promotion..."
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="professionalShortTermHurdles">Challenges</Label>
                                        <Textarea
                                            id="professionalShortTermHurdles"
                                            value={furtherQuestions.professionalShortTermHurdles}
                                            onChange={(e) => handleFurtherQuestionsChange('professionalShortTermHurdles', e.target.value)}
                                            rows={2}
                                            placeholder="What hurdles do you face?"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="professionalShortTermTimeline">Timeline</Label>
                                        <Input
                                            id="professionalShortTermTimeline"
                                            value={furtherQuestions.professionalShortTermTimeline}
                                            onChange={(e) => handleFurtherQuestionsChange('professionalShortTermTimeline', e.target.value)}
                                            placeholder="e.g., 6 months, 1 year"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="professionalLongTermGoal">Long-term Professional Vision</Label>
                                    <Textarea
                                        id="professionalLongTermGoal"
                                        value={furtherQuestions.professionalLongTermGoal}
                                        onChange={(e) => handleFurtherQuestionsChange('professionalLongTermGoal', e.target.value)}
                                        rows={3}
                                        placeholder="e.g., Become an expert in your field, start your own business..."
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="professionalLongTermHurdles">Long-term Challenges</Label>
                                        <Textarea
                                            id="professionalLongTermHurdles"
                                            value={furtherQuestions.professionalLongTermHurdles}
                                            onChange={(e) => handleFurtherQuestionsChange('professionalLongTermHurdles', e.target.value)}
                                            rows={2}
                                            placeholder="What are the main obstacles?"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="professionalLongTermTimeline">Long-term Timeline</Label>
                                        <Input
                                            id="professionalLongTermTimeline"
                                            value={furtherQuestions.professionalLongTermTimeline}
                                            onChange={(e) => handleFurtherQuestionsChange('professionalLongTermTimeline', e.target.value)}
                                            placeholder="e.g., 3 years, 5 years"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Growth */}
                        <Card className="border-2 border-accent/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-accent" />
                                    Social Growth
                                    <Badge variant="secondary" className="text-xs">Optional</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="socialShortTermGoal">Short-term Social Goal</Label>
                                    <Textarea
                                        id="socialShortTermGoal"
                                        value={furtherQuestions.socialShortTermGoal}
                                        onChange={(e) => handleFurtherQuestionsChange('socialShortTermGoal', e.target.value)}
                                        rows={3}
                                        placeholder="e.g., Improve communication skills, build deeper friendships..."
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="socialShortTermHurdles">Challenges</Label>
                                        <Textarea
                                            id="socialShortTermHurdles"
                                            value={furtherQuestions.socialShortTermHurdles}
                                            onChange={(e) => handleFurtherQuestionsChange('socialShortTermHurdles', e.target.value)}
                                            rows={2}
                                            placeholder="What hurdles do you face?"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="socialShortTermTimeline">Timeline</Label>
                                        <Input
                                            id="socialShortTermTimeline"
                                            value={furtherQuestions.socialShortTermTimeline}
                                            onChange={(e) => handleFurtherQuestionsChange('socialShortTermTimeline', e.target.value)}
                                            placeholder="e.g., 3 months, 6 months"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="socialLongTermGoal">Long-term Social Vision</Label>
                                    <Textarea
                                        id="socialLongTermGoal"
                                        value={furtherQuestions.socialLongTermGoal}
                                        onChange={(e) => handleFurtherQuestionsChange('socialLongTermGoal', e.target.value)}
                                        rows={3}
                                        placeholder="e.g., Build a strong support network, become a community leader..."
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="socialLongTermHurdles">Long-term Challenges</Label>
                                        <Textarea
                                            id="socialLongTermHurdles"
                                            value={furtherQuestions.socialLongTermHurdles}
                                            onChange={(e) => handleFurtherQuestionsChange('socialLongTermHurdles', e.target.value)}
                                            rows={2}
                                            placeholder="What are the main obstacles?"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="socialLongTermTimeline">Long-term Timeline</Label>
                                        <Input
                                            id="socialLongTermTimeline"
                                            value={furtherQuestions.socialLongTermTimeline}
                                            onChange={(e) => handleFurtherQuestionsChange('socialLongTermTimeline', e.target.value)}
                                            placeholder="e.g., 2 years, 4 years"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="flex items-center justify-between pt-6 border-t mt-6">
                    <div className="text-sm text-muted-foreground">
                        {saved && <span className="text-green-600">Questionnaire saved successfully!</span>}
                    </div>
                    <Button onClick={handleSave} disabled={loading}>
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Saving...' : 'Save Questionnaire'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
