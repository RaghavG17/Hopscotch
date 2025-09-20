import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/database';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { firebaseUid, email, displayName, photoURL } = body;

        if (!firebaseUid || !email) {
            return NextResponse.json({ error: 'Firebase UID and email required' }, { status: 400 });
        }

        // Check if user exists in database
        let existingUser = dbService.getUserByFirebaseUid(firebaseUid);

        if (!existingUser) {
            // Create new user in database
            dbService.createUser(firebaseUid, email, displayName, photoURL);
            existingUser = dbService.getUserByFirebaseUid(firebaseUid);
        } else {
            // Update existing user info
            dbService.updateUser(firebaseUid, displayName, photoURL);
            existingUser = dbService.getUserByFirebaseUid(firebaseUid);
        }

        return NextResponse.json({
            success: true,
            user: existingUser
        });
    } catch (error) {
        console.error('Error syncing user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
