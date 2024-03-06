import Ux from 'ux';

const __verifyMessage = (reference, key) => {
    if ("string" !== typeof key) {
        return null;
    }
    /*
     * {
     *     "_modal": {
     *     }
     * }
     */
    const modal = Ux.fromHoc(reference, "modal");
    if (Ux.isEmpty(modal)) {
        return null;
    }
    const {error = {}} = modal;
    let message = error[key];
    if (!message) {
        message = key;
    }
    return message;
}
const outMessage = (reference, error, async = false) => {
    let message = __verifyMessage(reference, error);
    if (!message) {
        const ref = Ux.onReference(reference, 1);
        message = __verifyMessage(ref, error);
    }
    if (async) {
        return Promise.reject({data: message});
    } else {
        return message;
    }
}

const outError = (reference, data, {pAsync, pFlow = false}) => {
    if (pAsync) {
        // 异步
        return data;
    } else {
        // 同步
        if (data) {
            Ux.messageFailure(data);
        }
        if (pFlow) {
            /*
             * 「默认关闭」
             * 开启页面流，子组件和父组件都触发重复提交的关闭处理流程
             * 1. 子组件
             *    $submitting = false
             *    $loading = false
             * 2. 父组件调用 rxSubmitting(false, ...)
             */
            Ux.of(reference).load().handle(() =>
                Ux.of(reference)._.submitted())
        }
        return true;
    }
}

const inPrePay = (reference, params = {}, config = {}, pAsync = false) => {
    const {
        payment = [],
        amountActual = 0,            // 总金额（总金额直接放到请求数据中）
    } = params;

    const {
        pFlow = false,         // 是否开启页面流，主要是是否触发父组件的 rxSubmitting
        pDigit = 2,             // 金额计算精度
        eEmpty = "payway",     // Err: 如果 payment 的值为 undefined 或 length 为 0 时抛错
        ePay = "payment",      // Err: 支付信息不完整时抛错，检查每一行的 name / amount 两个值
        eAmount = "pay",       // Err：金额检查失败时抛错，检查每一行金额是否为0，若为0则抛错
    } = config;
    // 检查 payment.length
    if (0 === payment.length) {
        const data = outMessage(reference, eEmpty, pAsync);
        return outError(reference, data, {pFlow, pAsync});
    }
    // 检查 payment 中的 name / amount
    let sum = 0;
    for (let idx = 0; idx < payment.length; idx++) {
        if (!payment[idx].name || !payment[idx].amount) {
            const data = outMessage(reference, ePay, pAsync);
            return outError(reference, data, {pFlow, pAsync});
        }
        sum += Ux.valueFloat(payment[idx].amount, 0.0, pDigit);
    }
    /**
     * 新的三合一验证流程
     * 根据属性 rounded 判断验证流程
     * - HALF / 四舍五入
     * - FLOOR / 零头舍弃
     * - CEIL / 零头入进
     */
    if (amountActual !== sum) {
        const data = outMessage(reference, eAmount, pAsync);
        return outError(reference, data, {pFlow, pAsync});
    }
    return pAsync ? Promise.resolve({}) : false;
}
export default {
    outMessage,
    outError,
    inPrePay
}