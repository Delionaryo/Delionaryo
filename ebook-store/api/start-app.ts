import startHandler from './start';

export default function handler(req:any,res:any){
  // The public Start shell contains no user/session-specific data, so it can be
  // cached at the edge. Authentication and account APIs remain uncached.
  const setHeader=res.setHeader.bind(res);
  res.setHeader=(name:any,value:any)=>{
    if(String(name).toLowerCase()==='cache-control'){
      return setHeader('Cache-Control','public, max-age=0, s-maxage=300, stale-while-revalidate=86400');
    }
    return setHeader(name,value);
  };

  // Render the existing Start handler in-process. This removes the previous
  // /start -> /api/start-app -> HTTP /api/start double round-trip while
  // preserving the exact current UI, registration and Supabase behavior.
  return startHandler(req,res);
}
