(() => {
  "use strict";

  const finePointer = window.matchMedia("(pointer: fine)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!finePointer.matches || reduceMotion.matches) return;

  const root = document.documentElement;
  const hero = document.querySelector(".hero");
  const heroTitle = document.querySelector(".hero-title");
  const cardSelector = ".work-card, .skill-card, .advantage-card, .profile-card, .recent-tile";
  const spotlightSelector = ".contact-form";
  const magneticControls = Array.from(document.querySelectorAll(".contact-pill, .text-link, .submit-button"));
  const cards = Array.from(document.querySelectorAll(cardSelector));
  const spotlightSurfaces = Array.from(document.querySelectorAll(spotlightSelector));

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function bindSurface(element, tilts) {
    element.classList.add("pointer-reactive");
    if (!tilts) element.classList.add("pointer-reactive--spotlight");

    element.addEventListener("pointermove", (event) => {
      const bounds = element.getBoundingClientRect();
      const normalizedX = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
      const normalizedY = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
      element.style.setProperty("--glow-x", `${normalizedX * 100}%`);
      element.style.setProperty("--glow-y", `${normalizedY * 100}%`);
      if (tilts) {
        element.style.setProperty("--tilt-x", `${(0.5 - normalizedY) * 3.2}deg`);
        element.style.setProperty("--tilt-y", `${(normalizedX - 0.5) * 3.2}deg`);
      }
      element.classList.add("is-pointer-active");
    }, { passive: true });

    element.addEventListener("pointerleave", () => {
      element.classList.remove("is-pointer-active");
      element.style.setProperty("--tilt-x", "0deg");
      element.style.setProperty("--tilt-y", "0deg");
    });
  }

  cards.forEach((card) => bindSurface(card, true));
  spotlightSurfaces.forEach((surface) => bindSurface(surface, false));

  if (hero && heroTitle) {
    hero.addEventListener("pointermove", (event) => {
      const bounds = hero.getBoundingClientRect();
      const normalizedX = clamp((event.clientX - bounds.left) / bounds.width, 0, 1) - 0.5;
      const normalizedY = clamp((event.clientY - bounds.top) / bounds.height, 0, 1) - 0.5;
      heroTitle.style.setProperty("--hero-shift-x", `${normalizedX * 11}px`);
      heroTitle.style.setProperty("--hero-shift-y", `${normalizedY * 7}px`);
    }, { passive: true });

    hero.addEventListener("pointerleave", () => {
      heroTitle.style.setProperty("--hero-shift-x", "0px");
      heroTitle.style.setProperty("--hero-shift-y", "0px");
    });
  }

  magneticControls.forEach((control) => {
    control.classList.add("magnetic-control");
    control.addEventListener("pointermove", (event) => {
      const bounds = control.getBoundingClientRect();
      const x = clamp((event.clientX - (bounds.left + bounds.width / 2)) * 0.16, -5, 5);
      const y = clamp((event.clientY - (bounds.top + bounds.height / 2)) * 0.16, -4, 4);
      control.style.setProperty("--magnet-x", `${x}px`);
      control.style.setProperty("--magnet-y", `${y}px`);
      control.classList.add("is-magnetic");
    }, { passive: true });

    control.addEventListener("pointerleave", () => {
      control.style.setProperty("--magnet-x", "0px");
      control.style.setProperty("--magnet-y", "0px");
      control.classList.remove("is-magnetic");
    });
  });

  root.classList.add("content-motion-enabled");
})();
