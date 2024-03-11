import Ux from 'ux';
import Ex from 'ex';
const __yoValue = ($inited = {}, customer = {}) => {
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
export default {
    yoValue: ($inited = {}, customer = {}) => {
        const formValues = __yoValue($inited, customer);
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