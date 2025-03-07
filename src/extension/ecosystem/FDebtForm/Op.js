import Ux from 'ux';
import Ex from 'ex';
const __valueInited = ($inited = {}, customer = {}) => {
    const formValues = Ux.clone($inited);
    const { debts = []} = $inited;

    // 客户名称，由于客户名称是一致的，所以签单人也应该一致
    formValues.customerName = customer.name;
    formValues.customerId = customer.key;
    // 应收总额度
    formValues.amountTotal = debts.map(debt => debt.amount)
        .reduce((left, right) => Ux.mathSum(left, right, true), 0.0);
    formValues.amountActual = debts.map(debt => debt.amountBalance)
        .reduce((left, right) => Ux.mathSum(left, right, true), 0.0);
    return formValues;
}

// 验证本次请求详细信息
const __verifyRequest = (params = {}, reference) => {
    // 父级引用
    const ref = Ux.onReference(reference, 1);
    const modal = Ux.inHoc(ref, "modal");
    const { error = {}} = modal;
    const amountLimit = Ux.valueFloat(params.amountTotal);
    const amount = Ux.valueFloat(params.amount);
    if(amountLimit > amount){
        // 本次交易额不可以超过总额
        return Ux.ajaxError(reference, {data: error.exceed});
    }
    if (0 === params.amountActual){
        // 本次交易额为0
        return Ux.ajaxError(reference, {data: error.zero});
    }
    // 付款方式中的额度必须和 amountActual 相等
    return Ex.inPrePay(reference, params, {}, true);
}
export default {
    actions: {
        $opSave: (reference) => (params) => {
            const request = Ux.clone(params);
            return __verifyRequest(request, reference)
                .then(nil => {
                    // 标准结账（现结）
                    const payment = request.payment;
                    const $payment = [];
                    payment.forEach(each => {
                        const found = Ux.elementUniqueDatum(reference, "pay.type", "code", each.name);
                        if (found) {
                            const record = {};
                            record.amount = each.amount;
                            record.name = found.name;
                            $payment.push(record);
                        }
                    })
                    request.payment = $payment;
                    // type 计算
                    request.type = (request.amountActual > 0) ? "DEBT": "REFUND";
                    return Ux.ajaxPut("/api/trans-proc/debt", request)
                })
                .then(data => Ux.ajaxDialog(reference, {data, key: "saved"}))
                .then(response => Ux.of(reference).close(response))
                .catch(error => Ux.ajaxError(reference, error));
        }
    },
    yoValue: ($inited = {}, customer = {}) => {
        const formValues = __valueInited($inited, customer);
        const { debts = []} = $inited;
        const $debts = Ux.clone(debts);
        $debts.forEach(debt => {
            debt.finished = true;
            debt.finishedAmount = debt.amountBalance;
        });
        formValues.debts = $debts;

        const params = Ux.isMod('mHotel');
        formValues.rounded = params['pRemainder'] ? params['pRemainder'] : "HALF";
        const amountAttach = Ex.payGap({
            amount: formValues.amountActual,
            rounded: formValues.rounded,
        });
        formValues.amount = formValues.amountActual;
        Object.assign(formValues, amountAttach);

        formValues.payment = [];
        formValues.payment.push({
            key: "Cash",
            name: "Cash",
            amount: formValues.amountActual
        })

        return formValues;
    },
    yiPage: (reference) => {
        const state = {};
        // 客户ID customerId
        const { $inited = {}} = reference.props;
        const { debts = []} = $inited;
        const customerId = debts[0]?.customerId;
        return Ux.ajaxGet("/api/customer/:key", {key: customerId}).then(response => {
            state.$customer = response;
            Ux.of(reference).in(state).ready().done();
        })
    },
    // rxMountAfter
    rxMountAfter: (state, reference) => {
        const { $inited = {}} = reference.props;
        state.$inited = Ux.clone($inited);
        Ux.of(reference).in(state).ready().done();
    },
    rxDebts: (ref) => (debts = [], reference) => {
        const { $inited = {}} = reference.props;
        const formValues = Ux.clone($inited);
        formValues.debts = debts;
        formValues.amountActual = debts.map(debt => debt.finishedAmount)
            .reduce((left, right) => Ux.mathSum(left, right, true), 0.0);
        formValues.amount = formValues.amountActual;

        const formRef = Ux.onReference(reference, 1);

        const rounded = Ux.formHit(formRef, "rounded");
        const amountAttach = Ex.payGap({
            amount: formValues.amountActual,
            rounded,
        });
        Object.assign(formValues, amountAttach);
        Ux.formHits(formRef, formValues);
    }
}