(() => {
  const section = document.getElementById("recent-works");
  const track = section?.querySelector("[data-recent-works-track]");
  const sourceSet = section?.querySelector("[data-recent-works-set]");
  const lightbox = document.getElementById("image-lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const closeButton = document.getElementById("lightbox-close");
  const previousButton = document.getElementById("lightbox-prev");
  const nextButton = document.getElementById("lightbox-next");

  if (!section || !track || !sourceSet || !lightbox || !lightboxImage) return;

  const sourceCards = Array.from(sourceSet.querySelectorAll("[data-recent-work-index]"));
  const works = sourceCards.map((card) => {
    const image = card.querySelector("img");
    const index = card.querySelector(".recent-work-card__index")?.textContent.trim() || "";
    const title = card.querySelector(".recent-work-card__back strong")?.textContent.trim() || image?.alt || "";
    return {
      src: image?.getAttribute("src") || "",
      alt: image?.alt || title,
      label: `${index} ${title}`.trim()
    };
  });
  let lightboxIndex = 0;
  let lightboxTrigger = null;
  let isLightboxOpen = false;

  function updateScrollDistance() {
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    track.style.setProperty(
      "--recent-scroll-distance",
      `${sourceSet.getBoundingClientRect().width + gap}px`
    );
  }

  function makeLoopSet() {
    const clone = sourceSet.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
    clone.querySelectorAll("button").forEach((button) => {
      button.tabIndex = -1;
    });
    track.append(clone);
    return clone;
  }

  function pause() {
    track.classList.add("is-paused");
  }

  function resume() {
    track.classList.remove("is-paused");
  }

  function wireCard(card) {
    card.addEventListener("pointerenter", pause);
    card.addEventListener("pointerleave", resume);
    card.addEventListener("focus", pause);
    card.addEventListener("blur", resume);
    card.addEventListener("click", () => {
      const index = Number(card.dataset.recentWorkIndex);
      if (!Number.isInteger(index) || !works[index]) return;
      lightboxTrigger = card;
      showLightbox(index);
    });
  }

  function showLightbox(index) {
    lightboxIndex = (index + works.length) % works.length;
    const work = works[lightboxIndex];
    lightboxImage.src = work.src;
    lightboxImage.alt = work.label;
    previousButton.hidden = false;
    nextButton.hidden = false;
    isLightboxOpen = true;
    document.body.classList.add("lightbox-open");
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    closeButton?.focus({ preventScroll: true });
  }

  function stepLightbox(step) {
    if (!isLightboxOpen) return;
    showLightbox(lightboxIndex + step);
  }

  function closeLightbox() {
    if (!isLightboxOpen) return;
    isLightboxOpen = false;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.removeAttribute("src");
    previousButton.hidden = true;
    nextButton.hidden = true;
    document.body.classList.remove("lightbox-open");
    lightboxTrigger?.focus({ preventScroll: true });
    lightboxTrigger = null;
  }

  makeLoopSet();
  makeLoopSet();
  updateScrollDistance();
  section.querySelectorAll("[data-recent-work-index]").forEach(wireCard);
  window.addEventListener("resize", updateScrollDistance, { passive: true });
  previousButton?.addEventListener("click", () => stepLightbox(-1));
  nextButton?.addEventListener("click", () => stepLightbox(1));
  closeButton?.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (isLightboxOpen) {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        stepLightbox(event.key === "ArrowLeft" ? -1 : 1);
      } else if (event.key === "Escape") {
        closeLightbox();
      }
      return;
    }
    if (
      event.key === "Escape" &&
      track.classList.contains("is-paused") &&
      document.activeElement?.closest?.(".recent-works")
    ) {
      document.activeElement.blur();
      resume();
    }
  });
})();
