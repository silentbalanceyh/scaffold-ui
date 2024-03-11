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
            return (
                <div>
                    <ExForm {...form}
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
                                }
                            }}/>
                </div>
            )
        }, Ex.parserOfColor(UCA_NAME).page())
    }
}

export default Component