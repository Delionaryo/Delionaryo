const youtubeChannelUrl = 'https://www.youtube.com/channel/UC8tBAhLFySPo7vp9cBUh4fA';
const tiktokUrl = 'https://www.tiktok.com/@rrl6980?_r=1&_t=ZS-98clQNSR9KH';
const facebookUrl = 'https://www.facebook.com/Delionaryo09';

const footer = document.querySelector('footer');
if (footer && !document.querySelector('#social-channels')) {
  const social = document.createElement('section');
  social.id = 'social-channels';
  social.className = 'border-t border-amber-500/20 bg-stone-900';
  social.innerHTML = `
    <div class="mx-auto max-w-6xl px-5 py-16 text-center">
      <p class="text-sm font-black tracking-widest text-amber-400">FOLLOW DELIONARYO</p>
      <h2 class="mt-3 text-4xl font-black md:text-5xl">Continue Your Transformation.</h2>
      <p class="mx-auto mt-4 max-w-3xl text-lg leading-8 text-stone-400">Follow DELIONARYO for financial transformation lessons, practical guidance, short-form education and new videos.</p>
      <div class="mt-8 flex flex-wrap justify-center gap-4">
        <a href="${youtubeChannelUrl}" target="_blank" rel="noopener noreferrer" class="rounded-xl bg-amber-400 px-8 py-4 font-black text-stone-950">YOUTUBE →</a>
        <a href="${tiktokUrl}" target="_blank" rel="noopener noreferrer" class="rounded-xl border border-amber-400 px-8 py-4 font-black text-amber-400">TIKTOK →</a>
        <a href="${facebookUrl}" target="_blank" rel="noopener noreferrer" class="rounded-xl border border-amber-400 px-8 py-4 font-black text-amber-400">FACEBOOK →</a>
      </div>
    </div>`;
  footer.parentElement?.insertBefore(social, footer);
}
