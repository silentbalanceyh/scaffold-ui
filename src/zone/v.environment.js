import Immutable from "immutable";

// 运行时配置合并：优先使用 window.g 中的配置
const getRuntimeEnv = () => {
    // 创建环境变量副本
    const env = {};

    // 从 process.env 复制所有属性（define 替换的值已经在这里）
    try {
        const rawEnv = Immutable.fromJS(process.env).toJS();
        Object.assign(env, rawEnv);
    } catch (e) {
        console.warn('Failed to copy process.env:', e);
    }

    // 运行时从 window.g 覆盖配置（window.g 优先级更高）
    if (typeof window !== 'undefined' && window.g) {
        Object.keys(window.g).forEach(key => {
            const value = window.g[key];
            if (value !== undefined && value !== null && value !== '') {
                if (key.startsWith('Z_')) {
                    // 移除 Z_ 前缀存储（如 Z_ENDPOINT -> ENDPOINT）
                    const envKey = key.substring(2);
                    env[envKey] = value;
                } else {
                    env[key] = value;
                }
            }
        });
    }

    // 确保关键变量有默认值
    env.CSS_FONT = env.CSS_FONT || env.Z_CSS_FONT || "14";
    env.CSS_COLOR = env.CSS_COLOR || env.Z_CSS_COLOR || "#36648b";
    env.CSS_RADIUS = env.CSS_RADIUS || env.Z_CSS_RADIUS || "4";
    env.CSS_SHADOW = env.CSS_SHADOW || env.Z_CSS_SHADOW || "true";
    env.CSS_SKIN_MODULE = env.CSS_SKIN_MODULE || env.Z_CSS_SKIN_MODULE || "HM";
    env.CSS_SKIN_NAME = env.CSS_SKIN_NAME || env.Z_CSS_SKIN_NAME || "NormLight";
    env.LANGUAGE = env.LANGUAGE || env.Z_LANGUAGE || "cn";
    env.ENDPOINT = env.ENDPOINT || env.Z_ENDPOINT || "";
    env.APP = env.APP || env.Z_APP || "";
    env.TITLE = env.TITLE || env.Z_TITLE || "";

    return env;
};

const ENV = getRuntimeEnv();
// eslint-disable-next-line
for (const key in ENV) {
    if (ENV.hasOwnProperty(key)) {
        if (key.startsWith("K_") || key.startsWith("DEV_")) delete ENV[key];// 移除原始K_和DEV_
        // Boolean处理，布尔值;
        if ("true" === ENV[key] || "false" === ENV[key]) {
            ENV[key] = JSON.parse(ENV[key]);
        }
    }
}
const RUNTIME = {
    DEVELOPMENT: "development",
    PRODUCTION: "production"
}
// __解析
const __BOOLEAN = (...keys) => {
    let result = RUNTIME.DEVELOPMENT === process.env.NODE_ENV;
    keys.forEach(key => result = result && process.env[key] && "true" === process.env[key]);
    return Boolean(result);
}
// __BOOLEAN / STRING COMPARE
const __BOOLEAN_EQ = (input) => {
    if ("string" === typeof input) {
        return "true" === input.toString().toLowerCase();
    } else {
        return !!input;
    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    ...ENV,
    RUNTIME,
    LANGUAGE: ENV['LANGUAGE'],

    DEBUG_DEV: __BOOLEAN("DEV_DEBUG") &&
        RUNTIME.DEVELOPMENT === process.env.NODE_ENV,
    DEBUG: __BOOLEAN("DEV_DEBUG"),                      // DEV_DEBUG
    DEBUG_FORM: __BOOLEAN("DEV_FORM"),                  // DEV_FORM
    DEBUG_AJAX: __BOOLEAN("DEV_MOCK", "DEV_AJAX"),      // DEV_MOCK && DEV_AJAX
    DEBUG_QR: __BOOLEAN("DEV_QR"),                      // DEV_QR

    MONITOR: __BOOLEAN("DEV_DEBUG", "DEV_MONITOR"),     // DEV_MONITOR
    MOCK: __BOOLEAN("DEV_MOCK"),                        // DEV_MOCK
    SIGN: __BOOLEAN_EQ(ENV['SIGN']),

    ENTRY_LOGIN: `${process.env.ENTRY_LOGIN}`,     // 登录页
    ENTRY_ADMIN: `${process.env.ENTRY_ADMIN}`,     // 管理页
    ENTRY_FIRST: `${process.env.ENTRY_FIRST}`,     // 首次登录更改密码
}