import __Zn from './zero.module.dependency';

const limitNumber = length => value => {
    if (value) {
        // 整数限制
        value = value.toString();
        if (1 === value.length) {
            value = value.replace(/[^0-9]/g, "");
        } else {
            value = value.replace(/\D/g, "");
        }
        // 长度限制
        if (0 < length) {
            if (length < value.length) {
                value = value.substring(0, length);
            }
        }
        value = __Zn.isNumber(value) ? parseInt(value, 10) : value;
    }
    return value;
};
const limitPInteger = length => value => {
    if (value) {
        // 正整数限制
        value = value.toString();
        if (1 === value.length) {
            value = value.replace(/[^1-9]/g, "");
        } else {
            value = value.replace(/\D/g, "");
        }
        // 长度限制
        if (0 < length) {
            if (length < value.length) {
                value = value.substring(0, length);
            }
        }
        value = __Zn.isNumber(value) ? parseInt(value, 10) : value;
    }
    return value;
};
const limitLength = length => value => {
    if (value) {
        // 长度限制
        value = value.toString();
        if (0 < length) {
            if (length < value.length) {
                value = value.substring(0, length);
            }
        }
    }
    return value;
};
const limitText = length => value => {
    if (value) {
        const width = __Zn.toWidth(value);
        if (0 < length) {
            if (length < width) {
                const last = value.charAt(value.length - 1);
                if (__Zn.isCn(last)) {
                    value = value.substring(0, length - 2);
                } else {
                    value = value.substring(0, length);
                }
            }
        }
    }
    return value;
};
const limitId = (length) => value => {
    if (value) {
        value = value.toString();
        value = value.replace(/[^A-Za-z0-9.\-_]/g, ""); //清除“数字”和“.”以外的字符
        if (0 < length) {
            if (length < value.length) {
                value = value.substring(0, length);
            }
        }
    }
    return value;
};
const limitUpper = (length) => value => {
    if (value) {
        value = value.toString();
        value = value.replace(/[^A-Za-z0-9.\-_ ]/g, ""); //清除“数字”和“.”以外的字符
        if (0 < length) {
            if (length < value.length) {
                value = value.substring(0, length);
            }
        }
        value = value.toUpperCase();
    }
    return value;
};
const limitDecimal = (length, scale = 2) => value => {
    if (value) {
        // 2.正数输入限制
        value = value.toString();
        const original = value; // String
        value = value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
        value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        value = value
            .replace(".", "$#$")
            .replace(/\./g, "")
            .replace("$#$", ".");
        const scaleReg = new RegExp(`(\\-)*(\\d+)\\.(\\d{${scale}}).`);
        value = value.replace(scaleReg, `$1$2.$3`); //只能输入两个小数
        // 3.长度输入限制
        if (length < value.length) {
            value = value.substring(0, length);
        }
        // 4.最终数据成型
        /*
         * 保证在小数输入过程中可支持 12.05 这种类型的输入
         * Issue：https://github.com/silentbalanceyh/hotel/issues/206
         */
        let scaleType = 0;
        if (0 < value.indexOf('.')) {
            const scaleStr = value.substring(value.indexOf(".") + 1);
            if (scaleStr) {
                scaleType = scaleStr.length;
            }
        }
        /*
         * 浮点数允许录入负数的浮点数，并且只能带一个负号
         */
        if (original && original.startsWith("-")) {
            value = `-${value}`;
        }
        value = __Zn.isDecimal(value) ? parseFloat(value).toFixed(scaleType) : value;
    }
    return value;
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    decimal: limitDecimal,
    number: limitNumber,
    id: limitId,
    integer: limitPInteger,
    length: limitLength,
    text: limitText,
    upper: limitUpper,
};