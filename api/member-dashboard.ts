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
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return json(res, 200, {
      memberId: 'PENDING_MEMBER_CONNECTION',
      aiCoachId: 'PENDING_AI_COACH_CONNECTION',
      journeyStage: 'SURVIVAL',
      learningProgress: '0%',
      dpbsSummary: 'Awaiting Supabase connection'
    });
  }

  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    Accept: 'application/json'
  };

  try {
    const profileResponse = await fetch(`${supabaseUrl}/rest/v1/member_profiles?select=*&limit=1`, { headers });
    const profiles = await profileResponse.json();
    const profile = profiles?.[0] || {};

    const data: DashboardResponse = {
      memberId: profile.id || 'NO_MEMBER',
      aiCoachId: profile.ai_coach_id || 'NO_COACH',
      journeyStage: profile.journey_stage || 'SURVIVAL',
      learningProgress: `${profile.learning_progress || 0}%`,
      dpbsSummary: profile.dpbs_summary || 'No DPBS records yet'
    };

    return json(res, 200, data);
  } catch {
    return json(res, 200, {
      memberId: 'CONNECTION_ERROR',
      aiCoachId: 'CONNECTION_ERROR',
      journeyStage: 'SURVIVAL',
      learningProgress: '0%',
      dpbsSummary: 'Retrying connection'
    });
  }
}
