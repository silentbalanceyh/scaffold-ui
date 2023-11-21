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

                // 针对 normalize 无效的情况处理
                $jsx.value = text;
                // disabled 状态同步到组件
                const {
                    disabled = false,
                    config = {}
                } = reference.props;
                $jsx.disabled = disabled;


                /*
                 * 重新修订行变化的相关问题，此处原始代码有一个误区就是必须配置 format.type
                 * 在新版中，默认场景下直接 type = ARRAY 构造第一默认函数，有了此函数之后就
                 * 不会引起额外的无法更新的问题，简单说这里的 type = "ARRAY" 可以不用配置就
                 * 完成默认的表格 onChange 注入模式，如此处理之后就多出了一种扩展，若此处的
                 * 结构是基于 Matrix 而不是基于 Table，那么就可以更改 type 的值来实现
                 * onChange 的注入流程
                 */
                const format = config.format ? config.format: {};
                const { type = "ARRAY" } = format;
                const changeFn = ON_CHANGE[type];


                /*
                 * 此处的 onChange 函数需改写，此处的 index 为当前行的 index
                 * 所以此处计算的也会直接是 index 部分的值，旧代码有一个查找的过程
                 * 但实际上此处无需查找，直接处理即可。
                 */
                if (__Zn.isFunction(changeFn)) {
                    // 正常模式
                    const onChange = changeFn(reference, {
                        record,             // 行记录
                        text,               // 当前行值
                        config: {           // 所有配置
                            ...$config,                         // 基础配置
                            index,                              // 当前行索引
                            fieldColumn: column.dataIndex       // 列字段
                        }
                    });
                    return executor(reference, $jsx, onChange);
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