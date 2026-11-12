(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const bootLayer = document.getElementById("boot-layer");
  const bootSkip = document.getElementById("boot-skip");
  const bootFill = document.getElementById("boot-progress-fill");
  const bootPercent = document.getElementById("boot-percent");
  const bootClock = document.getElementById("boot-clock");
  const bootDate = document.getElementById("boot-date");
  const bootAxisTime = document.querySelector(".temporal-readout--left b");
  const bootLetters = Array.from(document.querySelectorAll(".boot-copy span"));
  const hero = document.querySelector(".hero");
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const bootStorageKey = "songaoge-boot-played-v2";
  let bootFrame = 0;
  let bootFinished = false;

  const safeSession = {
    get(key) {
      try {
        return window.sessionStorage.getItem(key);
      } catch (error) {
        return null;
      }
    },
    set(key, value) {
      try {
        window.sessionStorage.setItem(key, value);
      } catch (error) {
        // Storage can be unavailable in strict privacy modes.
      }
    }
  };

  function revealHero() {
    root.classList.remove("boot-active");
    body.classList.remove("boot-locked");
    if (hero) hero.classList.add("is-revealed");
  }

  function fullyDismissBoot() {
    if (bootFinished) return;
    bootFinished = true;
    revealHero();
    root.classList.add("boot-forced");
    if (bootLayer) bootLayer.setAttribute("aria-hidden", "true");
    window.clearTimeout(window.__bootSafetyTimer);
  }

  function skipBoot() {
    if (!bootLayer || bootFinished) return;
    bootFinished = true;
    window.clearTimeout(window.__bootSafetyTimer);
    window.cancelAnimationFrame(bootFrame);
    safeSession.set(bootStorageKey, "1");
    revealHero();

    bootLayer.classList.add("is-skipped");
    bootLayer.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      root.classList.add("boot-forced");
    }, 280);
  }

  function animateBootLetter(letter, index) {
    if (window.gsap && typeof window.gsap.fromTo === "function") {
      window.gsap.fromTo(
        letter,
        {
          autoAlpha: 0,
          scale: 1.14,
          filter: "blur(18px)",
          textShadow: "0 0 42px rgba(143, 105, 255, 0.72)"
        },
        {
          autoAlpha: 1,
          scale: 1,
          filter: "blur(0px)",
          textShadow: "0 0 0 rgba(143, 105, 255, 0)",
          duration: 0.8,
          delay: index * 0.07,
          ease: "power4.out",
          overwrite: true
        }
      );
      return;
    }

    if (typeof letter.animate !== "function") {
      letter.style.opacity = "1";
      letter.style.filter = "none";
      letter.style.transform = "scale(1)";
      return;
    }

    letter.animate(
      [
        {
          opacity: 0,
          filter: "blur(18px)",
          transform: "scale(1.14)",
          textShadow: "0 0 42px rgba(143, 105, 255, 0.72)"
        },
        {
          opacity: 0.72,
          filter: "blur(5px)",
          transform: "scale(1.035)",
          textShadow: "0 0 24px rgba(143, 105, 255, 0.36)",
          offset: 0.66
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          transform: "scale(1)",
          textShadow: "0 0 0 rgba(143, 105, 255, 0)"
        }
      ],
      {
        duration: 800,
        delay: index * 70,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "both"
      }
    );
  }

  function updateBootTime() {
    const now = new Date();
    const pad = (value, length = 2) => String(value).padStart(length, "0");
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());
    const milliseconds = pad(now.getMilliseconds(), 3);

    if (bootClock) bootClock.textContent = `${hours}:${minutes}:${seconds}.${milliseconds}`;
    if (bootAxisTime) bootAxisTime.textContent = `${hours} : ${minutes} : ${seconds}`;
    if (bootDate) {
      bootDate.textContent = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`;
    }
  }

  function startBootSequence() {
    if (!bootLayer) {
      fullyDismissBoot();
      return;
    }

    const alreadyPlayed = safeSession.get(bootStorageKey) === "1";
    if (alreadyPlayed || reduceMotionQuery.matches) {
      safeSession.set(bootStorageKey, "1");
      fullyDismissBoot();
      return;
    }

    safeSession.set(bootStorageKey, "1");
    body.classList.add("boot-locked");
    root.classList.add("boot-active");
    updateBootTime();

    const startedAt = performance.now();
    let gridVisible = false;
    let lineOpen = false;
    let lettersEntered = false;
    let welcomeVisible = false;
    let sweepStarted = false;
    let curtainStarted = false;
    let heroRevealed = false;

    const tick = (now) => {
      const elapsed = now - startedAt;

      if (!gridVisible && elapsed >= 40) {
        bootLayer.classList.add("is-grid");
        gridVisible = true;
      }

      if (!lineOpen && elapsed >= 50) {
        bootLayer.classList.add("is-line-open");
        lineOpen = true;
      }

      if (!lettersEntered && elapsed >= 400) {
        bootLetters.forEach(animateBootLetter);
        lettersEntered = true;
      }

      if (!welcomeVisible && elapsed >= 1200) {
        bootLayer.classList.add("is-welcomed");
        welcomeVisible = true;
      }

      if (elapsed >= 400) {
        const progress = Math.max(0, Math.min(100, ((elapsed - 400) / 1500) * 100));
        if (bootFill) bootFill.style.width = `${progress}%`;
        if (bootPercent) bootPercent.textContent = `${Math.round(progress)}%`;
        updateBootTime();
      }

      if (!sweepStarted && elapsed >= 1900) {
        bootLayer.classList.add("is-sweeping", "is-complete");
        if (bootFill) bootFill.style.width = "100%";
        if (bootPercent) bootPercent.textContent = "100%";
        sweepStarted = true;
      }

      if (!curtainStarted && elapsed >= 2400) {
        bootLayer.classList.add("is-curtain");
        curtainStarted = true;
      }

      if (!heroRevealed && elapsed >= 2400) {
        revealHero();
        heroRevealed = true;
      }

      if (elapsed >= 3200) {
        bootFinished = true;
        root.classList.add("boot-forced");
        bootLayer.setAttribute("aria-hidden", "true");
        window.clearTimeout(window.__bootSafetyTimer);
        return;
      }

      bootFrame = window.requestAnimationFrame(tick);
    };

    bootFrame = window.requestAnimationFrame(tick);
  }

  if (bootSkip) {
    bootSkip.addEventListener("click", skipBoot);
  }

  try {
    startBootSequence();
  } catch (error) {
    // The independent four-second watchdog in index.html remains the final guard.
    fullyDismissBoot();
  }

  // Header state and right-edge scroll meter.
  const header = document.getElementById("site-header");
  const scrollPercent = document.getElementById("scroll-percent");
  const scrollLine = document.getElementById("scroll-line");
  let scrollTicking = false;

  function updateScrollUI() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const scrollRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.max(0, Math.min(100, (scrollTop / scrollRange) * 100));

    if (header) header.classList.toggle("is-scrolled", scrollTop > 18);
    if (scrollPercent) scrollPercent.textContent = String(Math.round(progress));
    if (scrollLine) scrollLine.style.height = `${progress}%`;

    updateActiveNav(scrollTop);
    updateActiveWorkTab(scrollTop);
    scrollTicking = false;
  }

  function requestScrollUpdate() {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(updateScrollUI);
  }

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);

  // Scroll reveal, only once per section.
  const revealElements = Array.from(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && !reduceMotionQuery.matches) {
    root.classList.add("reveal-enabled");
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  // Anchor navigation with a consistent smooth scroll and mobile-menu close.
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;
    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    closeMobileMenu();
    const revealSection = target.closest(".reveal");
    if (revealSection) revealSection.classList.add("is-visible");
    target.scrollIntoView({
      behavior: reduceMotionQuery.matches ? "auto" : "smooth",
      block: "start"
    });

    if (window.history && typeof window.history.pushState === "function") {
      window.history.pushState(null, "", hash);
    }
  });

  // Desktop navigation scroll spy.
  const navLinks = Array.from(document.querySelectorAll(".desktop-nav a"));
  const navSections = navLinks
    .map((link) => {
      const id = link.getAttribute("href");
      return { link, section: id ? document.querySelector(id) : null };
    })
    .filter((item) => item.section);

  function updateActiveNav(scrollTop) {
    let current = null;
    let currentTop = -Infinity;
    navSections.forEach((item) => {
      if (item.section.offsetTop - 190 <= scrollTop && item.section.offsetTop > currentTop) {
        current = item;
        currentTop = item.section.offsetTop;
      }
    });
    navLinks.forEach((link) => link.classList.toggle("is-active", current && link === current.link));
  }

  // Works category tab scroll spy.
  const workTabs = Array.from(document.querySelectorAll(".works-tabs a"));
  const workGroups = Array.from(document.querySelectorAll(".work-group"));

  function updateActiveWorkTab(scrollTop) {
    if (!workGroups.length) return;
    let current = workGroups[0];
    workGroups.forEach((group) => {
      const distanceFromViewportTop = group.getBoundingClientRect().top;
      if (distanceFromViewportTop <= 320) current = group;
    });
    workTabs.forEach((tab) => {
      tab.classList.toggle("is-active", tab.getAttribute("href") === `#${current.id}`);
    });
  }

  // Mobile navigation.
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  function openMobileMenu() {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.querySelector(".sr-only").textContent = "关闭菜单";
    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
  }

  function closeMobileMenu() {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.querySelector(".sr-only").textContent = "打开菜单";
    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      if (menuToggle.getAttribute("aria-expanded") === "true") {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMobileMenu();
    });

    document.addEventListener("click", (event) => {
      if (!mobileMenu.classList.contains("is-open")) return;
      if (mobileMenu.contains(event.target) || menuToggle.contains(event.target)) return;
      closeMobileMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) closeMobileMenu();
    });
  }

  // This form intentionally stays entirely in the browser.
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const requiredFields = Array.from(contactForm.querySelectorAll("[required]"));
      const firstEmpty = requiredFields.find((field) => !field.value.trim());

      if (firstEmpty) {
        formStatus.textContent = "请先补全必填信息。";
        firstEmpty.focus();
        return;
      }

      contactForm.reset();
      formStatus.textContent = "已收到。当前为前端演示，内容不会发送到任何服务器。";
    });
  }

  // If the viewport was reduced after load, stop the one-time boot presentation cleanly.
  const onMotionPreferenceChange = (event) => {
    if (!event.matches || bootFinished) return;
    skipBoot();
  };

  if (typeof reduceMotionQuery.addEventListener === "function") {
    reduceMotionQuery.addEventListener("change", onMotionPreferenceChange);
  } else if (typeof reduceMotionQuery.addListener === "function") {
    reduceMotionQuery.addListener(onMotionPreferenceChange);
  }

  updateScrollUI();
  window.addEventListener("load", requestScrollUpdate);
})();
