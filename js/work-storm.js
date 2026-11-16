(() => {
  "use strict";

  const section = document.getElementById("work-storm");
  const viewport = section?.querySelector("[data-storm-viewport]");
  const funnel = section?.querySelector("[data-storm-funnel]");
  const dust = section?.querySelector("[data-storm-dust]");

  if (!section || !viewport || !funnel || !dust) return;

  const works = [
    { src: "./assets/recent-works/01-astronaut.jpg", label: "异星双面" },
    { src: "./assets/works/design/ip/xingdeng/main.jpg", label: "星灯 IP" },
    { src: "./assets/works/drama/boxer/cover.jpg", label: "这个拳手不太冷" },
    { src: "./assets/works/design/ecommerce/gpw5/image-01.jpg", label: "GPW5 电商套图" },
    { src: "./assets/works/design/fire.jpg", label: "FIRE" },
    { src: "./assets/works/design/ai-video/apl-mv/1.png", label: "APL MV" },
    { src: "./assets/works/design/qiongding.jpg", label: "穹顶天环" },
    { src: "./assets/works/drama/ai-sisters/cover.jpg", label: "全世界只有我有 AI" },
    { src: "./assets/recent-works/02-jellyfish.jpg", label: "临空水母" },
    { src: "./assets/works/design/ip/qirong/main.jpg", label: "奇绒 IP" },
    { src: "./assets/works/drama/sixth-second/cover.jpg", label: "第六秒" },
    { src: "./assets/works/design/ecommerce/tom-ford/image-01.jpg", label: "Tom Ford 电商套图" },
    { src: "./assets/works/design/shendian.jpg", label: "神殿之眼" },
    { src: "./assets/works/design/ai-video/apl-mv/4.png", label: "APL MV" },
    { src: "./assets/works/design/ecommerce/wassup/image-05.jpg", label: "Wassup 电商套图" },
    { src: "./assets/recent-works/03-mecha.jpg", label: "霓虹灰烬" },
    { src: "./assets/works/design/ip/nake-chronos/main.jpg", label: "纳克时计 IP" },
    { src: "./assets/works/drama/sixth-second/still-02.jpg", label: "第六秒剧照" },
    { src: "./assets/works/design/ai-video/dance-remake/cover.jpg", label: "舞蹈复刻" },
    { src: "./assets/works/design/hongmo.jpg", label: "红膜" },
    { src: "./assets/works/design/ip/xingdeng/detail-02.jpg", label: "星灯 IP 设计" },
    { src: "./assets/recent-works/04-deer.jpg", label: "雾林巨鹿" },
    { src: "./assets/works/design/ip/qirong/view-01.jpg", label: "奇绒 IP 视图" },
    { src: "./assets/works/design/game-cg/forza-gtr/cover.jpg", label: "Forza GTR" },
    { src: "./assets/works/design/ecommerce/rolex/主图佩戴图.png", label: "Rolex 电商套图" },
    { src: "./assets/works/design/jingjie.jpg", label: "镜界" },
    { src: "./assets/recent-works/05-hourglass.jpg", label: "天海沙漏" },
    { src: "./assets/works/design/ip/nake-chronos/detail-05.jpg", label: "纳克时计 IP 设计" },
    { src: "./assets/works/drama/boxer/still-01.jpg", label: "这个拳手不太冷剧照" },
    { src: "./assets/recent-works/06-wave.jpg", label: "冻浪灯塔" }
  ];

  const rings = [
    { count: 8, radius: 320, y: 118, width: 148, height: 222, offset: 0.18 },
    { count: 7, radius: 251, y: 251, width: 123, height: 185, offset: 0.54 },
    { count: 6, radius: 191, y: 374, width: 102, height: 153, offset: 0.81 },
    { count: 5, radius: 137, y: 482, width: 81, height: 122, offset: 1.08 },
    { count: 4, radius: 88, y: 582, width: 62, height: 93, offset: 0.35 }
  ];

  const stageWidth = 820;
  const stageHeight = 700;
  const centerX = stageWidth / 2;
  const cards = [];
  let workIndex = 0;

  rings.forEach((ring, ringIndex) => {
    for (let itemIndex = 0; itemIndex < ring.count; itemIndex += 1) {
      const work = works[workIndex];
      if (!work) break;

      const card = document.createElement("figure");
      const image = document.createElement("img");
      card.className = "work-storm__card";
      card.style.setProperty("--storm-card-width", `${ring.width}px`);
      card.style.setProperty("--storm-card-height", `${ring.height}px`);
      image.src = work.src;
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      image.draggable = false;
      card.append(image);
      funnel.append(card);

      const detectOrientation = () => {
        card.classList.toggle("is-horizontal", image.naturalWidth > image.naturalHeight);
      };
      image.addEventListener("load", detectOrientation, { once: true });
      if (image.complete) detectOrientation();

      cards.push({
        element: card,
        ringIndex,
        radius: ring.radius,
        y: ring.y,
        angle: ring.offset + (Math.PI * 2 * itemIndex) / ring.count
      });
      workIndex += 1;
    }
  });

  const particles = Array.from({ length: 38 }, (_, index) => {
    const progress = (index + 0.5) / 38;
    const radius = 48 + (1 - progress) * 310 + ((index % 5) - 2) * 24;
    const size = 1.8 + (index % 4) * 0.7;
    const isCyan = index % 3 !== 1;
    const particle = document.createElement("i");
    particle.className = "work-storm__particle";
    particle.style.setProperty("--storm-particle-size", `${size}px`);
    particle.style.setProperty(
      "--storm-particle-color",
      isCyan ? "rgba(103, 220, 230, 0.82)" : "rgba(242, 215, 124, 0.88)"
    );
    dust.append(particle);
    return {
      element: particle,
      radius,
      y: 42 + progress * 602,
      angle: index * 2.399 + progress * 0.8
    };
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let spinElapsed = 0;
  let dustElapsed = 0;
  let lastFrame = performance.now();
  let paused = false;

  function render(now) {
    const delta = Math.min(now - lastFrame, 64);
    lastFrame = now;

    if (!paused && !reduceMotion.matches) {
      spinElapsed += delta;
      dustElapsed += delta;
    }

    const spin = (spinElapsed / 42000) * Math.PI * 2;
    const dustSpin = (dustElapsed / 17000) * Math.PI * 2;

    cards.forEach((card) => {
      const angle = card.angle + spin;
      const depth = (Math.cos(angle) + 1) / 2;
      const x = centerX + Math.sin(angle) * card.radius;
      const scale = 0.78 + depth * 0.22;
      card.element.style.transform =
        `translate3d(${x}px, ${card.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      card.element.style.opacity = `${0.76 + depth * 0.24}`;
      card.element.style.zIndex = `${Math.round(depth * 100) + card.ringIndex}`;
    });

    particles.forEach((particle) => {
      const angle = particle.angle - dustSpin;
      const depth = (Math.cos(angle) + 1) / 2;
      const x = centerX + Math.sin(angle) * particle.radius;
      const y = particle.y + Math.sin(angle * 1.7 + dustSpin) * 3.5;
      const scale = 0.72 + depth * 0.55;
      particle.element.style.transform =
        `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
      particle.element.style.opacity = `${0.22 + depth * 0.48}`;
    });

    requestAnimationFrame(render);
  }

  function setPaused(nextPaused) {
    paused = nextPaused;
    section.classList.toggle("is-paused", paused);
  }

  function updateScale() {
    const width = viewport.clientWidth;
    const scale = Math.min(1, Math.max(0.28, (width - 18) / stageWidth));
    section.style.setProperty("--storm-scale", scale.toFixed(4));
    section.style.setProperty("--storm-stage-height", `${Math.ceil(stageHeight * scale)}px`);
  }

  section.addEventListener("pointerenter", () => setPaused(true));
  section.addEventListener("pointerleave", () => setPaused(false));
  section.addEventListener("focusin", () => setPaused(true));
  section.addEventListener("focusout", () => setPaused(false));

  if ("ResizeObserver" in window) {
    new ResizeObserver(updateScale).observe(viewport);
  } else {
    window.addEventListener("resize", updateScale, { passive: true });
  }

  updateScale();
  requestAnimationFrame(render);
})();
