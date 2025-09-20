"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from "@/lib/auth-context";
import { ProfileForm } from "@/components/profile/profile-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Calendar,
    Target,
    Users,
    Plus,
    Settings,
    BarChart3,
    Timeline as TimelineIcon
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const { currentUser } = useAuth();
    const [timelines, setTimelines] = useState<any[]>([]);
    const [goals, setGoals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            fetchUserData();
        }
    }, [currentUser]);

    const fetchUserData = async () => {
        if (!currentUser) return;

        try {
            // Fetch timelines
            const timelinesResponse = await fetch(`/api/timelines?uid=${currentUser.uid}`);
            if (timelinesResponse.ok) {
                const timelinesData = await timelinesResponse.json();
                setTimelines(timelinesData);
            }

            // Fetch goals
            const goalsResponse = await fetch(`/api/goals?uid=${currentUser.uid}`);
            if (goalsResponse.ok) {
                const goalsData = await goalsResponse.json();
                setGoals(goalsData);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>Access Denied</CardTitle>
                        <CardDescription>
                            Please sign in to access your dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <Link href="/">
                            <Button>Go to Homepage</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-accent-foreground" />
                        </div>
                        <span className="text-xl font-bold text-foreground">Chronos Dashboard</span>
                    </div>
                    <Link href="/">
                        <Button variant="outline" size="sm">
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Welcome back, {currentUser.displayName || 'User'}!
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your timelines, goals, and profile from your dashboard
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Timelines</CardTitle>
                            <TimelineIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{timelines.length}</div>
                            <p className="text-xs text-muted-foreground">
                                {timelines.length === 0 ? 'No timelines yet' : 'Active timelines'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Goals</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{goals.length}</div>
                            <p className="text-xs text-muted-foreground">
                                {goals.length === 0 ? 'No goals set' : 'Active goals'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Milestones</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {timelines.reduce((total, timeline) => total + (timeline.milestoneCount || 0), 0)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total milestones
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Communities</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">
                                Joined communities
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="timelines">Timelines</TabsTrigger>
                        <TabsTrigger value="goals">Goals</TabsTrigger>
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TimelineIcon className="w-5 h-5" />
                                        Recent Timelines
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {timelines.length === 0 ? (
                                        <div className="text-center py-8">
                                            <TimelineIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                            <p className="text-muted-foreground mb-4">No timelines created yet</p>
                                            <Button>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Create Timeline
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {timelines.slice(0, 3).map((timeline) => (
                                                <div key={timeline.id} className="border rounded-lg p-4">
                                                    <h3 className="font-medium">{timeline.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{timeline.description}</p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-xs text-muted-foreground">
                                                            {timeline.milestoneCount || 0} milestones
                                                        </span>
                                                        <span className={`text-xs px-2 py-1 rounded ${timeline.is_public
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {timeline.is_public ? 'Public' : 'Private'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="w-5 h-5" />
                                        Active Goals
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {goals.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                            <p className="text-muted-foreground mb-4">No goals set yet</p>
                                            <Button>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Set Goal
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {goals.slice(0, 3).map((goal) => (
                                                <div key={goal.id} className="border rounded-lg p-4">
                                                    <h3 className="font-medium">{goal.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-xs text-muted-foreground">
                                                            {goal.target_date ? `Due: ${new Date(goal.target_date).toLocaleDateString()}` : 'No deadline'}
                                                        </span>
                                                        <span className={`text-xs px-2 py-1 rounded ${goal.priority === 'high'
                                                            ? 'bg-red-100 text-red-800'
                                                            : goal.priority === 'medium'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-green-100 text-green-800'
                                                            }`}>
                                                            {goal.priority}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="timelines" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Timelines</CardTitle>
                                <CardDescription>
                                    Create and manage your life timelines
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <TimelineIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium mb-2">Timeline Management</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Timeline management features coming soon!
                                    </p>
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create New Timeline
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="goals" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Goals</CardTitle>
                                <CardDescription>
                                    Set and track your personal and professional goals
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium mb-2">Goal Management</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Goal management features coming soon!
                                    </p>
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Set New Goal
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="profile" className="space-y-6">
                        <ProfileForm />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
