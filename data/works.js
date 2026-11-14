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
      summary:
        "《这个拳手不太冷》讲的是一个双面男人的故事。男主白天是外卖员，夜里是地下拳场的拳手，擂台上人称“冷面”，出手快、不废话；可私下里他是个冷幽默高手，面无表情地说着一本正经的胡话，对谁都顺手帮一把。一次送餐路上，手机倒计时只剩不到两分钟，他却在巷口刹车，救下正被混混纠缠骚扰的女主，故事由此展开。",
      processNote:
        "全片人物资产由 GPT Image 2.5 制作，环境资产由 Midjourney 和 Image 2.5 制作，全片由小云雀 Seedance 2.5 制作。",
      cover: `${dramaRoot}/boxer/cover.jpg`,
      video: `${dramaRoot}/boxer/video.mp4`,
      stills: range(`${dramaRoot}/boxer`, "still", 3),
      process: [],
      workflow: [`${dramaRoot}/boxer/workflow/workflow-01.jpg`],
      assets: []
    },
    {
      id: "sixth-second",
      title: "第六秒",
      summary:
        "刻度大陆上人人出生自带与本性适配的命纹技能，唯独时间系是禁忌，会撕开因果裂纹，使用要付代价。18 岁的纳克被嘲为“无纹者”，实际上他能回溯 6 秒，而且无限次使用、毫无代价，原因成谜。预告片从他的市井生活切入战斗：巨鹏、技能集市、莉娅坠桥被他回溯救下、他打碎校准者的面具放话“看来时间站在我这边”；彩蛋是巨龙睁眼飞向世界树。前任时间系技能者正是他还活着的父亲，这是埋着的长线。",
      processNote:
        "本片全部人物资产由 GPT Image 2.5 生成与定妆，环境资产由 Midjourney 与 Image 2.5 协同制作，全片视频由小云雀 Seedance 2.5 生成。作品以预告片形式呈现，综合运用多种镜头语言，并以倒叙、插叙交织的叙事手法推进剧情，完成从资产设计、分镜生成到剪辑成片的完整 AI 影视制作流程。",
      cover: `${dramaRoot}/sixth-second/cover.jpg`,
      video: `${dramaRoot}/sixth-second/video.mp4`,
      stills: range(`${dramaRoot}/sixth-second`, "still", 3),
      process: [],
      workflow: [`${dramaRoot}/sixth-second/workflow/workflow-01.jpg`],
      assets: []
    },
    {
      id: "ai-sisters",
      title: "全世界只有我有AI",
      summary:
        "世界是 2026 年，但 AI 从未被发明出来，所有人的认知还停在 2018 年。唯一的例外是 23 岁的普通上班族宋奥——GPT、DeepSeek、豆包、Grok、Claude 五个 AI 变成了真人美女，只有他能看见、能使唤。",
      processNote:
        "全片人物资产由 GPT Image 2.5 制作，环境资产由 Midjourney 和 Image 2.5 制作，全片由小云雀 Seedance 2.5 制作。",
      cover: `${dramaRoot}/ai-sisters/cover.jpg`,
      video: `${dramaRoot}/ai-sisters/video.mp4`,
      stills: range(`${dramaRoot}/ai-sisters`, "still", 3),
      process: [],
      workflow: [`${dramaRoot}/ai-sisters/workflow/workflow-01.jpg`],
      assets: []
    },
    {
      id: "dongbei-seoul",
      title: "东北留子的首尔生活",
      summary:
        "王振北，20 岁，东北人，从小按意大利黑手党继承人的标准受训，父亲是家族老大。他求了父亲半天，终于被送到韩国首尔，体验他一直向往的普通留学生活。他人狠话不多，做事不墨迹，信条只有一条：绝不受委屈。他在校园里撞见女主郑夏琳正被人围着霸凌。男主出手相救，两人的故事由此展开。",
      processNote:
        "全片人物资产由 GPT Image 2.5 制作，环境资产由 Midjourney 和 Image 2.5 制作，全片由小云雀 Seedance 2.5 制作。",
      cover: `${dramaRoot}/dongbei-seoul/cover.jpg`,
      video: `${dramaRoot}/dongbei-seoul/video.mp4`,
      stills: range(`${dramaRoot}/dongbei-seoul`, "still", 3),
      process: [],
      workflow: [`${dramaRoot}/dongbei-seoul/workflow/workflow-01.jpg`],
      assets: []
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
          id: "tom-ford",
          title: "TOM FORD",
          meta: "Tobacco Vanille",
          cover: `${designRoot}/ecommerce/tom-ford/main.jpg`,
          images: range(`${designRoot}/ecommerce/tom-ford`, "image", 10),
          detail: `${designRoot}/ecommerce/tom-ford/detail-long.jpg`
        },
        {
          id: "gpw5",
          title: "GPW5",
          meta: "电商套图",
          cover: `${designRoot}/ecommerce/gpw5/main.jpg`,
          images: range(`${designRoot}/ecommerce/gpw5`, "image", 10),
          detail: `${designRoot}/ecommerce/gpw5/detail-long.jpg`
        },
        {
          id: "wassup",
          title: "WASSUP",
          meta: "外套电商套图",
          cover: `${designRoot}/ecommerce/wassup/main.jpg`,
          images: range(`${designRoot}/ecommerce/wassup`, "image", 10),
          detail: `${designRoot}/ecommerce/wassup/detail-long.jpg`
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
      id: "video",
      title: "创意视频",
      layout: "video",
      items: [
        {
          id: "forza-gtr",
          title: "东京 GTR",
          meta: "《极限竞速：地平线 6》同人 CG",
          cover: `${designRoot}/game-cg/forza-gtr/cover.jpg`,
          videos: [`${designRoot}/game-cg/forza-gtr/video.mp4`]
        },
        {
          id: "apl",
          title: "APL 女团 MV",
          meta: "Girl Group MV",
          cover: `${designRoot}/video/apl/cover.jpg`,
          videos: [`${designRoot}/video/apl/video.mp4`]
        }
      ]
    }
  ];

  const designOrder = ["ip", "creative", "workflow", "ecommerce", "video"];
  designSections.sort(
    (left, right) => designOrder.indexOf(left.id) - designOrder.indexOf(right.id)
  );

  const profile = {
    name: "宋傲阁",
    age: "22",
    education: "本科",
    major: "应急技术与管理",
    school: "重庆科技大学",
    software: [
      { name: "Photoshop", icon: "./assets/icons/software/photoshop.png" },
      { name: "Illustrator", icon: "./assets/icons/software/illustrator.png" },
      { name: "Premiere", icon: "./assets/icons/software/premiere.png" },
      { name: "ChatGPT", icon: "./assets/icons/software/chatgpt.png" },
      { name: "Midjourney", icon: "./assets/icons/software/midjourney.png" },
      { name: "Codex", icon: "./assets/icons/software/codex.png" },
      { name: "DaVinci Resolve", icon: "./assets/icons/software/davinci.png" }
    ]
  };

  window.SONGAOGE_WORKS = {
    profile,
    dramas,
    designSections
  };
})();
