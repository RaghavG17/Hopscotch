"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Trophy, User } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
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

        {/* Navigation Links */}
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
          <Link
            href="/profile"
            className={`flex items-center space-x-2 transition-colors ${isActive("/profile")
                ? "text-accent font-medium"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </Link>
        </nav>

        {/* Mobile Navigation - Simple dropdown for mobile */}
        <div className="md:hidden">
          <Button variant="outline" size="sm">
            Menu
          </Button>
        </div>

        {/* Sign In Button - Hidden on mobile to save space */}
        <div className="hidden md:block">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
}
