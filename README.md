# stronger

`stronger` 是一个单页滚动式的 AI 成长网站，帮助用户聚焦方向、执行关键行动，并在 AI 的陪伴下完成成长闭环。

## 技术栈

- Next.js 16
- TypeScript
- Tailwind CSS 4
- Recharts
- OpenAI SDK（通过兼容接口接入千问）

## 本地运行

1. 安装依赖

```bash
npm install
```

2. 复制环境变量文件

```bash
cp .env.example .env.local
```

3. 填写 `QWEN_API_KEY`

4. 启动开发环境

```bash
npm run dev
```

## 主要能力

- 单页大仪表盘
- 首次使用弹窗引导
- 三条主线状态扫描：生命 / 爱 / 事业
- 当前 30 天目标聚焦
- 今日关键行动管理
- AI 聚焦、安排今天、复盘今天、周总结
- 本周闭环和趋势展示

## 部署建议

- 使用阿里云 ECS
- Nginx 反向代理到 `next start`
- PM2 维持 Node 进程
- 环境变量只放服务器，不进仓库
