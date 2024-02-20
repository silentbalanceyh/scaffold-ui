import Ux from 'ux';
import Ex from "ex";

const verifyPayment = (reference, params = {}) => {
    // 支付手段
    const finishType = params.finishType;
    if ("STANDARD" === finishType) {
        // 标准结账，标准结账验证 payment
        return Ex.inPrePay(reference, params, {}, true);
    } else {
        // 延迟（应收/退款）
        return Ux.promise(params);
    }
}
export default {
    actions: {
        $opSave: (reference) => (params) => {
            // 支付手段
            const $params = Ux.clone(params);

            // 验证表单
            const request = {
                ...$params,
                amount: Math.abs($params.amount)
            }
            return verifyPayment(reference, request)
                .then(nil => Ux.ajaxPut("/api/settle/finish/:key", {
                    key: $params.key,
                    $body: $params
                }))
                .then(data => Ux.ajaxDialog(reference, {data, key: "saved"}))
                .then(response => Ux.of(reference).close(response))
                .catch(error => Ux.ajaxError(reference, error));
        }
    },
    yoValue: (reference) => {
        const {$inited = {}} = reference.props;
        let values = Ux.clone($inited);
        // 计算结算信息
        values = Ex.inSettlement(values);
        const {record = {}} = values;
        if (values.finished) {
            if (Ux.isEmpty(record)) {
                // 已结算
                values.linked = "DONE";
            } else {
                if (0 < record.amount) {
                    values.linked = "DEBT";
                } else {
                    values.linked = "REFUND";
                }
            }
        } else {
            // 未结算
            values.linked = "PENDING";
            // 结算方式默认：STANDARD
            values.finishType = "STANDARD";
            // 零头处理
            const params = Ux.isMod('mHotel');
            values.rounded = params['pRemainder'] ? params['pRemainder'] : "HALF";
        }
        return values;
    },
    // 选择结算单
    rxSettlement: (reference) => (keys = []) => {
        const {$inited = {}} = reference.props;
        const {settlements = [], items = []} = $inited;
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
        const {settlements = [], items = []} = $inited;
        const state = {};
        const $selected = {};
        $selected.items = items.filter(item => keys.includes(item.key));
        const keySettlement = $selected.items.map(item => item.settlementId);
        $selected.settlements = settlements.filter(item => keySettlement.includes(item.key));
        state.$selected = $selected;
        Ux.of(reference).in(state).done();
    }
}