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

        const questionnaireData = dbService.getQuestionnaireDataByUserId(user.id);

        return NextResponse.json({
            questionnaireData,
            hasCompletedQuestionnaire: user.has_completed_questionnaire
        });
    } catch (error) {
        console.error('Error fetching questionnaire data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { firebaseUid, questionnaireData } = body;

        if (!firebaseUid) {
            return NextResponse.json({ error: 'Firebase UID required' }, { status: 400 });
        }

        const user = dbService.getUserByFirebaseUid(firebaseUid);
        if (!user || !user.id) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Save questionnaire data
        dbService.saveQuestionnaireData(user.id, questionnaireData);

        // Update user's questionnaire completion status
        dbService.updateUserQuestionnaireStatus(firebaseUid, true);

        return NextResponse.json({
            success: true,
            message: 'Questionnaire data saved successfully'
        });
    } catch (error) {
        console.error('Error saving questionnaire data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
