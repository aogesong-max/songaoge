(() => {
  "use strict";

  const disc = document.querySelector(".hero-sigil__portrait");
  if (!disc) return;

  const symbols = ["♪", "♩", "♫", "♬"];
  const colors = ["var(--pink)", "var(--red)", "var(--cyan)"];
  let noteLayer = null;

  function getNoteLayer() {
    if (!noteLayer || !noteLayer.isConnected) {
      noteLayer = document.createElement("div");
      noteLayer.className = "vinyl-note-layer";
      noteLayer.setAttribute("aria-hidden", "true");
      document.body.appendChild(noteLayer);
    }

    return noteLayer;
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function playNoteWave() {
    const bounds = disc.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    const layer = getNoteLayer();
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < 16; index += 1) {
      const note = document.createElement("span");
      const angle = randomBetween(-Math.PI * 0.9, -Math.PI * 0.1);
      const distance = randomBetween(80, 210);
      const arc = randomBetween(-58, 58);
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;
      const perpendicularX = -Math.sin(angle);
      const perpendicularY = Math.cos(angle);
      const duration = randomBetween(1200, 1800);

      note.className = "hero-sigil__note";
      note.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      note.setAttribute("aria-hidden", "true");
      note.style.setProperty("--note-x", `${centerX + randomBetween(-9, 9)}px`);
      note.style.setProperty("--note-y", `${centerY + randomBetween(-9, 9)}px`);
      note.style.setProperty("--note-size", `${Math.round(randomBetween(16, 34))}px`);
      note.style.setProperty("--note-color", colors[Math.floor(Math.random() * colors.length)]);
      note.style.setProperty("--note-duration", `${Math.round(duration)}ms`);
      note.style.setProperty("--note-mid-x", `${endX * 0.46 + perpendicularX * arc}px`);
      note.style.setProperty("--note-mid-y", `${endY * 0.46 + perpendicularY * arc}px`);
      note.style.setProperty("--note-end-x", `${endX}px`);
      note.style.setProperty("--note-end-y", `${endY}px`);
      note.style.setProperty("--note-mid-rotation", `${randomBetween(-55, 55)}deg`);
      note.style.setProperty("--note-end-rotation", `${randomBetween(-190, 190)}deg`);

      let removed = false;
      const removeNote = () => {
        if (removed) return;
        removed = true;
        note.remove();
      };

      note.addEventListener("animationend", removeNote, { once: true });
      window.setTimeout(removeNote, duration + 220);
      fragment.appendChild(note);
    }

    layer.appendChild(fragment);
  }

  disc.addEventListener("click", playNoteWave);
  disc.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    playNoteWave();
  });
})();
