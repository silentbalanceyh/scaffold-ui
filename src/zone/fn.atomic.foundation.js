import Immutable from "immutable";

import __Is from './fn.under.is.decision';
import __It from './fn.under.it.spread';
import clone from './fn.atomic.__.clone';
const prevent = (event) => {
    /* 保证安全调用 */
    if (event && __Is.isFunction(event.preventDefault)) {
        event.preventDefault();
        return {};
    } else {
        /* 二义性，返回对应的Object值 */
        if (__Is.isObject(event)) {
            return event;
        } else return {};
    }
};
const immutable = (input) => Immutable.fromJS(input);
const remove = (item, ...keys) => {
    if (!__Is.isObject(item)) {
        return;
    }
    let removed = [];
    if (__Is.isArray(keys[0])) {
        removed = keys[0];
    } else {
        keys.forEach(key => removed.push(key))
    }
    removed.forEach(key => {
        if (item.hasOwnProperty(key)) {
            delete item[key];
        }
    })
}
const assign = (target = {}, source = {}, mode = 0) => {
    if (!target) target = {};
    let result = clone(target);
    if (0 === mode) {
        result = Object.assign(target, source);
    } else {
        __It.itObject(source, (field, value) => {
            // 检查target中是否包含了field
            const targetValue = result[field];
            if (__Is.isObject(targetValue) && !__Is.isMoment(targetValue) &&
                __Is.isObject(value) && !__Is.isMoment(value)) {
                // 当前节点为两个对象，统一方式合并，且mode也相同
                result[field] = assign(targetValue, value, mode);
            } else {
                if (1 === mode) {
                    // 直接覆盖
                    result[field] = value;
                } else if (2 === mode) {
                    // 没有属性才追加
                    if (!target.hasOwnProperty(field)) {
                        result[field] = value;
                    }
                }
            }
        });
    }
    return result;
};
const element = (id) => document.getElementById(id);
export default {
    immutable,
    clone,
    assign,
    remove,
    element,
    prevent,
}