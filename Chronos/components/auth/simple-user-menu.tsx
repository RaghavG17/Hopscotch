"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";
import { LogOut, Settings, Calendar, User } from "lucide-react";
import { useRouter } from 'next/navigation';

export function SimpleUserMenu() {
    const { currentUser, logout } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const handleTimelineClick = () => {
        router.push('/timeline');
        setShowMenu(false);
    };

    const handleProfileClick = () => {
        router.push('/profile');
        setShowMenu(false);
    };

    const handleLogout = async () => {
        try {
            setLoading(true);
            await logout();
            setShowMenu(false);
        } catch (error) {
            console.error('Failed to log out:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) return null;

    const getInitials = (email: string) => {
        return email.split('@')[0].substring(0, 2).toUpperCase();
    };

    return (
        <div className="relative">
            <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
                onClick={() => setShowMenu(!showMenu)}
            >
                <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.email || ''} />
                    <AvatarFallback className="bg-purple-600 text-white">
                        {currentUser.displayName ?
                            currentUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase() :
                            getInitials(currentUser.email || 'U')
                        }
                    </AvatarFallback>
                </Avatar>
            </Button>

            {showMenu && (
                <div className="absolute right-0 top-10 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="p-3 border-b border-gray-200">
                        <div className="flex flex-col space-y-1">
                            {currentUser.displayName && (
                                <p className="font-medium text-gray-900">{currentUser.displayName}</p>
                            )}
                            {currentUser.email && (
                                <p className="text-sm text-gray-500 truncate">
                                    {currentUser.email}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="py-1">
                        <button
                            onClick={handleTimelineClick}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                            <Calendar className="mr-2 h-4 w-4" />
                            My Timeline
                        </button>
                        <button
                            onClick={handleProfileClick}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </button>
                        <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </button>
                    </div>

                    <div className="border-t border-gray-200 py-1">
                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center disabled:opacity-50"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            {loading ? 'Signing out...' : 'Sign out'}
                        </button>
                    </div>
                </div>
            )}

            {/* Backdrop to close menu */}
            {showMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                />
            )}
        </div>
    );
}
