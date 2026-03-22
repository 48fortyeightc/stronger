# stronger 阿里云 ECS 部署说明

## 1. 服务器准备

- 操作系统：Ubuntu 22.04
- 安装 Node.js 20
- 安装 Nginx
- 安装 PM2

## 2. 上传项目

将项目放到服务器目录：

```bash
/var/www/stronger
```

## 3. 安装并构建

```bash
cd /var/www/stronger
npm install
cp .env.example .env.local
npm run build
```

在 `.env.local` 中填写：

- `AI_PROVIDER=qwen`
- `QWEN_API_KEY=你的新密钥`
- `QWEN_MODEL=qwen-plus`

## 4. 启动服务

```bash
pm2 start ecosystem.config.cjs
pm2 save
```

## 5. 配置 Nginx

将 `deploy/nginx/stronger.conf` 放到：

```bash
/etc/nginx/sites-available/stronger.conf
```

然后建立软链接并重启：

```bash
sudo ln -s /etc/nginx/sites-available/stronger.conf /etc/nginx/sites-enabled/stronger.conf
sudo nginx -t
sudo systemctl reload nginx
```

## 6. 上线前注意事项

- 旋转已经暴露过的 ECS root 密码
- 旋转已经暴露过的千问 API Key
- 不要把真实密钥提交到仓库
