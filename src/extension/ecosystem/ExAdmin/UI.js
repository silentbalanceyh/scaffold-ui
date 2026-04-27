import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import ExDevTool from '../ExDevTool/UI';
import Sk from 'skin';
import "./Cab.norm.scss";
import {PageContainer, ProConfigProvider, ProLayout, SettingDrawer, WaterMark} from '@ant-design/pro-components';
// Fix
import ExNotify from '../ExNotify/UI';

const UCA_NAME = "ExAdmin";
/**
 * ## 「组件」`ExAdmin`
 *
 * ```js
 * import { ExAdmin } from 'ei';
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
 * |   Sider   |  Header                     Notify |
 * |  Menu     |------------------------------------|
 * |  Menu     |                                    |
 * |  Menu     |                                    |
 * |  Menu     |                                    |
 * |  Menu     |                                    |
 * |  Menu     |                                    |
 * |------------------------------------------------|
 * ```
 *
 * @memberOf module:uca/extension
 * @method ExAdmin
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    Ex.yiProSetting(reference, {
        plugins: {
            ExNotify
        }
    }).then(Ux.ready).then(Ux.pipe(reference));
};
const SWITCH_EVENT = "zero:route-switching";

@Ux.zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    state = {
        $collapsed: true, // 默认将菜单收起来
        $switching: false,
    };
    __switchingTimer = null;

    __switching = (event = {}) => {
        if (this.__switchingTimer) {
            clearTimeout(this.__switchingTimer);
        }
        const detail = event.detail ? event.detail : {};
        detail.handled = true;
        const ready = Ux.isFunction(detail.ready) ? detail.ready : () => false;
        const onReady = () => window.requestAnimationFrame(() => window.requestAnimationFrame(ready));
        if (!this.state.$switching) {
            this.setState({$switching: true}, onReady);
        } else {
            onReady();
        }
    };

    __switchingDone = () => {
        if (this.__switchingTimer) {
            clearTimeout(this.__switchingTimer);
        }
        this.__switchingTimer = setTimeout(() => {
            this.setState({$switching: false});
            this.__switchingTimer = null;
        }, 420);
    };

    componentDidMount() {
        componentInit(this);
        window.addEventListener(SWITCH_EVENT, this.__switching);
        Ux.DevTool(this).on();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (Ux.isRoute(this.props, prevProps)) {
            Ex.yoProActive(this, {state: prevState})
            this.__switchingDone();
            Ux.DevTool(this).clean();
        }
    }

    componentWillUnmount() {
        window.removeEventListener(SWITCH_EVENT, this.__switching);
        if (this.__switchingTimer) {
            clearTimeout(this.__switchingTimer);
            this.__switchingTimer = null;
        }
        Ux.DevTool(this).off();
    }

    componentDidCatch(error, errorInfo) {
        console.error("ExAdmin", error);
    }

    render() {
        const attrMix = Sk.mixEx(UCA_NAME);
        return Ex.yoRender(this, () => {
            const attrLayout = Ex.yoProLayout(this);

            const attrDrawer = Ex.yoProSettingDrawer(this, 'up-layout');
            const attrChildren = Ex.yoProChildren(this);
            const attrWater = Ex.yoProWater();
            const attrPage = Ex.yoProPageHeader(this);

            const {children} = this.props;
            const {$switching = false} = this.state;
            return (
                <div id="up-layout" {...attrMix}>
                    <ProConfigProvider hashed={false}>
                        <ProLayout {...attrLayout}>
                            {children ? (
                                <PageContainer {...attrPage}>
                                    <div className={"uex_ExAdmin_content"}>
                                        <WaterMark {...attrWater}>
                                            {React.cloneElement(children, attrChildren)}
                                        </WaterMark>
                                        {$switching ? (
                                            <div className={"uex_ExAdmin_switching"}/>
                                        ) : false}
                                    </div>
                                </PageContainer>
                            ) : false}
                            {attrDrawer ? (<SettingDrawer {...attrDrawer}/>) : false}
                        </ProLayout>
                        {/* 开发工具专用，DEV_MONITOR 开启时使用 */}
                        {Ux.DevTool(this).render(ExDevTool)}
                    </ProConfigProvider>
                </div>
            )
        }, Ex.parserOfColor(UCA_NAME).tpl())
    }
}

export default Component;
