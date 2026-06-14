# soulmate 项目状态（2026-06-11）

H5 原型：https://ai-kanojo-h5.vercel.app ｜ 仓库：github.com/shisamon/ai-kanojo-h5 ｜ Supabase 项目：ai-kanojo-h5 (ilsytudubuvxojrhvgui)

## 架构

- Next.js 16 壳 + 静态原型（`outputs/companion-studio-prototype/index.html` zh / `ja.html` ja）+ 原生 JS（`public/prototype/app.js`，全部前端逻辑）
- API 路由：`/api/works`、`/api/characters`、`/api/templates`、`/api/chat`、`/api/generate-video`、`/api/health`
- Supabase：schema 见 `supabase/schema.sql`，模板表 `templates.sql`，auth 触发器/RPC `auth.sql`，管理员删除保护 `protect-admin-account.sql`，种子 `seed.sql`
- 推送 main 分支即触发 Vercel 部署

## 已完成

- 首页视频流 / 角色 / 模板全部读 Supabase 真实数据（API 失败时回退本地假数据）
- 邮箱密码登录注册：全屏登录页（登录/注册 tab、确认密码、游客跳过）
- 权限模型：游客只能看首页；创作/消息/我、生成、聊天、点赞、充值、编辑资料均需登录
- 登录后落库：profiles（昵称/余额）、works（生成历史，私密；分享转公开进首页流）、work_likes、chat_sessions/chat_messages、diamond_transactions
- 视频创作走 `/api/generate-video`：服务端校验登录、创建任务、扣钻、调用 RunPod（未配置时走演示结果）、保存私密作品；注册自动建 profile（触发器，默认 570 钻）
- 聊天：`/api/chat`，未配 key 时规则自动回复（zh/ja），配置 `AI_CHAT_API_KEY/BASE_URL/MODEL` 后走真模型；`AI_CHAT_SYSTEM_PROMPT` 可自定义人设（{name} {age} {tag} {language} 占位符）
- 分享：navigator.share 系统分享面板，链接 `/?work=<id>` 深链定位高亮；弹窗兜底含复制链接
- 移动端弹窗均为 bottom sheet；资料页/余额卡片样式已修
- `admin` / 管理员账号前端禁止提交删除请求；数据库保护见 `supabase/protect-admin-account.sql`

## 已知待办

1. **Supabase 关闭邮箱确认**（Dashboard → Authentication → Sign In/Providers → Email → Confirm email off），否则注册后无法直接登录。已有用户 abc@163.com 已手动确认
2. **GitHub token 需撤销更换**（聊天里用过的 PAT）
3. 充值是演示流程，未接真实支付（Stripe / 聚合支付）
4. 视频创作已有后端接口；真实生成需在 Vercel 配置 `RUNPOD_API_KEY` 和 `RUNPOD_VIDEO_ENDPOINT`
5. 聊天模型 key 未配置（需自选允许成人内容的 OpenAI 兼容服务商）
6. 头像上传（Supabase Storage）未做
7. 关注/粉丝、删除账户为占位

## 注意

- 改动原型 UI 要同时改 `index.html` 和 `ja.html` 两份
- 文案在 `app.js` 顶部 dictionary（zh/ja 两套）
- 自动回复台词在 `app/api/chat/route.ts` 的 `autoReply`
