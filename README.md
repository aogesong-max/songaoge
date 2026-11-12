# SONGAOGE 个人作品集

纯静态个人作品集，使用原生 HTML、CSS 与 JavaScript，不需要安装依赖或执行构建命令。站点资源全部通过 `./` 相对路径引用，可直接发布在 GitHub Pages 的仓库子路径中。

## 本地预览

不要直接双击 `index.html`，请从项目上级目录启动本地静态服务器，以便按 GitHub Pages 的子路径方式检查：

```powershell
# 在项目本级目录执行
python -m http.server 8080
```

然后访问 `http://localhost:8080/`。如果要在本地完整模拟 `/songaoge/` 子路径，可将整个项目目录命名为 `songaoge`，从它的上级目录启动服务器，再访问 `http://localhost:8080/songaoge/`。

## 文件结构

```text
.
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── data/
│   └── works.js
├── assets/
│   ├── portrait.jpg
│   └── works/
│       └── .gitkeep
└── README.md
```

## 替换个人主视觉

1. 准备一张竖幅图片，推荐 3:4 或 4:5，建议宽度 1200px 左右。
2. 用新图片覆盖 `assets/portrait.jpg`，保持文件名不变，即可沿用 `./assets/portrait.jpg` 的相对路径。
3. 打开 `index.html`，搜索 `portrait-note` 并删除整个 `<div class="portrait-note">...</div>`，即可去掉“主视觉预留”文字。
4. 图片 `alt` 文本可在同一个 `<img>` 标签中按真实内容修改。

## 替换作品

作品卡片目前直接写在 `index.html` 中，六个分类各有三张固定占位卡。替换时保留卡片结构与封面比例即可：

| 分类 | 封面比例 | 页面中的比例类名 |
| --- | --- | --- |
| AI短剧、MV、TVC | 16:9 | `ratio-16-9` |
| IP设计、AI海报 | 3:4 | `ratio-3-4` |
| 电商套图 | 4:3 | `ratio-4-3` |

操作步骤：

1. 将作品封面放入 `assets/works/`，不要使用 `assets/works/.gitkeep` 作为图片。
2. 在 `index.html` 对应分类的 `.work-cover` 中加入图片，例如：

```html
<div class="work-cover ratio-16-9">
  <img src="./assets/works/your-cover.jpg" alt="作品封面说明">
</div>
```

3. 替换“作品标题预留”“分类”和简介占位线；需要简介时，将 `.work-line` 换成 `<p>` 即可。
4. 去掉 `.work-link` 上的 `is-disabled`，并把 `<span>` 改为指向详情页的 `<a>`。
5. 新增作品时复制完整 `.work-card`，保持同一分类下所有封面比例一致。桌面端每个分类为三列，1024px 以下为两列，480px 以下为一列。

`data/works.js` 目前只保留空数组和一条被注释的字段示例，不会渲染页面内容。将来如果改为数据驱动，可继续使用其中约定的字段。

## 修改联系方式

打开 `index.html`，搜索以下中文注释，逐项替换即可：

```html
<!-- TODO: 将下方的占位文本替换为你的微信号 -->
<!-- TODO: 将 href 改为 mailto:你的邮箱，并替换可见文本 -->
<!-- TODO: 将 href 改为你的 GitHub 主页地址，并替换可见文本 -->
```

页面留言表单只做前端校验与“已收到”提示，不会向任何服务器发送数据。

## 开启 GitHub Pages

1. 确认站点代码已提交并推送到 GitHub 仓库 `songaoge` 的 `main` 分支。
2. 打开该仓库的 GitHub 页面。
3. 点击仓库顶部的 **Settings**。
4. 在左侧边栏点击 **Pages**。
5. 在 **Build and deployment** 下，将 **Source** 选择为 **Deploy from a branch**。
6. 在 **Branch** 下选择 **main**，目录选择 **/ (root)**，然后点击 **Save**。
7. 等待 Actions / Pages 部署完成，访问 `https://<你的GitHub用户名>.github.io/songaoge/`。

如果仓库属于免费账户，仓库需要是 **Public**。修改并推送到 `main` 后，Pages 会自动重新部署。

## 动效与兼容性

- 开机动画只使用原生 JavaScript 和 Web Animations API，不依赖 GSAP 或任何 CDN；代码同时兼容页面中若未来出现 `window.gsap` 的情况。
- 没有 JavaScript 时，`noscript` 样式会直接隐藏开机层，全部页面内容正常显示。
- 主脚本异常时，`index.html` 中独立运行的四秒安全计时器会强制移除开机层。
- 用户开启“减少动态效果”时会直接跳过开机动画与滚动入场动画。
- 同一浏览器标签页的一轮浏览中，开机动画通过 `sessionStorage` 记忆，刷新不会重播。
