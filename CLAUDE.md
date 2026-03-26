# 项目约定 — 个人主页 (my-site)

## 技术栈
- Astro + React Islands + Tailwind CSS + GSAP + Framer Motion + Lenis
- 部署: Vercel
- 移动端优先（NFC 扫码场景）

## 执行规范
- 每次只处理一个子任务
- 不要修改不在 touch_files 列表中的文件
- 遇到阻塞立即回报，不要自行绕过
- CSS 用 rem / clamp()，不用固定 px
- 图片用 WebP + loading="lazy"

## 任务完成回调
任务完成后必须执行:
openclaw system event --text "Done: <task_id> <summary>" --mode now
