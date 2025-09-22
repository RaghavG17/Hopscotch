import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/database';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const firebaseUid = searchParams.get('uid');

        if (!firebaseUid) {
            return NextResponse.json({ error: 'Firebase UID required' }, { status: 400 });
        }

        const user = dbService.getUserByFirebaseUid(firebaseUid);
        if (!user || !user.id) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const goals = dbService.getGoalsByUserId(user.id);

        return NextResponse.json(goals);
    } catch (error) {
        console.error('Error fetching goals:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { firebaseUid, title, description, targetDate, priority } = body;

        if (!firebaseUid || !title) {
            return NextResponse.json({ error: 'Firebase UID and title required' }, { status: 400 });
        }

        const user = dbService.getUserByFirebaseUid(firebaseUid);
        if (!user || !user.id) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const result = dbService.createGoal(user.id, title, description, targetDate, priority);

        return NextResponse.json({
            id: result.lastInsertRowid,
            message: 'Goal created successfully'
        });
    } catch (error) {
        console.error('Error creating goal:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
