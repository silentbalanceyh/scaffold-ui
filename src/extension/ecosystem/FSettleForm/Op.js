import Ux from 'ux';
import Ex from "ex";

const verifyPayment = (reference, params = {}) => {
    // 支付手段
    const finishType = params.finishType;
    if("STANDARD" === finishType){
        // 标准结账，标准结账验证 payment
        return Ex.inPrePay(reference, params, {}, true);
    }else{
        // 延迟（应收/退款）
        return Ux.promise(params);
    }
}
const valueAmount = (data = []) => {
    let amount = 0;
    data.forEach(item => {
        if(item.income){
            amount += item.amount;
        }else{
            amount -= item.amount;
        }
    })
    return amount;
}
export default {
    actions: {
        $opSave: (reference) => (params) => {
            const ref = Ux.onReference(reference, 1);
            const { $selected = {}} = ref.state;
            /* settlments / items */
            const request = Ux.clone(params);
            request.settlements = $selected.settlements;
            request.items = $selected.items;
            request.amountActual = valueAmount($selected.items);

            if(0 === request.settlements.length || 0 === request.items.length){
                const modal = Ux.fromHoc(ref, "modal");
                const {error = {}} = modal;
                return Ux.ajaxError(reference, {data: error.empty});
            }
            return verifyPayment(reference, request)
                .then(nil => Ux.ajaxPut("/api/trans-proc/standard", request))
                .then(data => Ux.ajaxDialog(reference, {data, key: "saved"}))
                .then(response => Ux.of(reference).close(response))
                .catch(error => Ux.ajaxError(reference, error));
        }
    },
    yoAmount: (reference) => {
        const ref = Ux.onReference(reference, 1);
        const { $selected = {} } = ref.state;
        return valueAmount($selected.items);
    },
    yoValue: (reference) => {
        const {$inited = {}} = reference.props;
        let values = Ux.clone($inited);
        // 计算结算信息，追加 cross
        values = Ex.inSettlement(values);
        /*
         * 默认结算方式和零头处理
         * - finishType
         * - rounded
         * 旧版中包含的 linked 在新版中已经在后端计算，所以不考虑
         * 在范围内
         */
        values.finishType = "STANDARD";
        const params = Ux.isMod('mHotel');
        values.rounded = params['pRemainder'] ? params['pRemainder'] : "HALF";
        return values;
    },
    // 选择结算单
    rxSettlement: (reference) => (keys = []) => {
        const {$inited = {}} = reference.props;
        const { settlements = [], items = []} = $inited;
        const state = {};
        const $selected = {};
        $selected.settlements = settlements.filter(item => keys.includes(item.key));
        $selected.items = items.filter(item => keys.includes(item.settlementId));
        state.$selected = $selected;
        Ux.of(reference).in(state).done();
    },
    // 选择结算明细
    rxSettleItem: (reference) => (keys = []) => {
        const {$inited = {}} = reference.props;
        const { settlements = [], items = []} = $inited;
        const state = {};
        const $selected = {};
        $selected.items = items.filter(item => keys.includes(item.key));
        const keySettlement = $selected.items.map(item => item.settlementId);
        $selected.settlements = settlements.filter(item => keySettlement.includes(item.key));
        state.$selected = $selected;
        Ux.of(reference).in(state).done();
    }
}