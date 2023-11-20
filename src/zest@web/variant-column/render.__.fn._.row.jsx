import __Zn from './zero.uca.dependency';
import React from 'react';

import WebField from '../variant-uca/index.column.UNLOCK.ROW';
import ON_CHANGE from './render.row.__.fn.onchange';
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
            // optionConfig 的另外表达方式

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