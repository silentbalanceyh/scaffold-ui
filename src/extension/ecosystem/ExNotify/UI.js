import React from 'react';
import {Tooltip, Badge} from "antd";
import Ux from 'ux';
import Op from './Op';
import Rdr from './Web';

import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "ExNotify";
const componentInit = (reference) => {
    const { $websocket = {}} = reference.props;
    if(Ux.isNotEmpty($websocket)){
        Ux.sockOn($websocket, reference);
    }
    Ux.ajaxGet("/api/message/type/MESSAGE").then(response => {
        const state = {};
        state.$data = response;
        Ux.of(reference).in(state).done();
    })
}

@Ux.zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        componentInit(this);
    }

    render() {
        const {config = {}, $websocket = {}} = this.props;
        if(Ux.isEmpty($websocket)){
            // 无内容
            return false;
        }
        const { label, key, icon } = config;
        // state -> $data
        const { $data = []} = this.state ? this.state: {};
        const messages = $data.filter(item => "SENT" === item.status);

        const attrTip = {};
        attrTip.title = label;
        attrTip.key = key;

        const attrMix = Sk.mixEx(UCA_NAME);
        const attrBadge = {};
        if(messages.length){
            attrBadge.count = messages.length;
        }
        return (
            <div {...attrMix}>
                <Badge {...attrBadge}>
                    <Tooltip {...attrTip}>
                        {Ux.v4Icon(icon, { onClick: Op.rxVisible(this)})}
                    </Tooltip>
                </Badge>
                {Rdr.renderDrawer(this)}
            </div>
        )
    }
}

export default Component