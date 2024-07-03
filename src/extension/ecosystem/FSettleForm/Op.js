import Ux from 'ux';
import Ex from "ex";

const __verifyPayment = (reference, params = {}) => {
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

const __valueAmount = (items = [], rounded = "HALF") => {
    const values = {};
    values.amount = Ex.paySum(items.filter(item=>item.finishedId===undefined).filter(item=>item.debtId===undefined));
    values.rounded = rounded;
    const attachAmount = Ex.payGap({
        amount: values.amount,
        rounded: values.rounded
    });
    Object.assign(values, attachAmount);
    return values;
}
export default {
    actions: {
        $opSave: (reference) => (params) => {
            const ref = Ux.onReference(reference, 1);
            const { $selected = {}} = reference.state;
            /* settlments / items */
            const request = Ux.clone(params);

            request.settlements = $selected.settlements;
            request.items = $selected.items;
            request.amountActual = Ex.paySum($selected.items);
            const attachAmount = __valueAmount($selected.items, request.rounded);
            Object.assign(request, attachAmount);

            if(0 === request.settlements.length || 0 === request.items.length){
                const modal = Ux.fromHoc(ref, "modal");
                const {error = {}} = modal;
                return Ux.ajaxError(reference, {data: error.empty});
            }
            return __verifyPayment(reference, request)
                .then(nil => Ux.ajaxPut("/api/trans-proc/standard", request))
                .then(data => Ux.ajaxDialog(reference, {data, key: "saved"}))
                .then(response => Ux.of(reference).close(response))
                .catch(error => Ux.ajaxError(reference, error));
        }
    },
    yoAmount: (reference) => {
        const { $selected = {} } = reference.state;
        return Ex.paySum($selected.items.filter(item=>item.finishedId===undefined).filter(item=>item.debtId===undefined));
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

        const amountAttach = __valueAmount($inited.items, values.rounded);
        Object.assign(values, amountAttach);

        values.payment = [];
        values.payment.push({
            key: "Cash",
            name: "Cash",
            amount: values.amountActual
        })
        return values;
    },
    // 选择结算单
    rxSettlement: (reference) => (keys = []) => {
        const ref = Ux.onReference(reference, 1);
        const {$inited = {}} = ref.props;
        const { settlements = [], items = []} = $inited;
        const state = {};
        const $selected = {};
        $selected.settlements = settlements.filter(item => keys.includes(item.key));
        $selected.items = items.filter(item => keys.includes(item.settlementId));
        state.$selected = $selected;
        Ux.of(reference).in(state).done();

        const rounded = Ux.formHit(reference, 'rounded');
        const formValues = __valueAmount($selected.items, rounded);
        Ux.formHits(reference, formValues);
    },
    // 选择结算明细
    rxSettleItem: (reference) => (keys = []) => {
        const ref = Ux.onReference(reference, 1);
        const {$inited = {}} = ref.props;
        const { settlements = [], items = []} = $inited;
        const state = {};
        const $selected = {};
        $selected.items = items.filter(item => keys.includes(item.key));
        const keySettlement = $selected.items.map(item => item.settlementId);
        $selected.settlements = settlements.filter(item => keySettlement.includes(item.key));
        state.$selected = $selected;
        Ux.of(reference).in(state).done();

        const rounded = Ux.formHit(reference, 'rounded');
        const formValues = __valueAmount($selected.items, rounded);
        Ux.formHits(reference, formValues);
    },
    // rxMountAfter
    rxMountAfter: (state, reference) => {
        const ref = Ux.onReference(reference, 1);
        const {$inited = {}} = ref.props;
        const { settlements = [], items = []} = $inited;
        const $selected = {};
        $selected.settlements = settlements;
        $selected.items = items;
        state.$selected = $selected;
        Ux.of(reference).in(state).ready().done();
    },
    // rxFinishType
    rxFinishType: (reference) => (event) => {
        let formValues = {};
        const { $selected = {}} = reference.state;
        const params = Ux.isMod('mHotel');
        const rounded = params['pRemainder'] ? params['pRemainder'] : "HALF";
        const amountAttach = __valueAmount($selected.items, rounded);
        Object.assign(formValues, amountAttach);
        Ux.formHits(reference, formValues);
    }
}