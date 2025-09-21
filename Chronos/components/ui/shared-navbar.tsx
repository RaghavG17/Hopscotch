"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Users, Trophy, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "@/components/auth/auth-modal";
import { SimpleUserMenu } from "@/components/auth/simple-user-menu";
import { useState } from "react";

interface SharedNavbarProps {
    variant?: "home" | "app";
    showNavigation?: boolean;
}

export function SharedNavbar({ variant = "app", showNavigation = true }: SharedNavbarProps) {
    const pathname = usePathname();
    const { currentUser, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const isSignedIn = !!currentUser;
    const user = {
        name: currentUser?.displayName || "User",
        email: currentUser?.email || "",
        avatar: currentUser?.photoURL || "/placeholder.svg",
    };

    const isActive = (path: string) => {
        return pathname === path;
    };

    return (
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                {/* App Name/Logo */}
                <Link
                    href="/"
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <span className="text-xl font-bold text-foreground">Chronos</span>
                </Link>

                {/* Navigation Links - Only show for app variant or when showNavigation is true */}
                {variant === "app" && showNavigation && (
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/timeline"
                            className={`flex items-center space-x-2 transition-colors ${isActive("/timeline")
                                ? "text-accent font-medium"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Calendar className="w-4 h-4" />
                            <span>Timeline</span>
                        </Link>
                        <Link
                            href="/friends"
                            className={`flex items-center space-x-2 transition-colors ${isActive("/friends")
                                ? "text-accent font-medium"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Users className="w-4 h-4" />
                            <span>Friends</span>
                        </Link>
                        <Link
                            href="/achievements"
                            className={`flex items-center space-x-2 transition-colors ${isActive("/achievements")
                                ? "text-accent font-medium"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Trophy className="w-4 h-4" />
                            <span>Achievements</span>
                        </Link>
                    </nav>
                )}

                {/* Home variant navigation - simple links */}
                {variant === "home" && showNavigation && (
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                            Features
                        </Link>
                        <Link href="#community" className="text-muted-foreground hover:text-foreground transition-colors">
                            Community
                        </Link>
                        <Link href="timeline" className="text-muted-foreground hover:text-foreground transition-colors">
                            Timeline
                        </Link>
                    </nav>
                )}

                {/* Mobile Navigation - Simple dropdown for mobile */}
                {showNavigation && (
                    <div className="md:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" type="button">
                                    Menu
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                {variant === "app" ? (
                                    // App variant mobile menu
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link href="/timeline" className="flex items-center">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                <span>Timeline</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/friends" className="flex items-center">
                                                <Users className="mr-2 h-4 w-4" />
                                                <span>Friends</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/achievements" className="flex items-center">
                                                <Trophy className="mr-2 h-4 w-4" />
                                                <span>Achievements</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        {isSignedIn ? (
                                            <>
                                                <DropdownMenuItem asChild>
                                                    <Link href="/settings" className="flex items-center">
                                                        <Settings className="mr-2 h-4 w-4" />
                                                        <span>Settings</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600 cursor-pointer"
                                                    onClick={() => {
                                                        logout();
                                                    }}
                                                >
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    <span>Sign out</span>
                                                </DropdownMenuItem>
                                            </>
                                        ) : (
                                            <DropdownMenuItem
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    setIsAuthModalOpen(true);
                                                }}
                                            >
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Sign In</span>
                                            </DropdownMenuItem>
                                        )}
                                    </>
                                ) : (
                                    // Home variant mobile menu
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link href="#features" className="flex items-center">
                                                <span>Features</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="#community" className="flex items-center">
                                                <span>Community</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/timeline" className="flex items-center">
                                                <span>Timeline</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        {isSignedIn ? (
                                            <DropdownMenuItem
                                                className="text-red-600 cursor-pointer"
                                                onClick={() => {
                                                    logout();
                                                }}
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Sign out</span>
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    setIsAuthModalOpen(true);
                                                }}
                                            >
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Sign In</span>
                                            </DropdownMenuItem>
                                        )}
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}

                <div className="hidden md:block">
                    {isSignedIn ? (
                        variant === "home" ? (
                            <SimpleUserMenu />
                        ) : (
                            <SimpleUserMenu />
                        )
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setIsAuthModalOpen(true);
                            }}
                        >
                            Sign In
                        </Button>
                    )}
                </div>
            </div>

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </header>
    );
}
