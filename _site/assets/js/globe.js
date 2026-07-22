export function initGlobe() {
  function buildHeroGlobe() {
    const wrap = document.querySelector('.hero-globe-wrap');
    const spin = document.querySelector('.globe-spin');
    if (!wrap || !spin) return;

    const size = wrap.clientWidth;
    const R = size / 2;
    spin.innerHTML = '';

    // Core
    const core = document.createElement('div');
    core.className = 'globe-core';
    spin.appendChild(core);

    // Meridians (longitude lines)
    [0, 30, 60, 90, 120, 150].forEach(angle => {
      const m = document.createElement('div');
      m.className = 'meridian';
      m.style.transform = `rotateY(${angle}deg)`;
      spin.appendChild(m);
    });

    // Latitude rings
    [-60, -30, 0, 30, 60].forEach(lat => {
      const rad = (lat * Math.PI) / 180;
      const w = size * Math.cos(rad);
      const yOff = -R * Math.sin(rad);
      const l = document.createElement('div');
      l.className = 'latitude' + (lat === 0 ? ' equator' : '');
      l.style.width = `${w}px`;
      l.style.height = `${w}px`;
      l.style.marginLeft = `-${w / 2}px`;
      l.style.marginTop = `-${w / 2}px`;
      l.style.transform = `translateY(${yOff}px) rotateX(90deg)`;
      spin.appendChild(l);
    });

    // MK label
    const label = document.createElement('div');
    label.className = 'globe-label';
    label.style.transform = `translateZ(${R}px)`;
    label.style.fontSize = `${size * 0.22}px`;
    label.textContent = 'MK';
    spin.appendChild(label);
  }

  // Build on load
  buildHeroGlobe();

  // Rebuild on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildHeroGlobe, 150);
  });

  // Mouse tilt
  const globeWrap = document.querySelector('.hero-globe-wrap');
  const globeTilt = document.querySelector('.globe-tilt');
  if (globeWrap && globeTilt) {
    globeWrap.addEventListener('mousemove', (e) => {
      const rect = globeWrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      globeTilt.style.transform = `rotateX(${y * -25}deg) rotateY(${x * 25}deg)`;
    });
    globeWrap.addEventListener('mouseleave', () => {
      globeTilt.style.transform = '';
    });
  }
}