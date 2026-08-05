// ── MIKAEL GLOBAL — Main JavaScript Entry ──

// Import all modules
import { initNav } from './nav.js';
import { initGlobe } from './globe.js';
import { initCountUp } from './countup.js';
import { initObserver } from './observer.js';
import { initFilter } from './filter.js';
import { initProjects } from './projects.js';

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initNav();
  // Lazy-init the hero globe when it becomes visible to avoid unnecessary work on initial load
  const globeWrap = document.querySelector('.hero-globe-wrap');
  if (globeWrap && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          initGlobe();
          observer.disconnect();
        }
      });
    }, { rootMargin: '200px' });
    io.observe(globeWrap);
  } else {
    initGlobe();
  }
  initCountUp();
  initObserver();
  initFilter();
  initProjects();
});