# GitHub Pages 部署指南

## 📋 部署步骤

### 方式一：自动部署（推荐）

#### 1. 创建 GitHub 仓库
```bash
# 在项目根目录初始化 git
git init
git add .
git commit -m "Initial commit"

# 创建 GitHub 仓库后添加远程地址
git remote add origin https://github.com/你的用户名/windsurf-project.git
git branch -M main
git push -u origin main
```

#### 2. 启用 GitHub Pages
1. 进入 GitHub 仓库设置页面
2. 找到 "Pages" 设置项
3. Source 选择 "GitHub Actions"
4. 保存设置

#### 3. 触发自动部署
```bash
# 每次推送代码到 main 分支会自动部署
git add .
git commit -m "更新功能"
git push
```

#### 4. 访问网站
部署完成后访问：`https://你的用户名.github.io/windsurf-project/`

---

### 方式二：手动部署

#### 1. 安装依赖
```bash
npm install
```

#### 2. 手动部署
```bash
# 一键部署命令
npm run deploy
```

---

## ⚙️ 配置说明

### Vite 配置
```typescript
// vite.config.ts 中的关键配置
base: process.env.NODE_ENV === 'production' ? '/windsurf-project/' : '/'
```
- 这确保了资源路径在 GitHub Pages 子目录中正确加载

### GitHub Actions 工作流
- 文件位置：`.github/workflows/deploy.yml`
- 自动触发：推送到 main 分支时
- 构建命令：`npm run build:prod`

---

## 🔧 自定义域名（可选）

### 1. 添加 CNAME 文件
```bash
# 在 public 文件夹创建 CNAME 文件
echo "your-domain.com" > public/CNAME
```

### 2. DNS 配置
在你的域名服务商设置 CNAME 记录：
```
www.your-domain.com -> 你的用户名.github.io
```

---

## 📊 部署状态检查

### 查看部署状态
1. 进入 GitHub 仓库
2. 点击 "Actions" 标签
3. 查看最新的工作流运行状态

### 常见问题

#### 问题 1：404 错误
**解决方案：**
- 检查仓库名是否为 `windsurf-project`
- 确认 vite.config.ts 中的 base 路径正确

#### 问题 2：资源加载失败
**解决方案：**
- 确保在生产环境中正确设置了 `NODE_ENV=production`
- 检查构建后的资源路径

#### 问题 3：GitHub Actions 失败
**解决方案：**
- 检查 package.json 中的脚本是否正确
- 确认所有依赖都已正确安装

---

## 🚀 快速命令参考

```bash
# 开发环境
npm run dev

# 本地构建测试
npm run build:prod
npm run preview

# 部署到 GitHub Pages
npm run deploy

# 代码检查
npm run lint
npm run type-check
```

---

## 📝 注意事项

1. **仓库名必须与 vite.config.ts 中的 base 路径匹配**
2. **首次部署可能需要 5-10 分钟生效**
3. **修改配置后记得重新构建部署**
4. **确保 GitHub 仓库是公开的（免费账户限制）**

部署完成后，你就可以通过 `https://你的用户名.github.io/windsurf-project/` 访问你的提示词管理器了！
