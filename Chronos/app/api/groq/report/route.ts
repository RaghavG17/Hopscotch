import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { dbService } from '@/lib/database';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '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',
});

interface QuestionnaireData {
    basicInfo: {
        name: string;
        age: string;
        journeyStage: string;
        journeyStageOther: string;
        graduation: string;
        schoolName: string;
        graduationYear: string;
        firstJob: string;
        promotion: string;
        retirement: string;
        relationshipStatus: string;
        familyStatus: string;
        movedOut: string;
        hobbies: string;
        interests: string;
        location: string;
        occupation: string;
    };
    furtherQuestions: {
        personalShortTermGoal: string;
        personalShortTermHurdles: string;
        personalShortTermTimeline: string;
        personalLongTermGoal: string;
        personalLongTermHurdles: string;
        personalLongTermTimeline: string;
        professionalShortTermGoal: string;
        professionalShortTermHurdles: string;
        professionalShortTermTimeline: string;
        professionalLongTermGoal: string;
        professionalLongTermHurdles: string;
        professionalLongTermTimeline: string;
        socialShortTermGoal: string;
        socialShortTermHurdles: string;
        socialShortTermTimeline: string;
        socialLongTermGoal: string;
        socialLongTermHurdles: string;
        socialLongTermTimeline: string;
    };
}

export async function POST(request: NextRequest) {
    try {
        const { userId, questionnaireData }: { userId: string; questionnaireData: QuestionnaireData } = await request.json();

        if (!userId || !questionnaireData) {
            return NextResponse.json({ error: 'User ID and questionnaire data are required' }, { status: 400 });
        }

        // Create a comprehensive prompt for the AI
        const prompt = `
Based on the following questionnaire responses, create a comprehensive personal growth report. Analyze the user's goals, challenges, and aspirations across Personal, Professional, and Social growth areas.

**Basic Information:**
- Name: ${questionnaireData.basicInfo.name}
- Age: ${questionnaireData.basicInfo.age}
- Current Journey Stage: ${questionnaireData.basicInfo.journeyStage} ${questionnaireData.basicInfo.journeyStageOther ? `(${questionnaireData.basicInfo.journeyStageOther})` : ''}
- Occupation: ${questionnaireData.basicInfo.occupation}
- Location: ${questionnaireData.basicInfo.location}
- Education: ${questionnaireData.basicInfo.graduation} ${questionnaireData.basicInfo.schoolName ? `from ${questionnaireData.basicInfo.schoolName}` : ''} ${questionnaireData.basicInfo.graduationYear ? `(${questionnaireData.basicInfo.graduationYear})` : ''}
- Relationship Status: ${questionnaireData.basicInfo.relationshipStatus}
- Family Status: ${questionnaireData.basicInfo.familyStatus}
- Hobbies: ${questionnaireData.basicInfo.hobbies}
- Interests: ${questionnaireData.basicInfo.interests}

**Personal Growth Goals:**
- Short-term: ${questionnaireData.furtherQuestions.personalShortTermGoal}
- Timeline: ${questionnaireData.furtherQuestions.personalShortTermTimeline}
- Challenges: ${questionnaireData.furtherQuestions.personalShortTermHurdles}
- Long-term: ${questionnaireData.furtherQuestions.personalLongTermGoal}
- Timeline: ${questionnaireData.furtherQuestions.personalLongTermTimeline}
- Challenges: ${questionnaireData.furtherQuestions.personalLongTermHurdles}

**Professional Growth Goals:**
- Short-term: ${questionnaireData.furtherQuestions.professionalShortTermGoal}
- Timeline: ${questionnaireData.furtherQuestions.professionalShortTermTimeline}
- Challenges: ${questionnaireData.furtherQuestions.professionalShortTermHurdles}
- Long-term: ${questionnaireData.furtherQuestions.professionalLongTermGoal}
- Timeline: ${questionnaireData.furtherQuestions.professionalLongTermTimeline}
- Challenges: ${questionnaireData.furtherQuestions.professionalLongTermHurdles}

**Social Growth Goals:**
- Short-term: ${questionnaireData.furtherQuestions.socialShortTermGoal}
- Timeline: ${questionnaireData.furtherQuestions.socialShortTermTimeline}
- Challenges: ${questionnaireData.furtherQuestions.socialShortTermHurdles}
- Long-term: ${questionnaireData.furtherQuestions.socialLongTermGoal}
- Timeline: ${questionnaireData.furtherQuestions.socialLongTermTimeline}
- Challenges: ${questionnaireData.furtherQuestions.socialLongTermHurdles}

Please create a comprehensive report that includes:

1. **Executive Summary** - A brief overview of the user's current situation and main goals
2. **Growth Analysis** - Detailed analysis of each growth area (Personal, Professional, Social)
3. **Goal Alignment** - How well the short-term and long-term goals align within each area
4. **Challenge Assessment** - Analysis of the hurdles and potential solutions
5. **Timeline Evaluation** - Assessment of whether the timelines are realistic
6. **Recommendations** - Specific, actionable advice for achieving their goals
7. **Priority Matrix** - Which goals should be prioritized and why
8. **Next Steps** - Immediate actions they should take

Make the report encouraging, insightful, and practical. Use a professional but warm tone. Format it with clear headings and bullet points for easy reading.
`;

        // Generate the report using Groq
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a personal growth coach and life strategist. Create detailed, insightful reports that help people understand their goals and provide actionable guidance for their personal development journey."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
            max_tokens: 2000,
        });

        const reportContent = completion.choices[0]?.message?.content || '';

        if (!reportContent) {
            return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
        }

        // Save the report to the database
        const result = dbService.createReport(parseInt(userId), 'questionnaire_analysis', reportContent);

        return NextResponse.json({
            success: true,
            report: {
                id: result.lastInsertRowid,
                content: reportContent,
                generatedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error generating report:', error);
        return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Get the latest report for the user
        const report = dbService.getLatestReportByUserId(parseInt(userId), 'questionnaire_analysis');

        if (!report) {
            return NextResponse.json({ error: 'No report found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            report: {
                id: report.id,
                content: report.content,
                generatedAt: report.generated_at
            }
        });

    } catch (error) {
        console.error('Error fetching report:', error);
        return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 });
    }
}
