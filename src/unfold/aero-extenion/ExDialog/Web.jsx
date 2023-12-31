import React from 'react';
import ExButton from '../ExButton/UI';

import Ux from "ux";
import {Button, Col, Drawer, Modal, Popover, Row} from "antd";
import Sk from 'skin';
import "./Cab.norm.scss";

import __StopOp from './Op.Stop';

const jsxTitle = (reference, config = {}) => (
    <Row>
        <Col span={23}>
            <h3>{config.title}</h3>
        </Col>
        <Col span={1}>
            <h3>
                <Button shape={"circle"} icon={Ux.v4Icon("close")}
                        size={"small"}
                        className={"uc_red"}
                        onClick={event => {
                            Ux.prevent(event);
                            Ux.of(reference).hide().done();
                            const {rxPop} = reference.props;
                            if (Ux.isFunction(rxPop)) {
                                rxPop(false);
                            }
                            // Ex.r?Visible(reference, false)();
                        }}/>
            </h3>
        </Col>
    </Row>
);

const renderPopover = (reference, jsxChildren, config = {}) => {
    config = Ux.clone(config);
    /*
     * overlayStyle 计算，主要针对 width
     */
    config.overlayStyle = {width: config.width};
    const attrCss = Sk.mixEx("ExDialog_Popover");
    config.overlayClassName = attrCss.className;
    // const jsx = Ux.isFunction(jsxChildren) ? jsxChildren() : false;
    config.content = Ux.isFunction(jsxChildren) ? jsxChildren() : false;
    /*
     * 关闭按钮属性专用
     */
    config.title = jsxTitle(reference, config);
    return (
        <Popover {...config}/>
    );
}

const renderDrawer = (reference, jsxChildren, config = {}) => {
    const $config = Ux.clone(config);
    $config.destroyOnClose = true;
    $config.closable = true;
    $config.maskClosable = false;
    if (Ux.isFunction(config.onCancel)) {
        delete $config.onCancel;
        $config.onClose = config.onCancel;
    }

    const attrCss = Sk.mixEx("ExDialog_Drawer");
    Object.assign($config, attrCss);
    return (
        <Drawer {...$config}>
            {Ux.isFunction(jsxChildren) ? jsxChildren() : false}
        </Drawer>
    );
}

const renderWindow = (reference, jsxChildren, config = {}) => {
    // const {$submitting = false} = reference.state;
    const $submitting = Ux.of(reference).is.submitting();
    config = Ux.clone(config);
    /*
     * 强制 Mask
     */
    config.maskClosable = false;
    config.destroyOnClose = true;        // 必须
    config.confirmLoading = $submitting; // 提交时的房重复提交
    config.cancelButtonProps = {
        loading: $submitting,
    };
    const attrCss = Sk.mixEx("ExDialog_Modal");
    Object.assign(config, attrCss)
    return (
        <Modal {...config}>
            {Ux.isFunction(jsxChildren) ? jsxChildren() : false}
        </Modal>
    );
}

const _jsxChildren = (reference, component = {}, attributes = {}) => {
    const {config = {}, Component} = component;
    if (Component) {
        const inherit = Ux.clone(attributes);
        // Ex.r?Visible(reference, false);
        inherit.rxClose = __StopOp.rxClose(reference);
        inherit.rxSubmitting = __StopOp.rxSubmitting(reference);

        const {$visible = false} = reference.state;
        inherit.$opened = $visible;
        return (
            <Component {...Ux.sorterObject(inherit)} config={config}/>
        );
    } else {
        console.error("未捕捉到组件！", component);
        return false;
    }
};
const RENDERS = {
    "WINDOW": renderWindow,
    "DRAWER": renderDrawer,
    "POPOVER": renderPopover
}
const _jsxDialog = (reference, dialog = {}, attributes = {}) => {
    const {config = {}, component = {}} = dialog;
    const {type = "WINDOW", ...rest} = config;
    const fnRender = RENDERS[type];
    if (Ux.isFunction(fnRender)) {
        return fnRender(reference, () =>
            _jsxChildren(reference, component, attributes), rest);
    } else {
        console.error("无法解析类型 type = ", type);
    }
};
// eslint-disable-next-line import/no-anonymous-default-export
export default (reference, {
    button = {},
    dialog = {},
    attributes = {},
}) => {
    const {$visible} = reference.state;
    return (
        <span>
            {$visible ? _jsxDialog(reference, dialog, attributes) : false}
            <ExButton {...attributes} config={button}/>
        </span>
    );
}