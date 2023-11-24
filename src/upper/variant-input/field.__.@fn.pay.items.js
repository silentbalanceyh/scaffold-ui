import Ux from "ux";

export default (reference, jsx) => {
    return Ux.aiTableTransfer(reference, jsx, (items = []) => {
        let sum = 0;
        if (items) {
            items.forEach(item => {
                const left = Ux.valueInt(item.quantity, 0);
                const right = Ux.valueFloat(item.price, 0.00);
                sum += (left * right);
            });
        }
        const values = {};
        values.amount = sum;
        Ux.formHits(reference, values);
        // 此处刷新之后 amountView 中才会包含相关值信息
        Ux.of(reference).up().done();
    })
}