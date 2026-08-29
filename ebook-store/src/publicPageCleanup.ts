function removeLegacyPublicSections(){
  document.querySelectorAll('section').forEach((section)=>{
    const text=(section.textContent||'').replace(/\s+/g,' ').trim();
    const isLearning=text.includes('DELIONARYO E-LEARNING HUB')&&text.includes('My Learning');
    const isFlagship=text.includes('DELIONARYO LIBRARY')&&text.includes("M.O.N.E.Y'S")&&text.includes('FLAGSHIP EBOOK');
    const isResources=text.includes('TRANSFORMATION RESOURCES')&&text.includes('Learn. Execute. Measure. Advance.');
    if(isLearning||isFlagship||isResources)section.remove();
  });
}
removeLegacyPublicSections();
const observer=new MutationObserver(removeLegacyPublicSections);
observer.observe(document.documentElement,{childList:true,subtree:true});
setTimeout(()=>observer.disconnect(),10000);
