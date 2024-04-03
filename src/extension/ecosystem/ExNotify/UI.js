import React from 'react';
import {Tooltip} from "antd";
import Ux from 'ux';

const UCA_NAME = "ExNotify";
const componentInit = (reference) => {
    console.log("Test")
    Ux.sockOn("/job/notify", () => {
    })
}

class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        componentInit(this);
    }

    render() {
        const {config = {}} = this.props;
        const { label, key, icon } = config;
        return (
            <Tooltip title={label} key={key}>
                {Ux.v4Icon(icon)}
            </Tooltip>
        );
    }
}

export default Component