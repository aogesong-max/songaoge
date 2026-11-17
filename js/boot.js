(() => {
  "use strict";

  const layer = document.getElementById("boot-layer");
  if (!layer) return;

  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function releasePage() {
    root.classList.remove("boot-active");
    layer.remove();
  }

  if (reducedMotion.matches) {
    releasePage();
    return;
  }

  const canvas = document.getElementById("boot-particles");
  const context = canvas?.getContext("2d", { alpha: true });
  const loader = document.getElementById("boot-loader");
  const progress = document.getElementById("boot-progress");
  const progressGlow = document.getElementById("boot-progress-glow");
  const percent = document.getElementById("boot-percent");
  const shockwave = document.getElementById("boot-shockwave");
  const recDot = document.getElementById("boot-rec-dot");
  const PARTICLE_COUNT = 700;
  const LOAD_END = 1.9;
  const EFFECT_END = 2.2;
  const EXIT_END = 2.7;
  const COLORS = [
    "235, 250, 255",
    "80, 229, 248",
    "255, 107, 190",
    "255, 182, 94"
  ];

  let frameId = 0;
  let startTime = 0;
  let viewportWidth = 0;
  let viewportHeight = 0;
  let deviceScale = 1;
  let finished = false;

  function clamp(value, min = 0, max = 1) {
    return Math.min(max, Math.max(min, value));
  }

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - clamp(value), 3);
  }

  function smoothstep(value) {
    const next = clamp(value);
    return next * next * (3 - 2 * next);
  }

  function createRandom(seed) {
    let state = seed >>> 0;
    return () => {
      state += 0x6d2b79f5;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  const random = createRandom(0x5a0a6e17);
  const particles = Array.from({ length: PARTICLE_COUNT }, () => {
    const colorIndex = random();
    return {
      angle: random() * Math.PI * 2,
      radiusX: 0.13 + Math.pow(random(), 0.68) * 0.87,
      radiusY: 0.13 + Math.pow(random(), 0.7) * 0.87,
      speed: 0.24 + random() * 0.68,
      size: 0.45 + Math.pow(random(), 1.8) * 1.55,
      alpha: 0.18 + Math.pow(random(), 0.7) * 0.66,
      phase: random() * Math.PI * 2,
      drift: 2 + random() * 7,
      color: COLORS[colorIndex < 0.3 ? 0 : colorIndex < 0.62 ? 1 : colorIndex < 0.88 ? 2 : 3],
      halo: random() < 0.11
    };
  });

  function sizeCanvas() {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    deviceScale = Math.min(window.devicePixelRatio || 1, 2);
    if (!canvas) return;
    canvas.width = Math.round(viewportWidth * deviceScale);
    canvas.height = Math.round(viewportHeight * deviceScale);
    context?.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
  }

  function drawParticles(elapsed, progressValue, layerOpacity) {
    if (!context || !canvas) return;
    context.clearRect(0, 0, viewportWidth, viewportHeight);

    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    const maxRadiusX = Math.max(130, Math.min(viewportWidth * 0.47, 720));
    const maxRadiusY = Math.max(145, Math.min(viewportHeight * 0.45, 455));
    const gathering = 1 - smoothstep(progressValue) * 0.25;
    const collapse = smoothstep((elapsed - LOAD_END) / 0.3);
    const radiusScale = gathering * (1 - collapse * 0.88);
    const fade = layerOpacity;

    context.save();
    context.globalCompositeOperation = "lighter";

    particles.forEach((particle, index) => {
      const angle = particle.angle + elapsed * particle.speed;
      const pulse = Math.sin(elapsed * 2.2 + particle.phase);
      const drift = 1 + pulse * particle.drift / 100;
      const radiusX = maxRadiusX * particle.radiusX * radiusScale * drift;
      const radiusY = maxRadiusY * particle.radiusY * radiusScale * drift;
      const x = centerX + Math.cos(angle) * radiusX;
      const y = centerY + Math.sin(angle) * radiusY;
      const shimmer = 0.82 + Math.sin(elapsed * 3.7 + index * 1.13) * 0.18;
      const alpha = clamp(particle.alpha * shimmer * fade, 0, 0.92);

      if (particle.halo) {
        context.beginPath();
        context.fillStyle = `rgba(${particle.color}, ${alpha * 0.1})`;
        context.arc(x, y, particle.size * 3.4, 0, Math.PI * 2);
        context.fill();
      }

      context.beginPath();
      context.fillStyle = `rgba(${particle.color}, ${alpha})`;
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  }

  function setRingProgress(value) {
    const offset = String(100 - clamp(value) * 100);
    if (progress) progress.style.strokeDashoffset = offset;
    if (progressGlow) progressGlow.style.strokeDashoffset = offset;
  }

  function finish() {
    if (finished) return;
    finished = true;
    if (frameId) window.cancelAnimationFrame(frameId);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("resize", sizeCanvas);
    window.removeEventListener("pagehide", onPageHide);
    reducedMotion.removeEventListener?.("change", onMotionPreference);
    releasePage();
  }

  function onKeyDown(event) {
    if (event.key !== "Escape") return;
    event.preventDefault();
    finish();
  }

  function onMotionPreference(event) {
    if (event.matches) finish();
  }

  function onPageHide() {
    finish();
  }

  function render(timestamp) {
    if (finished) return;
    const elapsed = Math.max(0, (timestamp - startTime) / 1000);
    const load = easeOutCubic(elapsed / LOAD_END);
    const finale = smoothstep((elapsed - LOAD_END) / 0.3);
    const exit = smoothstep((elapsed - EFFECT_END) / (EXIT_END - EFFECT_END));
    const layerOpacity = 1 - exit;
    const shock = clamp((elapsed - LOAD_END) / 0.3);
    const blinkPhase = (elapsed * 2.55) % 1;

    if (recDot) recDot.style.opacity = String(blinkPhase < 0.16 ? 1 : 0.28);
    setRingProgress(elapsed >= LOAD_END ? 1 : load);
    if (percent) {
      const displayedProgress = elapsed >= LOAD_END ? 100 : Math.min(99, Math.round(load * 100));
      percent.textContent = `${displayedProgress}%`;
    }

    loader?.style.setProperty("--boot-loader-scale", String(1 + finale * 0.07));
    loader?.style.setProperty("--boot-loader-opacity", String(1 - finale));
    shockwave?.style.setProperty("--boot-shock-scale", String(0.86 + easeOutCubic(shock) * 1.64));
    shockwave?.style.setProperty("--boot-shock-opacity", String(shock > 0 ? (1 - shock) * 0.92 : 0));
    layer.style.opacity = String(layerOpacity);
    drawParticles(elapsed, load, layerOpacity);

    if (elapsed >= EXIT_END) {
      finish();
      return;
    }
    frameId = window.requestAnimationFrame(render);
  }

  sizeCanvas();
  root.classList.add("boot-active");
  layer.focus({ preventScroll: true });
  window.addEventListener("resize", sizeCanvas, { passive: true });
  window.addEventListener("keydown", onKeyDown);
  layer.addEventListener("click", finish);
  reducedMotion.addEventListener?.("change", onMotionPreference);
  window.addEventListener("pagehide", onPageHide);
  startTime = performance.now();
  frameId = window.requestAnimationFrame(render);
})();
