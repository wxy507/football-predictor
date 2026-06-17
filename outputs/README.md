# ⚽ 足球赛事预测系统 Football Predictor

> 预测足球赛事结果和比分，赛后比对，支持作弊模式修改预测

## 功能

- **比赛浏览**：按联赛、状态筛选，搜索球队名
- **比分预测**：预测每场比赛的比分和胜平负结果
- **赛果录入**：手动录入实际赛果
- **预测比对**：自动对比预测与实际赛果，显示准确率
- **作弊模式**：赛后可以修改预测，假装自己猜中了（有标记）
- **每日更新**：GitHub Actions 每天自动拉取最新比赛数据

## 在线地址

部署到 GitHub Pages 后，你的网站地址为：
```
https://<你的GitHub用户名>.github.io/football-predictor/
```

## 部署到 GitHub Pages（在国内可正常访问）

### 方法一：一键部署（推荐）

1. 在 GitHub 上创建一个新仓库，名称为 `football-predictor`
2. 将本目录所有文件上传到该仓库
3. 进入仓库 **Settings → Pages**
4. **Source** 选择 **Deploy from a branch**
5. **Branch** 选择 `main`，文件夹选择 `/ (root)`
6. 点击 **Save**
7. 等待 1-2 分钟，你的网站就发布了！

### 方法二：使用 GitHub Actions 自动部署

1. 上传代码到 GitHub 仓库
2. 创建以下 `.github/workflows/deploy.yml` 文件：

```yaml
name: Deploy to Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - id: deployment
        uses: actions/deploy-pages@v4
```

3. 在仓库 **Settings → Pages** 选择 **GitHub Actions** 作为 Source
4. 推送代码后自动部署

## 每日自动更新比赛数据

本项目已配置 GitHub Actions 自动抓取数据。每 8 小时运行一次：

- **北京时间 10:00、18:00、次日 02:00** 自动更新
- 数据来源：懂球帝、500.com（中国可访问）
- 也可以在仓库 **Actions → Daily Football Data Update → Run workflow** 手动触发

## 手动刷新数据

在网站顶栏点击 **"刷新数据"** 按钮即可手动触发更新。

## 作弊模式说明

1. 点击顶栏的 **作弊模式** 开关
2. 打开一场已结束的比赛
3. 修改比分为任意你想显示的结果
4. 点击 **"修改预测（作弊）"**
5. 修改后的预测会带有 ⚡ 标记

## 本地运行

```bash
# 如果你有 Node.js
npx serve .
# 或者直接用浏览器打开 index.html
open index.html
```

## 项目结构

```
football-predictor/
├── index.html              # 主页面
├── css/style.css           # 样式
├── js/
│   ├── data.js             # 内置比赛数据
│   ├── data-loader.js      # 外部数据加载器
│   ├── storage.js          # localStorage 封装
│   └── app.js              # 应用逻辑
├── scraper/
│   └── fetch-matches.js    # 数据抓取脚本
├── .github/workflows/
│   └── update-data.yml     # 每日自动更新
└── README.md
```

## 技术栈

- 纯前端静态页面（HTML + CSS + JavaScript）
- 数据持久化：浏览器 localStorage
- 数据更新：GitHub Actions + Node.js fetch
- 托管：GitHub Pages（国内可访问）

## 注意事项

- 所有数据存储在浏览器本地，更换设备或清除浏览器数据会丢失预测记录
- 外站数据抓取可能受对方网站限制，如果抓取失败会使用内置演示数据
- 作弊功能仅供娱乐
- 数据来源为公开体育网站，仅用于个人娱乐参考

## License

MIT
