import React from 'react';
import Ux from "ux";
import Ex from "ex";
import ExForm from '../ExForm/UI';

import FSettleItems from '../FSettleItems/UI';
import FSettles from '../FSettles/UI';

import Op from './Op';

import Sk from 'skin';
import './Cab.norm.scss';

const UCA_NAME = "FSettleForm";
const componentInit = (reference) => {
    const state = {};
    const { $inited = {} } = reference.props;
    const { settlements = [], items = [] } = $inited;
    const $selected = {};
    $selected.settlements = settlements;
    $selected.items = items;
    state.$selected = $selected;
    Ux.of(reference).in(state).ready().done();
    // reference.?etState(state);
    // state.$ready = true;
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
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
            const {items = [], settlements = [], ...initValues} = $inited;
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
                            $form={$form} $op={Op.actions}
                            $renders={{
                                settlements: (reference, jsx) => {
                                    /*
                                     * 此处会有生命周期问题，不可以直接在这里提取 this.state 中的数据
                                     * 如果直接提取会导致状态不同步的情况，引起选中项无法同步状态的问题
                                     */
                                    const ref = Ux.onReference(reference, 1);
                                    const { $selected = {} } = ref.state;
                                    return (<FSettles {...inherit} data={settlements}
                                                      $selectedKeys={$selected.settlements.map(i => i.key)}
                                                      rxCascade={Op.rxSettlement(ref)}/>
                                    )
                                },
                                items: (reference, jsx) => {
                                    const ref = Ux.onReference(reference, 1);
                                    const { $selected = {} } = ref.state;
                                    return (<FSettleItems {...inherit} data={items}
                                                          $selectedKeys={$selected.items.map(i => i.key)}
                                                          rxCascade={Op.rxSettleItem(ref)}/>
                                    )
                                }
                            }}/>
                </div>
            );
        }, Ex.parserOfColor(UCA_NAME).view())
    }
}

export default Component