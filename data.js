export default {
    yoOp: () => ({
        // 批量处理
        rxSettleBatch: (ref, config) => (event) => {
            console.log(ref, config, event);
        }
    }),
    yoExecutor: () => ({
        // 行处理
        rxSettle: (key = {}, data = {}, metadata = {}) => {
            console.log(key, data, metadata);
        }
    })
}