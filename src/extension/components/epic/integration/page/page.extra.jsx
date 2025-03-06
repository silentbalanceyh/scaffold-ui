import {Button, Space, Tooltip} from "antd";
import Ux from "ux";
import React from "react";

export default (reference, $buttons = []) => {
    const {$submitting = false, $tabs = {}} = reference.state;
    const {items = []} = $tabs;
    return 2 === items.length ? (
        // FIX: Warning: [antd: Button.Group] `Button.Group` is deprecated. Please use `Space.Compact` instead. Error Component Stack
        <Space.Compact>
            {$buttons.map(each => {
                const {text, onClick, ...rest} = each;
                return (
                    <Tooltip title={text} key={rest['key']}>
                        <Button {...rest} loading={$submitting} onClick={event => {
                            Ux.prevent(event);
                            Ux.of(reference).submitting().handle(() => {
                                if (Ux.isFunction(onClick)) {
                                    onClick(event);
                                }
                            })

                            // reference.?etState({$submitting: true});
                            // if (Ux.isFunction(onClick)) {
                            //     onClick(event);
                            // }
                        }}/>
                    </Tooltip>
                )
            })}
        </Space.Compact>
    ) : false
}