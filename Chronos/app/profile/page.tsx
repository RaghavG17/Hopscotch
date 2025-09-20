import { Navbar } from "@/components/ui/navbar";
import { ProfileForm } from "@/components/profile/profile-form";
import { QuestionnaireEditor } from "@/components/profile/questionnaire-editor";
import Image from "next/image";
import React from "react";

const ProfilePage = () => {
  //temp data rn, replac eonce raghav makes sqlite live

  const user = {
    username: "tempsarah",
    bio: "dubai matcha 67 labubu",
    profilePic: "/emily-rodriguez.jpg",
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-accent/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Header */}
            <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
              {/* Profile Picture */}
              <div className="w-32 h-32 relative mb-4">
                <Image
                  src={user.profilePic}
                  alt={`${user.username}'s profile picture`}
                  fill
                  className="rounded-full object-cover"
                />
              </div>

              {/* Username */}
              <h1 className="text-2xl font-bold mb-2">{user.username}</h1>

              {/* Bio */}
              <p className="text-gray-600 text-center">{user.bio}</p>
            </div>

            {/* Profile Settings */}
            <ProfileForm />

            {/* Questionnaire Settings */}
            <QuestionnaireEditor />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;