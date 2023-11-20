import __Zn from './zero.module.dependency';

const Cv = __Zn.Env;
const aiErrorFocus = (reference, item) => {
    if (item.field) {
        if (item.optionConfig && item.optionConfig.hasOwnProperty("rules")) {
            if (!item.optionJsx) item.optionJsx = {};
            if (Cv.TYPE_JSX_VALIDATE.includes(item.render)) {
                // onFocus -> Error
                item.optionJsx.onFocus = __Zn.htmlErrorFocus(item);
                // onBlur -> Error
                item.optionJsx.onBlur = __Zn.htmlErrorFocus(item);
            } else {

                // onFocus -> Error
                item.optionJsx.onFocus = __Zn.htmlErrorFocus(item);
                // onBlur
                item.optionJsx.onBlur = __Zn.htmlErrorBlur(item);
            }
        }
    }
}
const aiValidation = (reference = {}, item = {}) => {
    if (item.optionConfig) {
        const rules = item.optionConfig.rules;
        // 触发条件设置，默认onBlur，符合大多数习惯
        if (!item.optionConfig.hasOwnProperty("validateTrigger")) {
            if (Cv.TYPE_JSX_VALIDATE.includes(item.render)) {
                item.optionConfig.validateTrigger = "onChange";
            } else {
                item.optionConfig.validateTrigger = "onBlur";
            }
        }
        // 解析 rules ( For 4.0 )
        // item.optionItem.rules = aiValidator(reference, rules, item.optionJsx);
        // aiValidator -> valveValidator
        item.optionConfig.rules = __Zn.valveValidator(reference, rules, item.optionJsx);
    }
};

const aiNormalizer = (reference, item = {}) => {
    if (item.optionConfig && item.optionConfig.normalize) {
        const expr = item.optionConfig.normalize;

        const jFun = aiNormalizerFn(expr);
        if(jFun){
            item.optionConfig.normalize = jFun;
        }
    }
}

const aiNormalizerFn = (expr) => {
    let retFn = null;
    if(expr && "string" === typeof expr){
        // 必须是字符串才可以执行
        const replaced = expr.toString().replace(/:/g, ",");
        const segments = replaced.toString().split(",");
        if (1 <= segments.length) {
            // 读取类型
            const type = segments[0];
            const executor = Cv.V_NORMALIZER[type];
            if (executor) {
                // 参数准备
                const args = [];
                for (let idx = 1; idx < segments.length; idx++) {
                    args.push(segments[idx]);
                }
                // 函数调用
                const jFun = executor.apply(null, args);
                if (__Zn.isFunction(jFun)) {
                    retFn = jFun;
                }
            } else {
                console.error("[ Ux ] normalize 属性解析失败：", expr);
            }
        }
    }
    return retFn;
}

const aiRule = (rule, item) => {
    if (__Zn.isNotEmpty(rule)) {
        if (item.optionJsx && rule.hasOwnProperty(item.field)) {
            // 构造 config
            if (!item.optionJsx.config) {
                item.optionJsx.config = {}
            }
            // 合并 linker，追加 seeking
            const configRef = item.optionJsx.config;
            const ruleConfig = rule[item.field]
            if (ruleConfig.linker) {
                if (!configRef.linker) {
                    configRef.linker = {}
                }
                Object.assign(configRef.linker, ruleConfig.linker);
            }

            // 合并 seeking
            if (ruleConfig.seeking) {
                configRef.seeking = ruleConfig.seeking;
            }
            // TODO:
            // 合并 optionJsx.depend
            // 合并 optionJsx.impact
        }
    }
}
export default {
    aiErrorFocus,
    aiNormalizer,
    aiNormalizerFn,
    aiValidation,
    aiRule,
}