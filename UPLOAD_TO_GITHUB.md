# 上传到新 GitHub 仓库的步骤

## ✅ 已完成的准备工作：
- [x] 清理了旧的 Git 记录
- [x] 创建了新的 Git 仓库
- [x] 添加了所有源文件（排除了 node_modules）
- [x] 创建了初始提交
- [x] 设置了 main 分支

## 🚀 下一步操作：

### 1. 创建 GitHub 仓库
1. 访问：https://github.com/new
2. 仓库名称：`windsurf-project` ⚠️ **必须是这个名称**
3. 设置为 Public（GitHub Pages 需要）
4. **不要勾选**"Add a README file"、".gitignore"、"license"

### 2. 连接并推送到 GitHub
在项目目录执行以下命令（替换你的用户名）：

```bash
# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/windsurf-project.git

# 推送到 GitHub
git push -u origin main
```

### 3. 启用 GitHub Pages
1. 进入仓库页面
2. 点击 Settings 标签
3. 左侧菜单找到 Pages
4. Source 选择 "GitHub Actions"
5. 保存设置

### 4. 访问网站
部署完成后访问：
`https://YOUR_USERNAME.github.io/windsurf-project/`

## 🔧 如果遇到问题：

### 问题：推送被拒绝
```bash
# 如果远程仓库有默认文件，强制推送
git push -u origin main --force
```

### 问题：仓库名称不对
如果你的仓库名称不是 `windsurf-project`，需要修改 `vite.config.ts` 中的 base 路径：
```typescript
base: process.env.NODE_ENV === 'production' ? '/你的仓库名/' : '/'
```

## 📊 推送后检查：
- [ ] 代码已上传到 GitHub
- [ ] GitHub Actions 开始运行
- [ ] Actions 页面显示绿色 ✅
- [ ] 网站可以正常访问

---

**重要提醒：** 首次部署可能需要 5-10 分钟生效，请耐心等待！
