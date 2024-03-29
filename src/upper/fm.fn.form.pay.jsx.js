import __In from './variant-input';
import __Pr from './fm.fn.pay.process';

export default {
    // 入账部分处理
    payFormBill: (ref) => {
        const fields = __In.Jsx.PayFn(ref);
        return {
            amountView: fields.amountView,
            items: fields.items,
        }
    },
    // 特殊函数
    payFormSettle: (ref) => {
        const {$selected = {}} = ref.state;
        const fields = __In.Jsx.PayFn(ref, __Pr.paySum($selected.items));
        return {
            rounded: fields.rounded,
            payment: fields.payment,
            amountGap: fields.amountGap,
        }
    },
    payFormDebt: (ref, amount) => {
        const fields = __In.Jsx.PayFn(ref, amount);
        return {
            rounded: fields.rounded,
            payment: fields.payment,
            amountGap: fields.amountGap,
        }
    },
    // 特殊函数
    payFormFee: (ref) => {
        const {$fee = {}} = ref.props;
        const fields = __In.Jsx.PayFn(ref, $fee.sum);
        return {
            finishType: fields.finishType,
            rounded: fields.rounded,
            payment: fields.payment,
            amountGap: fields.amountGap,
        }
    },
    // 普通入账
    payFormNorm: (ref) => {
        const fields = __In.Jsx.PayFn(ref);
        return {
            payment: fields.payment,
            rounded: fields.rounded,
            amount: fields.amount,
            amountGap: fields.amountGap,
        }
    },
    // items 入账
    payFormItem: (ref) => {
        const fields = __In.Jsx.PayFn(ref);
        return {
            payment: fields.payment,
            rounded: fields.rounded,
            amountView: fields.amountView,
            amountGap: fields.amountGap,
            items: fields.items
        }
    }
}