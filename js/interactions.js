(() => {
  "use strict";

  const finePointer = window.matchMedia("(pointer: fine)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!finePointer.matches || reduceMotion.matches) return;

  const root = document.documentElement;
  const hero = document.querySelector(".hero");
  const heroTitle = document.querySelector(".hero__word");
  const heroSigil = document.querySelector(".hero-sigil");
  const cards = Array.from(
    document.querySelectorAll(".design-card, .design-index-card, .drama-card")
  );
  const magneticControls = Array.from(
    document.querySelectorAll(".hero__cta, .contact-pill, .ghost-pill")
  );

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  cards.forEach((card) => {
    card.classList.add("pointer-reactive");
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
      const y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
      card.style.setProperty("--glow-x", `${x * 100}%`);
      card.style.setProperty("--glow-y", `${y * 100}%`);
      card.style.setProperty("--tilt-x", `${(0.5 - y) * 2.8}deg`);
      card.style.setProperty("--tilt-y", `${(x - 0.5) * 2.8}deg`);
      card.classList.add("is-pointer-active");
    }, { passive: true });

    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-pointer-active");
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });

  if (hero && heroTitle) {
    hero.addEventListener("pointermove", (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1) - 0.5;
      const y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1) - 0.5;
      heroTitle.style.setProperty("--hero-shift-x", `${x * 10}px`);
      heroTitle.style.setProperty("--hero-shift-y", `${y * 6}px`);
      if (heroSigil) {
        heroSigil.style.setProperty("--sigil-shift-x", `${x * -14}px`);
        heroSigil.style.setProperty("--sigil-shift-y", `${y * -9}px`);
      }
    }, { passive: true });

    hero.addEventListener("pointerleave", () => {
      heroTitle.style.setProperty("--hero-shift-x", "0px");
      heroTitle.style.setProperty("--hero-shift-y", "0px");
      if (heroSigil) {
        heroSigil.style.setProperty("--sigil-shift-x", "0px");
        heroSigil.style.setProperty("--sigil-shift-y", "0px");
      }
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
