import React from 'react';
import Ux from "ux";
import Ex from "ex";
import {Button, Modal} from 'antd';
import FSettleItems from '../FSettleItems/UI';
import ExTab from '../ExTab/UI';
import FDebtForm from '../FDebtForm/UI';
import FPaymentList from '../FPaymentList/UI';
import FPaymentForm from "../FPaymentForm/UI";

const UCA_NAME = "FDebtView";
const componentInit = (reference) => {
    Ex.yiAssist(reference).then(state => {
        const {$inited = {}} = reference.props;
        state.$inited = $inited;
        Ux.of(reference).in(state).ready().done();
        // reference.?etState(state);
        // state.$ready = true;
    })
}

const renderForm = (reference, $inited = {}) => {
    const window = Ux.fromHoc(reference, "window");
    const config = Ux.configDialog(reference, window);
    const {$visible = false} = reference.state;
    const inherit = Ex.inDebt(reference, $inited, true);
    return (
        <Modal {...config}
               className={"ux_dialog"}
            // v4
               open={$visible}>
            <FPaymentForm {...inherit}/>
        </Modal>
    )
}

const rxTab = (reference, initValues = {}) => {
    const {$activeKey} = reference.state;
    const tabs = Ux.fromHoc(reference, "tabs");
    tabs.onTabClick = ($activeKey) =>
        Ux.of(reference).in({$activeKey}).done();
    // reference.?etState({$activeKey});
    tabs.activeKey = $activeKey;
    tabs.fnExtra = () => {
        if ("keyPayment" === $activeKey) {
            const action = Ux.fromHoc(reference, "action");
            return (
                <Button icon={Ux.v4Icon("plus")} type={"primary"}
                        disabled={initValues.finished}
                        onClick={event => {
                            Ux.prevent(event);
                            Ux.of(reference).open().done();
                            // reference.?etState({$visible: true});
                        }}>
                    {action.text}
                </Button>
            );
        } else return false;
    }
    return tabs;
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    state = {
        $activeKey: "keyPayment"
    }

    componentDidMount() {
        componentInit(this)
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$inited = {}} = this.state;
            const {items = [], payment = [], ...initValues} = $inited;
            const inherit = Ex.yoAmbient(this);
            const tabs = rxTab(this, initValues);
            let sum = 0
            payment.forEach(item => {
                console.log(item)
                return sum += item.amount
            })
            initValues.amountAll = sum.toFixed(2)
            inherit.$amount = initValues.amount;
            return (
                <div>
                    <FDebtForm {...inherit} $inited={initValues}/>
                    <ExTab config={tabs}>
                        <FSettleItems {...inherit} data={items}/>
                        <FPaymentList {...inherit} data={payment}
                                      $assist={false}
                                      rxPayment={(keys = []) => {
                                          if (0 < keys.length) {
                                              const {$inited = {}} = this.state;
                                              let {payment = []} = $inited;
                                              payment = payment.filter(item => !keys.includes(item.key));
                                              const updated = Ux.clone($inited);
                                              updated.finished = false;
                                              updated.payment = payment;
                                              Ux.of(this).in({$inited}).done();
                                              // this.?etState({$inited: updated});
                                          }
                                      }}/>
                    </ExTab>
                    {renderForm(this, $inited)}
                </div>
            );
        }, Ex.parserOfColor(UCA_NAME).view())
    }
}

export default Component