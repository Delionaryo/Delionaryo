type DashboardResponse = {
  memberId: string;
  aiCoachId: string;
  journeyStage: string;
  learningProgress: string;
  dpbsSummary: string;
};

const json = (res: any, status: number, body: unknown) => res.status(status).json(body);

export default async function handler(_req: any, res: any) {
  const data: DashboardResponse = {
    memberId: 'PENDING_MEMBER_CONNECTION',
    aiCoachId: 'PENDING_AI_COACH_CONNECTION',
    journeyStage: 'SURVIVAL',
    learningProgress: '0%',
    dpbsSummary: 'Awaiting DPBS records'
  };

  return json(res, 200, data);
}
