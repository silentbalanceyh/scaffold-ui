import React from 'react';
import Ux from "ux";
import Ex from "ex";
import ExForm from "../ExForm/UI";
import FDebts from '../FDebts/UI';
import FSettleTree from '../FSettleTree/UI';
import Op from './Op';

const UCA_NAME = "FDebtForm";

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const { $inited = {}} = this.props;
            const { $customer = {}} = this.state;
            const formValues = Op.yoValue($inited, $customer);
            const form = Ex.yoForm(this, null, formValues);
            const { rxClose } = this.props;
            return (
                <div>
                    <ExForm {...form}
                            // 关闭之后处理选择信息
                            rxClose={(data = {}, addOn = {}) => {
                                const ref = Ux.onReference(this, 1);
                                Ux.of(ref).in({$selected:[]}).handle(() => {
                                    // 调用外层函数
                                    if(Ux.isFunction(rxClose)){
                                        rxClose(data, addOn)
                                    }
                                })
                            }}
                            rxMountAfter={Op.rxMountAfter}
                            $op={Op.actions}
                            $renders={{
                                ...Ex.payFormDebt(this, formValues.amountActual),
                                debts: (reference, jsx) => {
                                    const { $inited = {}} = reference.state;
                                    return (
                                        <FDebts {...jsx} data={$inited ? $inited.debts: []}
                                                rxDebt={Op.rxDebts(this)}/>
                                    )
                                },
                                settlements: (reference, jsx) => {
                                    const { $inited = {}} = reference.state;
                                    const inherit = Ex.yoAmbient(this);
                                    return (
                                        <FSettleTree {...inherit} data={$inited.settlements}
                                                     dataItems={$inited.items}/>
                                    )
                                },
                                SettlementRecords:(reference , jsx)=>{
                                    const { $inited = {}} = reference.state;
                                    const inherit = Ex.yoAmbient(this);
                                    return (
                                        <FSettleTree {...inherit} data={$inited.transactions}/>
                                    )
                                }
                            }}/>
                </div>
            )
        }, Ex.parserOfColor(UCA_NAME).form())
    }
}

export default Component