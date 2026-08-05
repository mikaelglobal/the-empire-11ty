export function initObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -10%' });

  document.querySelectorAll(
    '.service-card, .project-item, .stat-item, .skill-group, .founder-block, .focus-grid article, .project-filters, .contact-links, .case-study-card, .insight-card, .reveal'
  ).forEach(el => {
    observer.observe(el);
  });
}