type DashboardResponse = {
  memberId: string;
  aiCoachId: string;
  journeyStage: string;
  learningProgress: string;
  dpbsSummary: string;
};

const json = (res: any, status: number, body: unknown) => res.status(status).json(body);

export default async function handler(_req: any, res: any) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Supabase connection is prepared through environment variables.
  // Tables will be connected after schema confirmation.
  if (!supabaseUrl || !supabaseKey) {
    const pending: DashboardResponse = {
      memberId: 'PENDING_MEMBER_CONNECTION',
      aiCoachId: 'PENDING_AI_COACH_CONNECTION',
      journeyStage: 'SURVIVAL',
      learningProgress: '0%',
      dpbsSummary: 'Awaiting Supabase records'
    };
    return json(res, 200, pending);
  }

  const data: DashboardResponse = {
    memberId: 'MEMBER_RECORD_READY',
    aiCoachId: 'AI_COACH_RECORD_READY',
    journeyStage: 'SURVIVAL',
    learningProgress: '0%',
    dpbsSummary: 'DPBS RECORD READY'
  };

  return json(res, 200, data);
}
