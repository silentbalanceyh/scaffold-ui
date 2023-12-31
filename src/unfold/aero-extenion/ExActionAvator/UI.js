import React from 'react';
import Ux from 'ux';
import {Dropdown} from 'antd';

import __Zn from '../zero.aero.dependency';

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const {data, config, content} = this.props;
        const user = Ux.isLogged();
        if (Ux.isEmpty(user)) {
            // 未登录
            return false;
        }
        const dropAttrs = {};
        dropAttrs.menu = {
            items: data,
            onClick: __Zn.rxMenuWith(this, data),
        };
        dropAttrs.className = `ex-avator-${config.layout}-${config.size}`
        return (
            <Dropdown {...dropAttrs}>
                {content ? content : false}
            </Dropdown>
        )
    }
}

export default Component;