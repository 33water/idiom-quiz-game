# 脑洞大翻车 — 成语猜谜游戏

基于 uni-app + Vue 3 的成语猜谜游戏，融合 AI 陪玩调侃、动态难度、成就系统，边玩边学。

## 功能特性

### 猜谜模式

- **文本模式** — 根据文字谜面（如"给蛇画脚"）猜出对应的成语
- **图像模式** — 根据 Emoji 图案（如 🐍）猜出对应的成语
- **选择题模式** — 四选一（A/B/C/D），正确答案与三个干扰项随机排列
- **输入模式** — 手动输入成语，精确匹配判定

### 回合机制

- 每轮 10 道题目，每题 20 秒倒计时，超时视为答错
- **动态难度分层** — 前约 3 题简单（难度 1），中间 4 题中等（难度 2-3），最后 3 题困难（难度 4-5）
- **自适应难度调整** — 系统根据最近 5 轮的答题准确率动态调整：准确率 > 70% 增加难题比例，< 40% 增加简单题比例

### 道具系统（后悔药）

每轮游戏获得两个一次性道具：

1. **排除一个错误选项** — 消除一个错误答案
2. **偷看首字** — 显示正确答案的第一个字
3. **补充道具** — 两个道具用完后可用 50 分刷新

### 计分规则

- **基础分** — 答对一题 10 分（复习模式 5 分）
- **连胜加成** — 每题额外 +5 分/连胜，上限 +30 分
- **总分公式** — `正确数 × 10 + min(连胜数 × 5, 30)`

### AI 陪玩调侃

- 每道题作答后弹出调侃弹幕，55+ 条台词随机呈现
- **答对时** — 鼓励夸奖类（"不错嘛"、"厉害了我的哥"）
- **答错时** — 调侃吐槽类（"答错了，回去翻翻课本吧"）
- **连续答错 3 次以上** — 触发冷笑话彩蛋弹窗

### 每日签到

- 首页未签到显示红点提示
- 签到奖励 50 积分
- 记录连续签到天数

### 成就徽章

| 徽章 | 达成条件 |
|------|----------|
| 初出茅庐 | 完成第一轮游戏 |
| 小有成就 | 累计答题 50 题 |
| 成语达人 | 累计答题 200 题 |
| 脑洞大开 | 单轮满分（10 题全对） |
| 翻车王 | 单轮最多答错 2 题及以下 |

### 成语词典

- **搜索** — 按成语文字、拼音或释义全文检索
- **分类筛选** — 寓言故事、历史典故、文学艺术、祝福吉祥四大类别
- **详情弹窗** — 点击成语查看完整释义、出处、近义词、反义词、例句
- **收藏** — 可将成语加入收藏集，方便复习

### 错题本

- 自动收集答错的成语
- 支持单条删除和清空全部
- **一键复习** — 对错题发起复习模式，重新作答

### 历史记录

- 展示最近 10 轮游戏记录
- 每轮记录以彩色进度条显示正确/错误比例
- 可点击查看该轮详情与复盘

### 学习统计

- 总积分、今日得分、准确率对比图
- 近 10 轮成绩趋势图
- 连胜纪录、今日活跃度

### 个人中心

- 头像上传（调用系统相机/相册）
- 昵称编辑
- 积分/连胜/总答题数/总正确数四维统计
- 成就徽章展示墙
- 设置入口（声音开关、AI 调侃开关、深色/浅色主题、重置积分、清除数据）

### 交互体验

- **深色/浅色主题** — 跟随系统或手动切换，全应用适配
- **音效系统** — 全部通过 Web Audio API 合成（无音频文件），正确/错误/超时各有专属音效，背景音乐可开关
- **底部标签导航** — 首页、词典、个人中心三 Tab
- **弹窗系统** — 底部弹出式设计，滑入动画，包含签到、详情、调侃、冷笑话等多种类型

## 在线体验

