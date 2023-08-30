import React from 'react';

import {Col, Row} from 'antd';
import Sk from 'skin';
import "./Cab.norm.scss";
import Op from './Op';

const UCA_NAME = "ExBpmn";

class Component extends React.PureComponent {

    displayName = UCA_NAME;

    constructor(props) {
        super(props);
        /*
         * 若开启加载模式要处理，则设置状态中的 $loading 值
         * this.containerRef 最终会注入到 <div/> 中，render 过程中会将 DOM 节点的注入
         * 设置和 this.containerRef 绑定形成 ref
         *
         * 其实此处还会有一个 this.viewer 的变量，这个变量是 BpmnJs 的实例，但
         * 构造时不用处理，在生命周期中处理即可。
         */
        this.state = {$loading: true}
        this.containerRef = React.createRef();
    }

    componentDidMount() {
        Op.componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.componentUp(this, {props: prevProps, state: prevState});
    }

    render() {
        /* 构造画布的偏移量处理 */
        const {$canvas = {}} = this.props;
        const {height = 200, offset = 6} = $canvas;
        const style = {height};
        style.paddingLeft = `${offset}%`;
        const attrBpmn = Sk.mixEx("ExBpmn");
        return (
            <div {...attrBpmn}>
                <Row>
                    <Col span={24}>
                        {/*
                        此处使用 this.containerRef 的目的是为了保证可以拿到对应的 DOM 节点
                        */}
                        <div ref={this.containerRef}
                             className={"ux_container"}
                             style={style}
                             id={"bpmnContainer"}>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Component