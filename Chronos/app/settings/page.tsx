"use client";

import { AppNavbar } from "@/components/ui/app-navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SettingsPage = () => {
    const { currentUser, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !currentUser) {
            router.push("/"); // Redirect to home if not authenticated
        }
    }, [currentUser, loading, router]);

    if (loading || !currentUser) {
        return (
            <div>
                <AppNavbar />
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <p className="text-lg text-gray-600">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <AppNavbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">Settings</h1>

                    {/* Profile Settings */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="displayName">Display Name</Label>
                                <Input id="displayName" defaultValue={currentUser.displayName || "N/A"} />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue={currentUser.email || "N/A"} disabled />
                            </div>
                            <Button>Update Profile</Button>
                        </CardContent>
                    </Card>

                    {/* Notification Settings */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="emailNotifications">Email Notifications</Label>
                                <Switch id="emailNotifications" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="pushNotifications">Push Notifications</Label>
                                <Switch id="pushNotifications" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Privacy Settings */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Privacy</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="profileVisibility">Profile Visibility</Label>
                                <Select defaultValue="public">
                                    <SelectTrigger id="profileVisibility">
                                        <SelectValue placeholder="Select visibility" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">Public</SelectItem>
                                        <SelectItem value="friends">Friends Only</SelectItem>
                                        <SelectItem value="private">Private</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="dataSharing">Allow Data Sharing</Label>
                                <Switch id="dataSharing" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Appearance Settings */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="theme">Theme</Label>
                                <Select defaultValue="system">
                                    <SelectTrigger id="theme">
                                        <SelectValue placeholder="Select theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="border-red-200 bg-red-50">
                        <CardHeader>
                            <CardTitle className="text-red-700">Danger Zone</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-red-600">
                                Proceed with caution. These actions are irreversible.
                            </p>
                            <Button variant="destructive">Delete Account</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
