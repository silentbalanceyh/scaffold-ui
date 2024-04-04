import React from 'react';
import {Tooltip} from "antd";
import Ux from 'ux';

const UCA_NAME = "ExNotify";
const componentInit = (reference) => {
    const { $websocket = {}} = reference.props;
    if(Ux.isNotEmpty($websocket)){
        Ux.sockOn($websocket, reference);
    }
}

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
        return (
            <Tooltip title={label} key={key}>
                {Ux.v4Icon(icon)}
            </Tooltip>
        );
    }
}

export default Component