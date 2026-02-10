# 🔄 启动脚本整合更新说明

## 更新时间

2026-02-09

## 更新内容

### ✅ 已完成的整合工作

1. **run-zero.sh 增强** ⭐️
    - 整合了 run-optimized.sh 的所有优化功能
    - 支持实例模式（检测 Z_INSTANCE 环境变量）
    - 提供交互式菜单选择
    - 支持各种开发模式和缓存管理

2. **run-zero-instance.sh 简化** ⭐️
    - 改为调用 run-zero.sh
    - 自动设置 Z_INSTANCE 环境变量
    - 保持原有的实例参数验证

3. **移除冗余文件**
    - ✅ 删除 run-optimized.sh（功能已整合）
    - ✅ 更新所有文档中的脚本引用

4. **文档更新**
    - ✅ 所有 OPTIMIZATION*.md 文档已更新
    - ✅ 所有 run-optimized.sh 引用改为 run-zero.sh

---

## 使用方式

### 1. 正常启动（单应用模式）

```bash
./run-zero.sh
```

会显示交互式菜单：

```
🚀 Scaffold UI 启动工具
================================

📊 当前优化配置:

请选择操作:

1) 正常启动 (推荐 - 最快速度)
2) 启动并检查循环依赖
3) 启动并分析包大小
4) 启动并显示性能统计
5) 完整分析模式 (最慢)
6) 清理所有缓存
7) 清理缓存并启动
8) 显示优化文档
0) 退出

请输入选项 [0-8]:
```

### 2. 实例模式启动（多应用模式）

```bash
./run-zero-instance.sh hotel.001
```

会自动：

1. 设置 Z_INSTANCE=hotel.001
2. 调用 run-zero.sh
3. 显示实例信息和交互式菜单

输出示例：

```
📦 实例模式: hotel.001

🚀 Scaffold UI 启动工具
   实例模式: hotel.001
================================
...
```

---

## 功能清单

### 启动模式

| 选项 | 功能      | 说明                         |
|----|---------|----------------------------|
| 1  | 正常启动    | 最快速度，推荐日常开发                |
| 2  | 检查循环依赖  | 启用 Z_DEV_PLUGIN_LOOP       |
| 3  | 分析包大小   | 启用 Z_DEV_PLUGIN_SIZE       |
| 4  | 性能统计    | 启用 Z_DEV_PLUGIN_SMP        |
| 5  | 完整分析    | 启用所有分析插件（最慢）               |
| 6  | 清理缓存    | 清理 Webpack/Babel/ESLint 缓存 |
| 7  | 清理缓存并启动 | 清理后立即启动                    |
| 8  | 显示优化文档  | 查看 OPTIMIZATION.md         |
| 0  | 退出      | 退出脚本                       |

---

## 脚本架构

```
run-zero.sh (主脚本)
├── 显示标题和配置
├── 检测 Z_INSTANCE (实例模式)
├── 显示交互式菜单
└── 执行选择的操作

run-zero-instance.sh (实例启动)
├── 验证参数
├── 设置 Z_INSTANCE
└── 调用 run-zero.sh
```

---

## 兼容性

### 旧的启动方式仍然有效

```bash
# 直接使用 yarn/npm（跳过菜单）
yarn start
npm start

# 环境变量方式
Z_DEV_PLUGIN_LOOP=true yarn start

# 实例模式（传统方式，但现在通过 run-zero.sh）
Z_INSTANCE=hotel.001 yarn start
```

---

## 优势

### ✅ 统一入口

- 所有启动方式都通过 run-zero.sh
- 减少脚本维护成本
- 功能集中管理

### ✅ 保持兼容

- run-zero-instance.sh 保留原有接口
- Z_INSTANCE 环境变量机制不变
- 传统启动方式仍然可用

### ✅ 功能增强

- 交互式菜单更友好
- 支持更多开发模式
- 缓存管理更方便

### ✅ 代码简洁

- 删除冗余脚本
- 减少重复代码
- 易于维护

---

## 文件变更总结

### 修改的文件

- ✅ `run-zero.sh` - 整合优化功能，支持实例模式
- ✅ `run-zero-instance.sh` - 改为调用 run-zero.sh

### 删除的文件

- ✅ `run-optimized.sh` - 功能已整合到 run-zero.sh

### 更新的文档

- ✅ `document/OPTIMIZATION.md`
- ✅ `document/OPTIMIZATION_README.md`
- ✅ `document/OPTIMIZATION_SUMMARY.md`
- ✅ `document/OPTIMIZATION_COMPLETE.md`

---

## 测试验证

### 测试正常启动

```bash
./run-zero.sh
# 选择选项 1
```

### 测试实例模式

```bash
./run-zero-instance.sh hotel.001
# 选择选项 1
```

### 测试清理缓存

```bash
./run-zero.sh
# 选择选项 6
```

### 测试分析模式

```bash
./run-zero.sh
# 选择选项 2、3 或 4
```

---

## 注意事项

1. **首次使用**
    - 脚本需要可执行权限（已设置）
    - 实例模式需要对应的实例配置文件

2. **实例配置**
    - 实例配置文件位置: `running/<实例名>/.env.development.instance`
    - 确保实例配置文件存在

3. **兼容性**
    - 所有旧的启动方式仍然有效
    - 环境变量机制保持不变

---

## 后续建议

### 短期

- [ ] 团队成员了解新的脚本结构
- [ ] 测试各种启动模式
- [ ] 验证实例模式正常工作

### 长期

- [ ] 考虑添加更多快捷选项
- [ ] 优化菜单显示
- [ ] 添加配置文件支持（可选）

---

## 帮助和支持

### 查看优化文档

```bash
./run-zero.sh
# 选择选项 8
```

### 查看使用帮助

```bash
./run-zero.sh --help           # TODO: 未来可以添加
./run-zero-instance.sh         # 显示使用说明
```

### 其他文档

- `document/OPTIMIZATION_README.md` - 完整使用指南
- `document/OPTIMIZATION.md` - 技术细节
- `show-optimization-diff.sh` - 查看优化对比

---

**整合完成！现在可以使用统一的 run-zero.sh 启动脚本了。** 🎉

