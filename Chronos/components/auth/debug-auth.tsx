"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export function DebugAuth() {
    const { currentUser, logout } = useAuth();

    if (!currentUser) {
        return (
            <div className="fixed bottom-4 right-4 bg-blue-100 p-4 rounded-lg">
                <p className="text-sm">Not logged in</p>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 bg-green-100 p-4 rounded-lg">
            <p className="text-sm">Logged in as: {currentUser.email}</p>
            <Button
                size="sm"
                variant="outline"
                onClick={logout}
                className="mt-2"
            >
                Logout
            </Button>
        </div>
    );
}
