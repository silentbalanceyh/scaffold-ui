import React from 'react';
import Ux from 'ux';
import {Button, Space, Tooltip} from 'antd';
import FUNS from '../event';
/*
 * 按照状态设置按钮
 */
const OP = {
    READY: [
        // "edit",      // 就绪的任务不可编辑
        // "starting",     // 启动任务
        "stopping"      // 停止任务
    ],
    ERROR: [
        "edit",         // 错误时可编辑
        "resuming",     // 恢复任务
    ],
    STOPPED: [
        "edit",         // 停止时可编辑
        "starting",     // 停止时可启动
    ]
};

const renderBar = (reference, config = {}, item, onClick) => {
    const {text, icon, ...rest} = config;
    const attrs = Ux.clone(rest);
    attrs.icon = Ux.v4Icon(icon);
    if (text) {
        /* Confirm */
        return (
            <Tooltip title={text} key={item}>
                {/* Warning: A props object containing a "key" prop is being spread into JSX: */}
                <Button key={attrs.key} {...attrs} onClick={onClick}/>
            </Tooltip>
        )
    } else {
        attrs.key = item;
        return (
            // Warning: A props object containing a "key" prop is being spread into JSX:
            <Button key={attrs.key} {...attrs} onClick={onClick}/>
        )
    }
};
export default (reference) => {
    return ({
        dataIndex: "key",
        fixed: "left",
        width: 72,
        className: "job-op",
        render: (text, record = {}) => {
            const status = record.status;
            if (OP[status]) {
                const cab = Ux.sexCab(reference, "toolbar");
                let items = Ux.clone(OP[status]);
                /*
                 * 如果是 readOnly，则移除 edit
                 */
                if (record.readOnly) {
                    items = items.filter(item => "edit" !== item);
                }
                return (
                    // FIX: Warning: [antd: Button.Group] `Button.Group` is deprecated. Please use `Space.Compact` instead. Error Component Stack
                    <Space.Compact key={text}>
                        {items.map(item => {
                            let onClick = FUNS.op[item];
                            if (Ux.isFunction(onClick)) {
                                onClick = onClick(reference, record);
                            }
                            if (Ux.isFunction(onClick)) {
                                const config = cab[item];
                                return renderBar(reference, config, item, onClick);
                            } else return false;
                        })}
                    </Space.Compact>
                )
            } else return false;
        }
    })
}