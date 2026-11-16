(() => {
  "use strict";

  const card = document.querySelector("[data-dance-remake-open]");
  const detail = document.getElementById("dance-remake-detail");
  if (!card || !detail) return;

  const backButton = detail.querySelector(".game-cg-detail__back");
  const player = document.getElementById("dance-remake-player");
  const video = document.getElementById("dance-remake-video");
  const playButtons = detail.querySelectorAll(".tvc-player__play, .tvc-player__center-play");
  const seek = document.getElementById("dance-remake-seek");
  const currentTime = document.getElementById("dance-remake-current");
  const duration = document.getElementById("dance-remake-duration");
  const muteButton = detail.querySelector(".tvc-player__mute");
  const volume = document.getElementById("dance-remake-volume");
  const fullscreenButton = detail.querySelector(".tvc-player__fullscreen");

  const state = {
    open: false,
    scrollY: 0,
    trigger: null
  };

  function formatTime(value) {
    if (!Number.isFinite(value) || value < 0) return "00:00";
    const totalSeconds = Math.floor(value);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
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
  }

  function openDetail() {
    state.open = true;
    state.scrollY = window.scrollY;
    state.trigger = card;
    video.pause();
    video.currentTime = 0;
    video.muted = false;
    video.volume = 1;
    currentTime.textContent = "00:00";
    duration.textContent = formatTime(video.duration);
    seek.value = "0";
    updateRangeFill(seek, 0);
    syncPlaybackState();
    syncVolumeState();
    document.body.classList.add("game-cg-detail-open");
    detail.classList.add("is-open");
    detail.setAttribute("aria-hidden", "false");
    detail.querySelector(".game-cg-detail__panel").scrollTop = 0;
    requestAnimationFrame(() => backButton.focus({ preventScroll: true }));
  }

  function closeDetail() {
    if (!state.open) return;
    state.open = false;
    video.pause();
    video.currentTime = 0;
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
    detail.classList.remove("is-open");
    detail.setAttribute("aria-hidden", "true");
    document.body.classList.remove("game-cg-detail-open");
    window.scrollTo(0, state.scrollY);
    state.trigger?.focus({ preventScroll: true });
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

  video.addEventListener("loadedmetadata", syncProgress);
  video.addEventListener("seeked", syncProgress);
  video.addEventListener("timeupdate", syncProgress);
  video.addEventListener("durationchange", syncProgress);
  video.addEventListener("play", syncPlaybackState);
  video.addEventListener("pause", syncPlaybackState);
  video.addEventListener("ended", syncPlaybackState);
  video.addEventListener("volumechange", syncVolumeState);

  document.addEventListener("keydown", (event) => {
    if (state.open && event.key === "Escape") {
      event.preventDefault();
      closeDetail();
    }
  });

  updateRangeFill(seek, 0);
  updateRangeFill(volume, 1);
})();
