import React from 'react'
import Ux from "ux";
import Ex from "ex";

const UCA_NAME = "ExLoginSms";

const componentInit = (reference) => {
    const state = {};
    state.$session = Ux.randomString(48);
    Ux.of(reference).in(state).ready().done();
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
    .form().raft(1).raft(Ex.Jsx.LoginSMS)
    .bind(Ex.Op)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () =>
                Ux.aiForm(this),
            Ex.parserOfColor(UCA_NAME).form({monitor: false}))
    }
}

export default Component;