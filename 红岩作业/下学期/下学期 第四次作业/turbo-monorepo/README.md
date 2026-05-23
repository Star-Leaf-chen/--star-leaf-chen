# Turbo Monorepo

使用 Turborepo 构建的 Monorepo 项目，体验公共组件库被应用引用的过程。

## 项目结构

```
turbo-monorepo/
├── apps/
│   └── web/              # Web 应用（引用 @monorepo/ui）
├── packages/
│   └── ui/               # 公共组件库
├── .github/
│   └── workflows/
│       ├── ci.yml        # CI：Lint + TypeCheck + Build
│       └── preview.yml   # PR 预览
├── turbo.json            # Turborepo 配置
├── pnpm-workspace.yaml   # pnpm 工作空间配置
└── package.json
```

## 快速开始

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# Lint 检查
pnpm lint
```

## 组件库使用

在 `apps/web` 中引用 `packages/ui`：

```tsx
import { Button, Card, Title } from '@monorepo/ui'

function App() {
  return (
    <Card title="示例">
      <Title level={1}>Hello</Title>
      <Button variant="primary">点击</Button>
    </Card>
  )
}
```

## GitHub Actions CI

推送代码自动执行：

| Job | 说明 |
|-----|------|
| `lint` | ESLint 代码检查 |
| `typecheck` | TypeScript 类型检查 |
| `build` | 构建项目 |

## 注意事项

1. 需要在 GitHub 仓库设置 `TURBO_TOKEN` 和 `TURBO_TEAM` secrets
2. 或者移除 `turbo.json` 中的 `--filter` 限制，简化 CI 配置
