# SONGAOGE 作品集

纯静态 HTML、CSS 与 JavaScript 网站，不需要安装依赖或执行构建命令。全部站点资源使用 `./assets/...` 相对路径，可直接部署到 GitHub Pages 的 `/songaoge/` 子路径。

## 页面

- `index.html`：首页与详情层容器
- `data/works.js`：全部作品名称、分类、路径和详情图组
- `css/style.css`：首页编辑式版式、全站视觉、断点与详情层样式
- `css/cursor.css`：旋转粒子光标、悬停状态与点击爆发效果
- `css/interactions.css`：标题视差、磁吸按钮与作品卡片倾斜效果
- `js/main.js`：首页渲染、导航菜单、详情层、灯箱、轮播和视频
- `js/boot.js`：开机动画粒子、进度与退场时间轴
- `js/cursor.js`：自定义粒子光标的指针跟踪与反馈
- `js/interactions.js`：首页及作品列表的轻量鼠标交互

## 本地预览

在项目上级目录启动静态服务器：

```powershell
python -m http.server 8080
```

访问 `http://localhost:8080/songaoge/`。

## 素材约定

- 头像目标路径为 `assets/avatar.jpg`。当前文件不存在，页面显示不带裂图的空头像框。
- 首页 Hero 背景继续使用 `assets/hero/hero-background.mp4` 与对应海报。
- 开机动画由 `css/boot.css` 与 `js/boot.js` 实时绘制，不依赖视频或图片素材。
- Hero 个人信息来自作品集第 4 页，常用软件图标位于 `assets/icons/software/`。
- 短剧、IP、创意图、国内电商套图、工作流和视频资源均位于 `assets/works/`。
- 电商套图使用 TOM FORD、GPW5、WASSUP 三组国内电商素材。
- 缺失封面保持空媒体框；缺失详情图组会自动隐藏，不显示裂图或空段。
- 短剧资产图暂未接入，等待对应成品文件后放入各短剧的 `assets/` 目录。

## 视频说明

仓库中的短剧、游戏 CG 和 APL 视频是适合网页播放的 1280px 宽 H.264 压缩版本。原始 4K 视频保留在本地作品素材目录，不进入 GitHub Pages。
