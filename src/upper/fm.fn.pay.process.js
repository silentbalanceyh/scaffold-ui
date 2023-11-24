import Ux from "ux";
const payGap = (params = {}) => {
    const rounded = params.rounded ? params.rounded : "NONE";
    // 根据 amount 计算实际金额 amountActual 和 amountGap
    const amount = Ux.valueFloat(params.amount, 0.0);
    const amountAddon = {};
    if (0 !== amount) {
        if ("FLOOR" === rounded) {
            // 舍弃
            amountAddon.amountActual = Math.floor(amount);
            amountAddon.amountGap = (amount - amountAddon.amountActual).toFixed(2);
        } else if ("CEIL" === rounded) {
            // 直接进入
            amountAddon.amountActual = Math.ceil(amount);
            amountAddon.amountGap = (amount - amountAddon.amountActual).toFixed(2);
        } else if ("HALF" === rounded) {
            // 四舍五入
            amountAddon.amountActual = Math.round(amount);
            amountAddon.amountGap = (amount - amountAddon.amountActual).toFixed(2);
        } else if ("INPUT" === rounded) {
            // 输入
            amountAddon.amountActual = amount;
        } else {
            // 不处理零头
            amountAddon.amountActual = amount;
            amountAddon.amountGap = 0;
        }
    }
    return amountAddon;
}
export default {
    /*
     * amount
     * rounded
     * =>
     * amountActual
     * amountGap
     */
    payGap,
}