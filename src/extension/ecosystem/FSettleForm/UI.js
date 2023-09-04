import React from 'react';
import Ux from "ux";
import Ex from "ex";
import ExForm from '../ExForm/UI';
import ExTab from '../ExTab/UI';
import FSettleItems from '../FSettleItems/UI';
import Op from './Op';

import Sk from 'skin';
import './Cab.norm.scss';

const UCA_NAME = "FSettleForm";
const componentInit = (reference) => {
    const state = {};
    Ux.of(reference).in(state).ready().done();
    // reference.?etState(state);
    // state.$ready = true;
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        componentInit(this)
    }

    render() {
        return Ex.yoRender(this, () => {
            // 初始化数据
            const $inited = Op.yoValue(this);
            const {items = [], ...initValues} = $inited;
            const form = Ex.yoForm(this, null, initValues);
            const $form = {};
            const inherit = Ex.yoAmbient(this);

            // 配置处理（标题替换）
            let tabs = Ux.fromHoc(this, "tabs");
            const page = Ux.fromHoc(this, "page");
            tabs = Ux.clone(tabs);
            tabs = Ux.configTab(this, tabs)
            tabs.items.filter(item => "keyRelated" === item.key)
                .forEach(item => item.tab = page[initValues.linked]);

            const attrs = Sk.mixF(UCA_NAME);
            return (
                <div {...attrs}>
                    <ExForm {...form} $height={"300px"}
                            $form={$form} $op={Op.actions}/>
                    <ExTab config={tabs}>
                        <FSettleItems {...inherit} data={items}/>
                    </ExTab>
                </div>
            );
        }, Ex.parserOfColor(UCA_NAME).view())
    }
}

export default Component