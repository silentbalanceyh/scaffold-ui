import __Zn from './zero.uca.dependency';

const Cv = __Zn.Env;
/*
    "$option": [
        {
            "text": "删除",
            "executor": "rxDelete",
            "confirm": "确认删除该行标签记录？",
            "success": "恭喜，您所选择的标签记录删除成功！"
        }
    ],
    "$config": {
        "pMessage": {
            "error": "该操作出现了异常，请联系管理员！"
        }
    }

    执行操作后的数据结构：
    {
        "pMessage": {
            "error": "维持不变",
            "success": "成功消息"
        },
        "pMessageKey": "success"
    }
 */
const _inParameter = ({option, config}) => {
    const parameters = {};
    const {
        success,
        successKey = "success"
    } = option;
    const globalConfig = config[Cv.K_NAME.CONFIG] ? __Zn.clone(config[Cv.K_NAME.CONFIG]) : {};
    Object.keys(globalConfig)
        .filter(field => field.startsWith("p"))
        .forEach(field => parameters[field] = globalConfig[field]);
    if (!parameters.pMessage) {
        parameters.pMessage = {};
    }
    if (success) {
        parameters.pMessageKey = successKey;
        parameters.pMessage[successKey] = success;
    }
    __Zn.dgDebug(parameters, "行执行 Executor 构造参数（render = EXECUTOR）！", "#8B1C62");
    return parameters;
}
const optionExecutor = (option = {}, item, metadata = {}) => {
    const {
        executor = {},      /* 执行器函数 */
        reference,              /* 当前组件引用 */
        text,                   /* Ant Design 中的 text */
        record,                 /* 当前行的记录集 */
        config = {}         /* 当前字段对应的配置数据 */
    } = metadata;
    /*
     * 1. item 中配置 executor 选项，如 executor = "fnEdit"
     * 2. 在 executor = {} 是否配置了 Function 类型的函数
     */
    if (!item.executor) {
        option.error = "（Error）No Configured Executor";
        console.error(option.error);
    }
    const fun = executor[item.executor];
    if (!__Zn.isFunction(fun)) {
        option.error = "（Error）Not Executor Function";
        console.error(option.error);
    }


    /*
     * 构造 fnExecutor 函数执行器，此执行器为一个执行函数，此处会多两个参数构造到 configuration
     * {
     *     "ajax": {},
     *     "parameters": {}
     * }
     * 这两个参数用于定制远程通信部分的 ajax 和对应参数信息。
     */
    const fnExecutor = (event) => {
        event.preventDefault();
        const configuration = {
            config,     // 完整配置
            reference,  // 引用
        };
        if (item.ajax) {
            configuration.ajax = item.ajax;
        }
        // p 系列的方法追加到 configuration，防止和旧系统冲突
        configuration.parameters = _inParameter({option, config});
        fun(text, record, configuration);
    };


    /*
     * 函数模式切换
     * 1）confirm 模式，会出现浮游确认框，直接触发 onConfirm
     * 2）click 模式，直接触发 onClick
     */
    if (item.confirm) {
        option.confirm = item.confirm;
        option.onConfirm = fnExecutor;
    } else {
        option.onClick = fnExecutor;
    }
}
const optionRule = (option, item = {}, record = {}) => {
    if (!item.rule) {
        return;
    }
    /* 合并规则配置 */
    try {
        const rule = item.rule;
        const field = rule.field;
        const value = record[field];
        const replaced = rule.value[value];
        if (replaced) {
            Object.assign(option, replaced);
        }
    } catch (error) {
    }
}
/*
 * 禁用启用拦截
 * 1 - executor 若是 {} 为空，则直接返回，不设置编辑权限。
 * 2 - 当前 executor 中是否包含了选项中的函数名
 *     - fnEdit：OOB 中的编辑函数
 *     - fnDelete：OOB 中的删除函数
 * 3 - OOB 计算模式 / 非 OOB 计算模式
 */
const optionEnabled = (calculated, item = {}, executor = {}, options = {}) => {
    if (__Zn.isEmpty(executor)) {
        return false;
    }
    if (!executor.hasOwnProperty(item.executor)) {
        return false;
    }
    if ([
        "fnEdit",           // 编辑
        "fnDelete"          // 删除
    ].includes(item.executor)) {
        if (calculated.edition && "fnEdit" === item.executor) {
            /*
             * OOB 中的编辑函数计算
             * 1）条件1：edition 有值
             * 2）条件2：fnEdit 内置函数检查
             **/
            const option = options['op.row.edit'];
            if (undefined === option) {
                return true;
            } else {
                return !!option;
            }
        } else if (calculated.deletion && "fnDelete" === item.executor) {
            /*
             * OOB 中的删除函数计算
             * 1）条件1：deletion 有值
             * 2）条件2：fnDelete 内置函数检查
             */
            const option = options['op.row.delete'];
            if (undefined === option) {
                return true;
            } else {
                return !!option;
            }
        } else {
            /*
             * 此处为 false，默认选项全打开
             */
            return false;
        }
    } else {
        /*
         * $executor 的启用拦截，此处的 calculated 为计算的最终结果，计算的流程如：
         * 1. 检查系统中是否包含了 pluginRow 函数，如果有此函数直接执行此函数
         * 2. 若没有 pluginRow 函数，则直接返回
         * {
         *     edition: true,
         *     deletion: true
         * }
         */
        if (calculated.hasOwnProperty(item.executor)) {
            return calculated[item.executor];
        } else {
            return true;
        }
    }
};
/*
 * 修复 options 专用方法，options 在新版来自几个方向，优先级
 * 1. 默认优先级（配置）config.options
 * 2. 第二优先级（状态）state.options
 * 3. 第三优先级（编程）$options
 */
const optionIn = (reference) => {
    const {
        $options = {},
        config = {},
    } = reference.props;
    const {
        options = {},
    } = reference.state;
    return Object.assign({},
        config.options ? config.options : {},
        options,
        $options,
    );
}
export default {
    optionIn,
    optionExecutor,
    optionRule,
    optionEnabled,
}