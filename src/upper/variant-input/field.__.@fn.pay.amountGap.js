import Ux from "ux";
/*
 配置：
                {
                    "metadata": "amountGap,零头,,,,addonAfter=￥,normalize=decimal:18:2",
                    "optionJsx.depend.enabled": {
                        "rounded": "INPUT"
                    }
                }
 */
export default (reference, jsx) => {
    return Ux.aiInput(reference, jsx, event => {
        const amountGap = Ux.ambEvent(event);
        const amount = Ux.formHit(reference, "amount");
        if (amount) {
            const values = {};
            values.amountActual = (
                Ux.valueFloat(amount, 0.0)
                -
                Ux.valueFloat(amountGap, 0.0)
            ).toFixed(2);
            Ux.formHits(reference, values);
        }
    });
}