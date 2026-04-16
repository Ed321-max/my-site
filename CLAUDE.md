# 项目开发规范 — Slow Factor 个人主页 (my-site)

## 技术栈
- Astro 5 + React Islands + Tailwind CSS + GSAP + Framer Motion + Lenis
- Notion 作为 CMS（@astro-notion/loader）
- Vercel 部署（ISR, expiration: 3600）
- 三个 Content Collection: portfolio, blog, journal
- 移动端优先（NFC 扫码场景）

## 执行规范
- 每次只处理一个子任务
- 不要修改不在 touch_files 列表中的文件
- 遇到阻塞立即回报，不要自行绕过
- CSS 用 rem / clamp()，不用固定 px
- 图片用 WebP + loading="lazy"

## ⚠️ Notion 图片处理规则（最重要）

Notion 上传的图片 URL 是带签名的临时链接（S3 signed URL），约 1 小时过期。
Build 之后这些 URL 就会失效，导致图片 404。

### 封面图（Cover 字段）
- 已有 prebuild 脚本 `scripts/download-covers.mjs`
- `npm run build` 会自动先执行 prebuild，下载所有封面图到 `public/images/covers/`
- 组件里封面图 src 用本地路径 `/images/covers/{prefix}-{slug}.{ext}`
- **不要直接用 Notion S3 URL 作为 img src**

### 正文图片（页面 body 里的 image block）
- @astro-notion/loader 会在 build 时下载到 assets 目录
- 通过 Astro 的 __ASTRO_IMAGE_ 管线处理
- 确保 sharp 已安装（npm ls sharp）
- 确保 astro.config.mjs 没有禁用图片优化

### 新增数据库/内容类型时
- 封面图：在 download-covers.mjs 的 databases 数组里加上新数据库
- 正文图片：确认 loader 的 render() 正常处理即可

## 新增内容 Checklist
在 Notion 数据库新增条目后，确认：
- [ ] Slug 字段已填写（英文短横线格式，如 weekend-sunset）
- [ ] Published 已勾选
- [ ] 封面图已上传到 Cover 字段
- [ ] 如果有详情页，确认对应的 [slug].astro 路由存在

## 内容更新构建规则
每次 Notion 数据库内容变更后，必须重新构建部署，Notion 不会自动同步到网站。
执行流程：`npm run build` → `git add -A` → `git commit -m "content: update"` → `git push`

### 构建时必须检查
- 封面图是否被 prebuild 脚本正确下载到 `public/images/covers/`
- 正文图片是否通过 `__ASTRO_IMAGE_` 管线正确处理
- 构建完成后检查 build 输出中是否有图片相关的 warning 或 404
- 如果图片缺失，先运行 `node scripts/download-covers.mjs` 单独检查

## 排版规范
- 正文容器用 article-body 类（自定义 CSS，不依赖 @tailwindcss/typography）
- 中文段落：line-height 1.9，段间距 1.5em
- 正文最大宽度 720px，居中
- 深色主题配色：正文 #d1d5db，标题 #fff，链接 #f59e0b

## 封面图空状态处理
- 如果 Cover 字段为空，不要渲染 img 标签
- 显示深色渐变占位背景 + 图标
- 避免出现破碎的 alt 文本

## 组件结构
- ArticleLayout.astro — 详情页通用布局（Portfolio/Blog/Journal 共用）
- 首页各 Section 组件在 src/components/
- 社媒图标：GitHub / X / Email / 微信公众号（无 LinkedIn）
- 邮箱：ruiyzfr321@gmail.com

## 不要做的事
- 不要直接用 Notion S3 签名 URL 作为图片 src
- 不要手动建 filename→UUID 映射表来猜图片路径
- 不要用 client:visible/client:load 来"修复"图片不显示的问题
- 排版问题不要猜 prose 类是否生效，先检查插件是否安装和引入
- 遇到图片问题先 console.log 数据结构、看 Network 请求，不要猜
- 不要给容器设 `overflow-hidden` + 固定高度来约束打字机文字
- 不要用 `min-h-screen` 做内容很少的 Hero 区域
- 不要用原始分辨率图片，按显示尺寸 2x 压缩后使用
- 不要在不同 section 混用不同的 max-width，首页所有模块统一 `max-w-5xl`
- 不要把 px-6 放在 section 上，统一放在内容 div 上
- 不要未经确认就安装 puppeteer / playwright 等依赖

## 任务完成回调
任务完成后必须执行:
openclaw system event --text "Done: <task_id> <summary>" --mode now

<!-- VERCEL BEST PRACTICES START -->
## Best practices for developing on Vercel

These defaults are optimized for AI coding agents (and humans) working on apps that deploy to Vercel.

- Treat Vercel Functions as stateless + ephemeral (no durable RAM/FS, no background daemons), use Blob or marketplace integrations for preserving state
- Edge Functions (standalone) are deprecated; prefer Vercel Functions
- Don't start new projects on Vercel KV/Postgres (both discontinued); use Marketplace Redis/Postgres instead
- Store secrets in Vercel Env Variables; not in git or `NEXT_PUBLIC_*`
- Provision Marketplace native integrations with `vercel integration add` (CI/agent-friendly)
- Sync env + project settings with `vercel env pull` / `vercel pull` when you need local/offline parity
- Use `waitUntil` for post-response work; avoid the deprecated Function `context` parameter
- Set Function regions near your primary data source; avoid cross-region DB/service roundtrips
- Tune Fluid Compute knobs (e.g., `maxDuration`, memory/CPU) for long I/O-heavy calls (LLMs, APIs)
- Use Runtime Cache for fast **regional** caching + tag invalidation (don't treat it as global KV)
- Use Cron Jobs for schedules; cron runs in UTC and triggers your production URL via HTTP GET
- Use Vercel Blob for uploads/media; Use Edge Config for small, globally-read config
- If Enable Deployment Protection is enabled, use a bypass secret to directly access them
- Add OpenTelemetry via `@vercel/otel` on Node; don't expect OTEL support on the Edge runtime
- Enable Web Analytics + Speed Insights early
- Use AI Gateway for model routing, set AI_GATEWAY_API_KEY, using a model string (e.g. 'anthropic/claude-sonnet-4.6'), Gateway is already default in AI SDK
needed. Always curl https://ai-gateway.vercel.sh/v1/models first; never trust model IDs from memory
- For durable agent loops or untrusted code: use Workflow (pause/resume/state) + Sandbox; use Vercel MCP for secure infra access
<!-- VERCEL BEST PRACTICES END -->
