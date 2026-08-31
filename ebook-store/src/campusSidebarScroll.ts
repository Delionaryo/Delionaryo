// Isolated Campus sidebar scrolling fix.
// This module intentionally changes only sidebar overflow/scroll behavior.
const style=document.createElement('style');
style.id='delionaryo-campus-sidebar-scroll';
style.textContent=`
@media (min-width:901px){
  #member-portal .campus-sidebar{
    box-sizing:border-box!important;
    height:100vh!important;
    max-height:100vh!important;
    overflow-y:auto!important;
    overflow-x:hidden!important;
    overscroll-behavior:contain!important;
    scrollbar-width:thin;
    scrollbar-color:rgba(105,188,178,.55) transparent;
  }
  #member-portal .campus-sidebar::-webkit-scrollbar{width:6px}
  #member-portal .campus-sidebar::-webkit-scrollbar-track{background:transparent}
  #member-portal .campus-sidebar::-webkit-scrollbar-thumb{background:rgba(105,188,178,.45);border-radius:999px}
  #member-portal .campus-sidebar::-webkit-scrollbar-thumb:hover{background:rgba(105,188,178,.7)}
  #member-portal .campus-nav{padding-bottom:18px}
}
`;
document.head.appendChild(style);
