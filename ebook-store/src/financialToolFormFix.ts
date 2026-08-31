const css=document.createElement('style');
css.textContent=`
.dpbs-private-overlay .dpbs-form-area{background:transparent!important;box-shadow:none!important}
.dpbs-private-overlay .dpbs-form-area form{background:transparent!important}
.dpbs-private-overlay .dpbs-form-area input,.dpbs-private-overlay .dpbs-form-area select,.dpbs-private-overlay .dpbs-form-area textarea{appearance:none!important;-webkit-appearance:none!important;box-sizing:border-box!important;width:100%!important;min-width:0!important;padding:14px 15px!important;border:1px solid #29454b!important;border-radius:11px!important;background:#071820!important;color:#edf4f3!important;font:inherit!important;outline:none!important}
.dpbs-private-overlay .dpbs-form-area input::placeholder,.dpbs-private-overlay .dpbs-form-area textarea::placeholder{color:#70868b!important;opacity:1}
.dpbs-private-overlay .dpbs-form-area input:focus,.dpbs-private-overlay .dpbs-form-area select:focus,.dpbs-private-overlay .dpbs-form-area textarea:focus{border-color:#69bcb2!important;box-shadow:0 0 0 3px rgba(105,188,178,.10)!important}
.dpbs-private-overlay .dpbs-form-area select option{background:#071820!important;color:#edf4f3!important}
.dpbs-private-overlay .dpbs-form-area button{border:1px solid rgba(207,174,104,.35)!important;border-radius:11px!important;background:#cfae68!important;color:#07131a!important;padding:14px 18px!important;font-weight:900!important}
`;
document.head.appendChild(css);
