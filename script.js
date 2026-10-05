/**
 * Leo Aquino Portfolio — Interactive Engine
 * Themes: Black, Simple, Creative
 * Accent: Electric Cyan (#00f0ff)
 */

document.addEventListener('DOMContentLoaded', () => {
  initSpotlight();
  initArtworkInverter();
  initLightbox();
  initSketchpad();
  initCopyEmail();
  initTiltEffect();
});

/* --------------------------------------------------------------------------
   1. Ambient Mouse Spotlight (Electric Cyan Tint)
   -------------------------------------------------------------------------- */
function initSpotlight() {
  const glow = document.getElementById('ambientGlow');
  if (!glow) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight * 0.3;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function renderGlow() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;
    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;
    requestAnimationFrame(renderGlow);
  }

  requestAnimationFrame(renderGlow);
}

/* --------------------------------------------------------------------------
   2. Artwork Invert Ink Mode
   -------------------------------------------------------------------------- */
function initArtworkInverter() {
  const invertBtn = document.getElementById('invertToggleBtn');
  const frame = document.getElementById('artworkFrame');
  if (!invertBtn || !frame) return;

  invertBtn.addEventListener('click', () => {
    const isInverted = frame.classList.toggle('inverted');
    const label = invertBtn.querySelector('.tool-label');
    if (label) {
      label.textContent = isInverted ? 'Original Ink' : 'Invert Ink';
    }
  });
}

/* --------------------------------------------------------------------------
   3. Lightbox Modal
   -------------------------------------------------------------------------- */
function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const triggerBtn = document.getElementById('zoomArtworkBtn');
  const artworkImg = document.getElementById('mainArtworkImg');
  const closeBtn = document.getElementById('lightboxClose');
  const backdrop = document.getElementById('lightboxBackdrop');
  if (!modal) return;

  function openLightbox() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (triggerBtn) triggerBtn.addEventListener('click', openLightbox);
  if (artworkImg) artworkImg.addEventListener('click', openLightbox);
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   4. The Digital Ink Lab (Interactive Canvas with Cyan & White Ink)
   -------------------------------------------------------------------------- */
function initSketchpad() {
  const canvas = document.getElementById('doodleCanvas');
  const hint = document.getElementById('canvasHint');
  const clearBtn = document.getElementById('clearCanvasBtn');
  const saveBtn = document.getElementById('saveCanvasBtn');
  const sizeBtns = document.querySelectorAll('.brush-size');
  const swatches = document.querySelectorAll('.color-swatch');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  let brushSize = 2;
  let inkColor = '#00f0ff'; // Default Electric Cyan
  let hasDrawn = false;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    let tempCanvas = null;
    if (hasDrawn) {
      tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCanvas.getContext('2d').drawImage(canvas, 0, 0);
    }

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    if (tempCanvas && hasDrawn) {
      ctx.drawImage(tempCanvas, 0, 0, rect.width, rect.height);
    }
  }

  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 50);

  // Brush sizing
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      brushSize = parseInt(btn.dataset.size, 10) || 2;
    });
  });

  // Color Swatches
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      inkColor = swatch.dataset.color || '#00f0ff';
    });
  });

  function getCoords(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function startDrawing(e) {
    isDrawing = true;
    if (hint && !hasDrawn) {
      hint.classList.add('hidden');
      hasDrawn = true;
    }
    const { x, y } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = brushSize;
  }

  function draw(e) {
    if (!isDrawing) return;
    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function stopDrawing() {
    if (isDrawing) {
      ctx.closePath();
      isDrawing = false;
    }
  }

  canvas.addEventListener('pointerdown', startDrawing);
  canvas.addEventListener('pointermove', draw);
  canvas.addEventListener('pointerup', stopDrawing);
  canvas.addEventListener('pointercancel', stopDrawing);
  canvas.addEventListener('pointerleave', stopDrawing);

  // Clear Canvas
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      hasDrawn = false;
      if (hint) hint.classList.remove('hidden');
    });
  }

  // Save / Download Sketch
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const outCanvas = document.createElement('canvas');
      outCanvas.width = canvas.width;
      outCanvas.height = canvas.height;
      const outCtx = outCanvas.getContext('2d');
      outCtx.fillStyle = '#050508';
      outCtx.fillRect(0, 0, outCanvas.width, outCanvas.height);
      outCtx.drawImage(canvas, 0, 0);

      const link = document.createElement('a');
      link.download = `leo-aquino-digital-ink-${Date.now()}.png`;
      link.href = outCanvas.toDataURL('image/png');
      link.click();
    });
  }
}

/* --------------------------------------------------------------------------
   5. Copy Email
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const btn = document.getElementById('copyEmailBtn');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const email = btn.dataset.email || 'aquino_de_azambuja01@student.smc.edu';
    
    navigator.clipboard.writeText(email).then(() => {
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      btn.style.background = 'var(--cyan)';
      btn.style.color = '#050508';
      btn.style.boxShadow = '0 0 16px rgba(0, 240, 255, 0.6)';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
        btn.style.boxShadow = '';
      }, 2000);
    }).catch(() => {
      prompt('Copy email:', email);
    });
  });
}

/* --------------------------------------------------------------------------
   6. 3D Tilt Effect on Work Cards
   -------------------------------------------------------------------------- */
function initTiltEffect() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll('[data-tilt]');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
