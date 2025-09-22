import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { dbService } from '@/lib/database';
import { groqConfig } from '@/lib/config';

// Initialize Groq with centralized configuration
const groq = groqConfig.enabled ? new Groq({
  apiKey: groqConfig.apiKey,
}) : null;

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
    // Check if Groq service is properly configured
    if (!groqConfig.enabled || !groq) {
      return NextResponse.json({
        error: 'Groq AI service is not configured. Please set GROQ_API_KEY in your .env.local file.'
      }, { status: 500 });
    }

    const { userId, questionnaireData }: { userId: number; questionnaireData: QuestionnaireData } = await request.json();

    console.log('Groq API received userId:', userId, 'type:', typeof userId);

    if (!userId || !questionnaireData) {
      return NextResponse.json({ error: 'User ID and questionnaire data are required' }, { status: 400 });
    }

    // Check if user exists in database, create if not
    let user = dbService.getUserByFirebaseUid(userId.toString());
    if (!user) {
      // Create a temporary user for testing purposes
      const result = dbService.createUser(
        userId.toString(),
        `test-user-${userId}@example.com`,
        `Test User ${userId}`
      );
      user = { id: result.lastInsertRowid };
    }

    // Create a structured timeline prompt for the AI
    const prompt = `
Based on the following questionnaire responses, create a structured **Timeline Report** that strictly follows the user's specified timelines.

CRITICAL REQUIREMENTS:
1. **RESPECT EXACT TIMELINES**: If a user says "6 months", create a 6-month timeline, not longer.
2. **INCLUDE ALL GOALS**: Both short-term AND long-term goals must be included if provided.
3. **NO ASSUMPTIONS**: Only use information explicitly provided by the user. Do not add hobbies or interests unless they directly relate to stated goals.
4. **SEPARATE TIMELINES**: Create separate timelines for short-term and long-term goals, respecting their individual due dates.

Format Requirements:
1. For each **goal** in each area (Personal, Professional, Social):
   - Generate a timeline from the current month until the goal's EXACT due date.
   - Each **year** must have exactly 3 yearly focus items (action-oriented, 6–12 words each).
   - Each **month** within that year must have exactly 3 concrete monthly actions (specific, measurable, short).
   - All actions must align with the user's challenges, aspirations, and timelines.
   - Only include areas that have goals filled out (some areas may be empty).

2. Do NOT create an essay, executive summary, or analysis. 
Only output a timeline plan in structured text or JSON.

---

**Input Data (from questionnaire):**

Basic Information:
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

Personal Growth Goals:
- Short-term: ${questionnaireData.furtherQuestions.personalShortTermGoal}
- Timeline: ${questionnaireData.furtherQuestions.personalShortTermTimeline}
- Challenges: ${questionnaireData.furtherQuestions.personalShortTermHurdles}
- Long-term: ${questionnaireData.furtherQuestions.personalLongTermGoal}
- Timeline: ${questionnaireData.furtherQuestions.personalLongTermTimeline}
- Challenges: ${questionnaireData.furtherQuestions.personalLongTermHurdles}

Professional Growth Goals:
- Short-term: ${questionnaireData.furtherQuestions.professionalShortTermGoal}
- Timeline: ${questionnaireData.furtherQuestions.professionalShortTermTimeline}
- Challenges: ${questionnaireData.furtherQuestions.professionalShortTermHurdles}
- Long-term: ${questionnaireData.furtherQuestions.professionalLongTermGoal}
- Timeline: ${questionnaireData.furtherQuestions.professionalLongTermTimeline}
- Challenges: ${questionnaireData.furtherQuestions.professionalLongTermHurdles}

Social Growth Goals:
- Short-term: ${questionnaireData.furtherQuestions.socialShortTermGoal}
- Timeline: ${questionnaireData.furtherQuestions.socialShortTermTimeline}
- Challenges: ${questionnaireData.furtherQuestions.socialShortTermHurdles}
- Long-term: ${questionnaireData.furtherQuestions.socialLongTermGoal}
- Timeline: ${questionnaireData.furtherQuestions.socialLongTermTimeline}
- Challenges: ${questionnaireData.furtherQuestions.socialLongTermHurdles}

---

**Output Format Example:**

Goal: Professional Growth → "Land a software internship by June 2026"

Year 2025:
- Yearly Focus:
  1. Build strong portfolio with 3 projects
  2. Apply to 40 internships
  3. Practice 100 coding problems
- Monthly Breakdown:
  October 2025:
    1. Draft resume and LinkedIn profile  
    2. Start project 1 (setup + initial code)  
    3. Solve 25 coding problems  
  November 2025:
    1. Finish project 1 and publish demo  
    2. Apply to 10 internships  
    3. Mock interview with 1 friend  
  December 2025:
    1. Start project 2 (MVP)  
    2. Apply to 15 internships  
    3. Solve 30 coding problems  

Year 2026:
- Yearly Focus:
  1. Complete 2 more portfolio projects  
  2. Apply broadly and attend interviews  
  3. Secure internship by June  
- Monthly Breakdown:
  January 2026:
    1. Complete project 2  
    2. Apply to 20 internships  
    3. Weekly mock interviews (x4)  
  February 2026:
    1. Start project 3  
    2. Attend 1 career fair  
    3. Solve 20 coding problems  
  … (continue until June 2026)
`;

    // STEP 1: Generate initial report structure using Llama 3.1-8b-instant
    const initialCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a timeline planning expert and goal strategist. Create structured, actionable timeline reports that STRICTLY follow the user's specified timelines. If a user says '6 months', create exactly a 6-month plan, not longer. Include ALL goals provided (both short-term and long-term). Do NOT make assumptions or add information not explicitly provided by the user. Focus on specific, measurable, and time-bound actions that align with the user's challenges and aspirations. Do NOT write essays or analysis - only provide structured timeline plans."
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

    const initialReport = initialCompletion.choices[0]?.message?.content || '';

    if (!initialReport) {
      return NextResponse.json({ error: 'Failed to generate initial report structure' }, { status: 500 });
    }

    // STEP 2: Enhance with detailed timeline using Llama 3.3-70b-versatile
    const enhancementPrompt = `
You are an expert timeline strategist. Take the following initial timeline report and enhance it with SPECIFIC DATES, MONTHS, and YEARS to create a detailed, actionable timeline.

CRITICAL REQUIREMENTS:
1. **EXACTLY 3 SUGGESTIONS PER PERIOD**: Each year must have exactly 3 yearly focus items, and each month must have exactly 3 monthly actions
2. **ADD SPECIFIC DATES**: Replace vague timelines with exact months and years (e.g., "October 2025", "March 2026")
3. **MAINTAIN TIMELINE ACCURACY**: Keep the same overall timeline structure but add precise dates
4. **ENHANCE DETAILS**: Add more specific, measurable actions with exact timing
5. **PRESERVE STRUCTURE**: Keep the same goal areas and overall format

**Initial Report to Enhance:**
${initialReport}

**MANDATORY Output Format:**
For each goal area (Personal, Professional, Social):

**Short-term Goals (X months):**
- Month 1 (e.g., "October 2025"):
  1. [Specific action 1]
  2. [Specific action 2] 
  3. [Specific action 3]
- Month 2 (e.g., "November 2025"):
  1. [Specific action 1]
  2. [Specific action 2]
  3. [Specific action 3]
- Continue for each month in the timeline...

**Long-term Goals (X years):**
- Year 1 (e.g., "2026"):
  1. [Yearly focus item 1]
  2. [Yearly focus item 2]
  3. [Yearly focus item 3]
- Year 2 (e.g., "2027"):
  1. [Yearly focus item 1]
  2. [Yearly focus item 2]
  3. [Yearly focus item 3]
- Continue for each year in the timeline...

**CRITICAL**: Every single month and year must have exactly 3 numbered items. No more, no less.
`;

    const enhancedCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert timeline strategist specializing in creating detailed, date-specific action plans. Your role is to take initial timeline structures and enhance them with specific dates, months, and years to create actionable, time-bound plans. CRITICAL: Every year must have exactly 3 yearly focus items, and every month must have exactly 3 monthly actions. Always maintain the original goals and structure while adding precise timing details."
        },
        {
          role: "user",
          content: enhancementPrompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      max_tokens: 3000,
    });

    const enhancedReport = enhancedCompletion.choices[0]?.message?.content || '';
    const reportContent = enhancedReport || initialReport;

    if (!reportContent) {
      return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }

    // Save the report to the database
    const result = dbService.createReport(user.id, 'questionnaire_analysis', reportContent);

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
        id: (report as any).id,
        content: (report as any).content,
        generatedAt: (report as any).generated_at
      }
    });

  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 });
  }
}
