"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
} from "lucide-react";
import { AppNavbar } from "@/components/ui/app-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "@/components/auth/auth-modal";

interface QuestionnaireData {
  name?: string;
  age?: string;
  graduation?: string;
  school_name?: string;
  graduation_year?: string;
  first_job?: string;
  promotion?: string;
  retirement?: string;
  relationship_status?: string;
  family_status?: string;
  moved_out?: string;
  hobbies?: string;
  interests?: string;
  location?: string;
  occupation?: string;
}

const ProfilePage = () => {
  const { currentUser, loading } = useAuth();
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null);
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Fetch questionnaire data when user is authenticated
  useEffect(() => {
    const fetchQuestionnaireData = async () => {
      if (!currentUser) {
        setIsLoadingData(false);
        return;
      }

      try {
        const response = await fetch(`/api/questionnaire?uid=${currentUser.uid}`);
        if (response.ok) {
          const data = await response.json();
          setQuestionnaireData(data.questionnaireData);
          setHasCompletedQuestionnaire(data.hasCompletedQuestionnaire);
        }
      } catch (error) {
        console.error('Error fetching questionnaire data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchQuestionnaireData();
  }, [currentUser]);

  // Show loading state
  if (loading || isLoadingData) {
    return (
      <div>
        <AppNavbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="max-w-4xl mx-auto pt-8">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show sign-in prompt for unauthenticated users
  if (!currentUser) {
    return (
      <div>
        <AppNavbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="max-w-4xl mx-auto pt-8">
            <Card className="bg-white shadow-xl">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Sign In to View Your Profile
                </CardTitle>
                <CardDescription className="text-gray-600 mb-6">
                  Create an account or sign in to access your personal timeline, manage your goals, and connect with friends.
                </CardDescription>
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full sm:w-auto"
                  size="lg"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In / Sign Up
                </Button>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-500">
                  Join thousands of users building their life stories with Chronos
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }

  // Prepare user data from authentication and questionnaire
  const user = {
    username: questionnaireData?.name || currentUser.displayName || "User",
    displayName: currentUser.displayName || questionnaireData?.name || "User",
    bio: questionnaireData?.hobbies ?
      `Passionate about ${questionnaireData.hobbies}. ${questionnaireData.interests || 'Always exploring new interests and opportunities.'}` :
      "Welcome to your Chronos profile! Complete the questionnaire to personalize your experience.",
    profilePic: currentUser.photoURL || "/placeholder.svg",
    location: questionnaireData?.location || "Location not set",
    joinDate: new Date(currentUser.metadata.creationTime || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    occupation: questionnaireData?.occupation || "Occupation not set",
    education: questionnaireData?.school_name && questionnaireData?.graduation_year ?
      `${questionnaireData.graduation}, ${questionnaireData.school_name} (${questionnaireData.graduation_year})` :
      "Education not set",
    interests: questionnaireData?.interests ?
      questionnaireData.interests.split(',').map(i => i.trim()).filter(i => i) :
      ["Complete questionnaire to see interests"],
    email: currentUser.email || "",
    stats: {
      timelineEvents: 0, // TODO: Get from database
      friends: 0, // TODO: Get from database
      achievements: 0, // TODO: Get from database
    },
  };

  return (
    <div>
      <AppNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            {/* Cover Section */}
            <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

            {/* Profile Info Section */}
            <div className="relative px-6 pb-6">
              {/* Profile Picture */}
              <div className="absolute -top-16 left-6">
                <div className="w-32 h-32 relative border-4 border-white rounded-full overflow-hidden shadow-lg">
                  <Image
                    src={user.profilePic || "/placeholder.svg"}
                    alt={`${user.username}'s profile picture`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* User Info */}
              <div className="pt-20">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                      {user.username}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{user.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </div>

                {/* Bio Section */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    About
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {user.stats.timelineEvents}
                    </div>
                    <div className="text-sm text-gray-600">Timeline Events</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {user.stats.friends}
                    </div>
                    <div className="text-sm text-gray-600">Friends</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {user.stats.achievements}
                    </div>
                    <div className="text-sm text-gray-600">Achievements</div>
                  </div>
                </div>

                {/* Questionnaire Section */}
                <div className="mb-6">
                  {hasCompletedQuestionnaire ? (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-green-600" />
                            Profile Complete
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Your profile is personalized with questionnaire data. You can update it anytime.
                          </p>
                        </div>
                        <Link href="/questionnaire">
                          <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                            <FileText className="w-4 h-4 mr-2" />
                            Update Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-purple-600" />
                            Complete Your Profile
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Take our questionnaire to personalize your experience and get better recommendations.
                          </p>
                        </div>
                        <Link href="/questionnaire">
                          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                            <FileText className="w-4 h-4 mr-2" />
                            Start Questionnaire
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                      Professional
                    </h3>
                    <p className="text-gray-700 mb-2">{user.occupation}</p>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Joined {user.joinDate}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2 text-green-600" />
                      Education
                    </h3>
                    <p className="text-gray-700">{user.education}</p>
                  </div>
                </div>

                {/* Interests */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-600" />
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
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
    </div>
  );
};

export default ProfilePage;
