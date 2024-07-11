import React from 'react';

import {Col, Input, Row} from 'antd';
import __Zn from '../zero.uca.dependency';
import Rdr from './Web';
import './Cab.norm.scss';
import Sk from 'skin';

const UCA_NAME = "InputCaptcha";

const componentGet = (reference) => {
    const {config = {}} = reference.props;
    const {type = "image"} = config;
    if (!["image", "sms"].includes(type)) {
        console.warn("其他模式还不支持, type 必须是（ image / sms ）之一", type);
        return;
    }
    return Rdr[type];
}
const componentInit = (reference) => {
    const component = componentGet(reference);
    const {config = {}} = reference.props;
    if (!component) {
        console.warn("类型不支持：", config.type);
        return;
    }
    component.initialize(reference, config);
}

const componentUp = (reference, virtual = {}) => {
    const component = componentGet(reference);
    const {config = {}} = reference.props;
    if (!component) {
        console.warn("类型不支持：", config.type);
        return;
    }
    component.refresh(reference, virtual);
}

class Component extends React.PureComponent {
    displayName = UCA_NAME;

    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this, {props: prevProps});
    }

    render() {
        return __Zn.xtReady(this, () => {
            const {config = {}, ...rest} = this.props;
            const inputAttrs = __Zn.yoLimit(rest, [
                "$session",
                "$message"
            ]);
            const WebField = __Zn.V4InputGroup;
            return (
                <WebField {...Sk.mixUca(UCA_NAME)}>
                    <Row>
                        <Col span={12}>
                            <Input {...inputAttrs}/>
                        </Col>
                        <Col span={12}>
                            {(() => {
                                const {type = "image"} = config;
                                const image = Rdr[type];
                                return image.render(this);
                            })()}
                        </Col>
                    </Row>
                </WebField>
            )
        }, {name: UCA_NAME, logger: true})
    }
}

export default Component