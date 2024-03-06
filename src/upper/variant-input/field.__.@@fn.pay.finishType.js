import __Fn from '../fm.fn.pay.process';
import Ux from "ux";
/*
配置：
                {
                    "metadata": "finishType,结账类型,16,,aiRadio",
                    "optionJsx.config.items": [
                        "STANDARD,标准结账",
                        "RUN_UP,挂S结账"
                    ]
                }
 */
export default (ref, required) => {
    return (reference, jsx) => {
        return Ux.aiRadio(reference, jsx, (event) => {
            const mode = Ux.ambEvent(event);
            const params = {};
            params.amount = required;
            if ("RUN_UP" === mode) {
                // 延迟结账（挂账），重设某部分值
                params.amountActual = params.amount;
                params.amountGap = 0;
            } else {
                // 现结，直接用金额执行计算
                const input = {};
                input.amount = required;
                const pParam = Ux.isMod('mHotel');
                const rounded = pParam['pRemainder'] ? pParam['pRemainder'] : "NONE";
                input.rounded = rounded;
                const values = __Fn.payGap(input);

                // rounded 和 payment 的还原
                values.rounded = rounded;
                values.payment = [];
                values.payment.push({
                    key: "Cash",
                    name: "Cash",
                    amount: input.amountActual
                })
                Object.assign(params, values);
            }
            Ux.formHits(reference, params);
        })
    }
}