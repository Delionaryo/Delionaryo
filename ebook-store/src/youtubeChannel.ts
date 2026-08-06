const youtubeChannelUrl = 'https://www.youtube.com/channel/UC8tBAhLFySPo7vp9cBUh4fA';
const tiktokUrl = 'https://www.tiktok.com/@rrl6980?_r=1&_t=ZS-98clQNSR9KH';
const facebookUrl = 'https://www.facebook.com/Delionaryo09';
const mondayMindPlaylistUrl = 'https://www.youtube.com/playlist?list=PLbLe7g_8n8L8';
const tuesdayOrientationPlaylistUrl = 'https://www.youtube.com/playlist?list=PLEZcxEc5NjjE';
const wednesdayNarrativePlaylistUrl = 'https://www.youtube.com/playlist?list=PLRAOblnZblB8';
const thursdayExecutionPlaylistUrl = 'https://www.youtube.com/playlist?list=PLOPvZb7ghfOM';
const fridayYieldPlaylistUrl = 'https://www.youtube.com/playlist?list=PLS4Q524LSbLY';
const saturdayPlaylistUrl = 'https://www.youtube.com/playlist?list=PLdkURstUGJus';

function connectDayPlaylist(day: string, title: string, playlistUrl: string) {
  const today = document.querySelector('#today');
  if (!today) return false;
  const dayLabel = Array.from(today.querySelectorAll('p')).find((el) => el.textContent?.trim() === day);
  const card = dayLabel?.parentElement as HTMLElement | null;
  if (!card) return false;
  if (card.dataset.playlistConnected === 'true') return true;
  card.dataset.playlistConnected = 'true';
  card.setAttribute('role', 'link');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Open ${day} ${title} YouTube playlist`);
  card.classList.add('cursor-pointer', 'hover:border-amber-400', 'transition');
  const openPlaylist = () => window.open(playlistUrl, '_blank', 'noopener,noreferrer');
  card.addEventListener('click', openPlaylist);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPlaylist();
    }
  });
  const hint = document.createElement('p');
  hint.className = 'mt-4 text-xs font-black text-amber-400';
  hint.textContent = `WATCH ${day} ${title} PLAYLIST →`;
  card.appendChild(hint);
  return true;
}

function renderSocialChannels() {
  const footer = document.querySelector('footer');
  if (!footer || document.querySelector('#social-channels')) return false;
  const social = document.createElement('section');
  social.id = 'social-channels';
  social.className = 'border-t border-amber-500/20 bg-stone-900';
  social.innerHTML = `
    <div class="max-w-6xl mx-auto px-5 py-16 text-center">
      <p class="text-amber-400 font-black tracking-widest text-sm">FOLLOW DELIONARYO</p>
      <h2 class="mt-3 text-4xl md:text-5xl font-black">Continue Your Transformation.</h2>
      <p class="mt-4 max-w-3xl mx-auto text-lg leading-8 text-stone-400">Follow DELIONARYO for financial transformation lessons, practical guidance, short-form education and new videos.</p>
      <div class="mt-8 flex flex-wrap justify-center gap-4">
        <a href="${youtubeChannelUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center rounded-xl bg-amber-400 px-8 py-4 font-black text-stone-950 hover:bg-amber-300 transition">YOUTUBE →</a>
        <a href="${tiktokUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center rounded-xl border border-amber-400 px-8 py-4 font-black text-amber-400 hover:bg-amber-400 hover:text-stone-950 transition">TIKTOK →</a>
        <a href="${facebookUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center rounded-xl border border-amber-400 px-8 py-4 font-black text-amber-400 hover:bg-amber-400 hover:text-stone-950 transition">FACEBOOK →</a>
      </div>
      <p class="mt-4 text-sm text-stone-500">Subscribe and follow to receive new DELIONARYO content.</p>
    </div>`;
  footer.parentElement?.insertBefore(social, footer);
  return true;
}

function initializeEnhancements() {
  const mondayReady = connectDayPlaylist('MONDAY', 'MIND', mondayMindPlaylistUrl);
  const tuesdayReady = connectDayPlaylist('TUESDAY', 'ORIENTATION', tuesdayOrientationPlaylistUrl);
  const wednesdayReady = connectDayPlaylist('WEDNESDAY', 'NARRATIVE', wednesdayNarrativePlaylistUrl);
  const thursdayReady = connectDayPlaylist('THURSDAY', 'EXECUTION', thursdayExecutionPlaylistUrl);
  const fridayReady = connectDayPlaylist('FRIDAY', 'YIELD', fridayYieldPlaylistUrl);
  const saturdayReady = connectDayPlaylist('SATURDAY', 'ACTION', saturdayPlaylistUrl);
  const socialReady = renderSocialChannels() || Boolean(document.querySelector('#social-channels'));
  return mondayReady && tuesdayReady && wednesdayReady && thursdayReady && fridayReady && saturdayReady && socialReady;
}

if (!initializeEnhancements()) {
  const observer = new MutationObserver(() => {
    if (initializeEnhancements()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
