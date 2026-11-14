(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const bootLayer = document.getElementById("boot-layer");
  const bootSkip = document.getElementById("boot-skip");
  const bootVideo = document.getElementById("boot-video");
  const hero = document.querySelector(".hero");
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const bootStorageKey = "songaoge-boot-played-v3";
  const bootFadeAt = 11.8;
  const bootEndAt = 12.45;
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
    window.cancelAnimationFrame(bootFrame);
    window.clearTimeout(window.__bootSafetyTimer);
    if (bootVideo) bootVideo.pause();
    revealHero();
    root.classList.add("boot-forced");
    if (bootLayer) bootLayer.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", handleBootKeydown);
  }

  function skipBoot() {
    if (!bootLayer || bootFinished) return;
    bootFinished = true;
    window.clearTimeout(window.__bootSafetyTimer);
    window.cancelAnimationFrame(bootFrame);
    if (bootVideo) bootVideo.pause();
    safeSession.set(bootStorageKey, "1");
    revealHero();

    bootLayer.classList.add("is-skipped");
    bootLayer.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", handleBootKeydown);
    root.classList.add("boot-forced");
  }

  function handleBootKeydown(event) {
    if (event.key === "Escape") skipBoot();
  }

  function handleBootClick() {
    skipBoot();
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
    bootLayer.addEventListener("click", handleBootClick);
    document.addEventListener("keydown", handleBootKeydown);

    if (!bootVideo) {
      window.setTimeout(fullyDismissBoot, 800);
      return;
    }

    let fadeStarted = false;
    const tick = () => {
      if (bootFinished || root.classList.contains("boot-forced")) {
        if (!bootFinished) fullyDismissBoot();
        return;
      }

      const currentTime = bootVideo.currentTime || 0;
      if (!fadeStarted && currentTime >= bootFadeAt) {
        fadeStarted = true;
        bootLayer.classList.add("is-video-fading");
        revealHero();
      }

      if (currentTime >= bootEndAt || bootVideo.ended) {
        fullyDismissBoot();
        return;
      }

      bootFrame = window.requestAnimationFrame(tick);
    };

    bootVideo.addEventListener("ended", fullyDismissBoot, { once: true });
    bootVideo.addEventListener("error", () => {
      bootLayer.classList.add("is-video-error");
      window.setTimeout(fullyDismissBoot, 900);
    }, { once: true });

    bootVideo.currentTime = 0;
    const playback = bootVideo.play();
    if (playback && typeof playback.catch === "function") {
      playback.catch(() => {
        bootLayer.classList.add("is-video-error");
        window.setTimeout(fullyDismissBoot, 900);
      });
    }
    bootFrame = window.requestAnimationFrame(tick);
  }

  if (bootSkip) {
    bootSkip.addEventListener("click", skipBoot);
  }

  try {
    startBootSequence();
  } catch (error) {
    // The independent watchdog in index.html remains the final guard.
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
