#!/usr/bin/env bash
if [ -z $1 ]; then
  echo "对不起，请输入实例名 ( hotel.001, hotel.002 )"
else
  export Z_INSTANCE=$1
  yarn start
fi