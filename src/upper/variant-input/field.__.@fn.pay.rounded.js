
import __Fn from '../fm.fn.pay.process';
import Ux from "ux";
/*
 配置：
                {
                    "metadata": "rounded,零头处理,16,,aiRadio",
                    "optionJsx.config.items": [
                        "NONE,不处理",
                        "HALF,四舍五入",
                        "FLOOR,零头舍弃",
                        "CEIL,零头入进",
                        "INPUT,自定义"
                    ]
                }
 */
export default (reference, jsx) => {
    return Ux.aiRadio(reference, jsx, event => {
        const rounded = Ux.ambEvent(event);
        const amount = Ux.formHit(reference, "amount");
        const values = __Fn.payGap({
            amount,
            rounded
        });
        const formValue = {};
        formValue.amount = amount;
        Object.assign(formValue, values);
        Ux.formHits(reference, formValue);
    })
}