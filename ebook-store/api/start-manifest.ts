export default function handler(_req:any,res:any){
  res.setHeader('Content-Type','application/manifest+json; charset=utf-8');
  res.setHeader('Cache-Control','public, max-age=300, s-maxage=600');
  res.status(200).json({
    name:'DELIONARYO Start',
    short_name:'DELIONARYO',
    description:'Official public entry point to the DELIONARYO ecosystem.',
    id:'/start/',
    start_url:'/start/',
    scope:'/start/',
    display:'standalone',
    orientation:'portrait-primary',
    background_color:'#071015',
    theme_color:'#071015',
    icons:[
      {src:'/start/icon.png',sizes:'1254x1254',type:'image/png',purpose:'any'}
    ]
  });
}
