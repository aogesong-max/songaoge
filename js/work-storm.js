(() => {
  "use strict";

  const section = document.getElementById("work-storm");
  const viewport = section?.querySelector("[data-storm-viewport]");
  const stage = section?.querySelector("[data-storm-stage]");
  const rotator = section?.querySelector("[data-storm-cylinder]");
  const starsBack = section?.querySelector("[data-storm-stars-back]");
  const starsFront = section?.querySelector("[data-storm-stars-front]");
  const meteorsBack = section?.querySelector("[data-storm-meteors-back]");
  const meteorsFront = section?.querySelector("[data-storm-meteors-front]");

  if (
    !section ||
    !viewport ||
    !stage ||
    !rotator ||
    !starsBack ||
    !starsFront ||
    !meteorsBack ||
    !meteorsFront
  ) {
    return;
  }

  const stageWidth = 1180;
  const stageHeight = 900;
  const centerX = stageWidth / 2;
  const centerY = stageHeight / 2;
  const radius = 470;
  const rotationPeriod = 60000;
  const works = [
    {
      src: "./assets/work-storm/01.jpg",
      origin: "./assets/recent-works/01-astronaut.jpg",
      width: 224,
      height: 246,
      offsetY: -6,
      tiltX: -2.2,
      tiltY: 1.4,
      tiltZ: -2.1
    },
    {
      src: "./assets/work-storm/02.jpg",
      origin: "./assets/works/design/ip/xingdeng/main.jpg",
      width: 196,
      height: 154,
      offsetY: 5,
      tiltX: 1.3,
      tiltY: -1.8,
      tiltZ: 2.4
    },
    {
      src: "./assets/work-storm/03.jpg",
      origin: "./assets/works/drama/boxer/cover.jpg",
      width: 168,
      height: 238,
      offsetY: -3,
      tiltX: 2.4,
      tiltY: 1.1,
      tiltZ: -1.3
    },
    {
      src: "./assets/work-storm/04.jpg",
      origin: "./assets/works/design/ecommerce/gpw5/image-01.jpg",
      width: 228,
      height: 176,
      offsetY: 7,
      tiltX: -1.2,
      tiltY: -2.2,
      tiltZ: 2.2
    },
    {
      src: "./assets/work-storm/05.jpg",
      origin: "./assets/works/design/fire.jpg",
      width: 190,
      height: 218,
      offsetY: 0,
      tiltX: 1.8,
      tiltY: 2.1,
      tiltZ: -2.5
    },
    {
      src: "./assets/work-storm/06.jpg",
      origin: "./assets/works/design/ai-video/apl-mv/1.png",
      width: 216,
      height: 188,
      offsetY: 4,
      tiltX: -2.4,
      tiltY: -1.2,
      tiltZ: 1.7
    },
    {
      src: "./assets/work-storm/07.jpg",
      origin: "./assets/works/design/qiongding.jpg",
      width: 154,
      height: 226,
      offsetY: -7,
      tiltX: 1.1,
      tiltY: 2.3,
      tiltZ: -1.8
    },
    {
      src: "./assets/work-storm/08.jpg",
      origin: "./assets/works/drama/ai-sisters/cover.jpg",
      width: 186,
      height: 206,
      offsetY: 2,
      tiltX: -1.6,
      tiltY: -2.4,
      tiltZ: 2.1
    },
    {
      src: "./assets/work-storm/09.jpg",
      origin: "./assets/recent-works/02-jellyfish.jpg",
      width: 200,
      height: 272,
      offsetY: -5,
      tiltX: 1.4,
      tiltY: 1.2,
      tiltZ: -2.3
    },
    {
      src: "./assets/work-storm/10.jpg",
      origin: "./assets/works/design/ip/qirong/main.jpg",
      width: 150,
      height: 244,
      offsetY: 4,
      tiltX: -2.1,
      tiltY: -1.5,
      tiltZ: 1.9
    },
    {
      src: "./assets/work-storm/11.jpg",
      origin: "./assets/works/drama/sixth-second/cover.jpg",
      width: 212,
      height: 198,
      offsetY: -7,
      tiltX: 2.3,
      tiltY: 2.1,
      tiltZ: -1.6
    },
    {
      src: "./assets/work-storm/12.jpg",
      origin: "./assets/works/design/ecommerce/tom-ford/image-01.jpg",
      width: 158,
      height: 268,
      offsetY: 6,
      tiltX: -1.3,
      tiltY: -2.2,
      tiltZ: 2.4
    },
    {
      src: "./assets/work-storm/13.jpg",
      origin: "./assets/works/design/shendian.jpg",
      width: 226,
      height: 220,
      offsetY: 1,
      tiltX: 1.7,
      tiltY: 1.3,
      tiltZ: -2.1
    },
    {
      src: "./assets/work-storm/14.jpg",
      origin: "./assets/works/design/ai-video/dance-remake/cover.jpg",
      width: 176,
      height: 252,
      offsetY: -4,
      tiltX: -2.3,
      tiltY: -1.4,
      tiltZ: 1.5
    },
    {
      src: "./assets/work-storm/15.jpg",
      origin: "./assets/works/design/ecommerce/wassup/image-05.jpg",
      width: 208,
      height: 230,
      offsetY: 7,
      tiltX: 1.2,
      tiltY: 2.4,
      tiltZ: -2.2
    },
    {
      src: "./assets/work-storm/16.jpg",
      origin: "./assets/recent-works/03-mecha.jpg",
      width: 150,
      height: 252,
      offsetY: -2,
      tiltX: -1.8,
      tiltY: -2.3,
      tiltZ: 2.1
    },
    {
      src: "./assets/work-storm/17.jpg",
      origin: "./assets/works/design/ip/nake-chronos/main.jpg",
      width: 220,
      height: 180,
      offsetY: 3,
      tiltX: 2.2,
      tiltY: 1.5,
      tiltZ: -1.9
    },
    {
      src: "./assets/work-storm/18.jpg",
      origin: "./assets/works/drama/sixth-second/still-02.jpg",
      width: 212,
      height: 242,
      offsetY: 6,
      tiltX: -1.5,
      tiltY: -1.8,
      tiltZ: 2.4
    },
    {
      src: "./assets/work-storm/19.jpg",
      origin: "./assets/works/design/hongmo.jpg",
      width: 174,
      height: 228,
      offsetY: -4,
      tiltX: 1.6,
      tiltY: 2.2,
      tiltZ: -1.7
    },
    {
      src: "./assets/work-storm/20.jpg",
      origin: "./assets/works/design/ip/xingdeng/detail-02.jpg",
      width: 226,
      height: 164,
      offsetY: 3,
      tiltX: -2.2,
      tiltY: -1.1,
      tiltZ: 2.3
    },
    {
      src: "./assets/work-storm/21.jpg",
      origin: "./assets/recent-works/04-deer.jpg",
      width: 190,
      height: 244,
      offsetY: -6,
      tiltX: 1.3,
      tiltY: 2.4,
      tiltZ: -2.4
    },
    {
      src: "./assets/work-storm/22.jpg",
      origin: "./assets/works/design/ip/qirong/view-01.jpg",
      width: 156,
      height: 210,
      offsetY: 7,
      tiltX: -1.4,
      tiltY: -2.1,
      tiltZ: 1.8
    },
    {
      src: "./assets/work-storm/23.jpg",
      origin: "./assets/works/design/ecommerce/rolex/主图佩戴图.png",
      width: 216,
      height: 156,
      offsetY: 0,
      tiltX: 2.1,
      tiltY: 1.2,
      tiltZ: -2.0
    },
    {
      src: "./assets/work-storm/24.jpg",
      origin: "./assets/recent-works/05-hourglass.jpg",
      width: 202,
      height: 236,
      offsetY: -3,
      tiltX: -2.3,
      tiltY: -1.7,
      tiltZ: 2.5
    },
    {
      src: "./assets/work-storm/25.jpg",
      origin: "./assets/recent-works/06-wave.jpg",
      width: 166,
      height: 184,
      offsetY: 5,
      tiltX: 1.5,
      tiltY: 2.2,
      tiltZ: -1.5
    }
  ];

  const rows = [
    { start: 0, count: 8, y: -300, angleOffset: 0 },
    { start: 8, count: 9, y: 0, angleOffset: (20 * Math.PI) / 180 },
    { start: 17, count: 8, y: 300, angleOffset: 0 }
  ];

  const imageCards = [];

  works.forEach((work, index) => {
    const row = rows.find((candidate) => index >= candidate.start && index < candidate.start + candidate.count);
    const rowItemIndex = index - row.start;
    const angle = row.angleOffset + (Math.PI * 2 * rowItemIndex) / row.count;
    const card = document.createElement("figure");
    const frame = document.createElement("div");
    const image = document.createElement("img");
    const cardIndex = index;

    card.className = "work-storm__card";
    frame.className = "work-storm__frame";
    card.style.setProperty("--storm-card-width", `${work.width}px`);
    card.style.setProperty("--storm-card-height", `${work.height}px`);
    card.style.setProperty("--storm-card-y", `${row.y + work.offsetY}px`);
    card.style.transform =
      `rotateY(${angle.toFixed(6)}rad) translateZ(${radius}px) ` +
      `rotateX(${work.tiltX}deg) rotateY(${work.tiltY}deg) rotateZ(${work.tiltZ}deg)`;
    card.style.setProperty("--storm-gloss-duration", `${5.1 + (index % 5) * 0.77}s`);
    card.style.setProperty("--storm-gloss-delay", `${(-((index * 1.13) % 5.8)).toFixed(2)}s`);

    image.src = work.src;
    image.alt = "";
    image.loading = "eager";
    image.decoding = "async";
    image.draggable = false;
    frame.append(image);
    card.append(frame);
    rotator.append(card);
    imageCards.push({ card, image, work, cardIndex });
  });

  const decodeImages = imageCards.map(({ card, image, work }) => {
    const updateOrientation = () => {
      const shouldRotate = image.naturalWidth > image.naturalHeight && work.width < work.height;
      card.classList.toggle("is-rotated", shouldRotate);
    };
    image.addEventListener("load", updateOrientation, { once: true });
    image.addEventListener("error", updateOrientation, { once: true });
    if (image.complete) updateOrientation();

    if (typeof image.decode === "function") {
      return image.decode().catch(() => {});
    }

    return new Promise((resolve) => {
      if (image.complete) {
        resolve();
        return;
      }
      image.addEventListener("load", resolve, { once: true });
      image.addEventListener("error", resolve, { once: true });
    });
  });

  function seeded(seed) {
    const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return value - Math.floor(value);
  }

  const starColors = ["rgba(255, 253, 239, 0.92)", "rgba(242, 215, 124, 0.9)", "rgba(145, 230, 246, 0.9)"];
  const stars = [];

  function createStars(container, count, offset, front) {
    for (let index = 0; index < count; index += 1) {
      const seed = offset + index * 7.31;
      const star = document.createElement("i");
      const size = 1.5 + seeded(seed + 1) * 2.5;
      const baseOpacity = 0.12 + seeded(seed + 2) * 0.28;

      star.className = "work-storm__star";
      star.style.setProperty("--storm-star-size", `${size.toFixed(2)}px`);
      star.style.setProperty("--storm-star-color", starColors[index % starColors.length]);
      star.style.left = `${(24 + seeded(seed + 3) * (stageWidth - 48)).toFixed(2)}px`;
      star.style.top = `${(30 + seeded(seed + 4) * (stageHeight - 55)).toFixed(2)}px`;
      container.append(star);
      stars.push({
        element: star,
        baseOpacity,
        phase: seeded(seed + 5) * Math.PI * 2,
        speed: 2200 + seeded(seed + 6) * 4300,
        front
      });
    }
  }

  createStars(starsBack, 56, 11, false);
  createStars(starsFront, 18, 491, true);

  const meteorColors = ["rgba(255, 253, 239, 0.95)", "rgba(242, 215, 124, 0.9)", "rgba(153, 233, 247, 0.93)"];
  const meteors = [];

  function createMeteors(container, count, offset, front) {
    for (let index = 0; index < count; index += 1) {
      const seed = offset + index * 9.17;
      const meteor = document.createElement("i");
      const tail = document.createElement("span");
      const head = document.createElement("b");
      const direction = index < (front ? 4 : 6) ? 1 : -1;

      meteor.className = "work-storm__meteor";
      tail.className = "work-storm__meteor-tail";
      head.className = "work-storm__meteor-head";
      meteor.style.setProperty("--storm-tail-length", `${(50 + seeded(seed + 1) * 60).toFixed(1)}px`);
      meteor.style.setProperty("--storm-meteor-color", meteorColors[index % meteorColors.length]);
      meteor.append(tail, head);
      container.append(meteor);
      meteors.push({
        element: meteor,
        front,
        direction,
        phase: seeded(seed + 2) * Math.PI * 2,
        speed: 8200 + seeded(seed + 3) * 9800,
        radiusX: 445 + seeded(seed + 4) * 105,
        radiusY: 190 + seeded(seed + 5) * 135,
        centerY: centerY + (seeded(seed + 6) - 0.5) * 85,
        pulse: seeded(seed + 7) * Math.PI * 2
      });
    }
  }

  createMeteors(meteorsBack, 8, 73, false);
  createMeteors(meteorsFront, 6, 811, true);

  let elapsed = 0;
  let rotation = 0;
  let previousTime = null;

  function updateStars(time) {
    stars.forEach((star) => {
      const pulse = 0.58 + 0.42 * (0.5 + Math.sin((time / star.speed) * Math.PI * 2 + star.phase) * 0.5);
      star.element.style.opacity = `${(star.baseOpacity * pulse * (star.front ? 0.82 : 1)).toFixed(3)}`;
    });
  }

  function updateMeteors(time) {
    meteors.forEach((meteor) => {
      const angle = meteor.phase + meteor.direction * (time / meteor.speed) * Math.PI * 2;
      const x = centerX + Math.sin(angle) * meteor.radiusX;
      const y = meteor.centerY + Math.cos(angle) * meteor.radiusY;
      const velocityX = Math.cos(angle) * meteor.radiusX * meteor.direction;
      const velocityY = -Math.sin(angle) * meteor.radiusY * meteor.direction;
      const heading = Math.atan2(velocityY, velocityX);
      const twinkle = 0.62 + Math.sin(time / 1100 + meteor.pulse) * 0.18;

      meteor.element.style.left = `${x.toFixed(2)}px`;
      meteor.element.style.top = `${y.toFixed(2)}px`;
      meteor.element.style.transform = `translate(-100%, -50%) rotate(${heading.toFixed(4)}rad)`;
      meteor.element.style.opacity = `${twinkle.toFixed(3)}`;
    });
  }

  function animate(now) {
    if (previousTime === null) previousTime = now;
    const delta = Math.min(64, Math.max(0, now - previousTime));
    previousTime = now;
    elapsed += delta;
    rotation += (delta / rotationPeriod) * Math.PI * 2;

    const displayAngle = rotation % (Math.PI * 2);
    const floatY = Math.sin(elapsed / 7200) * 5.5;
    rotator.style.transform =
      `translate3d(0, ${floatY.toFixed(2)}px, 0) rotateX(7deg) rotateY(${displayAngle.toFixed(6)}rad)`;

    updateMeteors(elapsed);
    updateStars(elapsed);
    requestAnimationFrame(animate);
  }

  function updateScale() {
    const width = viewport.clientWidth;
    const scale = Math.min(1, Math.max(0.25, (width - 18) / stageWidth));
    section.style.setProperty("--storm-scale", scale.toFixed(4));
    section.style.setProperty("--storm-stage-height", `${Math.ceil(stageHeight * scale)}px`);
  }

  if ("ResizeObserver" in window) {
    new ResizeObserver(updateScale).observe(viewport);
  } else {
    window.addEventListener("resize", updateScale, { passive: true });
  }

  updateScale();

  Promise.allSettled(decodeImages).then(() => {
    section.classList.add("is-ready");
    requestAnimationFrame(animate);
  });
})();
