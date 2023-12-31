import __Zi from 'zi';

/**
 * ## 「标准」`Ux.asyncMagic`
 *
 * 新版的 magic 对应 ajax 解析专用函数，该函数用于配置信息读取，在不同配置中执行核心解析，config中的`magic`数据结构如：
 *
 * ```json
 * {
 *     "field1": "expression1",
 *     "field2": "expression2",
 *     "...": "..."
 * }
 * ```
 *
 * 解析流程可参考`parseInput`的API说明，除开`magic`数据以外剩余数据配置如：
 *
 * ```json
 * {
 *     "uri": "访问Ajax的路径",
 *     "method": "默认为GET方法",
 *     "response": {
 *         "key": "数据提取的主键字段信，如果带有该字段，则给Array追加主键字段",
 *         "data": "数据字段，如果有该配置，解析响应数据。"
 *     }
 * }
 * ```
 *
 * 响应配置是后期加的新配置，该新配置会在很多场景中使用，主要用于响应数据本身格式的转换和解析，Zero Ui中的标准格式如：
 *
 * ```json
 * {
 *     "data": "Object|Array"
 * }
 * ```
 *
 * > 实际上response的配置是一个附加流程，如果不存在，则直接返回响应数据，如果存在则返回response的解析逻辑。
 *
 * 最后整理一下response的解析逻辑：
 *
 * 1. 响应数据必须是一个Object类型，然后读取`response[data]`的数据。
 * 2. 如果读取的数据是Array，并且又配置了`key`属性，为不带key属性的元素设置`key=field`的数据为主键属性。
 *
 * @memberOf module:remote/zion
 * @async
 * @param {Object} config 包含了 magic 配置的异步函数。
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @returns {Promise<T>} 返回Promise。
 */
const asyncMagic = (config = {}, reference) =>
    __Zi.asyncMagic(config, reference);
/**
 * ## 「标准」`Ux.asyncAssist`
 *
 * 新版的 assist 对应 ajax 解析专用函数，主要用于解析assist配置专用。
 *
 * 1. 每一个assist都是一个Object配置，键会生成最终的assist数据。
 * 2. assist应用于很多地方的字典解析部分，如DATUM渲染，所以每一个元素的配置最终都会生成数据。
 * 3. 早期版本中包含了Assist / Tabular两种。
 *      1. Assist生成的变量名为：属性：`a.x`，那么变量名为：`$a_a_x`。
 *      2. Tabular生成的变量名为：属性：`a.x`，那么变量名为：`$t_a_x`。
 * 4. 最终构造的数据是DataArray类型。
 *
 * ### 响应处理器
 *
 * > 该场景使用不多，也可忽略，直接以Assist配置为主就好。
 *
 * 新版的最后环节执行了响应处理器，可分组数据，可检索，可排序相关内容，这些内容作为Assist专用，详细内容参考`seekData`的源代码，
 * 此处不做说明。（略）
 *
 * ### 参考配置
 *
 * ```json
 "_assist": {
        "my.todo": {
            "uri": "/api/todo/search",
            "method": "POST",
            "magic": {
                "status,i": "ENUM:PENDING",
                "sigma": "PROP:app.sigma",
                "":"OPERATOR:AND"
            },
            "qr":true
        },
        "my.circle": {
            "uri": "/api/circle/search",
            "method": "POST",
            "magic": {
                "owner": "USER:key"
            },
            "qr":true
        }
    },
 * ```
 *
 * @memberOf module:remote/zion
 * @async
 * @param {Object} assist 辅助数据配置信息。
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {Object} state 处理的状态数据信息。
 * @returns {Promise<T>} 返回Promise。
 */
const asyncAssist = (assist = {}, reference, state = {}) =>
    __Zi.asyncAssist(assist, reference, state);

export default {
    asyncMagic,
    asyncAssist,
}