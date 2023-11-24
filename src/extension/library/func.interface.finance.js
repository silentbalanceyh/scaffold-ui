import __Zu from 'zet';
import __Zp from 'zep';

export default {
    /**
     * ## 「标准」`Ex.inSettlement`
     *
     * 此方法主要是计算当前的结算单是哪种结算关联模式，处理 `cross` 属性，逻辑很简单，直接判断 `relatedId` 的长度即可，如果
     * 长度为 36 则直接结算模式（单订单），若长度超过 36 则是跨订单模式（按批次结算），所以 `cross` 属性的计算方式为：
     *
     * 1. 若 relatedId 长度 > 36，则 cross = true
     * 2. 若 relatedId 长度 <= 36，则 cross = false
     *
     * @memberOf module:in/utter
     * @param data
     * @returns {Any}
     */
    inSettlement: (data = {}) =>
        __Zu.inSettlement(data),
    // 退款 / 应收初始化
    inDebt: (reference, $inited = {}, debt = true) =>
        __Zp.yoDebt(reference, $inited, debt),

    /**
     * ## 「标准」 `Ex.inPrePay`
     *
     * ### 基本介绍
     *
     * 此方法是标准化之后的结算管理办法，此处会带有一定的配置项，为的是让结算流程不产生任何重复效果而量身打造的标准化API，这个方法仅用于
     * 标准结算过程（延迟结算不包含在内），简单说不支持延迟模式。两种场景处理标准结算：
     *
     * 1. 结算管理中的：标准结算（不转应收/退款的）
     * 2. 处理结算过程中的非延迟结算
     *
     * ### 特殊说明
     *
     * #### `params` 参数
     *
     * ```json
     * {
     *     "amount": xxx,
     *     "payment": []
     * }
     * ```
     *
     * - **amount**：结算金额信息，此处是待付款的金额，如果是退款则是待退款的金额。
     * - **payment**：付款记录信息，付款记录可以是多次，也可以是一次，但针对标准结算模式，只能是在结算时直接支付，但是此处 payment 是一个数组，所以虽然是一次性结算支付，但付款记录可以是多条，比如 1000 块，微信支付200，现金800 这种结构是在支付过程中允许的。
     *
     * > 综上，`params` 参数是必须带有这两个值的，若 amount 的值是 0，那么一定会出现支付的金额验证问题。
     *
     * #### `config` 参数
     *
     * ```json
     * {
     *     "pFlow": xxx,
     *     "pDigit": xxx,
     *     "eEmpty": error,
     *     "ePay": error,
     *     "eAmount": error
     * }
     * ```
     *
     * 此处有两种参数，`p` 前缀参数为配置参数，`e` 前缀参数为错误参数（用于呈现错误信息专用）。
     *
     * - `pAsync`：此参数没有出现在 `config` 中，而是作为方法的第四参出现，主要标记当前方法的返回值使用同步还是异步模式。
     * - `pFlow`：是否开启**页面流**功能，若开启，那么会在执行完成之后调用 state 相关的表单防重复提交的状态变更操作。
     * - `pDigit`：小数点位数，默认是2，精确到 元角分 的分，若是其他金融系统，可能会精确到更深的地方。
     *
     * 异常专用
     *
     * - `eEmpty`：默认值 payway，若 payment 没有内容或 undefined，则抛出此异常信息。
     * - `ePay`：默认值 payment，若您追加了不同的 payment 记录，那么每条记录中的 name 和 amount 必须有值，若无值则抛出异常。
     * - `eAmount`：默认值 pay，由于是支付，带上抹零设置，若您的金额在和中的 -1 ~ 1 的范围，那么证明是合理的，抹零会处理，否则不合理。
     *
     * @memberOf module:in/utter
     * @param reference
     * @param params
     * @param config
     * @param pAsync
     * @return {*|boolean|Promise<Awaited<{}>>}
     */
    inPrePay: (reference, params = {}, config = {}, pAsync = false) =>
        __Zu.inPrePay(reference, params, config, pAsync),
    /**
     * ## 「通道」`Ex.yoDebt`
     * @memberOf module:yo/upper
     * @param reference
     * @param $inited
     * @param debt
     * @return {*}
     */
    yoDebt: (reference, $inited = {}, debt = true) =>
        __Zp.yoDebt(reference, $inited, debt),
    // TODO: 新的API
    payGap: (params = {}) => __Zp.payGap(params),
    // 表单
    payFormBill: (ref) => __Zp.payFormBill(ref),
    payFormFee: (ref) => __Zp.payFormFee(ref),
    payFormNorm: (ref) => __Zp.payFormNorm(ref),
    payFormItem: (ref) => __Zp.payFormItem(ref),
}