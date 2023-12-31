import __Zs from 'zs';

/**
 * ## 「标准」`Ux.pluginMetadata`
 *
 * 记录状态计算插件，根据数据记录中的 `metadata` 节点计算记录的状态信息，以辅助当前记录数据
 * 是否可编辑、是否可删除。
 *
 * 状态结构如下：
 *
 * ```json
 * {
 *     edition: "是否可编辑",
 *     deletion: "是否可删除"
 * }
 * ```
 *
 * @memberOf module:plugin/zest
 * @param {Object} record 数据记录信息。
 * @param {Object|ReactComponent} reference React组件引用。
 * @return {Object} 返回状态信息。
 */
const pluginMetadata = (record = {}, reference) =>
    __Zs.pluginMetadata(record, reference);

/**
 * ## 「标准」`Ux.pluginEdition`
 *
 * 内部调用 `pluginForm` 计算当前表单相关状态，主要计算只读还是可编辑，流程如：
 *
 * 1. 从props中读取`$plugins`变量（Object类型）。
 * 2. 如果该变量中存在`pluginForm`才执行。
 *      1. 使用`pluginFn`计算最终的`$edition`值（Object类型）
 *
 * > 不触发流程时直接为true（可编辑）。
 *
 * @memberOf module:plugin/zest
 * @param {Object|ReactComponent} reference React组件引用。
 * @return {boolean} 返回当前表单是否可编辑的直接状态。
 */
const pluginEdition = (reference) =>
    __Zs.pluginEdition(reference);
/**
 *
 * ## 「标准」`Ux.pluginField`
 *
 * 计算表单中的字段信息的状态，主要计算可编辑和可删除状态：
 *
 * * edition：可编辑。
 * * deletion：可删除。
 *
 * @memberOf module:plugin/zest
 * @param {Object|ReactComponent} reference React组件引用。
 * @return {{}|boolean} 返回当前字段的状态信息。
 */
const pluginField = (reference) =>
    __Zs.pluginField(reference);
/**
 * ## 「标准」`Ux.pluginSelection`
 *
 * 计算表格中多选框的状态信息，只有可编辑可删除不禁用，否则禁用多选框。
 *
 * @memberOf module:plugin/zest
 * @param {Object|ReactComponent} reference React组件引用。
 * @param {Object} record 数据记录对象。
 * @return {Object} 计算当前记录状态。
 */
const pluginSelection = (reference, record = {}) =>
    __Zs.pluginSelection(reference, record);
/**
 * ## 「标准」`Ux.pluginOp`
 *
 * 生成界面中每一行的两个特殊按钮：
 *
 * 1. 可编辑，则显示"编辑"按钮。
 * 2. 可删除，则显示"删除"按钮。
 *
 * @memberOf module:plugin/zest
 * @param {Object|ReactComponent} reference React组件引用。
 * @param {Object} record 数据记录对象。
 * @return {Object} 状态。
 */
const pluginOp = (reference, record = {}) =>
    __Zs.pluginOp(reference, record);
/**
 * ## 「标准」`Ux.pluginForm`
 *
 * 表单状态计算函数。
 *
 * ```js
 *      const $edition = Ux.pluginForm(this);
 * ```
 *
 * @memberOf module:plugin/zest
 * @param {Object|ReactComponent} reference React组件引用。
 * @return {boolean|{}} 返回当前表单的状态信息（可编辑、只读、部分只读）。
 */
const pluginForm = (reference) =>
    __Zs.pluginForm(reference);
/**
 * ## 「标准」`Ux.pluginKoRow`
 *
 * @memberOf module:plugin/zest
 * @param reference
 * @param record
 * @param actions
 * @returns {*}
 */
const pluginKoRow = (reference, record, actions = []) =>
    __Zs.pluginKoRow(reference, record, actions);
/**
 * ## 「标准」`Ux.pluginKoAdd`
 *
 * @memberOf module:plugin/zest
 * @param reference
 * @param record
 * @param actions
 * @returns {*}
 */
const pluginKoAdd = (reference, record, actions = []) =>
    __Zs.pluginKoAdd(reference, record, actions);
/**
 * ## 「标准」`Ux.pluginKoEdit`
 *
 * @memberOf module:plugin/zest
 * @param reference
 * @param record
 * @param actions
 * @returns {*}
 */
const pluginKoEdit = (reference, record, actions = []) =>
    __Zs.pluginKoEdit(reference, record, actions);
/**
 * ## 「标准」`Ux.pluginKoBatch`
 *
 * @memberOf module:plugin/zest
 * @param reference
 * @param actions
 * @returns {*}
 */
const pluginKoBatch = (reference, actions = []) =>
    __Zs.pluginKoBatch(reference, actions);
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    // ----------------------- 「启用/禁用」--------------------------
    pluginKoRow,
    pluginKoAdd,
    pluginKoEdit,
    pluginKoBatch,
    // ----------------------- 「启用/禁用」--------------------------
    /*
     * 「表格行选择项」（启用/禁用）
     * 行选择处理
     * 检查 selection，不过这个方法只检查当前操作按钮的以下两种状态：
     * 1. 启用
     * 2. 禁用
     * 该方法不处理显示/隐藏等问题。
     * 内置包含了 koSelection（启用/禁用）
     *
     * 属性集中的函数处理
     * 1）props属性插件：$plugins.pluginRow
     * 2）函数签名：pluginRow(record, reference）
     */
    ////// pluginRow
    pluginSelection,
    /*
     * 「表格行/表单内」（启用/禁用）
     * 行 编辑 / 删除
     * 检查 edition / deletion
     * 1. 表格中的行编辑/删除
     * 2. 表单内的记录编辑/删除
     *
     * 这两个操作会统一处理。
     *
     * 属性集中的函数处理
     * 1）props属性插件：$plugins.pluginRow
     * 2）函数签名：pluginRow(record, reference）
     */
    ////// pluginRow
    pluginOp,
    // ----------------------- 「编辑/删除」--------------------------
    /*
     * 表单编辑计算
     * 检查 edition
     *
     * 属性集中的函数处理
     * 1）props属性插件：$plugins.pluginForm
     * 2）函数签名：pluginForm(record, reference）
     */
    ////// pluginForm -> pluginField
    pluginEdition,
    /*
     * 核心插件函数
     * 属性 metadata 处理
     *
     * {
     *      "edition": "xxx",
     *      "deletion": "xxx"
     * }
     * 单独检查记录中的 metadata 部分的数据
     */
    pluginMetadata,
    /*
     * 表单编辑计算（全表单）
     * 检查 edition
     * 如果 edition = true，检查 pluginField 计算是否存在部分编辑
     * {
     *      "edition": "xxx",
     *      "deletion": "xxx"
     * }
     */
    ////// pluginForm -> pluginField
    pluginForm,
    /*
     * 直接表单计算（单字段）
     * 检查 pluginField 计算是否存在部分编辑
     * {
     *      "edition": "xxx",
     *      "deletion": "xxx"
     * }
     */
    ////// pluginField
    pluginField,
    // ----------------------- 「显示/隐藏」--------------------------
}