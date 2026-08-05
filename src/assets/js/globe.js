export function initGlobe() {
  function buildHeroGlobe() {
    const wrap = document.querySelector('.hero-globe-wrap');
    const spin = document.querySelector('.globe-spin');
    if (!wrap || !spin) return;

    const size = wrap.clientWidth;
    const R = size / 2;
    spin.innerHTML = '';

    const isSmall = size < 140;

    // Core
    const core = document.createElement('div');
    core.className = 'globe-core';
    spin.appendChild(core);

    // Meridians (longitude lines)
    const meridians = isSmall ? [0, 60, 120] : [0, 30, 60, 90, 120, 150];
    meridians.forEach(angle => {
      const m = document.createElement('div');
      m.className = 'meridian';
      m.style.transform = `rotateY(${angle}deg)`;
      spin.appendChild(m);
    });

    // Latitude rings (simpler on small screens)
    const latitudes = isSmall ? [-30, 0, 30] : [-60, -30, 0, 30, 60];
    latitudes.forEach(lat => {
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

  // Build when needed (callers may lazy-init)
  buildHeroGlobe();

  // Rebuild on resize (debounced, slightly longer to avoid churn)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildHeroGlobe, 250);
  });

  // Pointer tilt (throttled via requestAnimationFrame)
  const globeWrap = document.querySelector('.hero-globe-wrap');
  const globeTilt = document.querySelector('.globe-tilt');
  if (globeWrap && globeTilt) {
    let ticking = false;
    const onPointer = (e) => {
      if (window.matchMedia && window.matchMedia('(max-width: 900px)').matches) return; // avoid on small touch devices
      const rect = globeWrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          globeTilt.style.transform = `rotateX(${y * -25}deg) rotateY(${x * 25}deg)`;
          ticking = false;
        });
        ticking = true;
      }
    };

    globeWrap.addEventListener('pointermove', onPointer, { passive: true });
    globeWrap.addEventListener('mouseleave', () => {
      globeTilt.style.transform = '';
    });
  }
}