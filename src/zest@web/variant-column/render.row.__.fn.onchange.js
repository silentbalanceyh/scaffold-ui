import __Zn from './zero.uca.dependency';
import __Norm from './render.row.__.fn.normalize';
/*
 * 两个核心配置
 * - fieldCond：条件查询字段，当前行的 唯一键信息
 * - fieldKey：当前行的主键信息，用于更新
 *
 * 此处有点特殊，TableEditor 的 onChange 事件中会包含如下的基础信息：
 * 1）state 中会有 data 作为数据（此数据是根据 xtFormat 结果计算的）
 */
export default {
    ARRAY: (reference, {
        record = {},
        config = {}
    }) => (event) => {
        // 行记录设置，此处的属性为 config.field，外层传入的 columnIndex 值
        const valueChanged = __Zn.ambEvent(event);
        record = __Zn.clone(record);

        if(__Norm.hasOwnProperty(config.field)){
            const valueFn = __Norm[config.field];
            record[config.fieldColumn] = valueFn(valueChanged, config);
        }else{
            record[config.fieldColumn] = valueChanged;
        }
        /*
         * 按照当前行的基础数据在 value 中查找
         * 1. 查找数据源 reference.props.value
         * 2. 被查找的记录：record（副本），查找的记录主键 config.fieldKey
         * 3. 查找的条件字段：config.fieldCond
         *
         * 查找结果：
         * 1. 若可以找到则直接更新
         * 2. 若找不到证明是新增，需要从 reference.state.data 和 reference.props.value 中合并查找
         */
        const {value = []} = reference.props;
        const $value = __Zn.clone(value);
        $value[config.index] = record;
        // 内层 data 变更
        __Zn.of(reference).in({data: $value}).handle(() => {
            // 外层 onChange
            __Zn.fn(reference).onChange($value);
        })
    }
}