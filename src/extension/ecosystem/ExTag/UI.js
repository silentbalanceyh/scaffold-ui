import React from 'react';
import Ux from 'ux';

import './Cab.norm.scss';
import Sk from 'skin';
import {Row, Col} from 'antd';
import {PlusOutlined} from "@ant-design/icons";

import Op from './Op';
import Jsx from './Web';

const UCA_NAME = "ExTag";
@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent{
    render(){
        const attrs = Sk.mixEx(UCA_NAME);
        const config = Ux.inHoc(this, "config");
        return (
            <Row {...attrs}>
                <Col span={3} className={"prefix"}>
                    {config?.prefix}
                </Col>
                <Col span={21}>
                    <span className={"op"}>
                        <PlusOutlined onClick={Op.event.rxOpen(this)}/>
                        {Jsx.renderWin(this)}
                    </span>
                </Col>
            </Row>
        )
    }
}
export default Component;