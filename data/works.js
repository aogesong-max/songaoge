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
      assetGallery: {
        characters: [
          `${dramaRoot}/boxer/assets/character-01.jpg`,
          `${dramaRoot}/boxer/assets/character-02.jpg`,
          `${dramaRoot}/boxer/assets/character-03.jpg`,
          `${dramaRoot}/boxer/assets/character-04.jpg`,
          `${dramaRoot}/boxer/assets/character-05.jpg`,
          `${dramaRoot}/boxer/assets/character-06.jpg`
        ],
        environments: [
          `${dramaRoot}/boxer/assets/environment-01.jpg`,
          `${dramaRoot}/boxer/assets/environment-02.jpg`,
          `${dramaRoot}/boxer/assets/environment-03.jpg`,
          `${dramaRoot}/boxer/assets/environment-04.jpg`,
          `${dramaRoot}/boxer/assets/environment-05.jpg`,
          `${dramaRoot}/boxer/assets/environment-06.jpg`
        ]
      },
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
      assetGallery: {
        layout: "category-rows",
        lightboxGroup: "sixth-second-assets",
        groups: [
          {
            label: "人物",
            images: [
              {
                src: `${dramaRoot}/sixth-second/assets/character-01-liya.jpg`,
                name: "莉娅",
                aspect: 1792 / 2400
              },
              {
                src: `${dramaRoot}/sixth-second/assets/character-02-nake.jpg`,
                name: "纳克",
                aspect: 1086 / 1448
              },
              {
                src: `${dramaRoot}/sixth-second/assets/character-03-calibrator.jpg`,
                name: "校准者",
                aspect: 1536 / 2048
              }
            ]
          },
          {
            label: "环境",
            images: [
              {
                src: `${dramaRoot}/sixth-second/assets/environment-01-broken-bridge.jpg`,
                name: "断桥视角2",
                aspect: 2400 / 1350
              },
              {
                src: `${dramaRoot}/sixth-second/assets/environment-02-market.jpg`,
                name: "集市角度2",
                aspect: 2400 / 1350
              },
              {
                src: `${dramaRoot}/sixth-second/assets/environment-03-city.jpg`,
                name: "视角2",
                aspect: 2400 / 1350
              }
            ]
          },
          {
            label: "道具",
            images: [
              {
                src: `${dramaRoot}/sixth-second/assets/prop-01-bread-basket.jpg`,
                name: "面包篮",
                aspect: 1792 / 1344
              },
              {
                src: `${dramaRoot}/sixth-second/assets/prop-02-milk-jug.jpg`,
                name: "牛奶壶",
                aspect: 1792 / 1344
              },
              {
                src: `${dramaRoot}/sixth-second/assets/prop-03-time-blade.jpg`,
                name: "时滞刃",
                aspect: 1344 / 1792
              }
            ]
          }
        ]
      },
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
      assetGallery: {
        layout: "category-rows",
        lightboxGroup: "ai-sisters-assets",
        groups: [
          {
            label: "人物",
            images: [
              {
                src: `${dramaRoot}/ai-sisters/assets/character-01-doubao.jpg`,
                name: "豆包",
                aspect: 2560 / 1440
              },
              {
                src: `${dramaRoot}/ai-sisters/assets/character-02-songao.jpg`,
                name: "宋奥",
                aspect: 4096 / 2304
              },
              {
                src: `${dramaRoot}/ai-sisters/assets/character-03-claude.jpg`,
                name: "Claude",
                aspect: 4096 / 2304
              }
            ]
          },
          {
            label: "人物",
            images: [
              {
                src: `${dramaRoot}/ai-sisters/assets/character-04-deepseek.jpg`,
                name: "Deepseek",
                aspect: 2560 / 1440
              },
              {
                src: `${dramaRoot}/ai-sisters/assets/character-05-gpt.jpg`,
                name: "GPT",
                aspect: 4096 / 2304
              },
              {
                src: `${dramaRoot}/ai-sisters/assets/character-06-grok.jpg`,
                name: "grok",
                aspect: 2560 / 1440
              }
            ]
          },
          {
            label: "环境",
            images: [
              {
                src: `${dramaRoot}/ai-sisters/assets/environment-01-office.jpg`,
                name: "办公室",
                aspect: 4096 / 2304
              },
              {
                src: `${dramaRoot}/ai-sisters/assets/environment-02-street.jpg`,
                name: "街道",
                aspect: 2048 / 1152
              },
              {
                src: `${dramaRoot}/ai-sisters/assets/environment-03-bedroom.jpg`,
                name: "卧室",
                aspect: 4096 / 2313
              }
            ]
          },
          {
            label: "道具",
            images: [
              {
                src: `${dramaRoot}/ai-sisters/assets/prop-01-car.jpg`,
                name: "车",
                aspect: 1792 / 1344
              },
              {
                src: `${dramaRoot}/ai-sisters/assets/prop-02-claude-book.jpg`,
                name: "Claude的书",
                aspect: 1792 / 1344
              },
              {
                src: `${dramaRoot}/ai-sisters/assets/prop-03-deepseek-plush.jpg`,
                name: "Deepseek玩偶",
                aspect: 2048 / 2048
              }
            ]
          }
        ]
      },
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
      assetGallery: {
        layout: "category-rows",
        lightboxGroup: "dongbei-seoul-assets",
        sectionClassName: "detail-section--assets-dongbei",
        groups: [
          {
            label: "人物",
            images: [
              {
                src: `${dramaRoot}/dongbei-seoul/assets/character-01-cui-xiuya1.png`,
                name: "崔秀雅1",
                aspect: 1536 / 2048
              },
              {
                src: `${dramaRoot}/dongbei-seoul/assets/character-02-quan-taijun.png`,
                name: "权泰俊",
                aspect: 2048 / 1152
              },
              {
                src: `${dramaRoot}/dongbei-seoul/assets/character-03-wang-zhenbei.png`,
                name: "王振北",
                aspect: 2048 / 1152
              }
            ]
          },
          {
            label: "人物",
            images: [
              {
                src: `${dramaRoot}/dongbei-seoul/assets/character-04-yin-shilin.png`,
                name: "尹世凛",
                aspect: 2048 / 1152
              },
              {
                src: `${dramaRoot}/dongbei-seoul/assets/character-05-zheng-xialin.png`,
                name: "郑夏琳",
                aspect: 2048 / 1152
              },
              {
                src: `${dramaRoot}/dongbei-seoul/assets/character-06-d.png`,
                name: "D",
                aspect: 2848 / 1600
              }
            ]
          },
          {
            label: "环境",
            images: [
              {
                src: `${dramaRoot}/dongbei-seoul/assets/environment-01-reverse-angle.png`,
                name: "教室反向机位",
                aspect: 2816 / 1584
              },
              {
                src: `${dramaRoot}/dongbei-seoul/assets/environment-02-main-view.png`,
                name: "教室主视角",
                aspect: 2048 / 1152
              },
              {
                src: `${dramaRoot}/dongbei-seoul/assets/environment-03-corridor.png`,
                name: "教室走廊",
                aspect: 4096 / 2304
              }
            ]
          },
          {
            label: "道具",
            images: [
              {
                src: `${dramaRoot}/dongbei-seoul/assets/prop-01-pink-folder.png`,
                name: "粉色文件夹",
                aspect: 2048 / 1152
              },
              {
                src: `${dramaRoot}/dongbei-seoul/assets/prop-02-girls-uniform.png`,
                name: "女生校服",
                aspect: 2048 / 1152
              },
              {
                src: `${dramaRoot}/dongbei-seoul/assets/prop-03-boys-uniform.png`,
                name: "校服",
                aspect: 2048 / 1152
              }
            ]
          }
        ]
      },
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
          banner: `${designRoot}/ip/nake-chronos/banner.jpg`,
          hero: `${designRoot}/ip/nake-chronos/banner.jpg`,
          theme: "时光回溯 × 机械守望",
          concept:
            "纳克（ ）是一位以时间守护为核心概念的原创潮玩角色，整体设计围绕「时间、机械、守护」三个核心意象展开。他拥有银白色蓬松发型、冷灰色眼眸与额头独特伤痕，搭配黑色机能战术服及金属质感武士刀，塑造出冷静、克制而敏锐的角色气质。设计以深冷蓝、深灰、黄铜金为主色调，融合发光时钟、机械齿轮与未来都市等视觉元素，营造出神秘而富有科技感的时间幻想氛围。",
          views: [`${designRoot}/ip/nake-chronos/view-01.jpg`],
          details: range(`${designRoot}/ip/nake-chronos`, "detail", 6),
          detailSections: [
            {
              title: "三视图",
              columns: 1,
              images: [`${designRoot}/ip/nake-chronos/view-01.jpg`]
            },
            {
              title: "表情包",
              columns: 1,
              images: [`${designRoot}/ip/nake-chronos/detail-05.jpg`]
            },
            {
              title: "设计元素",
              columns: 1,
              images: [`${designRoot}/ip/nake-chronos/detail-02.jpg`]
            },
            {
              title: "色彩 / 角色档案",
              columns: 1,
              images: [`${designRoot}/ip/nake-chronos/detail-01.jpg`]
            },
            {
              title: "应用 / 周边",
              columns: 2,
              images: [
                `${designRoot}/ip/nake-chronos/detail-04.jpg`,
                `${designRoot}/ip/nake-chronos/detail-03.jpg`
              ]
            },
            {
              title: "海报",
              columns: 1,
              images: [`${designRoot}/ip/nake-chronos/detail-06.jpg`]
            }
          ]
        },
        {
          id: "qirong",
          title: "漆绒",
          meta: "QIRONG",
          cover: `${designRoot}/ip/qirong/main.jpg`,
          banner: `${designRoot}/ip/qirong/banner.jpg`,
          hero: `${designRoot}/ip/qirong/banner.jpg`,
          theme: "绒彩绘梦 × 毛绒治愈",
          concept:
            "漆绒（ ）是一位以“把灵感画出来”为核心概念的原创潮玩角色，整体设计围绕「毛绒、颜料、治愈」三个核心意象展开。他拥有奶白色的蓬松毛绒身体、薄荷绿的尖耳朵内耳与大圆眼睛，带着一点小坏笑的小牙，背着橙色南瓜包、手里永远拿一支沾着薄荷绿颜料的画笔，塑造出鬼马、可爱、又有点小倔强的角色气质。设计以奶白、薄荷绿、南瓜橙为主色调，融合颜料泼溅、调色盘、云朵与南瓜等视觉元素，营造出温暖、柔软、又有动手感的创作氛围。",
          views: [`${designRoot}/ip/qirong/view-01.jpg`],
          details: range(`${designRoot}/ip/qirong`, "detail", 6),
          detailSections: [
            {
              title: "三视图",
              columns: 1,
              images: [`${designRoot}/ip/qirong/view-01.jpg`]
            },
            {
              title: "表情包",
              columns: 1,
              images: [`${designRoot}/ip/qirong/detail-02.jpg`]
            },
            {
              title: "设计元素 / 色彩",
              columns: 1,
              images: [`${designRoot}/ip/qirong/detail-01.jpg`]
            },
            {
              title: "应用 / 周边",
              columns: 2,
              images: [
                `${designRoot}/ip/qirong/detail-03.jpg`,
                `${designRoot}/ip/qirong/detail-04.jpg`
              ]
            },
            {
              title: "设计总览",
              columns: 1,
              images: [`${designRoot}/ip/qirong/detail-06.jpg`]
            },
            {
              title: "海报",
              columns: 1,
              images: [`${designRoot}/ip/qirong/detail-05.jpg`]
            }
          ]
        },
        {
          id: "xingdeng",
          title: "星灯",
          meta: "XINGDENG",
          cover: `${designRoot}/ip/xingdeng/main.jpg`,
          banner: `${designRoot}/ip/xingdeng/banner.jpg`,
          hero: `${designRoot}/ip/xingdeng/banner.jpg`,
          theme: "星夜守梦 × 暖光治愈",
          concept:
            "星灯（ ）是一位以夜晚守护为核心概念的原创潮玩角色，整体设计围绕「星空、灯光、睡眠」三个核心意象展开。他拥有圆滚滚深蓝星空毛绒身体、大星星眼眸与暖黄发光脸颊，搭配深蓝睡帽、黄毛球及手提小灯、灯笼尾巴，塑造出困倦却可靠、温柔而安静的角色气质。",
          views: [`${designRoot}/ip/xingdeng/view-01.jpg`],
          details: range(`${designRoot}/ip/xingdeng`, "detail", 5),
          detailSections: [
            {
              title: "三视图",
              columns: 1,
              images: [`${designRoot}/ip/xingdeng/view-01.jpg`]
            },
            {
              title: "表情包",
              columns: 1,
              images: [`${designRoot}/ip/xingdeng/detail-02.jpg`]
            },
            {
              title: "换装",
              columns: 1,
              images: [`${designRoot}/ip/xingdeng/detail-03.jpg`]
            },
            {
              title: "设计元素 / 色彩",
              columns: 1,
              images: [`${designRoot}/ip/xingdeng/detail-01.jpg`]
            },
            {
              title: "应用 / 周边",
              columns: 1,
              images: [`${designRoot}/ip/xingdeng/detail-04.jpg`]
            },
            {
              title: "海报",
              columns: 1,
              images: [`${designRoot}/ip/xingdeng/detail-05.jpg`]
            }
          ]
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
