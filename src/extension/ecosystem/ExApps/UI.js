import React from 'react';

import Ex from 'ex';
import Ux from "ux";

import {List} from 'antd';

const UCA_NAME = "ExApps";
/**
 * ## 「组件」`ExApps`
 *
 * ```js
 * import { ExApps } from 'ei';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * #### 1.1. 布局
 *
 * ```shell
 * |------------------------------------------------|
 * |                                                |
 * |------------------------------------------------|
 * |  |------|  |------|  |------|                  |
 * |  |      |  |      |  |      |  ......          |
 * |  |------|  |------|  |------|                  |
 * |------------------------------------------------|
 * ```
 *
 * ### 2. 核心
 *
 * #### 2.1.菜单执行
 *
 * 菜单只提取`APP-MENU`类型，`X_MENU`数据对接，并转换成react-router常用链接。
 *
 * @memberOf module:uca/extension
 * @method ExApps
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const state = {};
    Ux.ajaxGet("/api/apps/usable").then(app => {
        // 构造应用列表
        state.$data = Ex.buildApps(app, reference);
        Ux.of(reference).in(state).ready().done();
    })
};

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.ylCard(this, () => {
            const {$data = []} = this.state;
            return (
                <div>
                    <List dataSource={$data} itemRender={item => {
                        console.log(item);
                        return (
                            <div>
                            </div>
                        )
                    }}/>
                </div>
            );
        }, Ex.parserOfColor(UCA_NAME).component());
    }
}

export default Component;