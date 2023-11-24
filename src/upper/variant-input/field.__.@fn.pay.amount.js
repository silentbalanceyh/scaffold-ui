
import __Fn from '../fm.fn.pay.process';
import Ux from "ux";

export default (reference, jsx) => {
    return Ux.aiInput(reference, jsx, event => {
        // 更改价格
        const amount = Ux.ambEvent(event);
        const rounded = Ux.formHit(reference, 'rounded');
        const values = __Fn.payGap({
            amount,
            rounded
        });
        Ux.formHits(reference, values);
    });
}