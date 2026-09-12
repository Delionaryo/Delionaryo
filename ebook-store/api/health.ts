export default function handler(_req:any,res:any){
  res.setHeader('Cache-Control','public, max-age=0, s-maxage=30, stale-while-revalidate=30');
  return res.status(200).json({status:'healthy',app:'delionaryo-start',version:'phase1-2026-09-12',timestamp:new Date().toISOString()});
}
