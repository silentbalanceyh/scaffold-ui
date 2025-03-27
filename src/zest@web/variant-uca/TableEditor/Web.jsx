import React from 'react';
import {Button, Space, Tooltip} from 'antd';
import __Zn from "../zero.uca.dependency.table.UNLOCK";
import './Cab.norm.scss';

const addFn = (reference, record, index) => event => {
    return __Zn.xtRowAdd(reference, record, index)(event).then(combine => {
        if (combine) {
            const {config = {}} = reference.props;
            __Zn.fn(reference).onChange(__Zn.xtFormat(combine, config.format));
        }
    })
}
const removeFn = (reference, record, index) => event => {
    return __Zn.xtRowDel(reference, record, index)(event).then(combine => {
        if (combine) {
            const {config = {}} = reference.props;
            __Zn.fn(reference).onChange(__Zn.xtFormat(combine, config.format));
        }
    })
}
export default (reference) => {
    const editor = __Zn.fromHoc(reference, "editor");
    const {column = {}} = editor;
    const {config = {}, ...rest} = column;
    rest.width = 96;
    rest.render = (text, record, index) => {
        const {disabled = false} = reference.props;
        const {add = {}, remove = {}} = config;
        const {data = []} = reference.state;
        return (
            // FIX: Warning: [antd: Button.Group] `Button.Group` is deprecated. Please use `Space.Compact` instead. Error Component Stack
            <Space.Compact>
                <Tooltip title={add.tooltip}>
                    <Button icon={__Zn.v4Icon(add.icon)}
                            disabled={disabled}
                            onClick={addFn(reference, record, index)}/>
                </Tooltip>
                <Tooltip title={remove.tooltip}>
                    <Button icon={__Zn.v4Icon(remove.icon)}
                            disabled={disabled || 1 >= data.length}
                            onClick={removeFn(reference, record, index)}/>
                </Tooltip>
            </Space.Compact>
        );
    }
    return {...rest};
}