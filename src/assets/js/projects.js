export function initProjects() {
  // Handle project card click -> navigate to "More" (report) URL
  document.querySelectorAll('.project-item').forEach(card => {
    card.addEventListener('click', function(e) {
      // Ignore if the click originated from a button (to avoid double navigation)
      if (e.target.closest('.project-btn')) return;
      
      const reportUrl = this.dataset.reportUrl;
      if (reportUrl) {
        window.location.href = reportUrl;
      }
    });
  });

  // Also handle the "More" button clicks explicitly (they already have href)
  // This is just a safety measure for any dynamic behavior
  document.querySelectorAll('.project-btn.more').forEach(btn => {
    btn.addEventListener('click', function(e) {
      // Allow default navigation (already has href)
      // But prevent bubbling to the card click handler
      e.stopPropagation();
    });
  });
}