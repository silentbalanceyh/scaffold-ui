import React from 'react';
import {Row, Col} from 'antd';

import Op from './Op';
import Ux from 'ux';

import Sk from 'skin';
import "./Cab.norm.scss";
import Jsx from './Web';

const UCA_NAME = "DocViewer"

class Component extends React.PureComponent {
    componentDidMount() {
        Op.componentInit(this);
    }

    render() {
        return Ux.xtReady(this, () => {

            const attrs = Sk.mixUca(UCA_NAME);
            return (
                <div {...attrs}>
                    <Row>
                        <Col span={15}>
                            {Jsx.renderEditor(this)}
                        </Col>
                        <Col span={9}>

                        </Col>
                    </Row>
                </div>
            );
        }, {name: UCA_NAME, logger: true})
    }
}

export default Component;