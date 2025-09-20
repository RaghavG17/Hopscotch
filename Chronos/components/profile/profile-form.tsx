"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { Save, User, MapPin, Calendar, Globe, Linkedin, Github } from "lucide-react";

interface ProfileData {
    bio?: string;
    birthDate?: string;
    location?: string;
    website?: string;
    linkedinUrl?: string;
    githubUrl?: string;
}

export function ProfileForm() {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState<ProfileData>({});
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (currentUser) {
            // Fetch profile data from API
            fetchProfile();
        }
    }, [currentUser]);

    const fetchProfile = async () => {
        if (!currentUser) return;

        try {
            const response = await fetch(`/api/profile?uid=${currentUser.uid}`);
            if (response.ok) {
                const data = await response.json();
                setProfile(data.profile || {});
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleSave = async () => {
        if (!currentUser) return;

        setLoading(true);
        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firebaseUid: currentUser.uid,
                    ...profile
                }),
            });

            if (response.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                console.error('Error saving profile');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof ProfileData, value: string) => {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (!currentUser) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Please sign in to manage your profile</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Settings
                </CardTitle>
                <CardDescription>
                    Manage your personal information and preferences
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            placeholder="Tell us about yourself..."
                            value={profile.bio || ''}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="birthDate">Birth Date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <Input
                                    id="birthDate"
                                    type="date"
                                    value={profile.birthDate || ''}
                                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <Input
                                    id="location"
                                    placeholder="City, Country"
                                    value={profile.location || ''}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <Input
                                    id="website"
                                    type="url"
                                    placeholder="https://yourwebsite.com"
                                    value={profile.website || ''}
                                    onChange={(e) => handleInputChange('website', e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="linkedin">LinkedIn</Label>
                                <div className="relative">
                                    <Linkedin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="linkedin"
                                        type="url"
                                        placeholder="https://linkedin.com/in/username"
                                        value={profile.linkedinUrl || ''}
                                        onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="github">GitHub</Label>
                                <div className="relative">
                                    <Github className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="github"
                                        type="url"
                                        placeholder="https://github.com/username"
                                        value={profile.githubUrl || ''}
                                        onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                        {saved && <span className="text-green-600">Profile saved successfully!</span>}
                    </div>
                    <Button onClick={handleSave} disabled={loading}>
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Saving...' : 'Save Profile'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
