import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/database';
import { auth } from '@/lib/firebase';
import { getAuth } from 'firebase-admin/auth';

// Note: This is a simplified version. In production, you'd want to use Firebase Admin SDK
// For now, we'll handle this client-side with proper validation

export async function GET(request: NextRequest) {
    try {
        // In a real implementation, you'd verify the Firebase token here
        const { searchParams } = new URL(request.url);
        const firebaseUid = searchParams.get('uid');

        if (!firebaseUid) {
            return NextResponse.json({ error: 'Firebase UID required' }, { status: 400 });
        }

        const user = dbService.getUserByFirebaseUid(firebaseUid);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const profile = dbService.getProfileByUserId(user.id);

        return NextResponse.json({
            user,
            profile
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { firebaseUid, bio, birthDate, location, website, linkedinUrl, githubUrl } = body;

        if (!firebaseUid) {
            return NextResponse.json({ error: 'Firebase UID required' }, { status: 400 });
        }

        const user = dbService.getUserByFirebaseUid(firebaseUid);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if profile exists
        let profile = dbService.getProfileByUserId(user.id);

        if (!profile) {
            // Create new profile
            dbService.createProfile(user.id, bio, birthDate, location);
        } else {
            // Update existing profile
            dbService.updateProfile(user.id, bio, birthDate, location, website, linkedinUrl, githubUrl);
        }

        // Get updated profile
        profile = dbService.getProfileByUserId(user.id);

        return NextResponse.json({
            user,
            profile
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
