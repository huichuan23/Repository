# HM 私人 AI 穿搭

一个手机端优先的私人 AI 穿搭推荐网站。前端使用 Next.js，后端 API 运行在 Next.js Route Handlers，数据存放在 Supabase PostgreSQL，AI 推荐通过 OpenAI API 完成。

## 技术栈

- Next.js App Router
- Supabase PostgreSQL
- Supabase Storage，用于衣服图片
- OpenAI `gpt-5.4-mini`，用于穿搭推荐
- Vercel，推荐部署方式

## 本地配置

复制环境变量模板：

```bash
cp .env.example .env.local
```

填入：

```text
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
OPENAI_RECOMMENDATION_MODEL=gpt-5.4-mini
```

注意：`SUPABASE_SERVICE_ROLE_KEY` 和 `OPENAI_API_KEY` 只能放在后端环境变量里，不能暴露给浏览器。

## 数据库

在 Supabase SQL Editor 里执行：

```text
supabase/schema.sql
```

核心表：

- `user_profile`：你的身高、体型、肤色、偏好、避雷颜色和版型
- `clothing_items`：每件衣服的图片地址、品类、颜色、材质、季节、风格
- `outfits`：AI 或手动保存的穿搭方案
- `outfit_items`：穿搭方案和衣服的关联
- `feedback`：你对穿搭的评分和标签反馈
- `wear_logs`：每天实际穿了什么

## API

获取衣柜：

```http
GET /api/clothing-items
```

新增衣服：

```http
POST /api/clothing-items
```

生成穿搭：

```http
POST /api/outfit-recommendations
```

请求示例：

```json
{
  "occasion": "周末出门",
  "weather": "26°C，晴",
  "mood": "轻松但有精神",
  "formality": "casual"
}
```

## 部署

这个版本需要后端 API，所以不要继续用 GitHub Pages。推荐把 GitHub 仓库导入 Vercel，然后在 Vercel Project Settings 里添加 `.env.example` 中的环境变量。
