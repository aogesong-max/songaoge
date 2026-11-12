(() => {
  "use strict";

  const root = document.documentElement;
  const intro = document.getElementById("intro");
  const introSkip = document.getElementById("intro-skip");
  if (!intro) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const seenInSession = root.classList.contains("intro-session-seen");
  const storageKey = "songaoge-intro-seen";
  const duration = 5.2;
  let finished = false;
  let frameId = 0;
  let startedAt = 0;
  let canvasFrameAlpha = 0;

  const canvas = document.getElementById("intro-stars");
  const context = canvas ? canvas.getContext("2d") : null;
  const copy = document.getElementById("intro-copy");
  const character = document.getElementById("intro-character");
  const butterfly = document.getElementById("intro-butterfly");
  const foreheadStar = document.getElementById("intro-forehead-star");
  const closedEye = document.getElementById("eye-closed");
  const openEye = document.getElementById("eye-open");
  const hairSparkles = document.getElementById("intro-hair-sparkles");
  const hairPaths = Array.from(document.querySelectorAll(".intro-hair-path"));
  const hairAccents = Array.from(document.querySelectorAll(".intro-hair-accent"));
  const lineImage = document.getElementById("intro-line-image");
  const colorImage = document.getElementById("intro-color-image");
  const imageLayer = document.getElementById("intro-image-layer");
  const svgArt = document.getElementById("intro-svg");
  const colorFills = Array.from(document.querySelectorAll(".intro-color-fill"));
  const detailLines = Array.from(document.querySelectorAll(
    ".intro-face-line, .intro-collar-line, .intro-lapel-line, .intro-eye-line"
  ));
  const lipLine = document.getElementById("intro-lip-line");
  const drawPaths = Array.from(document.querySelectorAll(".intro-draw"));
  const drawStates = [];
  const stars = [];
  const startPoint = { x: 760, y: 920 };
  const controlPointA = { x: 940, y: 670 };
  const controlPointB = { x: 1080, y: 312 };
  const endPoint = { x: 1318, y: 206 };
  let imageMode = false;

  function clamp(value, min = 0, max = 1) {
    return Math.min(max, Math.max(min, value));
  }

  function progressBetween(elapsed, start, end) {
    return clamp((elapsed - start) / (end - start));
  }

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  function easeInOutCubic(value) {
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  function lerp(start, end, amount) {
    return start + (end - start) * amount;
  }

  function mixColor(from, to, amount) {
    const channels = from.map((value, index) => Math.round(lerp(value, to[index], amount)));
    return `rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`;
  }

  function rememberSeen() {
    try {
      window.sessionStorage.setItem(storageKey, "1");
    } catch (error) {
      // The animation still exits cleanly when storage is blocked.
    }
  }

  function clearSafetyTimer() {
    window.clearTimeout(window.__introSafetyTimer);
  }

  function finishIntro(immediate = false) {
    if (finished) return;
    finished = true;
    rememberSeen();
    clearSafetyTimer();
    window.cancelAnimationFrame(frameId);
    window.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("resize", resizeCanvas);
    root.classList.remove("intro-active", "intro-running");
    intro.style.pointerEvents = "none";
    intro.style.opacity = "0";
    if (immediate) {
      intro.remove();
    } else {
      intro.classList.add("is-finished");
      intro.remove();
    }
  }

  function handleKeydown(event) {
    if (event.key === "Escape" && !finished) {
      event.preventDefault();
      finishIntro(true);
    }
  }

  function preventScroll(event) {
    event.preventDefault();
  }

  function hideForSeenOrReducedMotion() {
    if (seenInSession || prefersReducedMotion) {
      if (prefersReducedMotion) rememberSeen();
      clearSafetyTimer();
      root.classList.remove("intro-active", "intro-running");
      intro.style.display = "none";
      intro.setAttribute("aria-hidden", "true");
      return true;
    }
    return false;
  }

  async function loadImage(path) {
    try {
      const response = await fetch(path, { cache: "no-cache" });
      if (!response.ok) return null;
      const type = response.headers.get("content-type") || "";
      return type.startsWith("image/") ? path : null;
    } catch (error) {
      return null;
    }
  }

  async function detectImageMode() {
    const timeout = new Promise((resolve) => {
      window.setTimeout(() => resolve([null, null]), 220);
    });
    const loads = Promise.all([
      loadImage("./assets/intro/line.png"),
      loadImage("./assets/intro/color.png")
    ]);
    const [line, color] = await Promise.race([loads, timeout]);
    if (!line || !color || !lineImage || !colorImage) return false;

    lineImage.src = line;
    colorImage.src = color;
    intro.classList.add("intro-mode-image");
    if (svgArt) svgArt.setAttribute("aria-hidden", "true");
    if (imageLayer) imageLayer.setAttribute("aria-hidden", "false");
    return true;
  }

  function prepareDrawingPaths() {
    const hairCount = hairPaths.length;
    drawPaths.forEach((path, index) => {
      const totalLength = path.getTotalLength();
      const isHair = path.classList.contains("intro-hair-path");
      const isEye = path.closest("#eye-closed") !== null;
      const isFace = path.classList.contains("intro-face-line") ||
        path.classList.contains("intro-lip-line");
      const isGarment = path.classList.contains("intro-collar-line") ||
        path.classList.contains("intro-lapel-line");

      let start = 0.84;
      let drawDuration = 1.2;
      if (isHair) {
        const hairIndex = hairPaths.indexOf(path);
        start = 0.4 + Math.max(0, hairIndex) * 0.065;
        drawDuration = 1 + (index % 4) * 0.13;
      } else if (isFace) {
        const faceIndex = Math.max(0, drawPaths.filter((item) =>
          item.classList.contains("intro-face-line") ||
          item.classList.contains("intro-lip-line")
        ).indexOf(path));
        start = 0.78 + faceIndex * 0.16;
        drawDuration = 1.24;
      } else if (isEye) {
        const eyeIndex = Math.max(0, Array.from(closedEye.querySelectorAll(".intro-draw")).indexOf(path));
        start = 0.94 + eyeIndex * 0.07;
        drawDuration = 1;
      } else if (isGarment) {
        start = 0.68 + Math.max(0, index - hairCount - 5) * 0.12;
        drawDuration = 1.16;
      }

      path.style.strokeDasharray = `${totalLength}`;
      path.style.strokeDashoffset = `${totalLength}`;
      path.style.opacity = "1";
      drawStates.push({
        path,
        totalLength,
        start,
        duration: drawDuration,
        isHair
      });
    });
  }

  function resizeCanvas() {
    if (!canvas || !context) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createStars() {
    stars.length = 0;
    for (let index = 0; index < 90; index += 1) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        radius: 0.4 + Math.random() * 1.55,
        speed: 0.18 + Math.random() * 0.52,
        phase: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.005,
        blue: Math.random() > 0.74
      });
    }
  }

  function drawStars(elapsed) {
    if (!context || !canvas) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    context.clearRect(0, 0, width, height);
    canvasFrameAlpha = clamp(elapsed / 0.4);
    if (canvasFrameAlpha <= 0) return;

    const time = elapsed * 10;
    stars.forEach((star) => {
      const x = ((star.x + star.drift * time) % 1 + 1) % 1;
      const y = ((star.y + 0.0018 * time * star.speed) % 1 + 1) % 1;
      const glow = 0.22 + 0.78 * (0.5 + Math.sin(time * star.speed + star.phase) * 0.5);
      context.beginPath();
      context.fillStyle = star.blue
        ? `rgba(112, 224, 255, ${0.58 * glow * canvasFrameAlpha})`
        : `rgba(236, 249, 255, ${0.68 * glow * canvasFrameAlpha})`;
      context.arc(x * width, y * height, star.radius, 0, Math.PI * 2);
      context.fill();
    });
  }

  function cubicPoint(amount) {
    const inverse = 1 - amount;
    const x =
      inverse * inverse * inverse * startPoint.x +
      3 * inverse * inverse * amount * controlPointA.x +
      3 * inverse * amount * amount * controlPointB.x +
      amount * amount * amount * endPoint.x;
    const y =
      inverse * inverse * inverse * startPoint.y +
      3 * inverse * inverse * amount * controlPointA.y +
      3 * inverse * amount * amount * controlPointB.y +
      amount * amount * amount * endPoint.y;
    return { x, y };
  }

  function cubicTangent(amount) {
    const inverse = 1 - amount;
    return {
      x:
        3 * inverse * inverse * (controlPointA.x - startPoint.x) +
        6 * inverse * amount * (controlPointB.x - controlPointA.x) +
        3 * amount * amount * (endPoint.x - controlPointB.x),
      y:
        3 * inverse * inverse * (controlPointA.y - startPoint.y) +
        6 * inverse * amount * (controlPointB.y - controlPointA.y) +
        3 * amount * amount * (endPoint.y - controlPointB.y)
    };
  }

  function characterViewportOffset() {
    if (window.innerWidth <= 480) return -420;
    if (window.innerWidth <= 768) return -210;
    return 0;
  }

  function updateCharacterColors(colorProgress) {
    colorFills.forEach((element) => {
      const maxOpacity = Number(element.dataset.maxOpacity || 1);
      element.style.fillOpacity = String(maxOpacity * colorProgress);
    });
    if (lipLine) lipLine.style.fillOpacity = String(0.9 * colorProgress);

    const strokeColor = mixColor([53, 207, 255], [159, 216, 242], colorProgress);
    hairPaths.forEach((path) => {
      path.style.stroke = strokeColor;
      path.style.opacity = String(1 - 0.58 * colorProgress);
    });
    hairAccents.forEach((path) => {
      path.style.stroke = strokeColor;
      path.style.opacity = String(0.62 * colorProgress);
    });
    const detailColor = mixColor([53, 207, 255], [125, 192, 217], colorProgress);
    detailLines.forEach((path) => {
      path.style.stroke = detailColor;
      path.style.opacity = String(1 - 0.42 * colorProgress);
    });
    if (hairSparkles) hairSparkles.style.opacity = String(colorProgress);
  }

  function updateDrawing(elapsed) {
    drawStates.forEach((state) => {
      const progress = progressBetween(elapsed, state.start, state.start + state.duration);
      state.path.style.strokeDashoffset = String(state.totalLength * (1 - easeOutCubic(progress)));
    });
  }

  function updateImageMode(elapsed, colorProgress, scale) {
    if (!imageMode || !lineImage || !colorImage) return;
    const drawProgress = clamp((elapsed - 0.4) / 1.6);
    const reveal = 6 + easeInOutCubic(drawProgress) * 112;
    lineImage.style.setProperty("--intro-image-reveal", `${reveal}%`);
    lineImage.style.opacity = String(1 - colorProgress * 0.72);
    colorImage.style.opacity = String(easeInOutCubic(colorProgress));
    lineImage.style.transform = `translate(-50%, -50%) scale(${scale})`;
    colorImage.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }

  function updateTimeline(elapsed) {
    drawStars(elapsed);
    updateDrawing(elapsed);

    if (copy && elapsed >= 0.6) copy.classList.add("is-visible");

    const colorProgress = progressBetween(elapsed, 2, 3.2);
    if (colorProgress > 0) updateCharacterColors(colorProgress);

    if (closedEye && openEye) {
      const eyeProgress = easeInOutCubic(progressBetween(elapsed, 2.6, 2.92));
      closedEye.style.opacity = String(1 - eyeProgress);
      openEye.style.opacity = String(eyeProgress);
    }

    if (copy && elapsed >= 2.8) copy.classList.add("is-awake");

    const zoomProgress = easeOutCubic(progressBetween(elapsed, 2, 4.3));
    const scale = 1 + zoomProgress * 0.08;
    if (character) {
      const offsetX = characterViewportOffset();
      character.setAttribute(
        "transform",
        `translate(${offsetX + 1392 * (1 - scale)} ${388 * (1 - scale)}) scale(${scale})`
      );
    }
    updateImageMode(elapsed, colorProgress, scale);

    if (butterfly) {
      const flight = progressBetween(elapsed, 3.4, 4.3);
      if (flight > 0 && flight < 1) {
        const point = cubicPoint(easeInOutCubic(flight));
        const tangent = cubicTangent(easeInOutCubic(flight));
        const angle = Math.atan2(tangent.y, tangent.x) * 180 / Math.PI;
        const butterflyOpacity = Math.min(1, flight / 0.08) * Math.min(1, (1 - flight) / 0.12);
        butterfly.setAttribute("transform", `translate(${point.x} ${point.y})`);
        butterfly.style.transformOrigin = `${point.x}px ${point.y}px`;
        butterfly.style.opacity = String(butterflyOpacity);
        butterfly.style.rotate = `${angle * 0.22}deg`;
      } else if (flight >= 1) {
        butterfly.style.opacity = "0";
      }
    }

    if (foreheadStar) {
      const glint = progressBetween(elapsed, 3.4, 3.78);
      const glintOpacity = glint > 0 && glint < 1
        ? Math.pow(Math.sin(glint * Math.PI), 2)
        : 0;
      const glintScale = 0.72 + Math.sin(glint * Math.PI) * 0.55;
      const glintX = characterViewportOffset() + 1392 + 4 * scale;
      const glintY = 388 - 86 * scale;
      foreheadStar.setAttribute(
        "transform",
        `translate(${glintX} ${glintY}) scale(${glintScale})`
      );
      foreheadStar.style.opacity = String(glintOpacity);
    }

    if (elapsed >= 4.3) {
      const fade = easeInOutCubic(progressBetween(elapsed, 4.3, 5.2));
      intro.style.opacity = String(1 - fade);
      if (elapsed >= 4.62) root.classList.remove("intro-active");
    }

    if (elapsed >= duration) {
      finishIntro(true);
      return;
    }
    frameId = window.requestAnimationFrame(animate);
  }

  function animate(now) {
    if (finished) return;
    updateTimeline((now - startedAt) / 1000);
  }

  function startTimeline(useImages) {
    imageMode = useImages;
    root.classList.add("intro-active", "intro-running");
    prepareDrawingPaths();
    resizeCanvas();
    createStars();

    if (introSkip) {
      intro.addEventListener("click", preventScroll, { passive: false });
      intro.addEventListener("click", () => finishIntro(true));
    }
    intro.addEventListener("wheel", preventScroll, { passive: false });
    intro.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("resize", resizeCanvas);

    startedAt = performance.now();
    frameId = window.requestAnimationFrame(animate);
  }

  function bootIntro() {
    if (hideForSeenOrReducedMotion()) return;
    startTimeline(false);
    detectImageMode().then((useImages) => {
      if (useImages && !finished && intro.isConnected) imageMode = true;
    });
  }

  bootIntro();
})();
