(() => {
  "use strict";

  const finePointer = window.matchMedia("(pointer: fine)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!finePointer.matches || reduceMotion.matches || document.getElementById("site-cursor")) return;

  const root = document.documentElement;
  const cursorLayer = document.createElement("div");
  const halo = document.createElement("span");
  const ring = document.createElement("span");
  const dot = document.createElement("span");
  const label = document.createElement("span");

  cursorLayer.className = "site-cursor";
  cursorLayer.id = "site-cursor";
  cursorLayer.setAttribute("aria-hidden", "true");
  halo.className = "site-cursor__halo";
  ring.className = "site-cursor__ring";
  dot.className = "site-cursor__dot";
  label.className = "site-cursor__label";
  cursorLayer.append(halo, ring, dot, label);
  document.body.appendChild(cursorLayer);
  root.classList.add("has-site-cursor");

  const state = {
    pointerX: window.innerWidth / 2,
    pointerY: window.innerHeight / 2,
    ringX: window.innerWidth / 2,
    ringY: window.innerHeight / 2,
    haloX: window.innerWidth / 2,
    haloY: window.innerHeight / 2,
    labelX: window.innerWidth / 2,
    labelY: window.innerHeight / 2,
    frame: 0,
    visible: false
  };

  function setLabel(text) {
    if (label.textContent === text) return;
    label.textContent = text;
  }

  function labelForTarget(target) {
    if (!(target instanceof Element)) return "";
    const interactive = target.closest("a, button, input, textarea, [role='button'], .work-card, .skill-card, .advantage-card, .recent-tile, .ring-poster, .hero-visual");
    if (!interactive) return "";

    if (interactive.dataset.cursor) return interactive.dataset.cursor;
    if (interactive.matches("input, textarea")) return "输入";
    if (interactive.matches(".work-card, .recent-tile, .ring-poster")) return "预览";
    if (interactive.matches(".skill-card, .advantage-card")) return "了解";
    if (interactive.matches(".hero-visual")) return "主视觉";
    if (interactive.matches("button")) return "点击";
    if (interactive.matches("a")) {
      return interactive.matches("[href^='#']") ? "前往" : "打开";
    }
    return "探索";
  }

  function updateHoverTarget(target) {
    const labelText = labelForTarget(target);
    cursorLayer.classList.toggle("is-hovering", Boolean(labelText));
    setLabel(labelText);
  }

  function positionElements() {
    const labelOffsetX = Math.min(48, window.innerWidth * 0.06);
    const labelOffsetY = 38;
    ring.style.transform = `translate3d(${state.ringX}px, ${state.ringY}px, 0) translate(-50%, -50%)`;
    dot.style.transform = `translate3d(${state.pointerX}px, ${state.pointerY}px, 0) translate(-50%, -50%)`;
    halo.style.transform = `translate3d(${state.haloX}px, ${state.haloY}px, 0) translate(-50%, -50%)`;
    label.style.transform = `translate3d(${state.pointerX + labelOffsetX}px, ${state.pointerY + labelOffsetY}px, 0) translate(-50%, -50%)`;
  }

  function animate() {
    state.ringX += (state.pointerX - state.ringX) * 0.2;
    state.ringY += (state.pointerY - state.ringY) * 0.2;
    state.haloX += (state.pointerX - state.haloX) * 0.075;
    state.haloY += (state.pointerY - state.haloY) * 0.075;
    positionElements();
    state.frame = window.requestAnimationFrame(animate);
  }

  function showCursor(x, y) {
    state.pointerX = x;
    state.pointerY = y;
    if (!state.visible) {
      state.ringX = x;
      state.ringY = y;
      state.haloX = x;
      state.haloY = y;
      cursorLayer.classList.add("is-visible");
      state.visible = true;
    }
  }

  function hideCursor() {
    cursorLayer.classList.remove("is-visible");
    state.visible = false;
  }

  function createRipple(x, y) {
    const ripple = document.createElement("span");
    ripple.className = "site-cursor__ripple";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    halo.parentElement.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 540);
  }

  window.addEventListener("pointermove", (event) => {
    showCursor(event.clientX, event.clientY);
    updateHoverTarget(event.target);
  }, { passive: true });

  window.addEventListener("pointerdown", (event) => {
    if (!state.visible || event.button !== 0) return;
    cursorLayer.classList.add("is-down");
    createRipple(event.clientX, event.clientY);
  });

  window.addEventListener("pointerup", () => cursorLayer.classList.remove("is-down"));
  window.addEventListener("pointerleave", hideCursor);
  window.addEventListener("blur", hideCursor);
  document.addEventListener("visibilitychange", hideCursor);
  document.documentElement.addEventListener("mouseleave", hideCursor);

  animate();
})();
