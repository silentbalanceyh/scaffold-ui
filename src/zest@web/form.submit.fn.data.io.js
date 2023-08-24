import __Zn from './zero.module.dependency';
import preFn from './form.submit.fn.__.io.pre';
import inputFn from './form.submit.fn.__.io.input';

const Cv = __Zn.Env;

const dataIo = (request = {}, config = {}, reference) => {
    /*
     * 出现 writer 时，最终结果允许出现
     * null, undefined, 0 等不合法的值（反选删除）
     */
    const {
        inSource,
        inPath,
        outType,
    } = config;
    // inPre 检查
    if (preFn(request, config, reference)) {
        // sourceData
        const sourceData = request[inSource];
        // 1. sourceData 无值
        if (!sourceData) {
            // request[inField] = undefined;
            return;
        }
        // 2. 有 inPath，则直接解析
        if (inPath) {
            return inputFn(sourceData, {
                inPath,     // 数据采集路径
                outType,    // 输出类型：ARRAY / OBJECT
            }, reference);
        }
        // 3. 没有 inPath，直接返回 sourceData
        return __Zn.clone(sourceData);
    }
}
const dataWrite = (request = {}, io = {}, reference) => {
    const {writer = {}} = io;
    if (__Zn.isEmpty(writer)) {
        // 跳过，没有定义 writer
        return;
    }
    /*
     * 若 writer 中出现了 key = value，value 为 String 类型
     * 自动转换
     * {
     *     "key": "field"
     * }
     * 这种直接转换成
     * {
     *     "key": {
     *         "inSource": "field",
     *         "inPath": null
     *     }
     * }
     */
    __Zn.dgDebug(writer, "[Data Writer] 转换器", "#008B00");
    Object.keys(writer).forEach(field => {
        const config = writer[field];
        if ("string" === typeof config) {
            request[field] = dataIo(request, {
                inField: config,
                inPath: null
            }, reference);
        } else {
            request[field] = dataIo(request, {
                ...config,
                inField: field,
            }, reference);
        }
    })
}
const dataRead = ($inited = {}, config = {}, reference) => {

}
const dataRequest = (params = {}) => {
    // 执行默认参数处理
    const data = __Zn.clone(params);
    /* 记录中的语言信息 */
    data.language = Cv['LANGUAGE'];
    if (!data.hasOwnProperty('active')) {
        /* 默认记录启用 */
        data.active = true;
    }
    /*
     * 三个头部参数提取，仅保留 sigma 参数，其余两个参数不在此处体现
     * X-App-Id, X-App-Key, X-Sigma
     */
    const app = __Zn.isInit();
    if (app && app.sigma) {
        // 双字段处理
        data.sigma = app.sigma;
    }
    return __Zn.valueValid(data);
};
export default {
    dataRequest,
    dataIo,
    dataRead,
    dataWrite,
}