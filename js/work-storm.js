(() => {
  "use strict";

  const section = document.getElementById("work-storm");
  const viewport = section?.querySelector("[data-storm-viewport]");
  const helix = section?.querySelector("[data-storm-helix]");
  const sparksLayer = section?.querySelector("[data-storm-sparks]");

  if (!section || !viewport || !helix || !sparksLayer) return;

  const layers = [
    [
      { src: "./assets/recent-works/01-astronaut.jpg", width: 168, height: 220 },
      { src: "./assets/works/design/ip/xingdeng/main.jpg", width: 98, height: 124 }
    ],
    [
      { src: "./assets/works/drama/boxer/cover.jpg", width: 94, height: 126 },
      { src: "./assets/works/design/ecommerce/gpw5/image-01.jpg", width: 158, height: 206 }
    ],
    [
      { src: "./assets/works/design/fire.jpg", width: 174, height: 218 },
      { src: "./assets/works/design/ai-video/apl-mv/1.png", width: 124, height: 94 }
    ],
    [
      { src: "./assets/works/design/qiongding.jpg", width: 120, height: 92 },
      { src: "./assets/works/drama/ai-sisters/cover.jpg", width: 166, height: 224 }
    ],
    [
      { src: "./assets/recent-works/02-jellyfish.jpg", width: 152, height: 220 },
      { src: "./assets/works/design/ip/nake-chronos/main.jpg", width: 96, height: 96 }
    ],
    [
      { src: "./assets/works/design/ecommerce/tom-ford/image-01.jpg", width: 128, height: 96 },
      { src: "./assets/works/design/ai-video/dance-remake/cover.jpg", width: 170, height: 216 }
    ],
    [
      { src: "./assets/recent-works/06-wave.jpg", width: 160, height: 206 },
      { src: "./assets/works/design/game-cg/forza-gtr/cover.jpg", width: 126, height: 94 }
    ]
  ];

  const layerY = [115, 232, 349, 466, 583, 700, 817];
  const stageWidth = 800;
  const stageHeight = 940;
  const centerX = stageWidth / 2;
  const radius = 218;
  const totalTurns = 2.35;
  const baseAngle = 0.38;
  const layerRecords = [];

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function createWind(index) {
    const direction = index % 3 === 0 || index % 7 === 4 ? 1 : -1;
    const durationMs = 5200 + (index % 6) * 710 + (index % 3) * 130;
    const glossDuration = 4.7 + (index % 4) * 1.16;

    return {
      direction,
      durationMs,
      phase: index * 1.17 + (index % 3) * 0.42,
      ryAmplitude: 34 + ((index * 7) % 25),
      ryBias: direction * (4 + (index % 4) * 3),
      rxAmp: 8 + (index % 5) * 2.1,
      rxPhase: index * 0.73,
      rzAmp: 3.5 + (index % 4) * 2.2,
      rzPhase: index * 1.41,
      glossDuration
    };
  }

  function getProjectedSize(width, height, rotationX, rotationY, rotationZ) {
    const radians = Math.PI / 180;
    const rx = rotationX * radians;
    const ry = rotationY * radians;
    const rz = rotationZ * radians;
    const cosX = Math.cos(rx);
    const sinX = Math.sin(rx);
    const cosY = Math.cos(ry);
    const sinY = Math.sin(ry);
    const cosZ = Math.cos(rz);
    const sinZ = Math.sin(rz);
    const corners = [
      [-width / 2, -height / 2],
      [width / 2, -height / 2],
      [width / 2, height / 2],
      [-width / 2, height / 2]
    ].map(([x, y]) => {
      const rotatedX = x * cosZ - y * sinZ;
      const rotatedY = x * sinZ + y * cosZ;
      const yAfterY = rotatedY;
      const zAfterY = -rotatedX * sinY;
      const xAfterY = rotatedX * cosY;
      const yAfterX = yAfterY * cosX - zAfterY * sinX;
      const zAfterX = yAfterY * sinX + zAfterY * cosX;
      const perspective = 1 / Math.max(0.62, 1 - zAfterX / 760);
      return [xAfterY * perspective, yAfterX * perspective];
    });
    const xs = corners.map((corner) => corner[0]);
    const ys = corners.map((corner) => corner[1]);
    return {
      width: Math.max(...xs) - Math.min(...xs),
      height: Math.max(...ys) - Math.min(...ys)
    };
  }

  function updateWind(card, elapsed) {
    const wind = card.wind;
    const phase = (elapsed / wind.durationMs) * Math.PI * 2 + wind.phase;
    const rotationY = wind.ryBias + Math.sin(phase) * wind.ryAmplitude * wind.direction;
    const rotationX = 3 + Math.sin(phase * 0.72 + wind.rxPhase) * wind.rxAmp;
    const rotationZ = Math.sin(phase * 0.54 + wind.rzPhase) * wind.rzAmp;
    card.motion.style.transform =
      `perspective(760px) rotateX(${rotationX.toFixed(2)}deg) rotateY(${rotationY.toFixed(2)}deg) rotateZ(${rotationZ.toFixed(2)}deg)`;
    return getProjectedSize(card.width, card.height, rotationX, rotationY, rotationZ);
  }

  layers.forEach((pair, layerIndex) => {
    const rung = document.createElement("i");
    rung.className = "work-storm__rung";
    helix.append(rung);

    const cards = pair.map((item, strandIndex) => {
      const card = document.createElement("figure");
      const motion = document.createElement("div");
      const frame = document.createElement("div");
      const image = document.createElement("img");
      const globalIndex = layerIndex * 2 + strandIndex;

      card.className = "work-storm__card";
      motion.className = "work-storm__motion";
      frame.className = "work-storm__frame";
      const wind = createWind(globalIndex);
      card.style.setProperty("--storm-card-width", `${item.width}px`);
      card.style.setProperty("--storm-card-height", `${item.height}px`);
      card.style.setProperty("--storm-gloss-duration", `${wind.glossDuration.toFixed(2)}s`);
      card.style.setProperty(
        "--storm-gloss-delay",
        `${(-((globalIndex * 1.17) % wind.glossDuration)).toFixed(2)}s`
      );

      image.src = item.src;
      image.alt = "";
      image.loading = "eager";
      image.decoding = "async";
      image.draggable = false;
      frame.append(image);
      motion.append(frame);
      card.append(motion);
      helix.append(card);

      const updateImageOrientation = () => {
        const rotateForPortraitFrame = image.naturalWidth > image.naturalHeight && item.width < item.height;
        card.classList.toggle("is-rotated", rotateForPortraitFrame);
      };
      image.addEventListener("load", updateImageOrientation, { once: true });
      if (image.complete) updateImageOrientation();

      return {
        element: card,
        motion,
        wind,
        width: item.width,
        height: item.height,
        strand: strandIndex
      };
    });

    layerRecords.push({
      rung,
      cards,
      y: layerY[layerIndex],
      angle: baseAngle + (Math.PI * 2 * totalTurns * layerIndex) / (layerY.length - 1)
    });
  });

  const sparks = Array.from({ length: 28 }, (_, index) => {
    const progress = (index + 0.5) / 28;
    const y = 72 + progress * 798 + ((index % 4) - 1.5) * 8;
    const sparkRadius = radius + ((index % 5) - 2) * 17;
    const spark = document.createElement("i");
    const size = 1.5 + (index % 4) * 0.55;
    const isCyan = index % 3 !== 0;

    spark.className = "work-storm__spark";
    spark.style.setProperty("--storm-spark-size", `${size}px`);
    spark.style.setProperty(
      "--storm-spark-color",
      isCyan ? "rgba(103, 220, 230, 0.86)" : "rgba(242, 215, 124, 0.9)"
    );
    sparksLayer.append(spark);

    return {
      element: spark,
      y,
      radius: sparkRadius,
      angle: baseAngle + progress * totalTurns * Math.PI * 2 + (index % 2) * 0.42
    };
  });

  const startTime = performance.now();

  function resolveCollisions(positions) {
    for (let pass = 0; pass < 48; pass += 1) {
      for (let firstIndex = 0; firstIndex < positions.length; firstIndex += 1) {
        for (let secondIndex = firstIndex + 1; secondIndex < positions.length; secondIndex += 1) {
          const first = positions[firstIndex];
          const second = positions[secondIndex];
          const overlapX = first.width / 2 + second.width / 2 + 28 - Math.abs(first.x - second.x);
          const overlapY = first.height / 2 + second.height / 2 + 20 - Math.abs(first.y - second.y);

          if (overlapX <= 0 || overlapY <= 0) continue;

          if (overlapX < overlapY) {
            const direction = first.x === second.x ? (firstIndex < secondIndex ? -1 : 1) : first.x < second.x ? -1 : 1;
            const push = overlapX / 2 + 0.6;
            first.x += direction * push;
            second.x -= direction * push;
          } else {
            const direction = first.y === second.y ? (firstIndex < secondIndex ? -1 : 1) : first.y < second.y ? -1 : 1;
            const push = overlapY / 2 + 0.6;
            first.y += direction * push;
            second.y -= direction * push;
          }

          [first, second].forEach((position) => {
            position.x = clamp(
              position.x,
              position.width / 2 + 7,
              stageWidth - position.width / 2 - 7
            );
            position.y = clamp(
              position.y,
              position.height / 2 + 7,
              stageHeight - position.height / 2 - 7
            );
          });
        }
      }
    }
  }

  function render(now) {
    const elapsed = now - startTime;
    const spin = (elapsed / 46000) * Math.PI * 2;
    const floatY = Math.sin(elapsed / 6100) * 7;
    helix.style.transform = `translate3d(0, ${floatY.toFixed(2)}px, 0)`;

    const framePositions = [];

    layerRecords.forEach((layer, layerIndex) => {
      const theta = layer.angle + spin;
      const projected = Math.sin(theta) * radius;
      const depthA = (Math.cos(theta) + 1) / 2;
      const depthB = (Math.cos(theta + Math.PI) + 1) / 2;
      const first = layer.cards[0];
      const second = layer.cards[1];
      const scaleA = 0.79 + depthA * 0.21;
      const scaleB = 0.79 + depthB * 0.21;
      const flippedA = updateWind(first, elapsed);
      const flippedB = updateWind(second, elapsed);
      const projectedGap = Math.abs(projected * 2);
      const horizontalClearance = (first.width + second.width) / 2 + 24;
      const collisionMix = clamp(1 - projectedGap / horizontalClearance, 0, 1);
      const verticalClearance = (first.height + second.height) / 2 + 22;
      const separation = (verticalClearance * collisionMix) / 2;

      const positions = [
        {
          x: centerX + projected,
          y: layer.y - separation,
          depth: depthA,
          card: first,
          layerIndex,
          strandIndex: 0,
          width: flippedA.width * scaleA,
          height: flippedA.height * scaleA
        },
        {
          x: centerX - projected,
          y: layer.y + separation,
          depth: depthB,
          card: second,
          layerIndex,
          strandIndex: 1,
          width: flippedB.width * scaleB,
          height: flippedB.height * scaleB
        }
      ];

      positions.forEach((position) => {
        framePositions.push(position);
      });
    });

    resolveCollisions(framePositions);

    layerRecords.forEach((layer, layerIndex) => {
      const positions = framePositions.filter((position) => position.layerIndex === layerIndex);

      positions.forEach((position) => {
        const card = position.card;
        const scale = 0.79 + position.depth * 0.21;
        card.element.style.transform =
          `translate3d(${position.x.toFixed(2)}px, ${position.y.toFixed(2)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        card.element.style.opacity = `${(0.77 + position.depth * 0.23).toFixed(3)}`;
        card.element.style.zIndex = `${10 + Math.round(position.depth * 100) + layerIndex}`;
      });

      const x1 = positions[0].x;
      const y1 = positions[0].y;
      const x2 = positions[1].x;
      const y2 = positions[1].y;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const lineLength = Math.hypot(dx, dy);
      const lineAngle = Math.atan2(dy, dx);
      layer.rung.style.width = `${Math.max(1, lineLength).toFixed(2)}px`;
      layer.rung.style.transform =
        `translate3d(${((x1 + x2) / 2).toFixed(2)}px, ${((y1 + y2) / 2).toFixed(2)}px, 0) translate(-50%, -50%) rotate(${lineAngle.toFixed(4)}rad)`;
      layer.rung.style.opacity = `${(0.46 + Math.min(1, lineLength / 360) * 0.3).toFixed(3)}`;
    });

    sparks.forEach((spark, index) => {
      const angle = spark.angle + spin;
      const depth = (Math.cos(angle) + 1) / 2;
      const x = centerX + Math.sin(angle) * spark.radius;
      const y = spark.y + Math.sin(angle * 1.8 + elapsed / 2400) * 2.5;
      const scale = 0.72 + depth * 0.45;
      spark.element.style.transform =
        `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(2)})`;
      spark.element.style.opacity = `${(0.22 + depth * 0.52 + (index % 3) * 0.03).toFixed(3)}`;
    });

    requestAnimationFrame(render);
  }

  function updateScale() {
    const width = viewport.clientWidth;
    const scale = Math.min(1, Math.max(0.26, (width - 18) / stageWidth));
    section.style.setProperty("--storm-scale", scale.toFixed(4));
    section.style.setProperty("--storm-stage-height", `${Math.ceil(stageHeight * scale)}px`);
  }

  if ("ResizeObserver" in window) {
    new ResizeObserver(updateScale).observe(viewport);
  } else {
    window.addEventListener("resize", updateScale, { passive: true });
  }

  updateScale();
  requestAnimationFrame(render);
})();
