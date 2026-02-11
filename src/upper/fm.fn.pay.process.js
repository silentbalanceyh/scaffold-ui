import Ux from "ux";
const payGap = (params = {}) => {
    const rounded = params.rounded ? params.rounded : "NONE";
    // 根据 amount 计算实际金额 amountActual 和 amountGap
    const amount = Ux.valueFloat(params.amount, 0.0);
    const amountAddon = {};
     //FIX:https://e.gitee.com/wei-code/issues/table?issue=IBRE54
    if (0 !== amount) {
        if ("FLOOR" === rounded) {
            // 舍弃
            amountAddon.amountActual = Math.floor(amount);
            amountAddon.amountGap = (amountAddon.amountActual - amount).toFixed(2);
        } else if ("CEIL" === rounded) {
            // 直接进入
            amountAddon.amountActual = Math.ceil(amount);
            amountAddon.amountGap = (amountAddon.amountActual - amount).toFixed(2);
        } else if ("HALF" === rounded) {
            // 四舍五入
            amountAddon.amountActual = Math.round(amount);
            amountAddon.amountGap = (amountAddon.amountActual - amount).toFixed(2);
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
/*
 * Fix: JavaScript 浮点数在加法的时候会出现精度问题，是因为 JavaScript 中的数字按照 IEEE 754 的标准
 * 使用 64 位双精度浮点型来表示1。这样会导致一些无法用有限的二进制位精确表示的十进制小数，在转换成二进制的过程中产生误差2。
 * 防止：535.83 -> 535.8299999999999 的情况发生
 */
const paySum = (data = []) => {
    let amount = 0;
    data.forEach(item => {
        if(item.income){
            amount += (item.amount * 100);
        }else{
            amount -= (item.amount * 100);
        }
    })
    return amount / 100;
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
    paySum,
}