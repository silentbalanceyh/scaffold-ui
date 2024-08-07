'use strict';

const fs = require('fs');
const path = require('path');
const paths = require('./paths');

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

// Make sure that including paths.js after env.js will read .env variables.
delete require.cache[require.resolve('./paths')];

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
    throw new Error(
        'The NODE_ENV environment variable is required but was not specified.'
    );
}

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
    `${paths.dotenv}.${NODE_ENV}.local`,
    // Don't include `.env.local` for `test` environment
    // since normally you expect tests to produce the same
    // results for everyone
    NODE_ENV !== 'test' && `${paths.dotenv}.local`,
    `${paths.dotenv}.${NODE_ENV}`,
    paths.dotenv,
].filter(Boolean);

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
dotenvFiles.forEach(dotenvFile => {
    if (fs.existsSync(dotenvFile)) {
        const config = dotenv.config({
            path: dotenvFile,
        });
        /*
         * 实例模式的启动，追加的新内容，根据 Z_INSTANCE 执行 config.parsed 的更改
         * 1）提取 Z_INSTANCE 启动变量
         * 2）根据它计算文件路径
         * 3）重写 config.parsed 中的内容
         */
        if(process.env.Z_INSTANCE){
            const instanceConfig = dotenv.config({
                path: `${paths.appPath}/running/${process.env.Z_INSTANCE}/.env.${NODE_ENV}.instance`
            });
            Object.assign(config.parsed, instanceConfig.parsed);
            Object.assign(process.env, instanceConfig.parsed);
        }
        dotenvExpand.expand(config);
        /*
        require('dotenv-expand')(
            require('dotenv').config({
                path: dotenvFile,
            })
        );*/
    }
});

// We support resolving modules according to `NODE_PATH`.
// This lets you use absolute paths in imports inside large monorepos:
// https://github.com/facebook/create-react-app/issues/253.
// It works similar to `NODE_PATH` in Node itself:
// https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders
// Note that unlike in Node, only *relative* paths from `NODE_PATH` are honored.
// Otherwise, we risk importing Node.js core modules into an app instead of webpack shims.
// https://github.com/facebook/create-react-app/issues/1023#issuecomment-265344421
// We also resolve them to make sure all tools using them work consistently.
const appDirectory = fs.realpathSync(process.cwd());
process.env.NODE_PATH = (process.env.NODE_PATH || '')
    .split(path.delimiter)
    .filter(folder => folder && !path.isAbsolute(folder))
    .map(folder => path.resolve(appDirectory, folder))
    .join(path.delimiter);

// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in webpack configuration.
const REACT_APP = /^REACT_APP_/i;

function getClientEnvironment(publicUrl) {
    // ----------------------------
    // Z_ 打头的环境变量注入
    function getEnv() {
        const zEnvs = {};
        for (const eKey in process.env) {
            if (process.env.hasOwnProperty(eKey)) {
                if (eKey.startsWith("Z_")) {
                    const key = `${eKey.substring(2)}`;
                    zEnvs[key] = process.env[eKey];
                }
            }
        }
        return zEnvs;
    }

    const envs = getEnv();
    // ----------------------------
    const raw = Object.keys(process.env)
        .filter(key => REACT_APP.test(key))
        .reduce(
            (env, key) => {
                env[key] = process.env[key];
                return env;
            },
            {
                // Useful for determining whether we’re running in production mode.
                // Most importantly, it switches React into the correct mode.
                NODE_ENV: process.env.NODE_ENV || 'development',
                // Useful for resolving the correct path to static assets in `public`.
                // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
                // This should only be used as an escape hatch. Normally you would put
                // images into the `src` and `import` them in code to get their paths.
                PUBLIC_URL: publicUrl,
                // We support configuring the sockjs pathname during development.
                // These settings let a developer run multiple simultaneous projects.
                // They are used as the connection `hostname`, `pathname` and `port`
                // in webpackHotDevClient. They are used as the `sockHost`, `sockPath`
                // and `sockPort` options in webpack-dev-server.
                WDS_SOCKET_HOST: process.env.WDS_SOCKET_HOST,
                WDS_SOCKET_PATH: process.env.WDS_SOCKET_PATH,
                WDS_SOCKET_PORT: process.env.WDS_SOCKET_PORT,
                // Whether or not react-refresh is enabled.
                // It is defined here so it is available in the webpackHotDevClient.
                FAST_REFRESH: process.env.FAST_REFRESH !== 'false',
                // ----------------------------
                ...envs     // 自定义环境变量
                //----------------------------
            }
        );
    // Stringify all values so we can feed into webpack DefinePlugin
    const stringified = {
        'process.env': Object.keys(raw).reduce((env, key) => {
            env[key] = JSON.stringify(raw[key]);
            return env;
        }, {}),
    };

    return {raw, stringified};
}

module.exports = getClientEnvironment;
