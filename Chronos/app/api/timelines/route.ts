import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/database';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const firebaseUid = searchParams.get('uid');
        const publicOnly = searchParams.get('public') === 'true';

        if (publicOnly) {
            const publicTimelines = dbService.getPublicTimelines();
            return NextResponse.json(publicTimelines);
        }

        if (!firebaseUid) {
            return NextResponse.json({ error: 'Firebase UID required' }, { status: 400 });
        }

        const user = dbService.getUserByFirebaseUid(firebaseUid);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const timelines = dbService.getTimelinesByUserId(user.id);

        return NextResponse.json(timelines);
    } catch (error) {
        console.error('Error fetching timelines:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { firebaseUid, title, description, isPublic } = body;

        if (!firebaseUid || !title) {
            return NextResponse.json({ error: 'Firebase UID and title required' }, { status: 400 });
        }

        const user = dbService.getUserByFirebaseUid(firebaseUid);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const result = dbService.createTimeline(user.id, title, description, isPublic || false);

        return NextResponse.json({
            id: result.lastInsertRowid,
            message: 'Timeline created successfully'
        });
    } catch (error) {
        console.error('Error creating timeline:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
