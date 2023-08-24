import __Zn from './zero.module.dependency';
/*
*  参考下边的示例程序
*  source:{
*      "a": {
*          "key": "key1",
*          "a": true,
*      },
*      "b": {
*          "key": "key2",
*          "b": true,
*      },
*      "c": {
*          "key": "key3",
*          "c": false
*      }
*  }
* 1.1. inPath = :field.key
*      outType = ARRAY
*      => [key1, key2, key3]
*
* 1.2. inPath = :field.key
*      outType = ARRAY
*      => {
*         "a": "key1",
*         "b": "key2",
*         "c": "key3"
*      }
*
* 2.1. inPath = :field.:field
*      outType = ARRAY
*      => [true, true, true]
*
* 2.2. inPath = :field.:field
*      outType = Object
*      => {
*          "a": true,
*          "b": true,
*          "c": true
*      }
*/
const __valueExpr = (sourceData, config = {},) => {
    const {
        inPath,
        outType,
    } = config;
    if ("ARRAY" === outType) {
        // 只关注路径下的值，构造完成的 Array 返回
        const result = [];
        Object.keys(sourceData).forEach(field => {
            const path = __Zn.formatExpr(inPath, {field}, true);
            if (path) {
                result.push(__Zn.valuePath(sourceData, path));
            }
        })
        return result;
    } else if ("OBJECT" === outType) {
        // 同时关注路径下的键值
        const result = {};
        Object.keys(sourceData).forEach(field => {
            const path = __Zn.formatExpr(inPath, {field}, true);
            if (path) {
                result[field] = __Zn.valuePath(sourceData, path);
            }
        })
        return result;
    }
}

const valueIngest = (sourceData, config = {}, reference) => {

    if (__Zn.isArray(sourceData)) {
        // Array 执行投影操作
        return sourceData
            .map(each => valueIngest(each, config, reference))
            .filter(each => !!each);
    } else if (__Zn.isObject(sourceData)) {
        const {
            inPath,
        } = config;
        /*
         * inPath 类型判断转换成统一的 path
         * 1. 包含了 : （多值结果集）
         * 2. 不包含 : （单值结果集）
         */
        if (!!inPath && 0 <= inPath.indexOf(":")) {
            // 根据输出结果解析
            return __valueExpr(sourceData, config);
        } else {
            // 单值结果集
            return __Zn.valuePath(sourceData, inPath);
        }
    } else {
        // 不是 Object / Array 则直接返回 sourceData 即可（纯值拷贝）
        return sourceData;
    }
}
export default valueIngest