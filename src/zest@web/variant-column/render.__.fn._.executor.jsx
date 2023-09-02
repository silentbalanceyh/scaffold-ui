import __Zn from './zero.uca.dependency';
import __JSX from './column.__.fn.jsx.segment';
import __NORM from './column.__.fn.norm.text';
import React from 'react';
import __T from '../equip.fn.plugin.extension';
import Opt from './option.__.render.executor';

const Cv = __Zn.Env;

const Cmn = {
    ...__JSX,
    ...__NORM,
}

export default {
    EXECUTOR: (reference, column, executor = {}) => (text, record) => {
        const $options = Opt.optionIn(reference);
        const {$option = []} = column;
        const options = [];
        // 「显示 / 隐藏」过滤 $plugins.koRow
        __T.pluginKoRow(reference, record, $option).forEach((item, index) => {
            // 「启用 / 禁用」过滤 ￥plugins.pluginRow（和表单会绑定，ACL操作）
            const calculated = __T.pluginOp(reference, record);
            const rowKey = `${text}-${index}`;                                          // 行专用的 key
            if (rowKey) {
                const option = {};
                option.key = `link-${rowKey}`;
                option.text = __Zn.formatExpr(item.text, record);
                option.enabled = Opt.optionEnabled(
                    calculated, item,
                    executor, $options
                );
                // 新流程专用
                option.success = item.success;
                if (option.enabled) {
                    Opt.optionExecutor(option, item, {
                        text, record,
                        config: column,
                        executor,
                        reference,
                    });
                    Opt.optionRule(option, item, record);
                    options.push(option);
                } else {
                    const viewText = $options['op.row.view'];                          // fnEdit 切换，编辑被关闭
                    if ("fnEdit" === item.executor && viewText) {                      // 打开 fnEdit
                        option.enabled = true;
                        option.icon = "search";
                        option.text = viewText;
                        Opt.optionExecutor(option, item, {
                            text, record,
                            config: column,
                            executor,
                            reference,
                        });
                        options.push(option);
                    }
                }
            }
        });
        // 自动计算 divider
        let normalized = [];
        for (let idx = 0; idx < options.length; idx++) {
            const option = options[idx];
            normalized.push(option);
            if (idx < options.length - 1) {
                const item = {};
                item.divider = true;
                item.key = `link-devider-${text}-${idx}`;
                normalized.push(item);
            }
        }
        return (
            <div style={{
                width: "100%",
                textAlign: "center",
                ...(column.style ? column.style : {})
            }}>
                {0 < options.filter(item => !item.divider).length ?
                    normalized.map(item => item.divider ?
                        Cmn.jsxDivider(item.key) :                                      // Divider 渲染
                        (item.confirm ? Cmn.jsxConfirm(item) : Cmn.jsxLink(item))       // Confirm 窗口处理，链接专用处理
                    ) : false}
            </div>
        );
    }
}