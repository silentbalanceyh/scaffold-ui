import React from 'react';
import Ux from "ux";
import Ex from "ex";
import ExForm from "../ExForm/UI";

const UCA_NAME = "FDebtForm";

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;

    render() {
        const {$inited = {}} = this.props;
        const form = Ex.yoForm(this, null, $inited);
        return (
            false
        )
    }
}

export default Component