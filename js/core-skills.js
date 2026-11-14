(() => {
  "use strict";

  const rack = document.getElementById("core-skills-rack");
  if (!rack) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const dragThreshold = 3;
  let direction = 1;
  let lastTime = performance.now();
  let paused = false;
  let hovering = false;
  let dragging = false;
  let pointerId = null;
  let dragStartX = 0;
  let dragStartScroll = 0;
  let dragDistance = 0;

  function maxScroll() {
    return Math.max(0, rack.scrollWidth - rack.clientWidth);
  }

  function animate() {
    const time = performance.now();
    const delta = Math.min(80, time - lastTime);
    lastTime = time;

    if (!paused && !dragging && !reduceMotion.matches) {
      const limit = maxScroll();
      if (limit > 0) {
        if (rack.scrollLeft >= limit - 0.5) direction = -1;
        if (rack.scrollLeft <= 0.5) direction = 1;
        rack.scrollLeft += direction * 0.022 * delta;
      }
    }

  }

  rack.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") {
      hovering = true;
      paused = true;
    }
  });

  rack.addEventListener("pointerleave", () => {
    hovering = false;
    if (!dragging) paused = false;
  });

  rack.addEventListener("pointerdown", (event) => {
    paused = true;
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    dragging = true;
    pointerId = event.pointerId;
    dragStartX = event.clientX;
    dragStartScroll = rack.scrollLeft;
    dragDistance = 0;
    rack.classList.add("is-dragging");
    rack.setPointerCapture?.(pointerId);
  });

  rack.addEventListener("pointermove", (event) => {
    if (!dragging || event.pointerId !== pointerId) return;
    const distance = event.clientX - dragStartX;
    dragDistance = Math.max(dragDistance, Math.abs(distance));
    if (dragDistance >= dragThreshold) event.preventDefault();
    rack.scrollLeft = dragStartScroll - distance;
  });

  function endDrag(event) {
    if (!dragging || (event && event.pointerId !== pointerId)) return;
    dragging = false;
    rack.classList.remove("is-dragging");
    if (pointerId !== null && rack.hasPointerCapture?.(pointerId)) {
      rack.releasePointerCapture(pointerId);
    }
    pointerId = null;
    paused = hovering;
  }

  function endPointerInteraction(event) {
    if (event.pointerType === "touch" || event.pointerType === "pen") {
      paused = hovering;
      return;
    }
    endDrag(event);
  }

  rack.addEventListener("pointerup", endPointerInteraction);
  rack.addEventListener("pointercancel", endPointerInteraction);
  rack.addEventListener("lostpointercapture", endDrag);

  rack.addEventListener("wheel", (event) => {
    const delta =
      Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (!delta) return;

    const atStart = rack.scrollLeft <= 0;
    const atEnd = rack.scrollLeft >= maxScroll() - 1;
    if ((delta < 0 && atStart) || (delta > 0 && atEnd)) return;

    event.preventDefault();
    rack.scrollLeft += delta;
  }, { passive: false });

  rack.addEventListener("dragstart", (event) => event.preventDefault());
  rack.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    rack.scrollLeft += event.key === "ArrowLeft" ? -180 : 180;
  });

  reduceMotion.addEventListener?.("change", () => {
    paused = false;
    lastTime = performance.now();
  });

  window.setInterval(animate, 32);
})();
