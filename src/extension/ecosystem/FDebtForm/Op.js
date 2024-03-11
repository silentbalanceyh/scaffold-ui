import Ux from 'ux';

const __yoValue = ($inited = {}, customer = {}) => {
    const formValues = Ux.clone($inited);
    const { debts = []} = $inited;

    // 客户名称，由于客户名称是一致的，所以签单人也应该一致
    formValues.customerName = customer.name;
    formValues.customerId = customer.key;
    // 应收总额度
    formValues.amount = debts.map(debt => debt.amount)
        .reduce((left, right) => Ux.mathSum(left, right), 0);
    formValues.amountBalance = debts.map(debt => debt.amountBalance)
        .reduce((left, right) => Ux.mathSum(left, right), 0);
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
        formValues.amountBalance = debts.map(debt => debt.amountBalance)
            .reduce((left, right) => Ux.mathSum(left, right), 0);

        const formRef = Ux.onReference(reference, 1);
        Ux.formHits(formRef, formValues);
    }
}