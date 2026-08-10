export default function handler(_req: any, res: any) {
  return res.status(200).json({
    ok: true,
    success: true,
    service: 'DELIONARYO AI Command Portal',
    status: 'ready',
  });
}
