#!/usr/bin/env bash

# ========================================
# Scaffold UI 实例启动脚本
# ========================================

if [ -z "$1" ]; then
  echo "❌ 对不起，请输入实例名"
  echo ""
  echo "使用方法:"
  echo "  ./run-zero-instance.sh <实例名>"
  echo ""
  echo "示例:"
  echo "  ./run-zero-instance.sh hotel.001"
  echo "  ./run-zero-instance.sh hotel.002"
  echo ""
  exit 1
else
  echo "📦 实例模式: $1"
  echo ""
  export Z_INSTANCE=$1
  # 调用主启动脚本
  ./run-zero.sh
fi

