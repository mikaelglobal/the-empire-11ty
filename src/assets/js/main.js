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
  initGlobe();
  initCountUp();
  initObserver();
  initFilter();
  initProjects();
});