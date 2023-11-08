import __Zn from './zero.module.dependency';

const preToUi =  (ui, configuration) => {
    const segment = configuration?.segment ? configuration?.segment: {};
    if(!segment || 0 === Object.keys(segment).length){
        return ui;
    }
    const enabled = Object.keys(segment);
    /**
     * 1）先压缩，如果 segment 中没有包含 row 那么直接跳过构造新的表单
     * 2）第一步完成后，实际中表单空出来的内容和 segment 是一致的，所以可以做同态交换
     */
    // 压缩专用
    const uiCompact = [];
    const idxV = [];
    ui.forEach((row, index) => {
        if("string" === typeof row){
            if(enabled.includes(row)){
                idxV.push(index);
                uiCompact.push(row);
            }
        }else{
            uiCompact.push(row);
        }
    });
    const combiner = __Zn.clone(configuration?.config?.combiner);
    // combiner 配置有问题
    if(!combiner || !__Zn.isArray(combiner.segment)
        // 没有提取到 row 相关配置
        || 0 === idxV.length){
        // 旧流程，没有 combiner 配置
        return uiCompact;
    }
    /*
     * 顺序重排
     * 1 = A, 索引
     * 2 = B, 索引
     * 3 = C，索引
     * 定义顺序：[B,A,C]
     */
    combiner.segment.forEach((region, index) => {
        // 从 region 中可提取索引值
        const idxReal = idxV[index];
        if(!isNaN(idxReal) && 0 <= idxReal){
            // 交换
            uiCompact[idxReal] = region;
        }
    });
    return uiCompact;
}
/*
 * 新版用于执行 segment / compiler 部分，此处的 compiler 为新配置，主要针对两种模型
 * 1）Segment 模型，若配置了 segment 之后，存在 compiler 的情况需执行 compiler 来实现表单组合
 * 2）Grid 模型，UP / FORM / DOWN 结构下，存在 compiler 的情况则还可以执行表单组合
 */
export default {
    /*
     * 新版交换算法，直接在您的配置中做两个事：
     * 1）如果 segment 配置中没有配置此节点，直接跳过
     * 2）如果存在 combiner 配置，则只提取 combiner.segment 中的顺序
     *
     * 这个函数属于扩展函数，此处需要说明 segment 中本来是直接可以使用 key = value 的方式对表单进行配置，为何还需要
     * combiner 配置呢，实际是因为它代表了两个不同的概念
     * 1）key = value 表示表单的职责位置，基础位置和扩展位置强相关，每个位置职责有限且一致，语义级一致
     * 2）combiner 表示基于职责位置的顺序重排
     */
    preToUi,
    /*
     * 复杂表单模型，针对特殊类型的计算
     * {
     *     "complex": true,
     *     "config": {
     *         "pages": {
     *             "<key>": []
     *         }
     *     }
     * }
     */
    preToComplex: (cell, configuration, compilerFn) => {
        // 0. 前置条件捕捉
        if(!__Zn.isFunction(compilerFn)) {
            return;
        }
        // 1. 先克隆一套配置
        const cellAdd = __Zn.clone(cell);
        // 2. 按断是否执行 pages 处理，若不执行 pages 处理，则直接截断跳出
        if(!cellAdd.config || !cellAdd.config['pages']) {
            // undefined
            return;
        }
        // 3. 递归处理
        const { pages = {}} = cellAdd.config;
        const pagesData = {};
        Object.keys(pages).forEach(pageName => {
            // 子表单
            const pageForm = pages[pageName];
            if(pageForm && __Zn.isArray(pageForm.ui)){
                // 「递归」复杂页面依旧执行递归替换
                pagesData[pageName] = __Zn.clone(pageForm);
                pagesData[pageName].ui = compilerFn(pageForm.ui, configuration);
            }
        });
        cellAdd.config.pages = pagesData;
        return cellAdd;
    },
    /*
     * 复杂表单模型，针对 segment 的单独计算，这里执行比较特殊，主要针对
     * 1）类型是 Object，直接返回
     * 2）类型是 String，执行 segment 标准化处理返回
     * 3）其他类型gssi，直接构造，如：["","",""]
     * 注意新版此处返回 []， 方便表单中统一返回值，对整个表单配置执行构造，外层可直接实现幂等型拉平处理。
     */
    preToSegment: (cell, configuration) => {
        const segment = configuration?.segment ? configuration?.segment: {};
        /*
         * 此处 cell 就是 segmentKey，你可以直接根据 segmentKey 获取到对应的 segment 配置数据
         * 在这一步之前，整个表单部分已完成过重排序，针对核心位置进行过重排，这里的表单部分仅针对可用
         * 的部分进行处理（流程表中的中配置是标准化的）
         */
        if("string" === typeof cell){
            const segmentData = segment[cell];
            if(__Zn.isArray(segmentData)){
                const result = [];
                // Cell 连接
                segmentData.filter(__Zn.isArray).filter(__Zn.isNotEmpty)
                    // Ui 追加都要考虑不为空
                    .forEach(each => result.push(each));
                return result;
            }else{
                /*
                 * String 单元格的普通追加
                 * [
                 *     "","",""
                 * ]
                 */
                return cell;
            }
        }else if(__Zn.isObject(cell)){
            /*
             * Object 单元格的普通追加
             * [
             *   {},{},{}
             * ]
             */
            return cell;
        }else{
            // 非法连接部分
            return null;
        }
    }
}