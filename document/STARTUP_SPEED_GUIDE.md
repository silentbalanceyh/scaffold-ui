# ⚡ 极速启动优化指南

## 当前状态

- **正常启动时间**: 23 秒
- **目标**: 进一步优化到 15 秒以内

---

## 📊 性能分析

### 当前瓶颈分析

```
缓存大小: 1.4 GB  ← 可能影响启动速度
node_modules: 2.1 GB
```

### 主要耗时来源

| 项目                  | 耗时估算  | 优化方案                               |
|---------------------|-------|------------------------------------|
| **Source Map 生成**   | 3-5秒  | ✅ 禁用 (GENERATE_SOURCEMAP=false)    |
| **TypeScript 类型检查** | 3-5秒  | ✅ 跳过错误 (TSC_COMPILE_ON_ERROR=true) |
| **Webpack 编译**      | 8-10秒 | ✅ 已使用缓存和懒编译                        |
| **ESLint 检查**       | 2-3秒  | ✅ 仅检查修改文件                          |
| **服务器启动**           | 2-3秒  | 正常，难以优化                            |

---

## 🚀 四种启动模式

### 1. ⚡ 极速启动（最快）

```bash
./run-zero.sh
# 选择选项 1
```

**配置**:

- GENERATE_SOURCEMAP=false （禁用 Source Map）
- TSC_COMPILE_ON_ERROR=true （跳过类型检查错误）

**预期时间**: 15-17 秒
**适合场景**: 日常快速开发，临时调试

**权衡**:

- ❌ 无法精确调试（但仍可通过浏览器开发者工具调试）
- ✅ 启动快 40% 左右

---

### 2. 🚀 正常启动（推荐）

```bash
./run-zero.sh
# 选择选项 2
```

**配置**:

- GENERATE_SOURCEMAP=true （启用 Source Map）
- TSC_COMPILE_ON_ERROR=true （跳过类型检查错误）

**预期时间**: 20-23 秒
**适合场景**: 正常开发（当前配置）

**优势**:

- ✅ 支持精确调试
- ✅ 类型检查不阻塞启动
- ✅ 性能和体验平衡

---

### 3. 🔍 完整检查模式

```bash
./run-zero.sh
# 选择选项 3、4、5 或 6
```

**用途**:

- 选项 3: 检查循环依赖
- 选项 4: 分析包大小
- 选项 5: 性能统计
- 选项 6: 全部检查

**预期时间**: 30+ 秒
**适合场景**: 代码审查、性能分析

---

### 4. 🧹 清理缓存模式

```bash
./run-zero.sh
# 选择选项 7 或 8
```

**用途**:

- 解决奇怪的缓存问题
- 清理 1.4GB 缓存空间

**警告**:

- ⚠️ 首次启动会重新生成缓存（较慢）
- ✅ 后续启动会恢复快速

---

## 💡 性能优化建议

### 立即生效的优化

#### 1. 使用极速启动（+5秒）

```bash
./run-zero.sh  # 选择 1
```

#### 2. 禁用 Source Map（+2-3秒）

```bash
GENERATE_SOURCEMAP=false yarn start
```

#### 3. 跳过类型检查（+3-5秒）

```bash
TSC_COMPILE_ON_ERROR=true yarn start
```

#### 4. 合并使用所有优化（预期 15-17秒）

```bash
GENERATE_SOURCEMAP=false TSC_COMPILE_ON_ERROR=true yarn start
```

### 长期优化建议

#### 1. 定期清理缓存

```bash
./run-zero.sh  # 选择 7 或 8
```

- 推荐频率: 每周 1-2 次
- 释放空间: ~1.4GB

#### 2. 更新依赖

```bash
yarn upgrade
```

新版本的 webpack、babel 等工具性能更好

#### 3. 监控启动性能

```bash
./run-zero.sh  # 选择 5（性能统计）
```

#### 4. 按需减少依赖

检查是否有不必要的大型依赖库

---

## 📈 性能对比表

| 启动模式     | Source Map | 类型检查 | 预期时间       | 调试体验  |
|----------|------------|------|------------|-------|
| **极速启动** | ❌ 禁用       | ❌ 跳过 | **15-17s** | ⭐⭐    |
| **正常启动** | ✅ 启用       | ❌ 跳过 | **20-23s** | ⭐⭐⭐⭐  |
| **完整启动** | ✅ 启用       | ✅ 完整 | **25-30s** | ⭐⭐⭐⭐⭐ |

---

## 🛠️ 故障排查

### 问题 1: 启动仍然很慢

**解决方案**:

