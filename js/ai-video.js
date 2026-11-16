(() => {
  "use strict";

  const card = document.querySelector("[data-game-cg-open]");
  const detail = document.getElementById("game-cg-detail");
  if (!card || !detail) return;

  const backButton = detail.querySelector(".game-cg-detail__back");
  const player = document.getElementById("game-cg-player");
  const video = document.getElementById("game-cg-video");
  const playButtons = detail.querySelectorAll(".tvc-player__play, .tvc-player__center-play");
  const seek = document.getElementById("game-cg-seek");
  const currentTime = document.getElementById("game-cg-current");
  const duration = document.getElementById("game-cg-duration");
  const muteButton = detail.querySelector(".tvc-player__mute");
  const volume = document.getElementById("game-cg-volume");
  const fullscreenButton = detail.querySelector(".tvc-player__fullscreen");
  const timelineViewport = document.getElementById("game-cg-timeline");
  const timelineTrack = document.getElementById("game-cg-timeline-track");
  const timelineFrames = Array.from(timelineTrack.querySelectorAll("[data-game-cg-time]"));
  const stillsSection = document.getElementById("game-cg-stills");
  const stillsGrid = document.getElementById("game-cg-stills-grid");
  const lightbox = document.getElementById("game-cg-lightbox");
  const lightboxImage = document.getElementById("game-cg-lightbox-image");
  const lightboxClose = lightbox.querySelector(".game-cg-lightbox__close");
  const lightboxPrevious = lightbox.querySelector(".game-cg-lightbox__nav--prev");
  const lightboxNext = lightbox.querySelector(".game-cg-lightbox__nav--next");

  const stillFiles = [
    "timeline/frame-01-01s.jpg",
    "timeline/frame-02-03s.jpg",
    "timeline/frame-03-05s.jpg",
    "timeline/frame-04-07s.jpg",
    "timeline/frame-05-09s.jpg",
    "timeline/frame-06-11s.jpg",
    "timeline/frame-07-13s.jpg",
    "timeline/frame-08-15s.jpg",
    "timeline/frame-09-17s.jpg",
    "timeline/frame-10-19s.jpg"
  ];
  const stillRoot = "./assets/works/design/game-cg/forza-gtr";

  const state = {
    detailOpen: false,
    galleryOpen: false,
    galleryIndex: 0,
    scrollY: 0,
    detailTrigger: null,
    galleryTrigger: null
  };

  const timelineState = {
    activeIndex: -1,
    dragging: false,
    dragStartX: 0,
    dragStartScroll: 0,
    dragged: false,
    suppressClick: false,
    lastManualInteraction: 0
  };

  function formatTime(value) {
    if (!Number.isFinite(value) || value < 0) return "00:00";
    const totalSeconds = Math.floor(value);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours) {
      return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
    }
    return [minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
  }

  function updateRangeFill(range, value) {
    const min = Number(range.min) || 0;
    const max = Number(range.max) || 100;
    const progress = max > min ? ((value - min) / (max - min)) * 100 : 0;
    range.style.setProperty("--range-progress", `${Math.min(100, Math.max(0, progress))}%`);
  }

  function syncPlaybackState() {
    const playing = !video.paused && !video.ended;
    player.classList.toggle("is-playing", playing);
    playButtons.forEach((button) => {
      button.setAttribute("aria-label", playing ? "暂停视频" : "播放视频");
    });
  }

  function syncVolumeState() {
    const muted = video.muted || video.volume === 0;
    player.classList.toggle("is-muted", muted);
    muteButton.setAttribute("aria-label", muted ? "取消静音" : "静音");
    volume.value = String(video.muted ? 0 : video.volume);
    updateRangeFill(volume, Number(volume.value));
  }

  function syncProgress() {
    const total = Number.isFinite(video.duration) ? video.duration : 0;
    const current = Number.isFinite(video.currentTime) ? video.currentTime : 0;
    seek.value = String(total ? Math.round((current / total) * 1000) : 0);
    currentTime.textContent = formatTime(current);
    duration.textContent = formatTime(total);
    updateRangeFill(seek, Number(seek.value));
    syncTimelineFrame(!video.paused);
  }

  function ensureTimelineFrameVisible(frame) {
    const viewportRect = timelineViewport.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();
    const edge = 30;
    if (frameRect.left < viewportRect.left + edge) {
      timelineViewport.scrollBy({
        left: frameRect.left - viewportRect.left - edge,
        behavior: "smooth"
      });
    } else if (frameRect.right > viewportRect.right - edge) {
      timelineViewport.scrollBy({
        left: frameRect.right - viewportRect.right + edge,
        behavior: "smooth"
      });
    }
  }

  function syncTimelineFrame(ensureVisible) {
    if (!timelineFrames.length) return;
    const current = Number.isFinite(video.currentTime) ? video.currentTime : 0;
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    timelineFrames.forEach((frame, index) => {
      const distance = Math.abs(Number(frame.dataset.gameCgTime) - current);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    if (timelineState.activeIndex !== nearestIndex) {
      timelineState.activeIndex = nearestIndex;
      timelineFrames.forEach((frame, index) => {
        const active = index === nearestIndex;
        frame.classList.toggle("is-active", active);
        frame.setAttribute("aria-current", active ? "true" : "false");
      });
    }

    if (
      ensureVisible &&
      !timelineState.dragging &&
      performance.now() - timelineState.lastManualInteraction > 1500
    ) {
      ensureTimelineFrameVisible(timelineFrames[nearestIndex]);
    }
  }

  function renderStills() {
    stillsSection.hidden = stillFiles.length === 0;
    stillsGrid.innerHTML = stillFiles.map((file, index) => `
      <button class="game-cg-detail__still" type="button" data-game-still="${index}" aria-label="查看剧照 ${index + 1}">
        <img src="${stillRoot}/${file}" alt="地平线6 · 东京GTR 剧照 ${index + 1}" loading="lazy" decoding="async">
      </button>
    `).join("");
  }

  function openDetail() {
    state.detailOpen = true;
    state.detailTrigger = card;
    state.scrollY = window.scrollY;
    video.pause();
    video.currentTime = 0;
    video.muted = false;
    video.volume = 1;
    currentTime.textContent = "00:00";
    duration.textContent = formatTime(video.duration);
    seek.value = "0";
    updateRangeFill(seek, 0);
    updateRangeFill(volume, 1);
    timelineViewport.scrollLeft = 0;
    timelineState.activeIndex = -1;
    syncTimelineFrame(false);
    syncPlaybackState();
    syncVolumeState();
    document.body.classList.add("game-cg-detail-open");
    detail.classList.add("is-open");
    detail.setAttribute("aria-hidden", "false");
    detail.querySelector(".game-cg-detail__panel").scrollTop = 0;
    requestAnimationFrame(() => backButton.focus({ preventScroll: true }));
  }

  function closeDetail() {
    if (!state.detailOpen) return;
    if (state.galleryOpen) closeLightbox();
    state.detailOpen = false;
    video.pause();
    video.currentTime = 0;
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
    detail.classList.remove("is-open");
    detail.setAttribute("aria-hidden", "true");
    document.body.classList.remove("game-cg-detail-open");
    window.scrollTo(0, state.scrollY);
    state.detailTrigger?.focus({ preventScroll: true });
  }

  function togglePlayback() {
    if (video.paused || video.ended) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    } else if (player.requestFullscreen) {
      player.requestFullscreen().catch(() => {});
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    }
  }

  function updateLightbox() {
    if (!stillFiles.length) return;
    const total = stillFiles.length;
    state.galleryIndex = (state.galleryIndex + total) % total;
    lightboxImage.src = `${stillRoot}/${stillFiles[state.galleryIndex]}`;
    lightboxImage.alt = `地平线6 · 东京GTR 剧照 ${state.galleryIndex + 1}`;
    lightboxPrevious.hidden = total < 2;
    lightboxNext.hidden = total < 2;
  }

  function openLightbox(index, trigger) {
    if (!stillFiles.length) return;
    state.galleryOpen = true;
    state.galleryIndex = index;
    state.galleryTrigger = trigger;
    updateLightbox();
    document.body.classList.add("game-gallery-open");
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => lightboxClose.focus({ preventScroll: true }));
  }

  function closeLightbox() {
    if (!state.galleryOpen) return;
    state.galleryOpen = false;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("game-gallery-open");
    state.galleryTrigger?.focus({ preventScroll: true });
  }

  card.addEventListener("click", openDetail);
  backButton.addEventListener("click", closeDetail);
  playButtons.forEach((button) => button.addEventListener("click", togglePlayback));
  fullscreenButton.addEventListener("click", toggleFullscreen);

  seek.addEventListener("input", () => {
    if (Number.isFinite(video.duration) && video.duration > 0) {
      video.currentTime = (Number(seek.value) / 1000) * video.duration;
      syncProgress();
    }
  });

  muteButton.addEventListener("click", () => {
    video.muted = !video.muted;
    if (!video.muted && video.volume === 0) video.volume = 0.8;
    syncVolumeState();
  });

  volume.addEventListener("input", () => {
    const nextVolume = Number(volume.value);
    video.volume = nextVolume;
    video.muted = nextVolume === 0;
    syncVolumeState();
  });

  timelineTrack.addEventListener("click", (event) => {
    if (timelineState.suppressClick) {
      timelineState.suppressClick = false;
      return;
    }
    const frame = event.target.closest("[data-game-cg-time]");
    if (!frame) return;
    video.currentTime = Number(frame.dataset.gameCgTime);
    syncProgress();
    video.play().catch(() => {});
  });

  timelineViewport.addEventListener("wheel", (event) => {
    const maxScroll = timelineViewport.scrollWidth - timelineViewport.clientWidth;
    if (maxScroll <= 0) return;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY;
    if (
      (delta < 0 && timelineViewport.scrollLeft <= 0) ||
      (delta > 0 && timelineViewport.scrollLeft >= maxScroll - 1)
    ) {
      return;
    }
    event.preventDefault();
    timelineState.lastManualInteraction = performance.now();
    timelineViewport.scrollLeft += delta;
  }, { passive: false });

  timelineViewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    timelineState.dragging = true;
    timelineState.dragStartX = event.clientX;
    timelineState.dragStartScroll = timelineViewport.scrollLeft;
    timelineState.dragged = false;
  });

  timelineViewport.addEventListener("pointermove", (event) => {
    if (!timelineState.dragging) return;
    const distance = event.clientX - timelineState.dragStartX;
    if (Math.abs(distance) > 4 && !timelineState.dragged) {
      timelineState.dragged = true;
      timelineViewport.classList.add("is-dragging");
      timelineViewport.setPointerCapture?.(event.pointerId);
    }
    if (!timelineState.dragged) return;
    event.preventDefault();
    timelineState.lastManualInteraction = performance.now();
    timelineViewport.scrollLeft = timelineState.dragStartScroll - distance;
  });

  function endTimelineDrag(event) {
    if (!timelineState.dragging) return;
    timelineState.dragging = false;
    timelineViewport.classList.remove("is-dragging");
    if (timelineState.dragged && timelineViewport.hasPointerCapture?.(event.pointerId)) {
      timelineViewport.releasePointerCapture(event.pointerId);
    }
    if (timelineState.dragged) {
      timelineState.suppressClick = true;
      window.setTimeout(() => {
        timelineState.suppressClick = false;
      }, 0);
    }
  }

  timelineViewport.addEventListener("pointerup", endTimelineDrag);
  timelineViewport.addEventListener("pointercancel", endTimelineDrag);

  stillsGrid.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-game-still]");
    if (trigger) openLightbox(Number(trigger.dataset.gameStill), trigger);
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrevious.addEventListener("click", () => {
    state.galleryIndex -= 1;
    updateLightbox();
  });
  lightboxNext.addEventListener("click", () => {
    state.galleryIndex += 1;
    updateLightbox();
  });

  video.addEventListener("loadedmetadata", syncProgress);
  video.addEventListener("seeked", syncProgress);
  video.addEventListener("timeupdate", syncProgress);
  video.addEventListener("durationchange", syncProgress);
  video.addEventListener("play", syncPlaybackState);
  video.addEventListener("pause", syncPlaybackState);
  video.addEventListener("ended", syncPlaybackState);
  video.addEventListener("volumechange", syncVolumeState);

  document.addEventListener("keydown", (event) => {
    if (state.galleryOpen) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        state.galleryIndex -= 1;
        updateLightbox();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        state.galleryIndex += 1;
        updateLightbox();
      }
      return;
    }

    if (state.detailOpen && event.key === "Escape") {
      event.preventDefault();
      closeDetail();
    }
  });

  renderStills();
  updateRangeFill(seek, 0);
  updateRangeFill(volume, 1);
})();
