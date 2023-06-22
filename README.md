# Zero UI脚手架

> _万物为道一偏，一物为万物一偏，愚者为一物一偏，而自以为知道，无知也。——《荀子·天论》_

## 0. 引导

- （后端）Zero Ecotope：<https://www.zerows.io>
- （前端）Zero UI：<https://www.vertxui.cn>
- （工具）Zero AI：<https://www.vertxai.cn>
- （标准）Zero Schema：<https://www.vertx-cloud.cn>

## 1. 介绍

随着Zero生态（<https://www.zerows.io>）中 Zero UI 和 Zero Ecotope 后端框架的不断扩展，原UI项目一分为二：

* Zero UI: <https://www.vertxui.cn>，包含了UI项目的相关文档和说明
* Scaffold UI：当前项目，为Zero UI的标准前端脚手架，可直接配合Zero后端框架进行开发

## 2. 开始

初始化工程专用命令：`ai init -name <name>`
（其中name为项目名称），参考文档：<http://www.vertxai.cn/document/doc-web/module-ai.html#.init>

### 2.1. 启动前端

1. 执行下边的命令下载代码：

    ```shell
    ai init -n zero-web
    ```

2. 初始化项目之后，进入项目执行依赖安装

    ```shell
    cd zero-web
    yarn install
    ```

3. 将根目录下的 `.env.development.tpl` 重命名，并结合自己的环境设置相关值

   ```shell
   mv .env.development.tpl .env.development
   ```

4. 安装完成过后执行脚本：`run-zero.sh / run-zero.bat` 启动前端框架。

### 2.2. 更新Zero UI

1. 若要更新框架，执行 `ai sync` 命令即可
2. Zero AI 的其他自动化命令相关信息参考：<https://www.vertxai.cn>
3. 根据 Zero AI 的限制，若是Windows系统必须开启 WSL 执行相关命令


