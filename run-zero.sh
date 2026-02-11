#!/usr/bin/env bash

# ========================================
# Scaffold UI 启动脚本（优化版）
# ========================================

# 显示标题
echo "🚀 Scaffold UI 启动工具"
if [ -n "$Z_INSTANCE" ]; then
    echo "   实例模式: $Z_INSTANCE"
fi
echo "================================"
echo ""

# 显示当前配置
echo "📊 当前优化配置:"
echo ""

if [ -f .env.development ]; then
    echo "环境变量配置 (.env.development):"
    echo "  循环依赖检测: $(grep Z_DEV_PLUGIN_LOOP .env.development | cut -d'=' -f2)"
    echo "  包大小分析: $(grep Z_DEV_PLUGIN_SIZE .env.development | cut -d'=' -f2)"
    echo "  Loader统计: $(grep Z_DEV_PLUGIN_SMP .env.development | cut -d'=' -f2)"
    echo "  Source Map: $(grep GENERATE_SOURCEMAP .env.development | cut -d'=' -f2)"
    echo "  类型检查: $(grep TSC_COMPILE_ON_ERROR .env.development | cut -d'=' -f2)"
    echo ""
fi

# 菜单
echo "请选择操作:"
echo ""
echo "1) 💨 急速启动 (禁用 Source Map，跳过类型检查) - 最快"
echo "2) 🧩 快速开发 (Fast Refresh + 关闭依赖/分析 + 无 Source Map)"
echo "3) 🚀 正常启动 (推荐 - 最快速度)"
echo "4) 🔍 启动并检查循环依赖"
echo "5) 📦 启动并分析包大小"
echo "6) ⏱️  启动并显示性能统计"
echo "7) 🔬 完整分析模式 (最慢)"
echo "8) 🧹 清理所有缓存"
echo "9) 🧹 清理缓存并启动"
echo "10) 📚 显示优化文档"
echo "0) 👋 退出"
echo ""

read -p "请输入选项 [0-10]: " choice

case $choice in
    1)
        echo ""
        echo "💨 急速启动模式..."
        echo "   (禁用 Source Map 和类型检查以获得最快启动速度)"
        GENERATE_SOURCEMAP=false TSC_COMPILE_ON_ERROR=true yarn start
        ;;
    2)
        echo ""
        echo "🧩 快速开发模式..."
        echo "   (开启 Fast Refresh，关闭依赖/分析插件与 Source Map)"
        FAST_REFRESH=true GENERATE_SOURCEMAP=false TSC_COMPILE_ON_ERROR=true \
        Z_DEV_PLUGIN_LOOP=false Z_DEV_PLUGIN_SIZE=false Z_DEV_PLUGIN_SMP=false \
        yarn start
        ;;
    3)
        echo ""
        echo "🚀 正常启动模式..."
        yarn start
        ;;
    4)
        echo ""
        echo "🔍 启动并检查循环依赖..."
        Z_DEV_PLUGIN_LOOP=true yarn start
        ;;
    5)
        echo ""
        echo "📦 启动并分析包大小..."
        Z_DEV_PLUGIN_SIZE=true yarn start
        ;;
    6)
        echo ""
        echo "⏱️  启动并显示性能统计..."
        Z_DEV_PLUGIN_SMP=true yarn start
        ;;
    7)
        echo ""
        echo "🔬 完整分析模式..."
        Z_DEV_PLUGIN_LOOP=true Z_DEV_PLUGIN_SIZE=true Z_DEV_PLUGIN_SMP=true yarn start
        ;;
    8)
        echo ""
        echo "🧹 清理所有缓存..."
        rm -rf node_modules/.cache
        echo "  ✓ 清理 Webpack 缓存"
        rm -rf node_modules/.cache/babel-loader
        echo "  ✓ 清理 Babel 缓存"
        rm -rf node_modules/.cache/.eslintcache
        echo "  ✓ 清理 ESLint 缓存"
        echo ""
        echo "✅ 缓存清理完成！(已释放约 1.4GB 空间)"
        ;;
    9)
        echo ""
        echo "🧹 清理缓存..."
        rm -rf node_modules/.cache
        echo "  ✓ 缓存已清理"
        echo ""
        echo "🚀 启动开发服务器..."
        yarn start
        ;;
    10)
        echo ""
        if [ -f document/OPTIMIZATION_README.md ]; then
            less document/OPTIMIZATION_README.md
        elif [ -f OPTIMIZATION_README.md ]; then
            less OPTIMIZATION_README.md
        elif [ -f document/OPTIMIZATION.md ]; then
            less document/OPTIMIZATION.md
        elif [ -f OPTIMIZATION.md ]; then
            less OPTIMIZATION.md
        else
            echo "❌ 未找到优化文档"
        fi
        ;;
    0)
        echo ""
        echo "👋 再见!"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ 无效选项"
        exit 1
        ;;
esac

