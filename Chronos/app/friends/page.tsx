"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Search,
  UserPlus,
  MessageCircle,
  Share2,
  Trophy,
  Target,
  Calendar,
} from "lucide-react";
import { AppNavbar } from "@/components/ui/app-navbar";
import { useAuth } from "@/lib/auth-context";

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline";
  mutualGoals: number;
  sharedMilestones: number;
  joinedDate: string;
  currentFocus: string;
  recentAchievement: string;
}

export default function FriendsPage() {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [friends] = useState<Friend[]>([
    {
      id: "1",
      name: "Sarah Chen",
      avatar: "/professional-woman-smiling.png",
      status: "online",
      mutualGoals: 5,
      sharedMilestones: 3,
      joinedDate: "2024-01-15",
      currentFocus: "Career Development",
      recentAchievement: "Completed React certification",
    },
    {
      id: "2",
      name: "Alex Rodriguez",
      avatar: "/young-man-smiling.png",
      status: "online",
      mutualGoals: 3,
      sharedMilestones: 2,
      joinedDate: "2024-02-20",
      currentFocus: "Fitness Goals",
      recentAchievement: "Ran first marathon",
    },
    {
      id: "3",
      name: "Emily Johnson",
      avatar: "/graduate-student-smiling.jpg",
      status: "offline",
      mutualGoals: 7,
      sharedMilestones: 4,
      joinedDate: "2023-11-10",
      currentFocus: "Graduate Studies",
      recentAchievement: "Published research paper",
    },
    {
      id: "4",
      name: "Michael Kim",
      avatar: "/professional-man-smiling.png",
      status: "offline",
      mutualGoals: 2,
      sharedMilestones: 1,
      joinedDate: "2024-03-05",
      currentFocus: "Entrepreneurship",
      recentAchievement: "Launched startup MVP",
    },
  ]);

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AppNavbar />

      {/* Friends Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Your Friends
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Connect with friends, share goals, and motivate each other on your
              journey
            </p>
          </div>

          {/* Search and Stats */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search friends..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Card className="px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">
                    {friends.length} Friends
                  </span>
                </div>
              </Card>
              <Card className="px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full border-2 border-background"></div>
                  <span className="text-sm font-medium">
                    {friends.filter((f) => f.status === "online").length} Online
                  </span>
                </div>
              </Card>
            </div>
          </div>

          {/* Friends Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFriends.map((friend) => (
              <Card
                key={friend.id}
                className="hover:shadow-lg transition-all duration-300"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={friend.avatar || "/placeholder.svg"}
                            alt={friend.name}
                          />
                          <AvatarFallback>
                            {friend.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${friend.status === "online"
                            ? "bg-green-500"
                            : "bg-gray-400"
                            }`}
                        ></div>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{friend.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Joined{" "}
                          {new Date(friend.joinedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Current Focus:
                      </span>
                      <Badge variant="secondary">{friend.currentFocus}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Recent Achievement:
                      </span>
                    </div>
                    <p className="text-sm font-medium">
                      {friend.recentAchievement}
                    </p>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4 text-accent" />
                      <span>{friend.mutualGoals} mutual goals</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Trophy className="w-4 h-4 text-accent" />
                      <span>{friend.sharedMilestones} shared milestones</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Message {friend.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-muted-foreground">
                            Start a conversation with {friend.name} about your
                            shared goals and milestones.
                          </p>
                          <div className="flex gap-2">
                            <Button className="flex-1">Send Message</Button>
                            <Button variant="outline">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFriends.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No friends found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Start connecting with people who share your goals"}
              </p>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Find Friends
              </Button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
