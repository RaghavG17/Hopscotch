"use client";
import { Navbar } from "@/components/ui/navbar";
import Image from "next/image";
import { CalendarModal } from "@/components/calendar";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
//temp data rn, replac eonce raghav makes sqlite live
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const user = {
    username: "tempsarah",
    bio: "dubai matcha 67 labubu",
    profilePic: "/emily-rodriguez.jpg", 
  };

  return (
    <div>
        <Navbar/>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
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
    </div>
    
    </div>
  );
};

export default ProfilePage;