import React from "react";
import Ux from "ux";
import Ex from "ex";
import ExForm from '../ExForm/UI';

import FSettleTree from '../FSettleTree/UI';
import FDebts from '../FDebts/UI';
import FTransItem from '../FTransItem/UI';

import Op from './Op';
import Sk from 'skin';
import './Cab.norm.scss';

const UCA_NAME = "FTransView";
const componentInit = (reference) => {
    Ux.of(reference).ready().done();
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

    render(){
        return Ex.yoRender(this, () => {
            const { $inited = {}} = this.props;
            const form = Ex.yoForm(this, null, $inited);

            const inherit = Ex.yoAmbient(this);
            const attrs = Sk.mixF(UCA_NAME);
            return (
                <div {...attrs}>
                    <ExForm {...form} $height={"300px"}
                            $op={Op.actions}
                            $renders={{
                                payment: (reference, jsx) => {
                                    const { payment = []} = $inited;
                                    return (
                                        <FTransItem {...inherit} data={payment}/>
                                    )
                                }
                            }}/>
                    {(() => {
                        if("SETTLEMENT" === $inited.type){
                            // 结算单
                            const { settlements = [], items = []} = $inited;
                            return (
                                <FSettleTree {...inherit} data={settlements} dataItems={items}/>
                            )
                        }else{
                            // 应收退款单
                            const { debts = []} = $inited;
                            return (
                                <FDebts {...inherit} data={debts} isView/>
                            )
                        }
                    })()}
                </div>
            )
        },Ex.parserOfColor(UCA_NAME).view())
    }
}

export default Component