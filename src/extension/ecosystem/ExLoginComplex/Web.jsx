import React from 'react'
import ACCOUNT from './image/ACCOUNT.png';
import WECHAT from './image/WECHAT.png';
import SMS from './image/SMS.png';

import FormBuiltIn from '../ExLoginBuiltIn/UI';
import FormWeChat from '../ExLoginWechat/UI';
import FormSms from '../ExLoginSms/UI';
import Ex from 'ex';
import {Card, Tooltip} from "antd";

const ICON_DATA = {
    ACCOUNT,
    WECHAT,
    SMS,
}

const FORM_DATA = {
    keyAccount: FormBuiltIn,
    keyWechat: FormWeChat,
    keySMS: FormSms,
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    renderItem: (item, reference) => {
        const itemData = {};
        itemData.key = item.key;
        itemData.label = (
            <span className={"auth_method"}>
                <Tooltip title={item.text}>
                    <img src={ICON_DATA[item.icon]} alt={""}/>
                </Tooltip>
            </span>
        );
        const Component = FORM_DATA[item.key];
        itemData.children = (
            <Card title={
                <div className={"auth_selected"}>
                    <img src={ICON_DATA[item.icon]} alt={""}/>
                    {item.text}
                </div>
            } bordered={false}>
                <Component {...Ex.yoAmbient(reference)}/>
            </Card>
        );
        return itemData;
    }
}