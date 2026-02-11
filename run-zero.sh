#!/usr/bin/env bash

# ========================================
# Scaffold UI 启动脚本（优化版）
# ========================================

# 记录从 .env.* 加载的变量名（用于环境变量检查菜单）
ENV_LOADED_KEYS=()

# 辅助函数：安全加载环境变量（支持行内注释，KEY=value 格式不变）
load_env_file() {
    if [ -f "$1" ]; then
        while IFS= read -r line; do
            # 跳过注释行和空行
            [[ $line =~ ^[[:space:]]*# ]] && continue
            [[ $line =~ ^[[:space:]]*$ ]] && continue
            # 仅处理 KEY=value 形式（支持含 = 的值）
            if [[ $line =~ ^([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]]; then
                key="${BASH_REMATCH[1]}"
                value="${BASH_REMATCH[2]}"
                # 移除行尾注释（区分色彩变量与普通变量）：
                # - 色彩类变量（如 Z_CSS_COLOR）值可能含 #36648b，仅当 # 前有空白才视为注释
                # - 其他变量值不含 #，一旦出现 # 即视为注释并截断
                if [[ $key =~ [Cc][Oo][Ll][Oo][Rr] ]]; then
                    value=$(echo "$value" | sed 's/[[:space:]]+#.*$//')
                else
                    value=$(echo "$value" | sed 's/#.*$//')
                fi
                # 去掉首尾全部空白（含制表符、多空格）
                value="${value#"${value%%[![:space:]]*}"}"
                value="${value%"${value##*[![:space:]]}"}"
                # 若值为 "#xxx" 形式，去掉首尾双引号，避免 export 时引号嵌套解析失败
                [[ $value =~ ^\"([^\"]*)\"$ ]] && value="${BASH_REMATCH[1]}"
                # 用 %q 安全引用后再 export，避免值中的 # 被 shell 当注释截断
                eval "export $(printf '%s=%q' "$key" "$value")"
                ENV_LOADED_KEYS+=( "$key" )
            fi
        done < "$1"
    fi
}

# 打印当前已加载的环境变量（对应 .env.* 中的全部变量）
show_loaded_env() {
    echo ""
    echo "🔧 环境变量检查（来自 .env / .env.local / .env.development）"
    echo "================================================================"
    if [ ${#ENV_LOADED_KEYS[@]} -eq 0 ]; then
        echo "  (未加载任何 .env 文件)"
        echo ""
        return
    fi
    # 去重、排序后逐行打印 KEY=当前值
    for key in $(printf '%s\n' "${ENV_LOADED_KEYS[@]}" | sort -u); do
        printf "  %s=%s\n" "$key" "${!key}"
    done
    echo "================================================================"
    echo ""
}

# 启动前加载环境变量（保持 .env.* 格式不变，确保对子进程生效）
if [ -f .env ]; then
    load_env_file .env
fi
if [ -f .env.local ]; then
    load_env_file .env.local
fi
if [ -f .env.development ]; then
    load_env_file .env.development
fi

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
    echo "  循环依赖检测: $(grep Z_DEV_PLUGIN_LOOP .env.development | cut -d'=' -f2 | cut -d'#' -f1 | xargs)"
    echo "  包大小分析: $(grep Z_DEV_PLUGIN_SIZE .env.development | cut -d'=' -f2 | cut -d'#' -f1 | xargs)"
    echo "  Loader统计: $(grep Z_DEV_PLUGIN_SMP .env.development | cut -d'=' -f2 | cut -d'#' -f1 | xargs)"
    echo "  Source Map: $(grep GENERATE_SOURCEMAP .env.development | cut -d'=' -f2 | cut -d'#' -f1 | xargs)"
    echo "  类型检查: $(grep TSC_COMPILE_ON_ERROR .env.development | cut -d'=' -f2 | cut -d'#' -f1 | xargs)"
    echo ""
fi

# 菜单（数字右对齐）
echo "请选择操作:"
echo ""
printf " %2d) 💨 急速启动 (禁用 Source Map，跳过类型检查) - 最快\n" 1
printf " %2d) 🧩 快速开发 (Fast Refresh + 关闭依赖/分析 + 无 Source Map)\n" 2
printf " %2d) 🚀 正常启动 (推荐 - 最快速度)\n" 3
printf " %2d) 🔍 启动并检查循环依赖\n" 4
printf " %2d) 📦 启动并分析包大小\n" 5
printf " %2d) ⏱️  启动并显示性能统计\n" 6
printf " %2d) 🔬 完整分析模式 (最慢)\n" 7
printf " %2d) 🧹 清理所有缓存\n" 8
printf " %2d) 🧹 清理缓存并启动\n" 9
printf " %2d) 📚 显示优化文档\n" 10
printf " %2d) 🔧 环境变量检查（打印全部已加载环境变量）\n" 11
printf " %2d) 👋 退出\n" 0
echo ""

read -p "请输入选项 [0-11]: " choice

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
        else
            echo "❌ 未找到优化文档"
        fi
        ;;
    11)
        show_loaded_env
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

