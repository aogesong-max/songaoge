(() => {
  "use strict";

  const range = (directory, prefix, count, extension = "jpg") =>
    Array.from(
      { length: count },
      (_, index) => `${directory}/${prefix}-${String(index + 1).padStart(2, "0")}.${extension}`
    );

  const dramaRoot = "./assets/works/drama";
  const designRoot = "./assets/works/design";

  const dramas = [
    {
      id: "boxer",
      title: "这个拳手不太冷",
      cover: `${dramaRoot}/boxer/cover.jpg`,
      video: `${dramaRoot}/boxer/video.mp4`,
      stills: range(`${dramaRoot}/boxer`, "still", 3),
      process: [],
      workflow: [`${dramaRoot}/boxer/workflow/workflow-01.jpg`],
      assets: range(`${dramaRoot}/boxer/assets`, "asset", 75)
    },
    {
      id: "sixth-second",
      title: "第六秒",
      cover: `${dramaRoot}/sixth-second/cover.jpg`,
      video: `${dramaRoot}/sixth-second/video.mp4`,
      stills: range(`${dramaRoot}/sixth-second`, "still", 3),
      process: [],
      workflow: [`${dramaRoot}/sixth-second/workflow/workflow-01.jpg`],
      assets: range(`${dramaRoot}/sixth-second/assets`, "asset", 54)
    },
    {
      id: "ai-sisters",
      title: "全世界只有我有AI",
      cover: `${dramaRoot}/ai-sisters/cover.jpg`,
      video: `${dramaRoot}/ai-sisters/video.mp4`,
      stills: range(`${dramaRoot}/ai-sisters`, "still", 3),
      process: [],
      workflow: [`${dramaRoot}/ai-sisters/workflow/workflow-01.jpg`],
      assets: range(`${dramaRoot}/ai-sisters/assets`, "asset", 33)
    },
    {
      id: "dongbei-seoul",
      title: "东北留子的首尔生活",
      cover: `${dramaRoot}/dongbei-seoul/cover.jpg`,
      video: `${dramaRoot}/dongbei-seoul/video.mp4`,
      stills: range(`${dramaRoot}/dongbei-seoul`, "still", 3),
      process: [],
      workflow: [`${dramaRoot}/dongbei-seoul/workflow/workflow-01.jpg`],
      assets: range(`${dramaRoot}/dongbei-seoul/assets`, "asset", 31)
    }
  ];

  const designSections = [
    {
      id: "ip",
      title: "IP 形象设计",
      layout: "ip",
      items: [
        {
          id: "nake-chronos",
          title: "纳克",
          meta: "CHRONOS",
          cover: `${designRoot}/ip/nake-chronos/main.jpg`,
          views: [`${designRoot}/ip/nake-chronos/view-01.jpg`],
          details: range(`${designRoot}/ip/nake-chronos`, "detail", 6)
        },
        {
          id: "qirong",
          title: "漆绒",
          meta: "QIRONG",
          cover: `${designRoot}/ip/qirong/main.jpg`,
          views: [`${designRoot}/ip/qirong/view-01.jpg`],
          details: range(`${designRoot}/ip/qirong`, "detail", 6)
        },
        {
          id: "xingdeng",
          title: "星灯",
          meta: "XINGDENG",
          cover: `${designRoot}/ip/xingdeng/main.jpg`,
          views: [`${designRoot}/ip/xingdeng/view-01.jpg`],
          details: range(`${designRoot}/ip/xingdeng`, "detail", 5)
        }
      ]
    },
    {
      id: "creative",
      title: "AI 创意图",
      layout: "creative",
      items: [
        { id: "qiongding", title: "穹顶天环", cover: `${designRoot}/qiongding.jpg` },
        { id: "shendian", title: "神殿之眼", cover: `${designRoot}/shendian.jpg` },
        { id: "fire", title: "FIRE", cover: `${designRoot}/fire.jpg` },
        { id: "jingjie", title: "镜界", cover: `${designRoot}/jingjie.jpg` },
        { id: "suihua", title: "碎花", cover: `${designRoot}/suihua.jpg` },
        { id: "hongmo", title: "红膜", cover: `${designRoot}/hongmo.jpg` }
      ]
    },
    {
      id: "ecommerce",
      title: "电商套图",
      layout: "ecommerce",
      items: [
        {
          id: "rolex",
          title: "Rolex",
          meta: "Submariner",
          cover: `${designRoot}/ecommerce/rolex/main.jpg`,
          images: range(`${designRoot}/ecommerce/rolex`, "image", 12),
          detail: `${designRoot}/ecommerce/rolex/detail-long.jpg`
        },
        {
          id: "louis-vuitton",
          title: "Louis Vuitton",
          meta: "Neverfull",
          cover: `${designRoot}/ecommerce/louis-vuitton/main.jpg`,
          images: range(`${designRoot}/ecommerce/louis-vuitton`, "image", 12),
          detail: `${designRoot}/ecommerce/louis-vuitton/detail-long.jpg`
        },
        {
          id: "chanel",
          title: "CHANEL",
          meta: "N°5",
          cover: `${designRoot}/ecommerce/chanel/main.jpg`,
          images: range(`${designRoot}/ecommerce/chanel`, "image", 14),
          detail: `${designRoot}/ecommerce/chanel/detail-long.jpg`
        }
      ]
    },
    {
      id: "workflow",
      title: "工作流搭建",
      layout: "workflow",
      items: [
        {
          id: "interior-style",
          title: "室内设计风格转换工作流",
          cover: `${designRoot}/workflow/interior-style/image-01.jpg`,
          images: range(`${designRoot}/workflow/interior-style`, "image", 4)
        },
        {
          id: "outfit-swap",
          title: "换装工作流",
          cover: `${designRoot}/workflow/outfit-swap/image-01.jpg`,
          images: range(`${designRoot}/workflow/outfit-swap`, "image", 4)
        }
      ]
    },
    {
      id: "game-cg",
      title: "创意游戏 CG",
      layout: "game",
      items: [
        {
          id: "forza-gtr",
          title: "东京 GTR",
          meta: "《极限竞速：地平线 6》",
          cover: `${designRoot}/game-cg/forza-gtr/cover.jpg`,
          videos: [`${designRoot}/game-cg/forza-gtr/video.mp4`]
        }
      ]
    },
    {
      id: "video",
      title: "创意视频",
      layout: "video",
      items: [
        {
          id: "apl",
          title: "APL 女团 MV",
          cover: `${designRoot}/video/apl/cover.jpg`,
          videos: [`${designRoot}/video/apl/video.mp4`]
        },
        {
          id: "dance-remake",
          title: "爆火舞蹈复刻",
          cover: `${designRoot}/video/dance-remake/cover.jpg`,
          videos: []
        }
      ]
    }
  ];

  window.SONGAOGE_WORKS = {
    dramas,
    designSections
  };
})();
