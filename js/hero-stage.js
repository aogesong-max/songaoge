(() => {
  "use strict";

  const hero = document.getElementById("home");
  const stage = document.getElementById("hero-stage");
  if (!hero || !stage) return;

  const stageWidth = 1440;
  const stageHeight = 810;
  const headVideo = stage.querySelector(".hero-stage__head");
  const helmet = stage.querySelector(".hero-stage__helmet");
  const pushButton = document.getElementById("hero-stage-button");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  function fitStage() {
    const bounds = hero.getBoundingClientRect();
    const scale = Math.max(bounds.width / stageWidth, bounds.height / stageHeight);

    stage.style.left = `${bounds.width / 2 - (stageWidth / 2) * scale}px`;
    stage.style.top = `${bounds.height / 2 - (stageHeight / 2) * scale}px`;
    stage.style.transform = `scale(${scale})`;
    stage.dataset.scale = String(scale);
  }

  fitStage();
  if ("ResizeObserver" in window) {
    const stageResizeObserver = new ResizeObserver(fitStage);
    stageResizeObserver.observe(hero);
  } else {
    window.addEventListener("resize", fitStage, { passive: true });
  }

  if (!pushButton || !helmet) return;

  pushButton.addEventListener("click", () => {
    const isWorn = pushButton.getAttribute("aria-pressed") !== "true";
    pushButton.setAttribute("aria-pressed", String(isWorn));
    pushButton.setAttribute("aria-label", isWorn ? "摘下玻璃头盔" : "戴上玻璃头盔");
    helmet.classList.toggle("is-worn", isWorn);

    pushButton.classList.remove("is-pressing");
    void pushButton.offsetWidth;
    pushButton.classList.add("is-pressing");
  });

  pushButton.addEventListener("animationend", () => {
    pushButton.classList.remove("is-pressing");
  });

  hero.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target?.closest(".hero__scroll")) return;

    const bounds = pushButton.getBoundingClientRect();
    const isButtonHit = (
      event.clientX >= bounds.left &&
      event.clientX <= bounds.right &&
      event.clientY >= bounds.top &&
      event.clientY <= bounds.bottom
    );

    if (!isButtonHit) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    pushButton.click();
  }, true);

  if (reduceMotion.matches || !headVideo) return;

  const remoteVideoUrl = headVideo.dataset.headSrc;
  if (!remoteVideoUrl) return;

  const easeFactor = 0.14;
  const idleDelay = 3500;
  let duration = 0;
  let displayedTime = 0;
  let targetTime = 0;
  let lastPointerAt = performance.now();
  let firstSeekPending = true;
  let revealTimer = 0;
  let frameRequest = 0;
  let objectUrl = "";

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function drawFrame(now) {
    if (duration > 0) {
      if (hasFinePointer.matches && now - lastPointerAt > idleDelay) {
        const idlePhase = (now - lastPointerAt - idleDelay) / 1000;
        targetTime = duration * (0.5 + Math.sin(idlePhase * (Math.PI / 4)) * 0.32);
      }

      displayedTime += (targetTime - displayedTime) * easeFactor;
      if (!headVideo.seeking) {
        headVideo.currentTime = clamp(displayedTime, 0, duration);
      }
    }

    frameRequest = window.requestAnimationFrame(drawFrame);
  }

  function setTargetFromPointer(event) {
    if (duration <= 0) return;
    const bounds = hero.getBoundingClientRect();
    if (!bounds.width) return;

    const position = clamp((event.clientX - bounds.left) / bounds.width, 0.14, 0.86);
    targetTime = ((position - 0.14) / 0.72) * duration;
    lastPointerAt = performance.now();
  }

  headVideo.addEventListener("loadedmetadata", () => {
    duration = Number.isFinite(headVideo.duration) ? headVideo.duration : 0;
    if (!duration) return;

    displayedTime = duration / 2;
    targetTime = displayedTime;
    headVideo.pause();
    headVideo.currentTime = displayedTime;
    frameRequest = window.requestAnimationFrame(drawFrame);
  }, { once: true });

  headVideo.addEventListener("seeked", () => {
    if (!firstSeekPending) return;
    firstSeekPending = false;
    window.clearTimeout(revealTimer);
    revealTimer = window.setTimeout(() => {
      headVideo.classList.add("is-visible");
    }, 600);
  });

  hero.addEventListener("pointermove", setTargetFromPointer, { passive: true });
  hero.addEventListener("pointerdown", setTargetFromPointer, { passive: true });

  async function loadHeadVideo() {
    try {
      const response = await fetch(remoteVideoUrl);
      if (!response.ok) throw new Error("Head video request failed");
      const blob = await response.blob();
      objectUrl = URL.createObjectURL(blob);
      headVideo.src = objectUrl;
    } catch (error) {
      headVideo.src = remoteVideoUrl;
    }

    headVideo.load();
  }

  window.addEventListener("pagehide", () => {
    window.cancelAnimationFrame(frameRequest);
    window.clearTimeout(revealTimer);
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }, { once: true });

  loadHeadVideo();
})();
