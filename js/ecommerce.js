(() => {
  "use strict";

  const root = "./assets/works/design/ecommerce";
  const cards = Array.from(document.querySelectorAll("[data-ecommerce-index]"));
  const detail = document.getElementById("ecommerce-detail");
  const backButton = detail?.querySelector(".ecommerce-detail__back");
  const breadcrumb = document.getElementById("ecommerce-detail-breadcrumb");
  const hero = document.getElementById("ecommerce-detail-hero");
  const title = document.getElementById("ecommerce-detail-title");
  const subtitle = document.getElementById("ecommerce-detail-subtitle");
  const conceptSection = document.getElementById("ecommerce-detail-concept");
  const conceptText = conceptSection?.querySelector("p");
  const carouselImage = document.getElementById("ecommerce-carousel-image");
  const carouselCategory = document.getElementById("ecommerce-carousel-category");
  const carouselCount = document.getElementById("ecommerce-carousel-count");
  const carouselCaption = document.getElementById("ecommerce-carousel-caption");
  const carouselThumbs = document.getElementById("ecommerce-carousel-thumbs");
  const previousButton = detail?.querySelector(".ecommerce-carousel__arrow--prev");
  const nextButton = detail?.querySelector(".ecommerce-carousel__arrow--next");
  const summary = document.getElementById("ecommerce-detail-summary");

  if (!cards.length || !detail) return;

  const imageRange = (brand, count, category, extension = "jpg") =>
    Array.from({ length: count }, (_, index) => ({
      src: `${root}/${brand}/image-${String(index + 1).padStart(2, "0")}.${extension}`,
      category
    }));

  const sets = [
    {
      brand: "TOM FORD",
      subtitle: "烟草香草 Tobacco Vanille",
      banner: `${root}/tom-ford/banner.jpg`,
      concept: "",
      images: [
        { src: `${root}/tom-ford/main.jpg`, category: "电商主图" },
        ...imageRange("tom-ford", 8, "产品详情页"),
        { src: `${root}/tom-ford/image-09.jpg`, category: "活动海报" },
        { src: `${root}/tom-ford/image-10.jpg`, category: "Banner" },
        { src: `${root}/tom-ford/detail-long.jpg`, category: "产品详情页" }
      ]
    },
    {
      brand: "GPW5",
      subtitle: "雪豹 · 重磅新品",
      banner: `${root}/gpw5/banner.jpg`,
      concept: "",
      images: [
        { src: `${root}/gpw5/main.jpg`, category: "电商主图" },
        ...imageRange("gpw5", 8, "产品详情页"),
        { src: `${root}/gpw5/image-09.jpg`, category: "活动海报" },
        { src: `${root}/gpw5/image-10.jpg`, category: "Banner" },
        { src: `${root}/gpw5/detail-long.jpg`, category: "产品详情页" }
      ]
    },
    {
      brand: "劳力士 ROLEX",
      subtitle: "SUBMARINER DATE",
      banner: `${root}/rolex/banner.jpg`,
      concept: "",
      images: [
        { src: `${root}/rolex/第一张.png`, category: "产品详情页" },
        { src: `${root}/rolex/第二张.png`, category: "产品详情页" },
        { src: `${root}/rolex/第三张.png`, category: "产品详情页" },
        { src: `${root}/rolex/第四张.png`, category: "产品详情页" },
        { src: `${root}/rolex/第五张.png`, category: "产品详情页" },
        { src: `${root}/rolex/第六张.png`, category: "产品详情页" },
        { src: `${root}/rolex/第七张.png`, category: "产品详情页" },
        { src: `${root}/rolex/主图背视图.png`, category: "电商主图" },
        { src: `${root}/rolex/主图侧视图.png`, category: "电商主图" },
        { src: `${root}/rolex/主图尺寸图.png`, category: "电商主图" },
        { src: `${root}/rolex/主图礼盒.png`, category: "电商主图" },
        { src: `${root}/rolex/主图佩戴图.png`, category: "电商主图" },
        { src: `${root}/rolex/主图正视图.png`, category: "电商主图" },
        { src: `${root}/rolex/详情页.png`, category: "产品详情页" }
      ]
    }
  ];

  const state = {
    open: false,
    activeSet: 0,
    activeImage: 0,
    scrollY: 0,
    trigger: null
  };

  function renderCarousel(index) {
    const set = sets[state.activeSet];
    const count = set.images.length;
    state.activeImage = (index + count) % count;
    const image = set.images[state.activeImage];

    carouselImage.src = image.src;
    carouselImage.alt = `${set.brand} ${image.category || ""} ${state.activeImage + 1}`;
    carouselCategory.textContent = image.category || "";
    carouselCategory.hidden = !image.category;
    carouselCount.textContent = `${state.activeImage + 1} / ${count}`;
    carouselCaption.textContent = image.caption || "";

    carouselThumbs.querySelectorAll(".ecommerce-carousel__thumb").forEach((thumb, thumbIndex) => {
      const active = thumbIndex === state.activeImage;
      thumb.classList.toggle("is-active", active);
      thumb.setAttribute("aria-current", active ? "true" : "false");
    });

    const activeThumb = carouselThumbs.querySelector(".is-active");
    if (activeThumb) {
      carouselThumbs.scrollTo({
        left: Math.max(0, activeThumb.offsetLeft - (carouselThumbs.clientWidth - activeThumb.offsetWidth) / 2),
        behavior: "smooth"
      });
    }
  }

  function renderSummary(images) {
    const counts = new Map();
    images.forEach((image) => {
      if (!image.category) return;
      counts.set(image.category, (counts.get(image.category) || 0) + 1);
    });

    summary.innerHTML = Array.from(counts, ([category, count]) => (
      `<li>${category}<span>${count} 张</span></li>`
    )).join("");
  }

  function renderSet(index, trigger) {
    const set = sets[index];
    if (!set) return;

    state.activeSet = index;
    state.activeImage = 0;
    state.trigger = trigger;
    breadcrumb.textContent = `SONGAOGE / 电商套图 / ${set.brand}`;
    hero.src = set.banner;
    hero.alt = `${set.brand} ${set.subtitle}`;
    title.textContent = set.brand;
    subtitle.textContent = set.subtitle;

    const hasConcept = Boolean(set.concept?.trim());
    conceptSection.hidden = !hasConcept;
    conceptText.textContent = hasConcept ? set.concept : "";

    carouselThumbs.innerHTML = set.images
      .map((image, imageIndex) => `
        <button class="ecommerce-carousel__thumb" type="button" data-ecommerce-image="${imageIndex}" aria-label="查看第 ${imageIndex + 1} 张：${image.category || set.brand}">
          <img src="${image.src}" alt="" loading="lazy" decoding="async">
        </button>
      `)
      .join("");

    renderCarousel(0);
    renderSummary(set.images);
  }

  function openDetail(index, trigger) {
    renderSet(index, trigger);
    state.open = true;
    state.scrollY = window.scrollY;
    document.body.classList.add("ecommerce-detail-open");
    detail.classList.add("is-open");
    detail.setAttribute("aria-hidden", "false");
    detail.querySelector(".ecommerce-detail__panel").scrollTop = 0;
    requestAnimationFrame(() => backButton.focus({ preventScroll: true }));
  }

  function closeDetail() {
    if (!state.open) return;
    state.open = false;
    detail.classList.remove("is-open");
    detail.setAttribute("aria-hidden", "true");
    document.body.classList.remove("ecommerce-detail-open");
    window.scrollTo(0, state.scrollY);
    state.trigger?.focus({ preventScroll: true });
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      openDetail(Number(card.dataset.ecommerceIndex), card);
    });
  });

  backButton.addEventListener("click", closeDetail);
  previousButton.addEventListener("click", () => renderCarousel(state.activeImage - 1));
  nextButton.addEventListener("click", () => renderCarousel(state.activeImage + 1));

  carouselThumbs.addEventListener("click", (event) => {
    const thumb = event.target.closest("[data-ecommerce-image]");
    if (thumb) renderCarousel(Number(thumb.dataset.ecommerceImage));
  });

  document.addEventListener("keydown", (event) => {
    if (!state.open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeDetail();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      renderCarousel(state.activeImage - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      renderCarousel(state.activeImage + 1);
    }
  });
})();
