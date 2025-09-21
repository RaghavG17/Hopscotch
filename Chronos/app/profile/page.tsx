"use client";
import { Navbar } from "@/components/ui/navbar";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Heart,
  Mail,
} from "lucide-react";

const ProfilePage = () => {
  const user = {
    username: "Sarah Chen",
    displayName: "Sarah",
    bio: "Passionate software engineer and world traveler. Love discovering new cultures, trying local cuisines, and capturing life's beautiful moments. Currently based in Dubai, always planning the next adventure!",
    profilePic: "/emily-rodriguez.jpg",
    location: "Dubai, UAE",
    joinDate: "March 2022",
    occupation: "Senior Software Engineer",
    education: "Computer Science, Stanford University",
    interests: ["Travel", "Photography", "Matcha", "Tech", "Hiking"],
    email: "sarah.chen@email.com",
    stats: {
      timelineEvents: 47,
      friends: 128,
      achievements: 23,
    },
import React, { useState } from "react";

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
    
    </div>
  );
};

export default ProfilePage;
