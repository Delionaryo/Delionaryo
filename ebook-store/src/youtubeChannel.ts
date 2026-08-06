const youtubeChannelUrl = 'https://www.youtube.com/channel/UC8tBAhLFySPo7vp9cBUh4fA';
const tiktokUrl = 'https://www.tiktok.com/@rrl6980?_r=1&_t=ZS-98clQNSR9KH';
const facebookUrl = 'https://www.facebook.com/Delionaryo09';
const mondayMindPlaylistUrl = 'https://www.youtube.com/playlist?list=PLbLe7g_8n8L8';
const tuesdayOrientationPlaylistUrl = 'https://www.youtube.com/playlist?list=PLEZcxEc5NjjE';
const wednesdayNarrativePlaylistUrl = 'https://www.youtube.com/playlist?list=PLRAOblnZblB8';
const thursdayExecutionPlaylistUrl = 'https://www.youtube.com/playlist?list=PLOPvZb7ghfOM';
const fridayYieldPlaylistUrl = 'https://www.youtube.com/playlist?list=PLS4Q524LSbLY';
const saturdayPlaylistUrl = 'https://www.youtube.com/playlist?list=PLdkURstUGJus';
const sundayPlaylistUrl = 'https://www.youtube.com/playlist?list=PLeZy8es56BcA';
const aiContentCreationPlaylistUrl = 'https://www.youtube.com/playlist?list=PLTFRVsx4BizQ';
const financialLiteracyPlaylistUrl = 'https://www.youtube.com/playlist?list=PLUc1LU9edXfI';

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

function renderFreeTraining() {
  if (document.querySelector('#free-training-paths')) return true;
  const today = document.querySelector('#today');
  if (!today) return false;
  const section = document.createElement('section');
  section.id = 'free-training-paths';
  section.className = 'border-t border-amber-500/20 bg-stone-950';
  section.innerHTML = `
    <div class="max-w-6xl mx-auto px-5 py-16">
      <div class="text-center">
        <p class="text-amber-400 font-black tracking-widest text-sm">FREE TRAINING VIDEOS</p>
        <h2 class="mt-3 text-4xl md:text-5xl font-black">Build Skills. Create. Earn.</h2>
        <p class="mt-4 max-w-3xl mx-auto text-lg leading-8 text-stone-400">Access practical DELIONARYO training playlists and keep learning as new lessons are added.</p>
      </div>
      <div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <a href="${aiContentCreationPlaylistUrl}" target="_blank" rel="noopener noreferrer" class="block rounded-2xl border border-amber-500/30 bg-stone-900 p-6 hover:border-amber-400 transition">
          <p class="text-amber-400 text-xs font-black tracking-widest">FREE TRAINING</p>
          <h3 class="mt-3 text-2xl font-black">AI CONTENT CREATION</h3>
          <p class="mt-3 text-stone-400 leading-7">Learn AI content creation, prompts, images, video workflows, editing and publishing.</p>
          <p class="mt-5 text-amber-400 font-black">WATCH PLAYLIST →</p>
        </a>
        <a href="${financialLiteracyPlaylistUrl}" target="_blank" rel="noopener noreferrer" class="block rounded-2xl border border-amber-500/30 bg-stone-900 p-6 hover:border-amber-400 transition">
          <p class="text-amber-400 text-xs font-black tracking-widest">FREE TRAINING</p>
          <h3 class="mt-3 text-2xl font-black">FINANCIAL LITERACY</h3>
          <p class="mt-3 text-stone-400 leading-7">Learn practical money management, saving, budgeting, income and wealth-building principles.</p>
          <p class="mt-5 text-amber-400 font-black">WATCH PLAYLIST →</p>
        </a>
        <div class="rounded-2xl border border-stone-700 bg-stone-900 p-6 opacity-70">
          <p class="text-stone-500 text-xs font-black tracking-widest">COMING NEXT</p>
          <h3 class="mt-3 text-2xl font-black">SPEND & EARN</h3>
        </div>
        <div class="rounded-2xl border border-stone-700 bg-stone-900 p-6 opacity-70">
          <p class="text-stone-500 text-xs font-black tracking-widest">COMING NEXT</p>
          <h3 class="mt-3 text-2xl font-black">SPIRITUALITY</h3>
        </div>
      </div>
    </div>`;
  today.insertAdjacentElement('afterend', section);
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
  const sundayReady = connectDayPlaylist('SUNDAY', 'REFLECTION', sundayPlaylistUrl);
  const trainingReady = renderFreeTraining();
  const socialReady = renderSocialChannels() || Boolean(document.querySelector('#social-channels'));
  return mondayReady && tuesdayReady && wednesdayReady && thursdayReady && fridayReady && saturdayReady && sundayReady && trainingReady && socialReady;
}

if (!initializeEnhancements()) {
  const observer = new MutationObserver(() => {
    if (initializeEnhancements()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
