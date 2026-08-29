const DIGITAL_EBOOK_LIBRARY_URL = 'https://delionaryo-ebook-library.vercel.app/';
const AI_COMMAND_LIBRARY_URL = 'https://delionaryo-video-uploader.vercel.app/ai-command-library';

function libraryDestination(slug: string | undefined): string | null {
  if (slug === 'digital-ebook-library') return DIGITAL_EBOOK_LIBRARY_URL;
  if (slug === 'ai-command-library') return AI_COMMAND_LIBRARY_URL;
  return null;
}

function bindLearningLibraryRoutes() {
  document.querySelectorAll<HTMLButtonElement>('.course-open').forEach((button) => {
    if (button.dataset.libraryRouteBound === '1') return;
    const destination = libraryDestination(button.dataset.course);
    if (!destination) return;

    button.dataset.libraryRouteBound = '1';
    button.textContent = 'VIEW LIBRARY →';
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.href = destination;
    }, true);
  });
}

const learningLibraryRouteObserver = new MutationObserver(bindLearningLibraryRoutes);
learningLibraryRouteObserver.observe(document.documentElement, { childList: true, subtree: true });
bindLearningLibraryRoutes();

export {};
