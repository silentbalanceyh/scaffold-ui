import __Zn from './zero.uca.dependency';
import React from 'react';

import WebField from '../variant-uca/index.column.UNLOCK.ROW';
/*
 * 两个核心配置
 * - fieldCond：条件查询字段，当前行的 唯一键信息
 * - fieldKey：当前行的主键信息，用于更新
 *
 * 此处有点特殊，TableEditor 的 onChange 事件中会包含如下的基础信息：
 * 1）state 中会有 data 作为数据（此数据是根据 xtFormat 结果计算的）
 */
const ON_CHANGE = {
    ARRAY: (reference, {
        record = {},
        config = {},
    }) => (event) => {
        // 行记录设置，此处的属性为 config.field，外层传入的 columnIndex 值
        const valueChanged = __Zn.ambEvent(event);
        record = __Zn.clone(record);
        record[config.fieldColumn] = valueChanged;
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
export default {

    ROW: (reference, column = {}) => {
        const {$config = {}} = column;
        const {
            field, jsx = {},
        } = $config;
        const executor = WebField[field];
        // jsx processing
        return (text, record = {}, index) => {
            const $jsx = __Zn.clone(jsx);
            if (__Zn.isFunction(executor)) {
                if (text) {
                    $jsx.value = text;
                }

                // disabled 状态同步到组件
                const {
                    disabled = false,
                    config = {}
                } = reference.props;
                $jsx.disabled = disabled;

                // 查找 ON_CHANGE 部分的高阶函数
                const changeFn = ON_CHANGE[config.format?.type];
                /*
                 * 此处的 onChange 函数需改写，此处的 index 为当前行的 index
                 * 所以此处计算的也会直接是 index 部分的值，旧代码有一个查找的过程
                 * 但实际上此处无需查找，直接处理即可。
                 */
                if (__Zn.isFunction(changeFn)) {
                    // 正常模式
                    return executor(reference, $jsx, changeFn(reference, {
                        record,             // 行记录
                        text,               // 当前行值
                        config: {           // 所有配置
                            ...$config,                         // 基础配置
                            index,                              // 当前行索引
                            fieldColumn: column.dataIndex       // 列字段
                        }
                    }))
                } else {
                    return executor(reference, $jsx)
                }
            } else {
                return (
                    <span>{field} is invalid</span>
                )
            }
        }
    },
}