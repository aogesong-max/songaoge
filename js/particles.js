(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) return;

  const canvas = document.createElement("canvas");
  canvas.id = "ambient-particles";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);

  const context = canvas.getContext("2d");
  if (!context) {
    canvas.remove();
    return;
  }

  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const pointer = { x: -1000, y: -1000, active: false };
  const particles = [];
  let width = 0;
  let height = 0;
  let ratio = 1;
  let frame = 0;
  let lastTime = performance.now();

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function makeParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: random(-0.12, 0.12),
      vy: random(-0.1, 0.1),
      radius: random(0.55, 2.1),
      phase: Math.random() * Math.PI * 2,
      speed: random(0.0007, 0.0018),
      cool: Math.random() > 0.28
    };
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const desiredCount = coarsePointer ? 38 : 84;
    while (particles.length < desiredCount) particles.push(makeParticle());
    if (particles.length > desiredCount) particles.length = desiredCount;
  }

  function draw(now) {
    if (document.documentElement.classList.contains("boot-active")) {
      lastTime = now;
      frame = window.requestAnimationFrame(draw);
      return;
    }
    const delta = Math.min(32, now - lastTime);
    lastTime = now;
    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = "lighter";

    for (let index = 0; index < particles.length; index += 1) {
      const particle = particles[index];
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;

      if (pointer.active) {
        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 0 && distance < 155) {
          const force = (1 - distance / 155) * 0.01;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }
      }

      particle.vx *= 0.994;
      particle.vy *= 0.994;
      particle.vx = Math.max(-0.42, Math.min(0.42, particle.vx));
      particle.vy = Math.max(-0.42, Math.min(0.42, particle.vy));

      if (particle.x < -12) particle.x = width + 12;
      if (particle.x > width + 12) particle.x = -12;
      if (particle.y < -12) particle.y = height + 12;
      if (particle.y > height + 12) particle.y = -12;

      const pointerDistance = pointer.active
        ? Math.hypot(pointer.x - particle.x, pointer.y - particle.y)
        : Infinity;
      const pointerBoost = pointerDistance < 180 ? (1 - pointerDistance / 180) * 0.55 : 0;
      const twinkle = 0.38 + 0.62 * (0.5 + Math.sin(now * particle.speed + particle.phase) * 0.5);
      const alpha = Math.min(0.92, (0.17 + twinkle * 0.34 + pointerBoost) * 0.88);

      context.beginPath();
      context.fillStyle = particle.cool
        ? `rgba(120, 232, 255, ${alpha})`
        : `rgba(190, 160, 255, ${alpha})`;
      context.arc(particle.x, particle.y, particle.radius + pointerBoost, 0, Math.PI * 2);
      context.fill();

      if (particle.cool && index % 13 === 0) {
        context.beginPath();
        context.strokeStyle = `rgba(180, 248, 255, ${alpha * 0.9})`;
        context.lineWidth = 0.8;
        context.moveTo(particle.x - 5, particle.y);
        context.lineTo(particle.x + 5, particle.y);
        context.moveTo(particle.x, particle.y - 5);
        context.lineTo(particle.x, particle.y + 5);
        context.stroke();
      }

      if (pointerDistance < 130) {
        context.beginPath();
        context.strokeStyle = `rgba(120, 232, 255, ${(1 - pointerDistance / 130) * 0.14})`;
        context.lineWidth = 0.7;
        context.moveTo(particle.x, particle.y);
        context.lineTo(pointer.x, pointer.y);
        context.stroke();
      }

      for (let next = index + 1; next < particles.length; next += 1) {
        const neighbor = particles[next];
        const lineDistance = Math.hypot(particle.x - neighbor.x, particle.y - neighbor.y);
        if (lineDistance > 104) continue;
        context.beginPath();
        context.strokeStyle = `rgba(142, 224, 255, ${(1 - lineDistance / 104) * 0.08})`;
        context.lineWidth = 0.6;
        context.moveTo(particle.x, particle.y);
        context.lineTo(neighbor.x, neighbor.y);
        context.stroke();
      }
    }

    frame = window.requestAnimationFrame(draw);
  }

  window.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  });
  window.addEventListener("blur", () => {
    pointer.active = false;
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pointer.active = false;
      window.cancelAnimationFrame(frame);
      frame = 0;
    } else if (!frame) {
      lastTime = performance.now();
      frame = window.requestAnimationFrame(draw);
    }
  });

  window.addEventListener("resize", resize);
  resize();
  window.requestAnimationFrame(() => document.documentElement.classList.add("ambient-ready"));
  frame = window.requestAnimationFrame(draw);
})();
