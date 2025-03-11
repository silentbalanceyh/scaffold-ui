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
            const gapValue = Ux.valueFloat(amountGap, 0.0);
            const amountValue = Ux.valueFloat(amount, 0.0);

            values.amountActual = (amountValue + (Math.sign(gapValue) >= 0 ? gapValue : -Math.abs(gapValue))).toFixed(2);

            Ux.formHits(reference, values);
        }
    });
}