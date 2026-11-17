(() => {
  "use strict";

  const body = document.body;
  const works = window.SONGAOGE_WORKS || { dramas: [], designSections: [] };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const dramaList = document.getElementById("drama-list");
  const heroProfile = document.getElementById("hero-profile");
  const ipShowcase = document.getElementById("ip-showcase");
  const designIndex = document.getElementById("design-index");
  const designGroups = document.getElementById("design-groups");
  const detailLayer = document.getElementById("detail-layer");
  const detailPanel = detailLayer?.querySelector(".detail-panel");
  const detailContent = document.getElementById("detail-content");
  const detailToc = document.getElementById("detail-toc");
  const detailBreadcrumb = document.getElementById("detail-breadcrumb");
  const detailPagination = document.getElementById("detail-pagination");
  const detailClose = document.getElementById("detail-close");
  const detailBack = document.getElementById("detail-back");
  const lightbox = document.getElementById("image-lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  const siteHeader = document.getElementById("site-header");
  const worksMenu = document.getElementById("works-menu");
  const worksMenuTrigger = document.getElementById("works-menu-trigger");
  const worksMenuPanel = document.getElementById("works-menu-panel");
  let worksMenuCloseTimer = 0;
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  const detailState = {
    open: false,
    scrollY: 0,
    trigger: null
  };
  const lightboxState = {
    items: [],
    index: 0,
    trigger: null
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function imageMarkup(src, alt, loading = "lazy") {
    if (!src) return "";
    return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="${loading}" decoding="async">`;
  }

  function primeImageFallbacks(container = document) {
    container.querySelectorAll(".media-frame img").forEach((image) => {
      const markMissing = () => image.closest(".media-frame")?.classList.add("is-missing");
      image.addEventListener("error", markMissing, { once: true });
      if (image.complete && image.naturalWidth === 0) markMissing();
    });
    container.querySelectorAll(".avatar img").forEach((image) => {
      const hideMissing = () => {
        image.hidden = true;
      };
      image.addEventListener("error", hideMissing, { once: true });
      if (image.complete && image.naturalWidth === 0) hideMissing();
    });
  }

  function setWorksMenuOpen(open) {
    if (!worksMenu || !worksMenuTrigger) return;
    if (open) {
      window.clearTimeout(worksMenuCloseTimer);
      worksMenuCloseTimer = 0;
    }
    worksMenu.classList.toggle("is-open", open);
    worksMenuTrigger.setAttribute("aria-expanded", String(open));
    worksMenuPanel?.setAttribute("aria-hidden", String(!open));
  }

  function setMobileMenuOpen(open) {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    mobileMenu.classList.toggle("is-open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
    body.classList.toggle("mobile-menu-open", open);
    siteHeader?.classList.toggle("is-menu-open", open);
  }

  function setupHeader() {
    if (siteHeader) {
      const updateHeader = () => {
        siteHeader.classList.toggle("is-scrolled", window.scrollY > 36);
      };
      window.addEventListener("scroll", updateHeader, { passive: true });
      updateHeader();
    }

    if (worksMenu && worksMenuTrigger) {
      const cancelWorksMenuClose = () => {
        window.clearTimeout(worksMenuCloseTimer);
        worksMenuCloseTimer = 0;
      };
      const closeWorksMenu = () => {
        cancelWorksMenuClose();
        setWorksMenuOpen(false);
      };
      const scheduleWorksMenuClose = () => {
        cancelWorksMenuClose();
        worksMenuCloseTimer = window.setTimeout(() => {
          worksMenuCloseTimer = 0;
          setWorksMenuOpen(false);
        }, 300);
      };
      worksMenu.addEventListener("mouseenter", () => {
        if (window.matchMedia("(min-width: 769px)").matches) setWorksMenuOpen(true);
      });
      worksMenu.addEventListener("mouseleave", () => {
        if (window.matchMedia("(min-width: 769px)").matches) scheduleWorksMenuClose();
      });
      worksMenuTrigger.addEventListener("click", () => {
        cancelWorksMenuClose();
        setWorksMenuOpen(!worksMenu.classList.contains("is-open"));
      });
      worksMenu.addEventListener("focusout", (event) => {
        if (!worksMenu.contains(event.relatedTarget)) closeWorksMenu();
      });
      worksMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeWorksMenu));
      document.addEventListener("click", (event) => {
        if (!worksMenu.contains(event.target)) closeWorksMenu();
      });
    }

    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener("click", () => {
        setMobileMenuOpen(!mobileMenu.classList.contains("is-open"));
      });
      mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMobileMenuOpen(false));
      });
      window.addEventListener("resize", () => {
        if (window.innerWidth > 768) setMobileMenuOpen(false);
      });
    }
  }

  function getIpItems() {
    return works.designSections.find((section) => section.layout === "ip")?.items || [];
  }

  function renderIpShowcase() {
    if (!ipShowcase) return;
    ipShowcase.innerHTML = getIpItems()
      .map(
        (item, index) => `
          <button class="ip-card" type="button" data-ip-index="${index}" aria-label="打开 IP ${escapeHtml(item.title)}">
            <span class="ip-card__cover">
              ${imageMarkup(item.banner || item.cover, `${item.title} ${item.meta} 封面`, "lazy")}
            </span>
            <span class="ip-card__meta">
              <span class="ip-card__name">
                <strong>${escapeHtml(item.title)}</strong>
                <span>${escapeHtml(item.meta)}</span>
              </span>
              ${item.theme ? `<span class="ip-card__theme">设计主题：${escapeHtml(item.theme)}</span>` : ""}
            </span>
          </button>
        `
      )
      .join("");
  }

  function renderHome() {
    const profile = works.profile || {};
    if (heroProfile) {
      heroProfile.innerHTML = `
        <div class="profile-block">
          <p class="profile-label">PROFILE</p>
          <dl class="profile-list">
            <div><dt>姓名</dt><dd>${escapeHtml(profile.name || "")}</dd></div>
            <div><dt>年龄</dt><dd>${escapeHtml(profile.age || "")}</dd></div>
            <div><dt>学历</dt><dd>${escapeHtml(profile.education || "")}</dd></div>
            <div><dt>专业</dt><dd>${escapeHtml(profile.major || "")}</dd></div>
            <div><dt>院校</dt><dd>${escapeHtml(profile.school || "")}</dd></div>
          </dl>
        </div>
        <div class="software-block">
          <p class="software-label">SOFTWARE</p>
          <div class="software-list">
            ${(profile.software || [])
              .map(
                (software) => `
                  <span class="software-item">
                    <img src="${escapeHtml(software.icon)}" alt="" loading="lazy" decoding="async">
                    <span>${escapeHtml(software.name)}</span>
                  </span>
                `
              )
              .join("")}
          </div>
        </div>
      `;
    }

    dramaList.innerHTML = works.dramas
      .map(
        (drama, index) => `
          <button class="drama-card" type="button" data-drama-index="${index}" aria-label="打开作品 ${escapeHtml(drama.title)}">
            <span class="media-frame ratio-16-9">
              ${imageMarkup(drama.cover, drama.title, index === 0 ? "eager" : "lazy")}
              <span class="play-mark" aria-hidden="true">▶</span>
            </span>
            <span class="drama-card__copy">
              <span class="drama-card__index">${String(index + 1).padStart(2, "0")} / AI SHORT DRAMA</span>
              <strong class="drama-card__title">${escapeHtml(drama.title)}</strong>
              <span class="drama-card__section">
                <span class="drama-card__label">简介</span>
                <span class="drama-card__text">${escapeHtml(drama.summary)}</span>
              </span>
              <span class="drama-card__section">
                <span class="drama-card__label">制作流程</span>
                <span class="drama-card__text">${escapeHtml(drama.processNote)}</span>
              </span>
              <span class="drama-card__link">查看作品 <span aria-hidden="true">→</span></span>
            </span>
          </button>
        `
      )
      .join("");

    renderIpShowcase();

    const indexOrder = ["ip", "creative", "ecommerce", "workflow"];
    designIndex.innerHTML = indexOrder
      .map((sectionId) => works.designSections.find((section) => section.id === sectionId))
      .filter(Boolean)
      .map((section, index) => {
        const representative = section.items[0];
        const subtitle = section.items.map((item) => item.title).join(" · ");
        return `
          <button class="design-index-card" type="button" data-scroll-design="${escapeHtml(section.id)}">
            <span class="design-index-card__media">
              ${imageMarkup(representative.cover, section.title)}
              <span class="design-index-card__line" aria-hidden="true"></span>
            </span>
            <span class="design-index-card__copy">
              <span class="design-index-card__title"><span>${String(index + 1).padStart(2, "0")}</span><em>${escapeHtml(section.title)}</em></span>
              <span class="design-index-card__subtitle">${escapeHtml(subtitle)}</span>
              <span class="design-index-card__button">查看作品 <span aria-hidden="true">→</span></span>
            </span>
          </button>
        `;
      })
      .join("");

    designGroups.innerHTML = works.designSections
      .map((section, sectionIndex) => {
        const groupItems = section.items.map((item) => item.title).join(" · ");
        const items = section.items
          .map((item, itemIndex) => {
            const layout = section.layout;
            const ratio =
              layout === "ip"
                ? "ratio-4-5"
                : layout === "ecommerce"
                  ? "ratio-ecommerce"
                  : layout === "creative"
                    ? "ratio-4-5"
                    : "ratio-16-9";
            const className =
              layout === "creative" ? "design-card creative-card" : "design-card";
            return `
              <button class="${className}" type="button" data-design-section="${sectionIndex}" data-design-id="${escapeHtml(section.id)}" data-design-item="${itemIndex}" aria-label="打开作品 ${escapeHtml(item.title)}">
                <span class="media-frame ${ratio}">
                  ${imageMarkup(item.cover, item.title)}
                </span>
                <span class="design-card__meta">
                  <strong>${escapeHtml(item.title)}</strong>
                  ${item.meta ? `<span>${escapeHtml(item.meta)}</span>` : ""}
                </span>
              </button>
            `;
          })
          .join("");
        return `
          <section class="design-group" id="design-section-${escapeHtml(section.id)}" aria-labelledby="design-group-${escapeHtml(section.id)}">
            <div class="design-group__heading">
              <h3 id="design-group-${escapeHtml(section.id)}">${escapeHtml(section.title)}</h3>
              <span>${String(sectionIndex + 1).padStart(2, "0")} / ${String(works.designSections.length).padStart(2, "0")} · ${escapeHtml(groupItems)}</span>
            </div>
            <div class="design-grid design-grid--${escapeHtml(section.layout)}">${items}</div>
          </section>
        `;
      })
      .join("");

    primeImageFallbacks();
  }

  function sectionMarkup(id, number, title, content, className = "") {
    if (!content) return "";
    return `
      <section class="detail-section ${className}" id="${escapeHtml(id)}" data-detail-section>
        <div class="detail-section__heading">
          <span>${escapeHtml(number)}</span>
          <h3>${escapeHtml(title)}</h3>
        </div>
        ${content}
      </section>
    `;
  }

  function mediaGridMarkup(images, alt, ratio = "ratio-4-5", button = true) {
    if (!images?.length) return "";
    return `
      <div class="${button ? "detail-gallery" : "process-grid"}">
        ${images
          .map((src, index) => {
            const media = `
              <span class="media-frame ${ratio}">
                ${imageMarkup(src, `${alt} ${index + 1}`, "lazy")}
              </span>
            `;
            return button
              ? `<button type="button" class="gallery-button" data-lightbox-src="${escapeHtml(src)}" data-lightbox-alt="${escapeHtml(alt)}">${media}</button>`
              : media;
          })
          .join("")}
      </div>
    `;
  }

  function dramaVideoMarkup(drama) {
    if (!drama.video) {
      return drama.cover
        ? `<div class="detail-cover-video"><span class="media-frame ratio-16-9">${imageMarkup(drama.cover, drama.title, "eager")}</span></div>`
        : "";
    }
    return `
      <div class="detail-video">
        <video controls preload="metadata" poster="${escapeHtml(drama.cover || "")}" playsinline>
          <source src="${escapeHtml(drama.video)}" type="video/mp4">
        </video>
      </div>
    `;
  }

  function dramaAssetGalleryMarkup(gallery, title) {
    if (!gallery) return "";

    const isCategoryRows = gallery.layout === "category-rows";
    const rows = isCategoryRows
      ? (gallery.groups || []).map((group) => ({
          ...group,
          imageOffset: 0,
          images: group.images || []
        }))
      : [
          { label: "人物", images: gallery.characters || [] },
          { label: "环境", images: gallery.environments || [] }
        ].flatMap((group) =>
          Array.from({ length: 2 }, (_, rowIndex) => ({
            ...group,
            imageOffset: rowIndex * 3,
            images: group.images.slice(rowIndex * 3, rowIndex * 3 + 3)
          }))
        );
    const lightboxGroup = gallery.lightboxGroup || "boxer-assets";

    return `
      <div class="drama-asset-grid${isCategoryRows ? " drama-asset-grid--category-rows" : ""}">
        ${rows
          .map(
            (row) => `
              <div class="drama-asset-row">
                ${Array.from({ length: 3 }, (_, columnIndex) => {
                  const image = row.images[columnIndex];
                  const src = typeof image === "string" ? image : image?.src;
                  if (!src) return `<span class="drama-asset-slot" aria-hidden="true"></span>`;
                  const imageName = typeof image === "string" ? "" : image?.name;
                  const imageAspect = Number(image?.aspect) > 0 ? Number(image.aspect) : 1;
                  const alt = `${title} ${row.label}资产 ${imageName || row.imageOffset + columnIndex + 1}`;
                  return `
                    <button
                      type="button"
                      class="drama-asset-card${isCategoryRows ? " drama-asset-card--proportional" : ""}"
                      ${isCategoryRows ? `style="--asset-aspect: ${imageAspect}"` : ""}
                      data-lightbox-src="${escapeHtml(src)}"
                      data-lightbox-alt="${escapeHtml(alt)}"
                      data-lightbox-group="${escapeHtml(lightboxGroup)}"
                      aria-label="查看${escapeHtml(alt)}"
                    >
                      ${imageMarkup(src, alt)}
                    </button>
                  `;
                }).join("")}
              </div>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderDrama(index, preserveScroll = false) {
    const drama = works.dramas[index];
    if (!drama) return;
    const sections = [];
    sections.push({
      id: "detail-video",
      number: "01",
      title: "视频",
      content: dramaVideoMarkup(drama)
    });
    if (drama.assetGallery) {
      sections.push({
        id: "detail-assets",
        number: "02",
        title: "资产图",
        content: dramaAssetGalleryMarkup(drama.assetGallery, drama.title),
        className: `detail-section--assets ${drama.assetGallery.sectionClassName || ""}`.trim()
      });
    } else if (drama.stills?.length) {
      sections.push({
        id: "detail-stills",
        number: "02",
        title: "剧照",
        content: `<div class="still-grid">${drama.stills
          .map(
            (src, stillIndex) =>
              `<button type="button" class="gallery-button" data-lightbox-src="${escapeHtml(src)}" data-lightbox-alt="${escapeHtml(drama.title)} ${stillIndex + 1}"><span class="media-frame">${imageMarkup(src, `${drama.title} 剧照 ${stillIndex + 1}`)}</span></button>`
          )
          .join("")}</div>`
      });
    }
    if (drama.process?.length) {
      sections.push({
        id: "detail-process",
        number: "03",
        title: "制作过程",
        content: mediaGridMarkup(drama.process, `${drama.title} 制作过程`, "ratio-4-3", false)
      });
    }
    if (drama.workflow?.length) {
      sections.push({
        id: "detail-workflow",
        number: drama.assetGallery ? "03" : "04",
        title: "工作流",
        content: `<div class="workflow-gallery">${drama.workflow
          .map(
            (src, workflowIndex) =>
              `<button type="button" class="gallery-button" data-lightbox-src="${escapeHtml(src)}" data-lightbox-alt="${escapeHtml(drama.title)} 工作流 ${workflowIndex + 1}"><span class="media-frame">${imageMarkup(src, `${drama.title} 工作流 ${workflowIndex + 1}`)}</span></button>`
          )
          .join("")}</div>`
      });
    }
    if (drama.assets?.length) {
      sections.push({
        id: "detail-assets",
        number: "05",
        title: "资产图",
        content: `<div class="asset-masonry">${drama.assets
          .map(
            (src, assetIndex) =>
              `<button type="button" data-lightbox-src="${escapeHtml(src)}" data-lightbox-alt="${escapeHtml(drama.title)} 资产 ${assetIndex + 1}">${imageMarkup(src, `${drama.title} 资产 ${assetIndex + 1}`)}</button>`
          )
          .join("")}</div>`
      });
    }

    const visibleSections = sections.filter((section) => Boolean(section.content));
    detailBreadcrumb.innerHTML = `<span>SONGAOGE</span> / <span>AI短剧</span> / <strong>${escapeHtml(drama.title)}</strong>`;
    detailContent.innerHTML = `
      <h1 class="detail-title" id="detail-title">${escapeHtml(drama.title)}</h1>
      ${visibleSections.map((section) => sectionMarkup(section.id, section.number, section.title, section.content, section.className)).join("")}
    `;
    detailToc.innerHTML = visibleSections
      .map((section) => `<a href="#${escapeHtml(section.id)}">${escapeHtml(section.number)} ${escapeHtml(section.title)}</a>`)
      .join("");
    detailPagination.innerHTML = `
      <button type="button" data-drama-step="-1">
        <small>PREVIOUS</small>
        <strong>← ${escapeHtml(works.dramas[(index - 1 + works.dramas.length) % works.dramas.length].title)}</strong>
      </button>
      <button type="button" data-drama-step="1">
        <small>NEXT</small>
        <strong>${escapeHtml(works.dramas[(index + 1) % works.dramas.length].title)} →</strong>
      </button>
    `;
    detailPagination.dataset.dramaIndex = String(index);
    detailContent.dataset.kind = "drama";
    detailContent.dataset.dramaIndex = String(index);
    primeImageFallbacks(detailContent);
    bindVideoFallbacks(detailContent, drama);
    if (!preserveScroll) detailPanel.scrollTop = 0;
  }

  function bindVideoFallbacks(container, drama) {
    container.querySelectorAll("video").forEach((video) => {
      video.addEventListener(
        "error",
        () => {
          const wrapper = video.closest(".detail-video");
          if (!wrapper || !drama.cover) return;
          wrapper.outerHTML = `<div class="detail-cover-video"><span class="media-frame ratio-16-9">${imageMarkup(drama.cover, drama.title, "eager")}</span></div>`;
          primeImageFallbacks(container);
        },
        { once: true }
      );
    });
  }

  function ipDetailGridMarkup(images, alt, columns = 1) {
    if (!images?.length) return "";
    const gridColumns = Math.min(3, Math.max(1, Number(columns) || 1));
    return `
      <div class="ip-detail-grid" style="--ip-detail-columns: ${gridColumns}">
        ${images
          .map(
            (src, index) => `
              <button type="button" class="ip-detail-media" data-lightbox-src="${escapeHtml(src)}" data-lightbox-alt="${escapeHtml(alt)} ${index + 1}">
                ${imageMarkup(src, `${alt} ${index + 1}`, "lazy")}
              </button>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderIp(index, preserveScroll = false) {
    const items = getIpItems();
    const item = items[index];
    if (!item) return;

    const sections = (item.detailSections || []).map((section, sectionIndex) => ({
      id: `ip-detail-${sectionIndex + 1}`,
      number: String(sectionIndex + 1).padStart(2, "0"),
      title: section.title,
      content: ipDetailGridMarkup(
        section.images,
        `${item.title} ${section.title}`,
        section.columns
      )
    }));

    const visibleSections = sections.filter((section) => Boolean(section.content));
    detailBreadcrumb.innerHTML = `<span>SONGAOGE</span> / <span>AI设计图</span> / <span>IP设计</span> / <strong>${escapeHtml(item.title)}</strong>`;
    detailToc.innerHTML = visibleSections
      .map((section) => `<a href="#${escapeHtml(section.id)}">${escapeHtml(section.number)} ${escapeHtml(section.title)}</a>`)
      .join("");
    detailContent.dataset.kind = "ip";
    detailContent.innerHTML = `
      <h1 class="detail-title" id="detail-title">${escapeHtml(item.title)}<em>${escapeHtml(item.meta)}</em></h1>
      <section class="detail-section">
        <div class="ip-detail-hero">
          ${imageMarkup(item.hero || item.banner || item.cover, `${item.title} ${item.meta} 主视觉`, "eager")}
        </div>
        ${item.theme || item.concept
          ? `<div class="ip-detail-intro">
              ${item.theme ? `<p class="ip-detail-theme">设计主题：${escapeHtml(item.theme)}</p>` : ""}
              ${item.concept ? `<p class="ip-detail-concept">${escapeHtml(item.concept)}</p>` : ""}
            </div>`
          : ""}
      </section>
      ${visibleSections.map((section) => sectionMarkup(section.id, section.number, section.title, section.content)).join("")}
    `;
    detailPagination.innerHTML = `
      <button type="button" data-ip-step="-1">
        <small>PREVIOUS</small>
        <strong>← ${escapeHtml(items[(index - 1 + items.length) % items.length].title)}</strong>
      </button>
      <button type="button" data-ip-step="1">
        <small>NEXT</small>
        <strong>${escapeHtml(items[(index + 1) % items.length].title)} →</strong>
      </button>
    `;
    detailPagination.dataset.ipIndex = String(index);
    delete detailPagination.dataset.dramaIndex;
    if (!preserveScroll) detailPanel.scrollTop = 0;
    primeImageFallbacks(detailContent);
  }

  function renderEcommerce(item) {
    detailBreadcrumb.innerHTML = `<span>SONGAOGE</span> / <span>AI设计图</span> / <span>电商套图</span> / <strong>${escapeHtml(item.title)}</strong>`;
    detailToc.innerHTML = "";
    detailPagination.innerHTML = "";
    detailContent.dataset.kind = "ecommerce";
    detailContent.innerHTML = `
      <h1 class="detail-title" id="detail-title">${escapeHtml(item.title)}<em>${escapeHtml(item.meta)}</em></h1>
      <section class="detail-section">
        <div class="carousel" data-carousel>
          <div class="carousel__stage">
            <img alt="${escapeHtml(item.title)} 1" loading="eager" decoding="async">
            <span class="carousel__count">1 / ${item.images.length}</span>
            <button class="carousel__arrow carousel__arrow--prev" type="button" aria-label="上一张">←</button>
            <button class="carousel__arrow carousel__arrow--next" type="button" aria-label="下一张">→</button>
          </div>
          <div class="carousel__thumbs">
            ${item.images
              .map(
                (src, index) =>
                  `<button class="carousel__thumb${index === 0 ? " is-active" : ""}" type="button" data-index="${index}" aria-label="查看第 ${index + 1} 张">${imageMarkup(src, `${item.title} ${index + 1}`)}</button>`
              )
              .join("")}
          </div>
        </div>
        ${item.detail ? `<div class="long-detail"><img src="${escapeHtml(item.detail)}" alt="${escapeHtml(item.title)} 详情" loading="lazy" decoding="async"></div>` : ""}
      </section>
    `;
    detailPanel.scrollTop = 0;
    primeImageFallbacks(detailContent);
    setupCarousel(item);
  }

  function setupCarousel(item) {
    const carousel = detailContent.querySelector("[data-carousel]");
    if (!carousel) return;
    const stageImage = carousel.querySelector(".carousel__stage img");
    const count = carousel.querySelector(".carousel__count");
    const thumbs = Array.from(carousel.querySelectorAll(".carousel__thumb"));
    let index = 0;

    function show(nextIndex) {
      if (!item.images.length) return;
      index = (nextIndex + item.images.length) % item.images.length;
      stageImage.src = item.images[index];
      stageImage.alt = `${item.title} ${index + 1}`;
      count.textContent = `${index + 1} / ${item.images.length}`;
      thumbs.forEach((thumb, thumbIndex) => thumb.classList.toggle("is-active", thumbIndex === index));
      const active = thumbs[index];
      if (active) active.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "nearest", inline: "center" });
    }

    carousel.querySelector(".carousel__arrow--prev").addEventListener("click", () => show(index - 1));
    carousel.querySelector(".carousel__arrow--next").addEventListener("click", () => show(index + 1));
    thumbs.forEach((thumb) => thumb.addEventListener("click", () => show(Number(thumb.dataset.index))));
    show(0);
  }

  function renderWorkflow(item) {
    detailBreadcrumb.innerHTML = `<span>SONGAOGE</span> / <span>AI设计图</span> / <span>工作流搭建</span> / <strong>${escapeHtml(item.title)}</strong>`;
    detailToc.innerHTML = "";
    detailPagination.innerHTML = "";
    detailContent.dataset.kind = "workflow";
    detailContent.innerHTML = `
      <h1 class="detail-title" id="detail-title">${escapeHtml(item.title)}</h1>
      <section class="detail-section">
        <div class="workflow-gallery workflow-gallery--single">
          ${item.images
            .map(
              (src, index) =>
                `<button type="button" class="gallery-button" data-lightbox-src="${escapeHtml(src)}" data-lightbox-alt="${escapeHtml(item.title)} ${index + 1}"><span class="media-frame">${imageMarkup(src, `${item.title} ${index + 1}`)}</span></button>`
            )
            .join("")}
        </div>
      </section>
    `;
    detailPanel.scrollTop = 0;
    primeImageFallbacks(detailContent);
  }

  function videoSectionMarkup(src, title, index) {
    if (!src) return "";
    return `
      <section class="detail-section">
        <div class="detail-section__heading"><span>${String(index).padStart(2, "0")}</span><h3>视频 ${index}</h3></div>
        <div class="detail-video">
          <video controls preload="metadata" playsinline>
            <source src="${escapeHtml(src)}" type="video/mp4">
          </video>
        </div>
      </section>
    `;
  }

  function renderVideoDetail(item, categoryOverride = "") {
    const category = categoryOverride || (item.id === "apl" ? "创意视频" : "创意游戏 CG");
    detailBreadcrumb.innerHTML = `<span>SONGAOGE</span> / <span>AI设计图</span> / <span>${category}</span> / <strong>${escapeHtml(item.title)}</strong>`;
    detailToc.innerHTML = "";
    detailPagination.innerHTML = "";
    detailContent.dataset.kind = "video";
    const videos = item.videos || [];
    detailContent.innerHTML = `
      <h1 class="detail-title" id="detail-title">${escapeHtml(item.title)}${item.meta ? `<em>${escapeHtml(item.meta)}</em>` : ""}</h1>
      ${videos.length
        ? videos.map((src, index) => videoSectionMarkup(src, item.title, index + 1)).join("")
        : `<section class="detail-section"><div class="detail-cover-video"><span class="media-frame ratio-16-9">${imageMarkup(item.cover, item.title, "eager")}</span></div></section>`}
    `;
    detailPanel.scrollTop = 0;
    primeImageFallbacks(detailContent);
    detailContent.querySelectorAll("video").forEach((video) => {
      video.addEventListener(
        "error",
        () => {
          if (!item.cover) return;
          video.closest(".detail-video").outerHTML = `<div class="detail-cover-video"><span class="media-frame ratio-16-9">${imageMarkup(item.cover, item.title, "eager")}</span></div>`;
          primeImageFallbacks(detailContent);
        },
        { once: true }
      );
    });
  }

  function openDetail(trigger) {
    if (!detailState.open) {
      detailState.scrollY = window.scrollY;
      detailState.trigger = trigger;
    }
    detailState.open = true;
    body.classList.add("detail-open");
    detailLayer.classList.add("is-open");
    detailLayer.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => detailClose.focus({ preventScroll: true }));
  }

  function closeDetail() {
    if (!detailState.open) return;
    closeLightbox();
    detailContent.querySelectorAll("video").forEach((video) => video.pause());
    detailLayer.classList.remove("is-open");
    detailLayer.setAttribute("aria-hidden", "true");
    body.classList.remove("detail-open");
    body.classList.remove("lightbox-open");
    detailState.open = false;
    window.scrollTo(0, detailState.scrollY);
    detailState.trigger?.focus({ preventScroll: true });
  }

  function openDramaByIndex(index) {
    const trigger = document.activeElement;
    renderDrama(index);
    openDetail(trigger);
  }

  function setLightboxItem(items, index) {
    lightboxState.items = items;
    lightboxState.index = index;
    const item = items[index];
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt || "";
    const canBrowse = items.length > 1;
    lightboxPrev.hidden = !canBrowse;
    lightboxNext.hidden = !canBrowse;
  }

  function openLightbox(src, alt, group = "") {
    if (!src) return;
    lightboxState.trigger = document.activeElement;
    const items = group
      ? Array.from(detailContent.querySelectorAll("[data-lightbox-src][data-lightbox-group]"))
          .filter((button) => button.dataset.lightboxGroup === group)
          .map((button) => ({
            src: button.dataset.lightboxSrc,
            alt: button.dataset.lightboxAlt
          }))
      : [];
    const currentIndex = items.findIndex((item) => item.src === src);
    setLightboxItem(
      currentIndex >= 0 ? items : [{ src, alt }],
      currentIndex >= 0 ? currentIndex : 0
    );
    body.classList.add("lightbox-open");
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    lightboxClose.focus({ preventScroll: true });
  }

  function stepLightbox(step) {
    if (lightboxState.items.length < 2) return;
    const nextIndex =
      (lightboxState.index + step + lightboxState.items.length) % lightboxState.items.length;
    setLightboxItem(lightboxState.items, nextIndex);
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.removeAttribute("src");
    lightboxPrev.hidden = true;
    lightboxNext.hidden = true;
    lightboxState.items = [];
    lightboxState.index = 0;
    if (!detailState.open) body.classList.remove("lightbox-open");
  }

  dramaList.addEventListener("click", (event) => {
    const card = event.target.closest("[data-drama-index]");
    if (card) openDramaByIndex(Number(card.dataset.dramaIndex));
  });

  ipShowcase?.addEventListener("click", (event) => {
    const card = event.target.closest("[data-ip-index]");
    if (!card) return;
    renderIp(Number(card.dataset.ipIndex));
    openDetail(card);
  });

  designIndex.addEventListener("click", (event) => {
    const card = event.target.closest("[data-scroll-design]");
    if (!card) return;
    document.getElementById(`design-section-${card.dataset.scrollDesign}`)?.scrollIntoView({
      behavior: reduceMotion.matches ? "auto" : "smooth",
      block: "start"
    });
  });

  designGroups.addEventListener("click", (event) => {
    const card = event.target.closest("[data-design-section]");
    if (!card) return;
    const section = works.designSections[Number(card.dataset.designSection)];
    const item = section?.items[Number(card.dataset.designItem)];
    if (!section || !item) return;
    const trigger = card;
    if (section.layout === "creative") {
      openLightbox(item.cover, item.title);
      return;
    }
    if (section.layout === "ip") renderIp(Number(card.dataset.designItem));
    if (section.layout === "ecommerce") renderEcommerce(item);
    if (section.layout === "workflow") renderWorkflow(item);
    if (section.layout === "game" || section.layout === "video") renderVideoDetail(item);
    openDetail(trigger);
  });

  detailContent.addEventListener("click", (event) => {
    const galleryButton = event.target.closest("[data-lightbox-src]");
    if (galleryButton) {
      openLightbox(
        galleryButton.dataset.lightboxSrc,
        galleryButton.dataset.lightboxAlt,
        galleryButton.dataset.lightboxGroup
      );
      return;
    }
    const tocLink = event.target.closest(".detail-toc a");
    if (tocLink) {
      event.preventDefault();
      document.querySelector(tocLink.getAttribute("href"))?.scrollIntoView({
        behavior: reduceMotion.matches ? "auto" : "smooth",
        block: "start"
      });
    }
  });

  detailToc.addEventListener("click", (event) => {
    const tocLink = event.target.closest("a");
    if (!tocLink) return;
    event.preventDefault();
    document.querySelector(tocLink.getAttribute("href"))?.scrollIntoView({
      behavior: reduceMotion.matches ? "auto" : "smooth",
      block: "start"
    });
  });

  detailPagination.addEventListener("click", (event) => {
    const ipButton = event.target.closest("[data-ip-step]");
    if (ipButton) {
      const current = Number(detailPagination.dataset.ipIndex);
      const step = Number(ipButton.dataset.ipStep);
      const items = getIpItems();
      renderIp((current + step + items.length) % items.length);
      return;
    }
    const button = event.target.closest("[data-drama-step]");
    if (!button) return;
    const current = Number(detailPagination.dataset.dramaIndex);
    const step = Number(button.dataset.dramaStep);
    renderDrama((current + step + works.dramas.length) % works.dramas.length);
  });

  detailClose.addEventListener("click", closeDetail);
  detailBack.addEventListener("click", closeDetail);
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => stepLightbox(-1));
  lightboxNext.addEventListener("click", () => stepLightbox(1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (
      lightbox.classList.contains("is-open") &&
      lightboxState.items.length > 1 &&
      (event.key === "ArrowLeft" || event.key === "ArrowRight")
    ) {
      event.preventDefault();
      stepLightbox(event.key === "ArrowLeft" ? -1 : 1);
      return;
    }
    if (event.key !== "Escape") return;
    if (lightbox.classList.contains("is-open")) {
      closeLightbox();
    } else if (detailState.open) {
      closeDetail();
    } else if (mobileMenu?.classList.contains("is-open")) {
      setMobileMenuOpen(false);
      menuToggle?.focus();
    } else if (worksMenu?.classList.contains("is-open")) {
      setWorksMenuOpen(false);
      worksMenuTrigger?.focus();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || !detailState.open || lightbox.classList.contains("is-open")) return;
    const focusable = Array.from(
      detailLayer.querySelectorAll("button:not([disabled]), a[href], video[controls], [tabindex]:not([tabindex='-1'])")
    ).filter((element) => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const navLinks = Array.from(document.querySelectorAll(".category-nav a"));
  const navSections = navLinks
    .map((link) => document.getElementById(link.dataset.section))
    .filter(Boolean);
  let navUpdateFrame = 0;

  function updateActiveCategory() {
    const marker = Math.min(190, window.innerHeight * 0.28);
    let activeSection = navSections[0];

    navSections.forEach((section) => {
      if (section.getBoundingClientRect().top <= marker) activeSection = section;
    });

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.section === activeSection?.id);
    });
    navUpdateFrame = 0;
  }

  function requestCategoryUpdate() {
    if (navUpdateFrame) return;
    navUpdateFrame = window.requestAnimationFrame(updateActiveCategory);
  }

  window.addEventListener("scroll", requestCategoryUpdate, { passive: true });
  window.addEventListener("resize", requestCategoryUpdate);
  updateActiveCategory();

  setupHeader();
  renderHome();
  primeImageFallbacks();

})();
