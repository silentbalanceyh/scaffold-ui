import React from 'react';
import {Badge, Tooltip} from "antd";
import Ux from 'ux';
import Op from './Op';
import Rdr from './Web';

import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "ExNotify";
const componentInit = (reference) => {
    const {$websocket = {}} = reference.props;
    if (Ux.isNotEmpty($websocket)) {
        Ux.sockOn($websocket, reference);
    }
    Ux.ajaxGet("/api/message/type/MESSAGE").then(response => {
        const state = {};
        state.$data = response;
        Ux.of(reference).in(state).done();
    }).catch(error => {
        /**
         * 此处的 catch 方法是必须的，error 的数据结构
         * {
         *     "data": {
         *         "code",
         *         "id",
         *         "message",
         *         "status",
         *         "statusText",
         *         _error
         *     }
         * }
         * 由于 notify 相关方法属于模板级别，有可能后端没有开启此功能，若没开启此功能，则此处 catch 会抛出 404 无法找到的问题
         * 此处还有一点就是提醒可以用来做登录控制
         * - 提醒本身就是全局的
         * - 登录可以判断 status 的值
         */
        const {data = {}} = error;
        console.warn("HTTP 状态码：", data.status);
        console.warn("异常信息：", data.message);
        console.warn("错误码：", data.code);
        if (404 === data.status) {
            console.info("提醒功能未开启！");
            return;
        }

        /**
         * 登录控制专用方法，一旦出现 404 的被动请求错误，则直接跳出。
         */
        if (401 === data.status) {
            console.info("登录过期，请重新登录！");
            Ux.toUnauthorized(reference);
        }
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
        if (Ux.isEmpty($websocket)) {
            // 无内容
            return false;
        }
        const {label, key, icon} = config;
        // state -> $data
        const {$data = []} = this.state ? this.state : {};
        const messages = $data.filter(item => "SENT" === item.status);

        const attrTip = {};
        attrTip.title = label;
        attrTip.key = key;

        const attrMix = Sk.mixEx(UCA_NAME);
        const attrBadge = {};
        if (messages.length) {
            attrBadge.count = messages.length;
        }
        return (
            <div {...attrMix}>
                <Badge {...attrBadge}>
                    <Tooltip {...attrTip} key={attrTip.key}>
                        {Ux.v4Icon(icon, {onClick: Op.rxVisible(this)})}
                    </Tooltip>
                </Badge>
                {Rdr.renderDrawer(this)}
            </div>
        )
    }
}

export default Component