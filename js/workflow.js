(() => {
  "use strict";

  const cards = Array.from(document.querySelectorAll("[data-workflow-index]"));
  const detail = document.getElementById("workflow-detail");
  if (!cards.length || !detail) return;

  const backButton = detail.querySelector(".workflow-detail__back");
  const breadcrumb = document.getElementById("workflow-detail-breadcrumb");
  const title = document.getElementById("workflow-detail-title");
  const subtitle = document.getElementById("workflow-detail-subtitle");
  const gallery = document.getElementById("workflow-detail-gallery");
  const process = document.getElementById("workflow-detail-process");

  const assetRoot = "./assets/works/design/workflow";
  const sortedAssets = (folder, files) => files
    .slice()
    .sort((left, right) => left.localeCompare(right, "zh-CN", { numeric: true }))
    .map((file) => `${assetRoot}/${folder}/${file}`);

  const works = [
    {
      title: "室内设计风格转换",
      subtitle: "室内风格转换工作流 · ComfyUI",
      images: sortedAssets("interior-style", [
        "display-01-workflow.jpg",
        "display-02-input.jpg",
        "display-03-result-01.jpg",
        "display-04-result-02.jpg",
        "display-05-result-final.png"
      ]),
      process: [
        {
          label: "总述：",
          text: "这条工作流解决的是一个老问题：AI 装修图要么户型飘了，要么风格不像参考。做法是把\"结构\"和\"风格\"从源头拆成两条路——结构交给 ControlNet 锁死，风格交给视觉模型注入，最后两轮采样分工：一轮管准，一轮管美。"
        },
        {
          label: "01 双图输入与尺寸标准化：",
          text: "输入两张图：一张毛坯房照片定结构，一张风格参考图定调性，两条路从源头分开、互不干扰。毛坯图先统一到最长边 1024，并按原图比例生成 Latent——先把尺寸和比例规范好，后面所有环节才不会出现拉伸和透视变形。"
        },
        {
          label: "02 ControlNet 结构锁定（双路 ControlNet）：",
          text: "毛坯图走两路预处理：DepthAnything 提取深度图锁空间纵深，M-LSD 提取直线锁门窗、墙体这些硬线条。注入权重分开给：深度 0.60、直线 0.40——锁得住户型，又不让线稿把家具生成绑得太死，布局留出呼吸感。"
        },
        {
          label: "03 风格注入（文字 + 视觉双路）：",
          text: "风格不靠一句提示词猜。Florence-2 先把参考图反推成详细文字描述，走文本编码器；同时 SigCLIP 视觉编码配合 FLUX Redux，直接提取参考图的材质、配色和氛围特征。文字一路、视觉一路，在条件端汇合，风格还原比单路准得多。"
        },
        {
          label: "04 布局生成（SD1.5 首轮采样）：",
          text: "在 ControlNet 的约束下用 SD1.5 完成第一轮采样，只解决一件事：准。家具布局、摆位、空间关系先定死，经 VAE 解码输出第一版装修稿——这一版不追求质感，布局对了，后面才有得修。"
        },
        {
          label: "05 质感精修（FLUX 二轮重绘）：",
          text: "第一版图重新编码回 Latent，送进 FLUX 建筑室内大模型重绘：材质、光影、软装细节全部在这一轮拉满。引导值 3.5——足够听话，不大改布局；随机种子全程固定，每次出图可复现、可对比调参，最后解码输出成图。"
        },
        {
          label: "流程总览：",
          text: "双图输入 → 尺寸标准化 → ControlNet 结构锁定 → 双路风格注入 → SD1.5 布局生成 → FLUX 质感精修 → 成图输出。"
        }
      ]
    },
    {
      title: "换装工作流",
      subtitle: "一键换装工作流 · FLUX.2",
      images: sortedAssets("outfit-swap", [
        "display-01-workflow.jpg",
        "display-02-person-original.jpg",
        "display-03-clothing-item.jpg",
        "display-04-person-result.png"
      ]),
      process: [
        {
          label: "总述：",
          text: "这条工作流只做一件事：给照片里的人换一身衣服，人一点不变。没有遮罩、不写提示词，靠双参考注入让模型自己\"看着办\"——人物图定身份和姿势，服装图定版型和纹样，4 步采样出图，快得像一次刷新。"
        },
        {
          label: "01 双图输入：",
          text: "两张图分工明确：人物图定身份、脸、姿势和构图；服装图定版型、纹样和材质。换什么、给谁换，从输入端就分清楚，后面不靠提示词补救。"
        },
        {
          label: "02 等比缩放：",
          text: "双图统一到最长边 1536，全程保持原比例。尺寸对齐是为了让两张图的特征在同一尺度上汇合；不拉伸、不裁切，人物比例和服装版型都不会走样。"
        },
        {
          label: "03 双参考注入：",
          text: "两张图分别经 VAE 编码成 Latent，再用 ReferenceLatent 串联叠加进条件端——无遮罩、无提示词。模型同时\"看着\"人和衣服自己完成贴合：领口、袖长、下摆的垂感都由服装图说了算。"
        },
        {
          label: "04 快速采样：",
          text: "主干是 FLUX.2 Klein 9B，Euler 采样器只跑 4 步就出图。步数少不是偷工，是这条链路的参考注入足够强——信息给足了，模型不需要反复猜，速度就是生产力。"
        },
        {
          label: "05 解码输出：",
          text: "VAE 解码成图。验收标准只有一条：人物不变、只换服装——脸、发型、姿势、背景全部保持原样，变的只有身上那套衣服。"
        },
        {
          label: "流程总览：",
          text: "双图输入 → 等比缩放 → VAE 编码 → 双参考注入 → 4 步采样 → VAE 解码 → 成图输出。"
        }
      ]
    }
  ];

  const state = {
    open: false,
    scrollY: 0,
    trigger: null
  };

  function renderImages(work) {
    gallery.innerHTML = work.images
      .map((src, index) => `
        <figure>
          <img src="${src}" alt="${work.title} 效果图 ${index + 1}" loading="lazy" decoding="async">
        </figure>
      `)
      .join("");
  }

  function renderProcess(blocks) {
    process.innerHTML = blocks.map((block) => `
      <div class="workflow-process-block">
        <h3>${block.label}</h3>
        <p>${block.text}</p>
      </div>
    `).join("");
  }

  function renderWork(index, trigger) {
    const work = works[index];
    if (!work) return;

    state.trigger = trigger;
    breadcrumb.textContent = `SONGAOGE / AI设计图 / 工作流 / ${work.title}`;
    title.textContent = work.title;
    subtitle.textContent = work.subtitle;
    renderImages(work);
    renderProcess(work.process);
  }

  function openDetail(index, trigger) {
    renderWork(index, trigger);
    state.open = true;
    state.scrollY = window.scrollY;
    document.body.classList.add("workflow-detail-open");
    detail.classList.add("is-open");
    detail.setAttribute("aria-hidden", "false");
    detail.querySelector(".workflow-detail__panel").scrollTop = 0;
    requestAnimationFrame(() => backButton.focus({ preventScroll: true }));
  }

  function closeDetail() {
    if (!state.open) return;
    state.open = false;
    detail.classList.remove("is-open");
    detail.setAttribute("aria-hidden", "true");
    document.body.classList.remove("workflow-detail-open");
    window.scrollTo(0, state.scrollY);
    state.trigger?.focus({ preventScroll: true });
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      openDetail(Number(card.dataset.workflowIndex), card);
    });
  });

  backButton.addEventListener("click", closeDetail);

  document.addEventListener("keydown", (event) => {
    if (!state.open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeDetail();
    }
  });
})();
