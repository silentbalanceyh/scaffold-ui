import Ux from 'ux';
import Ex from "ex";

export default {
    actions: {
        $opSave: (reference) => (params) => {
            console.log(params);
            return Promise.reject("Hello")
        }
    },
    yoValue: (reference) => {
        const {$inited = {}} = reference.props;
        let values = Ux.clone($inited);
        // 计算结算信息
        values = Ex.inSettlement(values);
        const { record = {}} = values;
        if(values.finished){
            if(Ux.isEmpty(record)){
                // 已结算
                values.linked = "DONE";
            }else{
                if(0 < record.amount){
                    values.linked = "DEBT";
                }else{
                    values.linked = "REFUND";
                }
            }
        }else{
            // 未结算
            values.linked = "PENDING";
            // 结算方式默认：STANDARD
            values.finishType = "STANDARD";
            // 零头处理
            const params = Ux.isMod('mHotel');
            values.rounded = params['pRemainder'] ? params['pRemainder'] : "HALF";
        }
        return values;
    }
}