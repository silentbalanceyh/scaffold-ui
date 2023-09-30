import React from 'react';
import Ux from 'ux';
import Ex from 'ex';

import './Cab.norm.scss';
import Sk from 'skin';
import {Row, Col} from 'antd';
import {PlusOutlined, RedoOutlined} from "@ant-design/icons";

import Op from './Op';
import Jsx from './Web';

const UCA_NAME = "ExTag";
@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent{
    componentDidMount(){
        Op.yiTag(this);
    }
    render(){
        return Ex.yoRender(this, () => {
            const attrs = Sk.mixEx(UCA_NAME);
            const configHoc = Ux.inHoc(this, "config");
            const {
                $edition = true,
                config = {}
            } = this.props;
            const { pLeft = 3, pManual = false } = config;
            const pRight = 24 - pLeft;
            return (
                <Row {...attrs}>
                    <Col span={pLeft} className={"tag-prefix"}>
                        {configHoc?.prefix}
                    </Col>
                    <Col span={pRight}>
                        {pManual ? (
                            <span className={"tag-op"}>
                                <RedoOutlined onClick={Op.event.rxRefresh(this)}/>
                            </span>
                        ): false}
                        {Jsx.renderTags(this)}
                        {$edition ? (
                            <span className={"tag-op"}>
                                <PlusOutlined onClick={Op.event.rxOpen(this)}/>
                                {Jsx.renderWin(this)}
                            </span>
                        ):false}
                    </Col>
                </Row>
            )
        }, Ex.parserOfColor("ExTag").control());
    }
}
export default Component;