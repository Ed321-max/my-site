# 个人主页设计 spec

## 项目概述
- **定位**：AI PM 求职作品集 + 技术内容分享平台，展示思考、能力、品味
- **NFC 场景**：扫码直接打开网页，移动端优先
- **长期目标**：沉淀个人品牌

---

## 视觉层

| 维度 | 选择 |
|------|------|
| 风格 | 极简艺术风，克制留白，参考 Linear/Vercel，信息量适中不拥挤 |
| 配色 | 深空灰 `#0a0a0a`（背景）+ 暖白 `#fafafa`（正文）+ 琥珀色点缀 |
| 字体 | Geist（西文）+ 思源黑体（中文） |
| 图标 | Lucide Icons（线性风格，与极简调性一致） |

---

## 页面结构

单栏纵向流，五区块依次排列：

1. **Hero** — 打字机效果 + 简短 Slogan
2. **个人介绍** — 照片 + 核心标签 + 一段有记忆点的自我介绍
3. **作品集** — 卡片网格，可展开详情（见下方交互说明）
4. **博客/内容** — 文章列表
5. **联系方式** — 邮件 + 社交链接 + 简历 PDF 下载

---

## 导航

- **桌面端**：固定顶部横条，Logo 左，锚点链接右。滚动时当前区块对应链接高亮（使用 IntersectionObserver 实现）。
- **移动端**：汉堡图标，点击展开全屏覆盖层（Framer Motion fade + scale 动画），展示所有锚点链接，点击后关闭。

---

## 动画方案

### Lenis + GSAP ScrollTrigger 整合
在 Layout 层初始化 Lenis 实例，将 GSAP ScrollTrigger 的 `raf` 交给 Lenis 驱动，避免两套 rAF 循环冲突：

```ts
// Layout.astro 或专用 hook
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

### 动画职责分工
| 库 | 负责场景 |
|----|----------|
| GSAP ScrollTrigger | 区块滚动渐入（fade + translateY） |
| Lenis | 全站平滑滚动 |
| Framer Motion | 组件级微交互（hover 浮起、点击反馈、菜单展开） |
| CSS / Framer Motion | Hero 打字机效果 |
| Framer Motion / 原生 | 磁性鼠标（仅 Hero 区外 CTA 和导航链接） |

### 磁性鼠标
通过 CSS 媒体查询 `pointer: fine` 检测是否为鼠标设备：
- 启用条件：`@media (pointer: fine)` — 桌面端鼠标环境
- 移动端/触摸设备：不挂载磁性鼠标效果，JS 不白跑
- 作用范围：仅 Hero 区外的 CTA 按钮和导航链接

### GSAP ScrollTrigger cleanup
每个动画组件在 `useEffect` return cleanup 中调用 `scrollTrigger.kill()`，确保 React 组件卸载时彻底清理。

### 3D tilt 降级策略
- 桌面端：启用 `preserve-3d` + `transform-style: preserve-3d`
- 移动端（检测 `hover: hover` 无响应）：禁用 tilt，降级为普通 hover 浮起效果

---

## 作品集卡片交互

点击作品集卡片时展开详情覆盖层（不跳页）：

- 点击卡片 → Framer Motion `AnimatePresence` + `layoutId` 实现展开动画，卡片内容扩展为全屏详情面板
- 详情面板包含：项目描述、技术栈、我的角色、关键成果、截图/视频演示
- 点击遮罩或返回按钮关闭，Framer Motion 反向收缩回卡片位置
- 键盘支持：ESC 关闭，焦点管理

---

## 技术架构

- **框架**：Astro + React Islands
- **水合策略**：
  - Hero 组件：`client:load`（首屏立即水合，打字机效果不能等滚动）
  - 其余区块：`client:visible`（滚动到视口才水合，减少首屏 JS）
- **组件结构**：每个区块独立 React 组件（Hero / About / Portfolio / Blog / Contact）
- **动画库**：GSAP + Lenis + Framer Motion（已在 package.json）
- **GSAP/Lenis 全局初始化**（Layout 层执行一次）：
  - `Lenis` 实例在 Layout 层创建，全局管理平滑滚动
  - `gsap.registerPlugin(ScrollTrigger)` 在 Layout 层调用一次
  - GSAP ticker 接管 Lenis RAF：`gsap.ticker.add((time) => lenis.raf(time * 1000))`
  - 各组件通过 `gsap.context()` 或直接使用 `ScrollTrigger` 实例，按需创建动画，无需各自初始化 Lenis 或重复注册插件
- **样式**：Tailwind CSS（已在 astro.config.mjs 配置）
- **部署**：Vercel（静态部署）

---

## 响应式断点

| 断点 | 宽度 | 适配 |
|------|------|------|
| Mobile | < 640px | 汉堡菜单，单栏布局，3D tilt 禁用 |
| Tablet | 640px - 1024px | 极简顶部导航，内容适当放宽 |
| Desktop | > 1024px | 固定顶部导航，完整 3D tilt + 磁性鼠标 |

---

## 性能注意事项

- 图片使用 WebP 格式 + `loading="lazy"`
- CSS 使用 `rem` / `clamp()`，避免固定 px
- Framer Motion 按组件引入（Tree-shaking 支持），GSAP 核心按需引入
- 字体使用 `font-display: swap`

---

## 待确认内容（实现前需填充）

- [ ] Hero 打字机效果的文字内容
- [ ] 个人介绍的具体文案和照片
- [ ] 作品集项目列表（至少 3 个）
- [ ] 博客文章列表或 RSS 接入方式
- [ ] 联系方式的具体链接（邮箱、LinkedIn、GitHub 等）
- [ ] 简历 PDF 的路径或上传方式
