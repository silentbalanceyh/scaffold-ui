/**
 * 前置条件检查，检查当前 io 设置是否满足前置条件，若满足才触发，此处的条件
 *
 * - `inSource` 必须配置，此配置不可为空，为空则不会触发
 * - 针对数据逻辑执行检查，检查结果返回条件部分。
 *
 * 将原始的 **双条件** 合并成单条件处理。
 *
 * @private
 * @param request 表单请求数据
 * @param config `io` 部分的配置
 * @param reference React组件
 */
export default (request = {}, config = {}, reference) => {
    const {
        inSource,
        inPre
    } = config;
    // 第一条件，若 inSource 未配置，直接返回 false
    if(!inSource){
        return false;
    }
    if(inPre){
        let checked = true;
        Object.keys(inPre).forEach(field => {
            let expected = inPre[field];
            let actual = request[field];
            if (String(expected) !== String(actual)) {
                /*
                 * 深度检查，如 undefined, false, 0, "" 表示相同意思
                 */
                expected = !!expected;
                actual = !!actual;
                if (expected !== actual) {
                    checked = false;
                }
            }
        });
        return checked;
    }else{
        // 检查通过，由于没有配置 inPre，直接跳过此处的检查流程
        return true;
    }
}