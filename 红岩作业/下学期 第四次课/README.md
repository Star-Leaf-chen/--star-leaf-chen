# Webpack + React/Vue + TypeScript + CSS Module

基于 Webpack 5 配置的开发环境，支持 ESLint + Husky + Vitest。

## 快速开始

```bash
# 一键初始化
bash setup-husky.sh
```

## 脚本命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建 |
| `npm run lint` | ESLint 检查 |
| `npm run lint:fix` | ESLint 修复 |
| `npm run test` | 运行测试 |
| `npm run test:watch` | 监听模式运行测试 |

## Git Hooks (Husky)

提交前自动运行：
1. ESLint 代码检查
2. Vitest 单元测试

### 手动启用/禁用 Husky

```bash
# 启用
npx husky install

# 禁用
npx husky uninstall
```

## 测试示例

```typescript
// src/utils/index.test.ts
import { describe, it, expect } from 'vitest'
import { isEmail, randomString } from '../utils/index'

describe('工具函数测试', () => {
  it('邮箱验证', () => {
    expect(isEmail('test@example.com')).toBe(true)
  })

  it('随机字符串', () => {
    expect(randomString(8).length).toBe(8)
  })
})
```

## 项目结构

```
├── webpack.config.js     # Webpack 配置
├── vite.config.ts        # Vitest 配置
├── eslint.config.mjs     # ESLint 配置
├── package.json
├── public/
│   └── index.html
├── src/
│   ├── utils/
│   │   ├── index.ts      # 工具函数
│   │   └── index.test.ts # 单元测试
│   ├── App.tsx
│   ├── App.vue
│   └── index.tsx
└── .husky/
    └── pre-commit         # 提交前检查
```
