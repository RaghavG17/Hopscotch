import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/database';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const timelineId = searchParams.get('timelineId');

        if (!timelineId) {
            return NextResponse.json({ error: 'Timeline ID required' }, { status: 400 });
        }

        const milestones = dbService.getMilestonesByTimelineId(parseInt(timelineId));

        return NextResponse.json(milestones);
    } catch (error) {
        console.error('Error fetching milestones:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { timelineId, title, date, description, imageUrl, category, tags } = body;

        if (!timelineId || !title || !date) {
            return NextResponse.json({
                error: 'Timeline ID, title, and date are required'
            }, { status: 400 });
        }

        const result = dbService.createMilestone(
            parseInt(timelineId),
            title,
            date,
            description,
            imageUrl,
            category,
            tags
        );

        return NextResponse.json({
            id: result.lastInsertRowid,
            message: 'Milestone created successfully'
        });
    } catch (error) {
        console.error('Error creating milestone:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
