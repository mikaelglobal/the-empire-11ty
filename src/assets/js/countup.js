export function initCountUp() {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('[data-target]');
        nums.forEach(num => {
          const target = +num.dataset.target;
          const suffix = target === 100 ? '%' : '+';
          let current = 0;
          const step = Math.ceil(target / 40);
          const interval = setInterval(() => {
            current = Math.min(current + step, target);
            num.textContent = current + (current === target ? suffix : '');
            if (current >= target) clearInterval(interval);
          }, 40);
        });
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stats-bar').forEach(el => countObserver.observe(el));
}