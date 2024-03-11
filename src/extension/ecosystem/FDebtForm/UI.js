import React from 'react';
import Ux from "ux";
import Ex from "ex";
import ExForm from "../ExForm/UI";
import FDebts from '../FDebts/UI';
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
            return (<ExForm {...form}
                            rxMountAfter={Op.rxMountAfter}
                            $renders={{
                                debts: (reference, jsx) => {
                                    const { $inited = {}} = reference.state;
                                    return (
                                        <FDebts {...jsx} data={$inited ? $inited.debts: []}
                                                rxDebt={Op.rxDebts(this)}/>
                                    )
                                }
                            }}/>)
        }, Ex.parserOfColor(UCA_NAME).page())
    }
}

export default Component