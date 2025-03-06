import __Zn from './zero.module.dependency';
import {Button, Space} from "antd";
import React from 'react';

const aiButton = (reference, button = {}) => {
    if (!button.key) {
        button.key = __Zn.randomUUID();
    }
    const {text, ...rest} = button;
    if (rest.icon) {
        rest.icon = __Zn.v4Icon(rest.icon);
    }
    return (
        <Button {...rest} key={rest.key}>{text}</Button>
    )
};
const aiButtonGroup = (reference, buttons = []) => {
    if (1 === buttons.length) {
        const button = buttons[0];
        return aiButton(reference, button);
    } else {
        return (
            // FIX: Warning: [antd: Button.Group] `Button.Group` is deprecated. Please use `Space.Compact` instead. Error Component Stack
            <Space.Compact>
                {buttons.map(button => aiButton(reference, button))}
            </Space.Compact>
        )
    }
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    aiButton,
    aiButtonGroup,
}