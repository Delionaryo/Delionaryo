const youtubeChannelUrl = 'https://www.youtube.com/channel/UC8tBAhLFySPo7vp9cBUh4fA';

const footer = document.querySelector('footer');
if (footer && !document.querySelector('#youtube-channel')) {
  const youtube = document.createElement('section');
  youtube.id = 'youtube-channel';
  youtube.className = 'border-t border-amber-500/20 bg-stone-900';
  youtube.innerHTML = `
    <div class="max-w-6xl mx-auto px-5 py-16 text-center">
      <p class="text-amber-400 font-black tracking-widest text-sm">DELIONARYO ON YOUTUBE</p>
      <h2 class="mt-3 text-4xl md:text-5xl font-black">Continue Your Transformation.</h2>
      <p class="mt-4 max-w-3xl mx-auto text-lg leading-8 text-stone-400">Watch DELIONARYO financial transformation lessons, practical guidance and new videos on YouTube.</p>
      <a href="${youtubeChannelUrl}" target="_blank" rel="noopener noreferrer" class="mt-8 inline-flex items-center justify-center rounded-xl bg-amber-400 px-8 py-4 font-black text-stone-950 hover:bg-amber-300 transition">VISIT DELIONARYO YOUTUBE →</a>
      <p class="mt-4 text-sm text-stone-500">Subscribe to follow new DELIONARYO videos and financial transformation content.</p>
    </div>`;
  footer.parentElement?.insertBefore(youtube, footer);
}
