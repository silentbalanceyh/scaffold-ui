import React from 'react'
import Ux from 'ux';
import Op from './Op';
import Ex from "ex";
import {ExForm} from "ei";
@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.ylCard(this, () => {
            const {$inited} = this.state;
            const form = Ex.yoForm(this, null, $inited);
            // form.config.form -> $options.form
            const { $options = {} } = form;
            if($options.form){
                let formConfig = Ux.clone($options.form);
                formConfig = Ux.toForm(formConfig, form.config.form);
                form.config.form = formConfig;
            }
            return (
                <div>
                    <ExForm {...form} $op={Op.actions}/>
                </div>
            )
        }, Ex.parserOfColor("My.Setting.Notify").page());
    }
}

export default Component;