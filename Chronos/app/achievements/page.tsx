"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/ui/navbar";
import { AuthModal } from "@/components/auth/auth-modal";
import { SimpleUserMenu } from "@/components/auth/simple-user-menu";
import { useAuth } from "@/lib/auth-context";
import {
  Trophy,
  Target,
  Star,
  Award,
  Medal,
  Crown,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  Lock,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: "milestone" | "streak" | "social" | "special";
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  isUnlocked: boolean;
}

interface Stats {
  totalAchievements: number;
  unlockedAchievements: number;
  currentStreak: number;
  longestStreak: number;
  milestonesCompleted: number;
  goalsAchieved: number;
}

export default function AchievementsPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const stats: Stats = {
    totalAchievements: 24,
    unlockedAchievements: 12,
    currentStreak: 7,
    longestStreak: 15,
    milestonesCompleted: 8,
    goalsAchieved: 23,
  };

  const achievements: Achievement[] = [
    {
      id: "1",
      title: "First Steps",
      description: "Complete your first milestone",
      icon: <Trophy className="w-6 h-6" />,
      category: "milestone",
      rarity: "common",
      unlockedAt: "2024-01-15",
      isUnlocked: true,
    },
    {
      id: "2",
      title: "Goal Getter",
      description: "Achieve 10 goals",
      icon: <Target className="w-6 h-6" />,
      category: "milestone",
      rarity: "common",
      unlockedAt: "2024-02-20",
      isUnlocked: true,
    },
    {
      id: "3",
      title: "Streak Master",
      description: "Maintain a 7-day streak",
      icon: <Zap className="w-6 h-6" />,
      category: "streak",
      rarity: "rare",
      unlockedAt: "2024-03-10",
      isUnlocked: true,
    },
    {
      id: "4",
      title: "Social Butterfly",
      description: "Connect with 5 friends",
      icon: <Star className="w-6 h-6" />,
      category: "social",
      rarity: "common",
      unlockedAt: "2024-02-28",
      isUnlocked: true,
    },
    {
      id: "5",
      title: "Milestone Marathon",
      description: "Complete 10 milestones",
      icon: <Medal className="w-6 h-6" />,
      category: "milestone",
      rarity: "rare",
      progress: 8,
      maxProgress: 10,
      isUnlocked: false,
    },
    {
      id: "6",
      title: "Consistency King",
      description: "Maintain a 30-day streak",
      icon: <Crown className="w-6 h-6" />,
      category: "streak",
      rarity: "epic",
      progress: 7,
      maxProgress: 30,
      isUnlocked: false,
    },
    {
      id: "7",
      title: "Community Leader",
      description: "Help 10 friends achieve their goals",
      icon: <Award className="w-6 h-6" />,
      category: "social",
      rarity: "epic",
      progress: 3,
      maxProgress: 10,
      isUnlocked: false,
    },
    {
      id: "8",
      title: "Legend",
      description: "Complete 50 milestones",
      icon: <Crown className="w-6 h-6" />,
      category: "special",
      rarity: "legendary",
      progress: 8,
      maxProgress: 50,
      isUnlocked: false,
    },
  ];

  const getRarityColor = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "legendary":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const filteredAchievements = achievements.filter((achievement) => {
    if (activeTab === "all") return true;
    if (activeTab === "unlocked") return achievement.isUnlocked;
    if (activeTab === "locked") return !achievement.isUnlocked;
    return achievement.category === activeTab;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Chronos</span>
          </a>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/timeline" className="text-muted-foreground hover:text-foreground transition-colors">
              Timeline
            </a>
            <a href="/friends" className="text-muted-foreground hover:text-foreground transition-colors">
              Friends
            </a>
            <a href="/achievements" className="text-foreground font-medium">
              Achievements
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            {/* Authentication */}
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
        </div>
      </header>

      {/* Achievements Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Your Achievements
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Track your progress and celebrate your accomplishments
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {stats.unlockedAchievements}
                </div>
                <div className="text-sm text-muted-foreground">Unlocked</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Target className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {stats.totalAchievements}
                </div>
                <div className="text-sm text-muted-foreground">Total</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {stats.currentStreak}
                </div>
                <div className="text-sm text-muted-foreground">
                  Current Streak
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <TrendingUp className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {stats.longestStreak}
                </div>
                <div className="text-sm text-muted-foreground">Best Streak</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <CheckCircle2 className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {stats.milestonesCompleted}
                </div>
                <div className="text-sm text-muted-foreground">Milestones</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Star className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {stats.goalsAchieved}
                </div>
                <div className="text-sm text-muted-foreground">Goals</div>
              </CardContent>
            </Card>
          </div>

          {/* Achievement Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
              <TabsTrigger value="locked">Locked</TabsTrigger>
              <TabsTrigger value="milestone">Milestones</TabsTrigger>
              <TabsTrigger value="streak">Streaks</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAchievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className={`relative overflow-hidden transition-all duration-300 ${achievement.isUnlocked
                      ? "hover:shadow-lg border-accent/20"
                      : "opacity-75 hover:opacity-90"
                      }`}
                  >
                    {!achievement.isUnlocked && (
                      <div className="absolute top-2 right-2 z-10">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}

                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div
                          className={`p-3 rounded-lg ${achievement.isUnlocked
                            ? "bg-accent/10 text-accent"
                            : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {achievement.icon}
                        </div>
                        <Badge
                          variant="outline"
                          className={getRarityColor(achievement.rarity)}
                        >
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">
                        {achievement.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {achievement.isUnlocked ? (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span>
                            Unlocked on{" "}
                            {new Date(
                              achievement.unlockedAt!
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Progress
                            </span>
                            <span className="font-medium">
                              {achievement.progress}/{achievement.maxProgress}
                            </span>
                          </div>
                          <Progress
                            value={
                              (achievement.progress! /
                                achievement.maxProgress!) *
                              100
                            }
                            className="h-2"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {achievement.category}
                        </Badge>
                        {achievement.isUnlocked && (
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(
                                achievement.unlockedAt!
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredAchievements.length === 0 && (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No achievements found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Keep working on your goals to unlock more achievements!
                  </p>
                  <Button asChild>
                    <Link href="/timeline">
                      <Target className="w-4 h-4 mr-2" />
                      View Timeline
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