[https://33water.github.io/idiom-quiz-game/](https://33water.github.io/idiom-quiz-game/)

## 本地运行

1. 克隆仓库：

   ```bash
   git clone https://github.com/33water/idiom-quiz-game.git
   cd idiom-quiz-game/output
   ```

2. 安装依赖：

   ```bash
   npm install
   ```

3. 启动开发服务器：

   ```bash
   # Windows CMD
   set UNI_INPUT_DIR=. && npm run dev

   # Git Bash
   export UNI_INPUT_DIR=. && npm run dev
   ```

4. 构建生产版本：

   ```bash
   set UNI_INPUT_DIR=. && npm run build
   ```

## 技术栈

| 技术 | 用途 |
|------|------|
| uni-app 3.x | 跨平台应用框架，编译为 H5 |
| Vue 3 (Composition API) | 前端 UI 框架 |
| Vite 5 | 构建工具 |
| SCSS | 样式预处理与设计变量 |
| Web Audio API | 音效合成（无音频文件） |
| localStorage | 数据持久化 |

## 项目结构

```
output/
├── App.vue                    # 应用入口（用户数据加载、主题应用）
├── main.js                    # Vue 应用启动
├── manifest.json              # uni-app 配置文件
├── pages.json                 # 路由配置（10 个页面）
├── package.json               # 项目依赖
├── vite.config.js             # Vite 构建配置
├── uni.scss                   # 全局 SCSS 变量与主题色
├── index.html                 # SPA 入口
├── data/                      # 数据层
│   ├── idioms.js              # 40 条成语题库（谜面、选项、释义）
│   ├── idiomEngine.js         # 出题引擎（动态难度、评分、自适应）
│   ├── aiTaunts.js            # AI 调侃台词库（55+ 条）
│   ├── userStore.js           # 响应式用户状态 + localStorage 持久化
│   └── soundManager.js        # Web Audio API 音效合成与背景音乐
├── components/                # 可复用组件
│   ├── TabBar.vue             # 底部标签导航
│   ├── IdiomCard.vue          # 成语卡片
│   ├── IdiomDetailPopup.vue   # 成语详情底部弹窗
│   ├── AiTauntPopup.vue       # AI 调侃弹窗
│   ├── SignInPopup.vue        # 每日签到弹窗
│   └── JokePopup.vue          # 冷笑话彩蛋弹窗
├── pages/                     # 10 个页面
│   ├── index/index.vue        # 首页（积分、签到、搜索、模式选择）
│   ├── game/game.vue          # 游戏主页面（答题、计时、道具）
│   ├── settle/settle.vue      # 结算页面
│   ├── encourage/encourage.vue# 鼓励页面
│   ├── history/history.vue    # 历史记录
│   ├── error/error.vue        # 错题本
│   ├── collection/collection.vue # 收藏集
│   ├── dictionary/dictionary.vue # 成语词典
│   ├── profile/profile.vue    # 个人中心
│   └── statistics/statistics.vue # 学习统计
├── scripts/
│   └── fix-paths.js           # 部署路径修正脚本
└── .github/workflows/
    └── deploy.yml             # GitHub Actions 自动部署
```

### 各模块说明

| 模块 | 职责 |
|------|------|
| `data/idiomEngine.js` | 出题引擎：从题库随机选题，动态难度分层，自适应策略调整，计分与连胜逻辑 |
| `data/userStore.js` | 用户状态管理：响应式数据 + localStorage 同步，支持积分、设置、进度等持久化 |
| `data/soundManager.js` | 音效管理器：Web Audio API 合成正确/错误/超时/背景音乐，音量控制 |
| `components/*.vue` | 可复用弹窗和导航组件，采用底部弹出式交互设计 |
| `pages/*.vue` | 各功能页面，通过 pages.json 配置路由 |

## 数据存储

所有数据存储在浏览器本地 localStorage：

| 存储键 | 内容 |
|--------|------|
| `user_data` | 用户信息、积分、设置、签到、成就等 |
| `idiom_errors` | 错题记录 |
| `idiom_favorites` | 收藏的成语 |
| `idiom_records` | 游戏历史记录（最近 10 轮） |

## 许可证

本项目暂未选择开源许可证。默认保留所有权利，仅供学习与参考。如需将本项目用于商业用途或二次分发，请联系作者获取授权。
