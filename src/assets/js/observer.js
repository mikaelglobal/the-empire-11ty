export function initObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(
    '.service-card, .project-item, .stat-item, .skill-group, .blog-item, .reveal'
  ).forEach(el => {
    observer.observe(el);
  });
}