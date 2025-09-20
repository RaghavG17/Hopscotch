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

export function Navbar() {
  const pathname = usePathname();
  const isSignedIn = true; // This would be dynamic based on auth state
  const user = {
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "/professional-woman-smiling.png",
  };

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
          <span className="text-xl font-bold text-foreground">LifeLine</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/timeline"
            className={`flex items-center space-x-2 transition-colors ${
              isActive("/timeline")
                ? "text-accent font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Timeline</span>
          </Link>
          <Link
            href="/friends"
            className={`flex items-center space-x-2 transition-colors ${
              isActive("/friends")
                ? "text-accent font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Friends</span>
          </Link>
          <Link
            href="/achievements"
            className={`flex items-center space-x-2 transition-colors ${
              isActive("/achievements")
                ? "text-accent font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Achievements</span>
          </Link>
        </nav>

        {/* Mobile Navigation - Simple dropdown for mobile */}
        <div className="md:hidden">
          <Button variant="outline" size="sm">
            Menu
          </Button>
        </div>

        <div className="hidden md:block">
          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/timeline" className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>My Timeline</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
