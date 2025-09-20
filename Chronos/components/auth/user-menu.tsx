"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";
import { LogOut, Settings, Calendar } from "lucide-react";

export function UserMenu() {
    const { currentUser, logout } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setLoading(true);
            await logout();
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
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
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
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                            {currentUser.displayName && (
                                <p className="font-medium">{currentUser.displayName}</p>
                            )}
                            {currentUser.email && (
                                <p className="w-[200px] truncate text-sm text-gray-500">
                                    {currentUser.email}
                                </p>
                            )}
                        </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>My Timeline</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleLogout}
                        disabled={loading}
                        className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{loading ? 'Signing out...' : 'Sign out'}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
