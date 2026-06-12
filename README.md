# 蓝珊瑚潜水俱乐部 - 课程与装备管理系统

基于 Vue3 + TypeScript + Vite + Tailwind CSS 构建的潜水俱乐部课程与装备页面，支持学员端（手机）和顾问端（平板）双视图切换。

## 原始需求

> 请制作潜水俱乐部课程与装备页面，Vue3 页面展示课程等级、教练、泳池课、开放水域日期、健康声明、装备尺码、证书进度和海况提醒。学员在手机上选择体验潜水、开放水域、进阶或救援课程，查看训练阶段、装备清单和集合地点；顾问在平板上组合课程、确认体检限制和分配装备。页面视觉要有海域层次，课程卡、装备尺码和海况标签要清晰，窄屏下先保证报名和确认行程顺畅。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 下一代前端构建工具
- **Tailwind CSS 3** - 实用优先的 CSS 框架
- **Vue Router** - Vue.js 官方路由
- **Lucide Vue Next** - 精美的图标库
- **clsx + tailwind-merge** - 样式类名组合工具

## 核心功能

### 学员端（手机端优化）
- 4 级课程选择：体验潜水 DSD / 开放水域 OW / 进阶 AOW / 救援 RD
- 多步骤报名流程：选课 → 排期 → 教练 → 装备 → 健康声明 → 确认行程
- 训练阶段时间线（理论课/泳池课/开放水域）
- 装备尺码选择 + 尺码对照表
- 潜水健康声明问卷
- 证书进度追踪
- 海况预报与提醒
- 集合地点导航

### 顾问端（平板端优化）
- 课程组合套餐（数量加减、价格汇总、优惠计算）
- 健康限制对照表（禁止 / 需医生证明 / 谨慎评估）
- 学员健康评估（通过 / 待评估 / 不通过 三级状态）
- 装备分配总览（按学员、按装备双向查看）
- 分配完成度进度条
- 导出分配清单

## 启动方式

### 前置要求

- **Node.js** >= 18.0.0（推荐 20.x LTS）
- **npm** >= 9.0.0 或 **pnpm** >= 8.0.0
- 现代浏览器（Chrome / Firefox / Safari / Edge 最新版本）

### 启动步骤

#### 1. 安装依赖

```bash
npm install
```

或使用 pnpm：

```bash
pnpm install
```

#### 2. 启动服务

开发模式（带热更新）：

```bash
npm run dev
```

访问地址：[http://localhost:5173](http://localhost:5173)

生产构建预览：

```bash
npm run build
npm run preview
```

预览地址：[http://localhost:4173](http://localhost:4173)

### 代码检查

TypeScript 类型检查：

```bash
npm run check
```

ESLint 代码检查：

```bash
npm run lint
```

自动修复 lint 问题：

```bash
npm run lint:fix
```

## Docker 一键启动（推荐）

### 前置要求

- **Docker** >= 20.10.0
- **Docker Compose** >= 2.0.0

### 构建并启动

在项目根目录执行：

```bash
docker compose up --build
```

后台运行：

```bash
docker compose up --build -d
```

访问地址：[http://localhost:8080](http://localhost:8080)

### 查看日志

```bash
docker compose logs -f
```

### 停止并清理服务

```bash
docker compose down
```

### 健康检查

容器内置健康检查，访问：[http://localhost:8080/health](http://localhost:8080/health)

返回 `healthy` 表示服务正常。

## 项目目录结构

```
wl-308/
├── src/
│   ├── components/          # 组件目录
│   │   ├── CourseCard.vue              # 课程卡片
│   │   ├── InstructorCard.vue          # 教练卡片
│   │   ├── TrainingTimeline.vue        # 训练阶段时间线
│   │   ├── EquipmentSizeSelector.vue   # 装备尺码选择
│   │   ├── HealthDeclarationForm.vue   # 健康声明表单
│   │   ├── SeaConditionAlert.vue       # 海况提醒标签
│   │   ├── CertificateProgressCard.vue # 证书进度卡片
│   │   ├── CourseDatePicker.vue        # 课程排期选择
│   │   ├── MeetingPointCard.vue        # 集合地点卡片
│   │   ├── StudentView.vue             # 学员视图（6步报名）
│   │   └── AdvisorView.vue             # 顾问视图（3个管理标签）
│   ├── data/
│   │   └── index.ts                    # 类型定义 + 模拟数据
│   ├── pages/
│   │   └── HomePage.vue                # 主页面（海域视觉 + 双视图切换）
│   ├── router/
│   │   └── index.ts                    # 路由配置
│   ├── style.css                       # 全局样式 + 海浪气泡动画
│   ├── App.vue
│   └── main.ts
├── Dockerfile                          # 多阶段构建配置
├── docker-compose.yml                  # 编排配置
├── nginx.conf                          # Nginx 生产配置（gzip + 缓存）
├── .dockerignore                       # Docker 构建排除文件
├── tailwind.config.js                  # Tailwind 海洋主题配置
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 设计特点

### 海域层次视觉
- 从深海（#001f33）到浅海（#007a99）的渐变背景
- 4 层波浪叠加动画，模拟海水流动
- 15 个随机气泡上升动画
- 鱼、贝壳、锚等装饰图标浮动效果

### 响应式适配
- **窄屏（<640px）**：移动端竖排布局，步骤条改为顶部横向进度条，底部固定操作按钮
- **中屏（640-1024px）**：平板端双列网格，顾问端表格支持横向滚动
- **宽屏（>1024px）**：桌面端多列布局，充分利用空间
- 所有交互元素最小触摸尺寸 >= 44px

### 色彩体系
| 色系 | 用途 |
|------|------|
| Ocean（海洋蓝） | 主色调、背景、信息类标签 |
| Coral（珊瑚橙） | 强调色、CTA按钮、价格、警示 |
| Kelp（海藻绿） | 成功状态、通过、已完成 |
| Sand（沙金） | 警告、待处理、一般状态 |

## 注意事项

1. 当前页面使用模拟数据（位于 `src/data/index.ts`），接入真实后端时需替换数据源
2. 健康声明问卷结果仅作前端展示，正式使用需咨询专业医疗人员
3. Docker 构建使用多阶段构建（Node 20 + Nginx Alpine），最终镜像约 50MB
4. 如需修改端口，调整 `docker-compose.yml` 中的 `ports` 映射（左侧为宿主机端口）
