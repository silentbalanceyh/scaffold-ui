import {Button, Col, Popconfirm, Row, Space, Switch, Tooltip} from "antd";
import React from "react";
import Ux from 'ux';
import Op from './Op';
import {Link} from "react-router-dom";

// eslint-disable-next-line import/no-anonymous-default-export
export default (reference) => {
    const {
        $combine = {},
        $selectedKeys = [],
        $selectedKey
    } = reference.state;
    const {$myView = {}} = reference.props;
    const {toolbar = {}} = $combine;
    return (
        <Row>
            <Col span={14}>
                {/* FIX: Warning: [antd: Button.Group] `Button.Group` is deprecated. Please use `Space.Compact` instead. Error Component Stack */}
                <Space.Compact>
                    {(() => {
                        const {yes = {}} = toolbar;
                        const {text, ...rest} = yes;
                        // disabled
                        rest.disabled = $selectedKey === $myView.name;
                        if (rest.disabled) {
                            rest.className = "";
                        } else {
                            rest.className = "uc_green";
                        }

                        return Op.isView(reference) ? (
                            <Button disabled
                                    {...rest}
                                    icon={Ux.v4Icon(rest.icon)}     // v4
                                    onClick={Op.rxYes(reference)}>
                                {text}
                            </Button>
                        ) : false;
                    })()}
                    {(() => {
                        const {plus = {}} = toolbar;
                        const {tooltip, ...rest} = plus;
                        return Op.isEdit(reference) ? (
                            <Tooltip title={tooltip}>
                                {/* Warning: A props object containing a "key" prop is being spread into JSX: */}
                                <Button key={rest.key} {...rest}
                                        icon={Ux.v4Icon(rest.icon)}     // v4
                                        onClick={Op.rxOpen(reference, {}, Ux.Env.FORM_MODE.ADD)}/>
                            </Tooltip>
                        ) : false
                    })()}
                </Space.Compact>
                &nbsp;&nbsp;&nbsp;&nbsp;
                {(() => {
                    const {batch = {}} = toolbar;
                    const {text, icon, confirm} = batch;
                    return Op.isEdit(reference) ? (
                        <Popconfirm title={confirm}
                                    onConfirm={Op.rxDeleteBatch(reference, batch)}
                                    disabled={0 === $selectedKeys.length}>
                            {/* @ts-ignore */}
                            <Link disabled={0 === $selectedKeys.length} to={""} onClick={event => Ux.prevent(event)}>
                                {Ux.v4Icon(icon)}
                                &nbsp;{text}
                            </Link>
                        </Popconfirm>
                    ) : false;
                })()}
            </Col>
            <Col span={10} className={"v-list-switch"}>
                {(() => {
                    const {switcher = {}} = $combine;
                    return (
                        <Switch checked={Op.isView(reference)}
                                onChange={Op.rxSwitch(reference)}
                                checkedChildren={switcher.view}
                                unCheckedChildren={switcher.edit}/>
                    )
                })()}
            </Col>
        </Row>
    );
}