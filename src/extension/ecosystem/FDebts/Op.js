import Ux from 'ux';
import {Checkbox, Input} from 'antd';

const normalizerFn = (length, scale = 2) => value => {
    if (value) {
        // 2.正数输入限制
        value = value.toString();
        const original = value; // String
        value = value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
        value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        value = value
            .replace(".", "$#$")
            .replace(/\./g, "")
            .replace("$#$", ".");
        const scaleReg = new RegExp(`(\\-)*(\\d+)\\.(\\d{${scale}}).`);
        value = value.replace(scaleReg, `$1$2.$3`); //只能输入两个小数
        // 3.长度输入限制
        if (length < value.length) {
            value = value.substring(0, length);
        }
        // 4.最终数据成型
        /*
         * 保证在小数输入过程中可支持 12.05 这种类型的输入
         * Issue：https://github.com/silentbalanceyh/hotel/issues/206
         */
        let scaleType = 0;
        if (0 < value.indexOf('.')) {
            const scaleStr = value.substring(value.indexOf(".") + 1);
            if (scaleStr) {
                scaleType = scaleStr.length;
            }
        }
        /*
         * 浮点数允许录入负数的浮点数，并且只能带一个负号
         */
        if (original && original.startsWith("-")) {
            value = `-${value}`;
        }
        value = Ux.isDecimal(value) ? parseFloat(value).toFixed(scaleType) : value;
    }
    return value;
};
const rxRowChecked = (reference, record  = {}) => (event) => {
    const checked = Ux.ambEvent(event, {
        prevent: false, checked:true,
    });
    const { data = []} = reference.props;
    const dataUp = Ux.clone(data);
    dataUp.forEach(item => {
        if(item.key === record.key){
            item.finished = checked;
            if(checked){
                item.finishedAmount = item.amountBalance;
            }
        }
    });
    const { rxDebt = () => false } = reference.props;
    if(Ux.isFunction(rxDebt)){
        rxDebt(dataUp, reference);
    }
}
const rxRowAmount = (reference, record = {}) => (event) => {
    let amount = Ux.ambEvent(event);
    amount = normalizerFn(18,2)(amount);

    const { data = []} = reference.props;
    const dataUp = Ux.clone(data);
    dataUp.forEach(item => {
        if(item.key === record.key){
            item.finishedAmount = amount;
        }
    });
    const { rxDebt = () => false } = reference.props;
    if(Ux.isFunction(rxDebt)){
        rxDebt(dataUp, reference);
    }
}
export default {
    yiControl: (reference) => {
        const state = {};
        const table = Ux.fromHoc(reference, "table");
        const columns = Ux.configColumn(reference, table.columns);

        columns.filter(column => ["finished", "finishedAmount"].includes(column.dataIndex))
            .forEach(column => {
                if("finished" === column.dataIndex){
                    // finished
                    column.render = (text, record) => {
                        return (
                            <Checkbox checked={!!text}
                                      onChange={rxRowChecked(reference, record)}/>
                        )
                    }
                }else{
                    // finishedAmount
                    column.render = (text, record = {}) => {
                        const disabled = record.finished;
                        return (
                            <Input disabled={disabled} value={text}
                                   onChange={rxRowAmount(reference, record)}/>
                        )
                    }
                }
            })

        const {data = []} = reference.props;
        Ux.ajaxEager(reference, columns, data).then($lazy => {
            state.$lazy = $lazy;
            state.$table = {
                ...table,
                columns,
            }
            Ux.of(reference).in(state).ready().done();
        })
    }
}