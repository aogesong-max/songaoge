(() => {
  "use strict";

  const cards = Array.from(document.querySelectorAll("[data-tvc-index]"));
  const detail = document.getElementById("tvc-detail");
  if (!cards.length || !detail) return;

  const backButton = detail.querySelector(".tvc-detail__back");
  const breadcrumb = document.getElementById("tvc-detail-breadcrumb");
  const title = document.getElementById("tvc-detail-title");
  const subtitle = document.getElementById("tvc-detail-subtitle");
  const concept = document.getElementById("tvc-detail-concept");
  const player = document.getElementById("tvc-player");
  const video = document.getElementById("tvc-detail-video");
  const playButtons = detail.querySelectorAll(".tvc-player__play, .tvc-player__center-play");
  const seek = document.getElementById("tvc-player-seek");
  const currentTime = document.getElementById("tvc-player-current");
  const duration = document.getElementById("tvc-player-duration");
  const muteButton = detail.querySelector(".tvc-player__mute");
  const volume = document.getElementById("tvc-player-volume");
  const fullscreenButton = detail.querySelector(".tvc-player__fullscreen");

  const works = [
    {
      brand: "TOM FORD",
      subtitle: "香水 TVC · Tobacco Vanille",
      src: "./assets/works/design/ecommerce/tvc/tom-ford.mp4",
      poster: "./assets/works/design/ecommerce/tvc/tom-ford.jpg",
      concept: [
        {
          label: "调性：",
          text: "暖，沉，欲。不是清新的香，是壁炉边皮革沙发的那种暖——越靠近，越上瘾。"
        },
        {
          label: "创意概念：",
          text: "不拍瓶子先拍原料。烟叶、香草荚、烟雾，香水还没出场，观众已经先\"闻\"到了味道。最后瓶子落在旧书和皮手套上，气味才有了主人。"
        },
        {
          label: "概念内核：",
          text: "香水的真相不在瓶子里，在原料里。烟草的燥、香草的甜，一层压一层。镜头先给足观众\"闻\"的过程，产品出现的那一秒只是揭晓，不是开始。"
        },
        {
          label: "色彩分工：",
          text: "琥珀金是主调，烟草棕打底，深黑收边。每一帧都像被暖光泡过；烟雾是画面里唯一的\"动\"，其余都稳。"
        },
        {
          label: "镜头语言：",
          text: "全程微距和特写——叶脉、刀刃切开香草荚的瞬间、烟雾的卷曲。手是唯一的人物语言，直到礼盒出现，故事从\"制作\"变成\"赠予\"。"
        },
        {
          label: "产品选择：",
          text: "选 Tobacco Vanille 是有原因的：它是 TF 最具辨识度的暖调香，烟草 + 香草的组合天生适合用画面讲——一个燥，一个润，冲突本身就是记忆点。"
        }
      ]
    },
    {
      brand: "GPW5",
      subtitle: "电竞外设 TVC · 雪豹 Snow Leopard",
      src: "./assets/works/design/ecommerce/tvc/gpw5.mp4",
      poster: "./assets/works/design/ecommerce/tvc/gpw5.jpg",
      concept: [
        {
          label: "调性：",
          text: "快，冷，电。不讲情怀，只讲手感和速度——电竞的东西，慢一帧都是输。"
        },
        {
          label: "创意概念：",
          text: "先给产品，再给战场。开场鼠标悬在电路纹之上像待发的武器；切到选手的手、屏幕里的准星，观众立刻明白：这不是办公用品，是装备。"
        },
        {
          label: "概念内核：",
          text: "鼠标的真相在握住它的那只手里。参数可以写在详情页，但\"跟手\"只能拍出来——握持、点击、急停，每一个动作都在证明同一件事。"
        },
        {
          label: "色彩分工：",
          text: "电蓝是能量，纯黑是战场，白是雪豹本体。蓝光只给能量线和分解镜头，正面产品永远干净利落，不抢。"
        },
        {
          label: "镜头语言：",
          text: "俯拍定妆、握持特写、爆炸分解收尾——结构件在蓝光里散开又归位，把\"内部做工\"拍成高潮，而不是说明书。"
        },
        {
          label: "产品选择：",
          text: "GPW5 雪豹，黑白拼色天生上镜：白身在深色电竞桌上跳，黑面压得住场。\"雪豹\"这个名字也给了整支片子一个冷、快、准的性格锚点。"
        }
      ]
    },
    {
      brand: "WASSUP",
      subtitle: "潮牌服装 TVC · 轰炸机夹克",
      src: "./assets/works/design/ecommerce/tvc/wassup.mp4",
      poster: "./assets/works/design/ecommerce/tvc/wassup.jpg",
      concept: [
        {
          label: "调性：",
          text: "松，暖，日常。不端着，不摆拍——就是秋天午后走进一家咖啡馆，自信不用喊出来。"
        },
        {
          label: "创意概念：",
          text: "不进影棚，进生活。枫叶、南瓜、暖光咖啡馆，模特端着咖啡和人聊天大笑，衣服是这场日常的一部分，而不是被供起来的展品。"
        },
        {
          label: "概念内核：",
          text: "潮牌的真相不在 logo 有多大，在穿它的人状态对不对。背面大 logo 给足识别，胸前小标留分寸——一张一弛，都是设计好的。"
        },
        {
          label: "色彩分工：",
          text: "秋橘和焦糖是季节，黑是衣服的底气。整个画面暖成一片，唯独黑夹克沉得住，人在哪儿，视线先落在哪儿。"
        },
        {
          label: "叙事与声音：",
          text: "英文口播讲产品，中英双字幕跟读——跨境的片子，语言先国际化，画面再生活化；咖啡馆的烟火气，哪国人都懂。"
        },
        {
          label: "产品选择：",
          text: "轰炸机夹克是 WASSUP 秋季最稳的版型：短款、利落、不挑人。一件衣服撑满 16 秒，靠的不是换装，是场景里的人把它穿活了。"
        }
      ]
    },
    {
      brand: "劳力士 ROLEX",
      subtitle: "腕表 TVC · Submariner Date",
      src: "./assets/works/design/ecommerce/tvc/rolex.mp4",
      poster: "./assets/works/design/ecommerce/tvc/rolex.jpg",
      concept: [
        {
          label: "调性：",
          text: "稳，贵，不动声色。真正的压场感不需要喊——西装、红酒、晚宴的人群自动让出中心。"
        },
        {
          label: "创意概念：",
          text: "先给场合，再给表。开场是晚宴上的男人举杯，镜头顺着手腕落到表上——表不是被展示的，是被\"戴出身份\"的。之后才切纯黑产品镜，让工艺自己说话。"
        },
        {
          label: "概念内核：",
          text: "腕表的真相，一半在社交场，一半在毫米之间。日历窗的放大镜、表冠上的皇冠、陶瓷圈的刻度——宏观看气场，微观看做工，两条线最后汇成一个词：可靠。"
        },
        {
          label: "色彩分工：",
          text: "黑是主场，钢色是骨，金色暖光只负责\"贵\"。晚宴段用暖金，产品段回到纯黑——热闹是别人的，表始终冷静。"
        },
        {
          label: "镜头语言：",
          text: "从人到物一条线：举杯 → 腕间特写 → 纯黑定妆 → 表盘微距 → 全表收尾。微距段把日历窗和表冠推满画面，细节就是这支片子的高潮。"
        },
        {
          label: "产品选择：",
          text: "Submariner Date 是劳力士最不需要解释的一只：黑盘、陶瓷圈、蚝式钢，任何文化里都读得懂的\"专业与体面\"。海外向的片子，不解释，只呈现。"
        }
      ]
    }
  ];

  const state = {
    open: false,
    index: 0,
    scrollY: 0,
    trigger: null
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
    const progress = total ? (current / total) * 1000 : 0;
    seek.value = String(Math.round(progress));
    currentTime.textContent = formatTime(current);
    duration.textContent = formatTime(total);
    updateRangeFill(seek, Number(seek.value));
  }

  function pausePreview(card) {
    const preview = card.querySelector("[data-tvc-preview]");
    if (!preview) return;
    preview.pause();
    try {
      preview.currentTime = 0;
    } catch {
      // Metadata may still be loading; the poster remains visible.
    }
    card.classList.remove("is-previewing");
  }

  function pauseAllPreviews() {
    cards.forEach(pausePreview);
  }

  function renderConcept(blocks) {
    concept.innerHTML = blocks.map((block) => `
      <div class="tvc-concept-block">
        <h3>${block.label}</h3>
        <p>${block.text}</p>
      </div>
    `).join("");
  }

  function renderWork(index, trigger) {
    const work = works[index];
    if (!work) return;

    state.index = index;
    state.trigger = trigger;
    breadcrumb.textContent = `SONGAOGE / AI设计图 / 电商套图 / ${work.brand}`;
    title.textContent = work.brand;
    subtitle.textContent = work.subtitle;
    video.pause();
    video.muted = false;
    video.volume = 1;
    video.poster = work.poster;
    video.src = work.src;
    video.load();
    volume.value = "1";
    currentTime.textContent = "00:00";
    duration.textContent = "00:00";
    seek.value = "0";
    updateRangeFill(seek, 0);
    updateRangeFill(volume, 1);
    renderConcept(work.concept);
    syncPlaybackState();
    syncVolumeState();
  }

  function openDetail(index, trigger) {
    pauseAllPreviews();
    renderWork(index, trigger);
    state.open = true;
    state.scrollY = window.scrollY;
    document.body.classList.add("tvc-detail-open");
    detail.classList.add("is-open");
    detail.setAttribute("aria-hidden", "false");
    detail.querySelector(".tvc-detail__panel").scrollTop = 0;
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
    document.body.classList.remove("tvc-detail-open");
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

  cards.forEach((card) => {
    const preview = card.querySelector("[data-tvc-preview]");

    card.addEventListener("pointerenter", (event) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      pauseAllPreviews();
      if (!preview) return;
      preview.muted = true;
      card.classList.add("is-previewing");
      preview.play().catch(() => {});
    });

    card.addEventListener("pointerleave", () => pausePreview(card));
    card.addEventListener("pointercancel", () => pausePreview(card));
    card.addEventListener("click", () => {
      openDetail(Number(card.dataset.tvcIndex), card);
    });
  });

  playButtons.forEach((button) => button.addEventListener("click", togglePlayback));
  backButton.addEventListener("click", closeDetail);
  fullscreenButton.addEventListener("click", toggleFullscreen);

  seek.addEventListener("input", () => {
    if (Number.isFinite(video.duration) && video.duration > 0) {
      video.currentTime = (Number(seek.value) / 1000) * video.duration;
      syncProgress();
    }
  });

  muteButton.addEventListener("click", () => {
    video.muted = !video.muted;
    if (!video.muted && video.volume === 0) {
      video.volume = 0.8;
    }
    syncVolumeState();
  });

  volume.addEventListener("input", () => {
    const nextVolume = Number(volume.value);
    video.volume = nextVolume;
    video.muted = nextVolume === 0;
    syncVolumeState();
  });

  video.addEventListener("loadedmetadata", syncProgress);
  video.addEventListener("timeupdate", syncProgress);
  video.addEventListener("durationchange", syncProgress);
  video.addEventListener("play", syncPlaybackState);
  video.addEventListener("pause", syncPlaybackState);
  video.addEventListener("ended", syncPlaybackState);
  video.addEventListener("volumechange", syncVolumeState);

  document.addEventListener("keydown", (event) => {
    if (!state.open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeDetail();
    } else if (event.key === " " && event.target === detail) {
      event.preventDefault();
      togglePlayback();
    }
  });

  updateRangeFill(seek, 0);
  updateRangeFill(volume, 1);
})();
