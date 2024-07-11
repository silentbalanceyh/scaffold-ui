import React from 'react'
import {Tabs} from "antd";
import Ux from 'ux';
import Ex from 'ex';

import Jsx from './Web';
import Sk from 'skin';
import "./Cab.Norm.scss";

const UCA_NAME = "ExLoginComplex";

const componentInit = (reference) => {
    const state = {};
    state.$ready = true;

    const params = Ux.isMod("mSetting");
    const items = Ux.inHoc(reference, "way");
    const tab = {};
    tab.defaultActiveKey = "keySMS";
    tab.tabPosition = "bottom";
    tab.items = [];
    items.forEach(item => {
        if (item.hasOwnProperty('condition')) {
            const enabled = params[item.condition];
            if (enabled) {
                const itemData = Jsx.renderItem(item, reference);
                tab.items.push(itemData);
            }
        } else {
            const itemData = Jsx.renderItem(item, reference);
            tab.items.push(itemData);
        }
    });
    state.$tab = tab;
    Ux.of(reference).in(state).done();

    const user = Ux.isLogged();
    if (Ux.isNotEmpty(user)) {
        // 清除遗留数据
        Ux.Session.remove([
            Ux.Env.KEY_USER,
            Ux.Env.PAGE_MENU,
            Ux.Env.PAGE_APP,
        ])
    }
}

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$tab = {}} = this.state;
            const attrs = Sk.mixEx(UCA_NAME, {});
            return (
                <div {...attrs}>
                    <Tabs {...$tab} key={"keyLoginContainer"}/>
                </div>
            )
        }, Ex.parserOfColor(UCA_NAME).form())
    }
}

export default Component