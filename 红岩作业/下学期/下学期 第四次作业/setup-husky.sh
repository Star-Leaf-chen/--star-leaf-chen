#!/bin/bash

# 安装依赖
npm install

# 初始化 Husky
npx husky install

echo "✅ 项目设置完成！"
echo ""
echo "已配置："
echo "  - ESLint 代码检查"
echo "  - Vitest 单元测试"
echo "  - Husky Git Hooks"
echo ""
echo "提交前会自动运行："
echo "  1. ESLint 检查"
echo "  2. Vitest 测试"
