# 启动优化快速参考

## 优化内容总结

### ✅ 已完成的优化

1. **环境变量优化** (.env.development)
    - 禁用循环依赖检测插件 (Z_DEV_PLUGIN_LOOP=false)
    - 禁用包大小分析插件 (Z_DEV_PLUGIN_SIZE=false)
    - 禁用性能统计插件 (Z_DEV_PLUGIN_SMP=false)

2. **Thread-Loader 优化** (webpack.config.js)
    - 移除 source-map-loader 的 thread-loader（减少不必要的进程开销）
    - 移除 SVG 处理的 thread-loader（文件少，多线程反而慢）
    - 优化 JS 处理的 worker 数量和配置
    - 优化 vendor 处理仅使用 2 个 worker

3. **Webpack 5 特性** (webpack.config.js)
    - 启用 `lazyCompilation` 实验性功能（按需编译动态导入）
    - 优化持久化缓存配置

4. **ESLint 优化** (webpack.config.js)
    - 开发模式只检查修改的文件 (lintDirtyModulesOnly)
    - 充分利用缓存

## 快速使用

### 日常开发（推荐）

```bash
npm start
# 或使用新的优化脚本
./run-zero.sh
```

### 需要代码质量检查

```bash
# 检查循环依赖
Z_DEV_PLUGIN_LOOP=true npm start

# 分析包大小
Z_DEV_PLUGIN_SIZE=true npm start

# 性能统计
Z_DEV_PLUGIN_SMP=true npm start
```

### 清理缓存

```bash
# 使用优化脚本（推荐）
./run-zero.sh  # 选择选项 6 或 7

# 或手动清理
rm -rf node_modules/.cache
```

## 预期性能提升

| 场景   | 优化前    | 优化后    | 提升   |
|------|--------|--------|------|
| 首次启动 | 60-90s | 40-60s | ~40% |
| 二次启动 | 40-60s | 10-20s | ~70% |
| 热更新  | 2-5s   | 1-3s   | ~50% |

## 文件变更清单

- ✅ `.env.development` - 禁用开发插件
- ✅ `config/webpack.config.js` - Thread-loader 优化、懒编译、ESLint 优化
- ✅ `OPTIMIZATION.md` - 详细优化文档
- ✅ `run-zero.sh` - 快速启动脚本
- ✅ `OPTIMIZATION_SUMMARY.md` - 本文档

## 注意事项

1. **首次启动后性能最佳** - Webpack 5 缓存生效后，后续启动会快很多
2. **插件按需开启** - 循环依赖、包分析等插件仅在需要时开启
3. **缓存问题** - 如遇怪问题，清理缓存重启: `rm -rf node_modules/.cache && npm start`
4. **内存不足** - 设置环境变量: `export NODE_OPTIONS="--max-old-space-size=4096"`

## 更多信息

查看完整优化文档: `OPTIMIZATION.md`

