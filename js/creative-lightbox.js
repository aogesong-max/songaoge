(() => {
  "use strict";

  const showcase = document.querySelector(".creative-showcase");
  const lightbox = document.getElementById("creative-lightbox");
  const lightboxImage = document.getElementById("creative-lightbox-image");
  const lightboxTitle = document.getElementById("creative-lightbox-title");
  const lightboxText = document.getElementById("creative-lightbox-text");
  const closeButton = lightbox?.querySelector(".creative-lightbox__close");
  const previousButton = lightbox?.querySelector(".creative-lightbox__nav--prev");
  const nextButton = lightbox?.querySelector(".creative-lightbox__nav--next");
  const triggers = Array.from(showcase?.querySelectorAll(".creative-showcase__media") || []);

  if (!showcase || !lightbox || !lightboxImage || !lightboxTitle || !lightboxText || !triggers.length) {
    return;
  }

  let currentIndex = 0;
  let returnFocus = null;
  let savedScrollY = 0;

  function syncImageAspect() {
    const ratio = lightboxImage.naturalWidth / lightboxImage.naturalHeight;
    if (Number.isFinite(ratio) && ratio > 0) {
      lightboxImage.style.setProperty("--creative-image-aspect", String(ratio));
    }
  }

  function render(index) {
    currentIndex = (index + triggers.length) % triggers.length;
    const trigger = triggers[currentIndex];
    const item = trigger.closest(".creative-showcase__item");
    const sourceImage = trigger.querySelector("img");
    const title = item.querySelector(".creative-showcase__title")?.textContent || sourceImage.alt;
    const text = item.querySelector(".creative-showcase__text")?.textContent || "";

    lightboxImage.src = sourceImage.currentSrc || sourceImage.src;
    lightboxImage.alt = title;
    if (lightboxImage.complete) syncImageAspect();
    lightboxTitle.textContent = title;
    lightboxText.textContent = text;
  }

  function open(index) {
    if (lightbox.classList.contains("is-open")) return;
    savedScrollY = window.scrollY;
    returnFocus = triggers[index];
    render(index);
    document.body.classList.add("creative-lightbox-open");
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => closeButton.focus({ preventScroll: true }));
  }

  function close() {
    if (!lightbox.classList.contains("is-open")) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("creative-lightbox-open");
    lightboxImage.removeAttribute("src");
    window.scrollTo(0, savedScrollY);
    returnFocus?.focus({ preventScroll: true });
  }

  function step(delta) {
    render(currentIndex + delta);
  }

  triggers.forEach((trigger, index) => {
    trigger.addEventListener("click", () => open(index));
  });

  closeButton.addEventListener("click", close);
  previousButton.addEventListener("click", () => step(-1));
  nextButton.addEventListener("click", () => step(1));
  lightboxImage.addEventListener("load", syncImageAspect);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = [closeButton, previousButton, nextButton];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