1. 清理缓存: `./run-zero.sh` 选择 7
2. 更新依赖: `yarn upgrade`
3. 检查磁盘空间
4. 使用 `./run-zero.sh` 选项 5 进行性能分析

### 问题 2: 调试时发现代码问题

**解决方案**:

1. 如使用了极速模式，切换到正常模式
2. 即使无 Source Map，仍可用浏览器开发者工具调试
3. 设置断点仍然有效（只是定位不够精确）

### 问题 3: 类型检查错误导致启动失败

**解决方案**:

1. 确保 `TSC_COMPILE_ON_ERROR=true`
2. 清理缓存重试
3. 运行 `yarn tsc --noEmit` 检查类型错误

### 问题 4: 某些大型依赖导致启动慢

**解决方案**:

1. 运行 `./run-zero.sh` 选项 4（分析包大小）
2. 查看哪些依赖占用空间最大
3. 考虑使用更轻的替代品或延迟加载

---

## 📚 配置文件说明

### .env.development 关键配置

```bash
# 禁用 Source Map（快 2-3秒）
GENERATE_SOURCEMAP=false

# 跳过 TypeScript 类型检查错误（快 3-5秒）
TSC_COMPILE_ON_ERROR=true

# 启用 Fast Refresh（热更新快）
FAST_REFRESH=true

# 仅在完全不需要时使用（不推荐）
# DISABLE_ESLINT_PLUGIN=true

# 如果经常内存溢出
# NODE_OPTIONS=--max-old-space-size=4096
```

### webpack.config.js 已应用的优化

```javascript
// ✅ 已启用：持久化文件系统缓存
cache: {
    type: 'filesystem',
    // ...
}

// ✅ 已启用：懒编译（按需编译）
experiments: {
    lazyCompilation: {
        imports: true,
        entries: false,
    }
}

// ✅ 已优化：ESLint 仅检查修改文件
new ESLintPlugin({
    lintDirtyModulesOnly: isEnvDevelopment,
    // ...
})
```

---

## 🎯 快速开始

### 最快的方式

```bash
# 极速启动（15-17 秒）
./run-zero.sh
# 选择 1
```

### 日常开发（推荐）

```bash
# 正常启动（20-23 秒）
./run-zero.sh
# 选择 2
```

### 直接命令

```bash
# 极速启动
GENERATE_SOURCEMAP=false TSC_COMPILE_ON_ERROR=true yarn start

# 正常启动
yarn start

# 启用性能分析
Z_DEV_PLUGIN_SMP=true yarn start
```

---

## 📊 预期收益

### 从 23 秒优化到 15-17 秒

```
┌─────────────────────────────────────────────┐
│ 优化前: 23 秒                               │
│ 优化后: 15-17 秒（极速模式）                 │
│ 优化后: 20-23 秒（正常模式）                 │
│ 性能提升: 25-35%                           │
└─────────────────────────────────────────────┘
```

### 累积优化效果

假设每天启动 10 次（20 次包括实例模式）：

| 模式     | 每天节省 | 每月节省  | 每年节省 |
|--------|------|-------|------|
| **极速** | ~80秒 | ~40分钟 | ~8小时 |
| **正常** | ~60秒 | ~30分钟 | ~6小时 |

---

## ⚙️ 高级配置

### 环境变量优化

```bash
# 禁用 ESLint（仅在必要时）
DISABLE_ESLINT_PLUGIN=true yarn start

# 增加内存限制（4GB）
NODE_OPTIONS=--max-old-space-size=4096 yarn start

# 禁用浏览器自动打开
BROWSER=none yarn start

# 自定义端口
PORT=3001 yarn start
```

### 组合优化

```bash
# 终极极速启动（最快，调试最弱）
export NODE_OPTIONS=--max-old-space-size=4096
export GENERATE_SOURCEMAP=false
export TSC_COMPILE_ON_ERROR=true
export DISABLE_ESLINT_PLUGIN=false
yarn start
```

---

## 📞 支持

### 查看详细优化文档

```bash
./run-zero.sh
# 选择 9
```

### 性能分析

```bash
./run-zero.sh
# 选择 5（性能统计）
```

### 清理缓存

```bash
./run-zero.sh
# 选择 7 或 8
```

---

## 总结

✅ **立即获得 25-35% 的启动速度提升！**

### 推荐方案

**日常开发**:

```bash
./run-zero.sh  # 选项 2（正常启动）
```

**需要快速反馈循环**:

```bash
./run-zero.sh  # 选项 1（极速启动）
```

**代码审查时**:

```bash
./run-zero.sh  # 选项 3-6（完整检查）
```

---

**下一次启动时，选择"极速启动"试试吧！** ⚡

