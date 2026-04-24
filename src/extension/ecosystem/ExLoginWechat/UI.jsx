import React from 'react'
import {QRCode} from "antd";
import './Cab.Norm.scss';
import Sk from 'skin';

const UCA_NAME = "ExLoginWechat";

class Component extends React.PureComponent {
    displayName = UCA_NAME;

    render() {
        return (
            <div {...Sk.mixEx(UCA_NAME, {})}>
                <QRCode value={"test"} size={280}/>
            </div>
        )
    }
}

export default Component