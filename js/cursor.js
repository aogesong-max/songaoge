(() => {
  "use strict";

  const finePointer = window.matchMedia("(pointer: fine)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!finePointer.matches || reduceMotion.matches || document.getElementById("site-cursor")) return;

  const root = document.documentElement;
  const cursorLayer = document.createElement("div");
  const halo = document.createElement("span");
  const wheel = document.createElement("span");
  const ring = document.createElement("span");
  const dot = document.createElement("span");
  const label = document.createElement("span");

  cursorLayer.className = "site-cursor";
  cursorLayer.id = "site-cursor";
  cursorLayer.setAttribute("aria-hidden", "true");
  halo.className = "site-cursor__halo";
  wheel.className = "site-cursor__wheel";
  ring.className = "site-cursor__ring";
  dot.className = "site-cursor__dot";
  label.className = "site-cursor__label";

  for (let index = 0; index < 16; index += 1) {
    const orbit = document.createElement("span");
    const particle = document.createElement("span");
    orbit.className = "site-cursor__orbit";
    particle.className = "site-cursor__particle";
    orbit.style.setProperty("--angle", `${index * 22.5}deg`);
    particle.style.setProperty("--delay", `${index * -58}ms`);
    orbit.appendChild(particle);
    wheel.appendChild(orbit);
  }

  cursorLayer.append(halo, wheel, ring, dot, label);
  document.body.appendChild(cursorLayer);
  root.classList.add("has-site-cursor");

  const state = {
    pointerX: window.innerWidth / 2,
    pointerY: window.innerHeight / 2,
    ringX: window.innerWidth / 2,
    ringY: window.innerHeight / 2,
    haloX: window.innerWidth / 2,
    haloY: window.innerHeight / 2,
    wheelX: window.innerWidth / 2,
    wheelY: window.innerHeight / 2,
    wheelRotation: 0,
    previousX: window.innerWidth / 2,
    previousY: window.innerHeight / 2,
    visible: false
  };

  function labelForTarget(target) {
    if (!(target instanceof Element)) return "";
    const interactive = target.closest(
      "a, button, input, textarea, [role='button'], .drama-card, .design-card, .design-index-card, .hero-sigil"
    );
    if (!interactive) return "";

    if (interactive.dataset.cursor) return interactive.dataset.cursor;
    if (interactive.matches("input, textarea")) return "输入";
    if (interactive.matches(".drama-card, .design-card, .design-index-card")) return "预览";
    if (interactive.matches(".hero-sigil")) return "主视觉";
    if (interactive.matches("button")) return "点击";
    if (interactive.matches("a")) {
      return interactive.matches("[href^='#']") ? "前往" : "打开";
    }
    return "探索";
  }

  function updateHoverTarget(target) {
    const nextLabel = labelForTarget(target);
    cursorLayer.classList.toggle("is-hovering", Boolean(nextLabel));
    if (label.textContent !== nextLabel) label.textContent = nextLabel;
  }

  function positionElements() {
    const labelOffsetX = Math.min(48, window.innerWidth * 0.06);
    ring.style.transform = `translate3d(${state.ringX}px, ${state.ringY}px, 0) translate(-50%, -50%)`;
    wheel.style.transform = `translate3d(${state.wheelX}px, ${state.wheelY}px, 0) translate(-50%, -50%) rotate(${state.wheelRotation}deg)`;
    dot.style.transform = `translate3d(${state.pointerX}px, ${state.pointerY}px, 0) translate(-50%, -50%)`;
    halo.style.transform = `translate3d(${state.haloX}px, ${state.haloY}px, 0) translate(-50%, -50%)`;
    label.style.transform = `translate3d(${state.pointerX + labelOffsetX}px, ${state.pointerY + 38}px, 0) translate(-50%, -50%)`;
  }

  function animate() {
    const speedX = state.pointerX - state.previousX;
    const speedY = state.pointerY - state.previousY;
    const speed = Math.min(42, Math.hypot(speedX, speedY));
    state.ringX += (state.pointerX - state.ringX) * 0.2;
    state.ringY += (state.pointerY - state.ringY) * 0.2;
    state.haloX += (state.pointerX - state.haloX) * 0.075;
    state.haloY += (state.pointerY - state.haloY) * 0.075;
    state.wheelX += (state.pointerX - state.wheelX) * 0.14;
    state.wheelY += (state.pointerY - state.wheelY) * 0.14;
    state.wheelRotation += 0.2 + speed * 0.032 + (cursorLayer.classList.contains("is-hovering") ? 0.34 : 0);
    state.previousX = state.pointerX;
    state.previousY = state.pointerY;
    positionElements();
    window.requestAnimationFrame(animate);
  }

  function showCursor(x, y) {
    state.pointerX = x;
    state.pointerY = y;
    if (!state.visible) {
      state.ringX = x;
      state.ringY = y;
      state.haloX = x;
      state.haloY = y;
      state.wheelX = x;
      state.wheelY = y;
      state.previousX = x;
      state.previousY = y;
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
    cursorLayer.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 540);
  }

  function createBurst(x, y) {
    for (let index = 0; index < 14; index += 1) {
      const particle = document.createElement("span");
      const angle = (Math.PI * 2 * index) / 14 + Math.random() * 0.22;
      const distance = 28 + Math.random() * 34;
      particle.className = "site-cursor__burst";
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.setProperty("--travel-x", `${Math.cos(angle) * distance}px`);
      particle.style.setProperty("--travel-y", `${Math.sin(angle) * distance}px`);
      particle.style.setProperty("--delay", `${Math.random() * 70}ms`);
      cursorLayer.appendChild(particle);
      window.setTimeout(() => particle.remove(), 780);
    }
  }

  window.addEventListener("pointermove", (event) => {
    showCursor(event.clientX, event.clientY);
    updateHoverTarget(event.target);
  }, { passive: true });

  window.addEventListener("pointerdown", (event) => {
    if (!state.visible || event.button !== 0) return;
    cursorLayer.classList.add("is-down");
    createRipple(event.clientX, event.clientY);
    createBurst(event.clientX, event.clientY);
  });

  window.addEventListener("pointerup", () => cursorLayer.classList.remove("is-down"));
  window.addEventListener("pointerleave", hideCursor);
  window.addEventListener("blur", hideCursor);
  document.addEventListener("visibilitychange", hideCursor);
  document.documentElement.addEventListener("mouseleave", hideCursor);

  animate();
})();
