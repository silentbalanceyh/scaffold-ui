import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import Jsx from './Web';

import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "ExAuthority";
const componentInit = (reference) => {
    // GET /api/authority/region/:type
    reference.setState({$ready: true});
}

// @ts-ignore
@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;

    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps) {
        const {$inited: prevInited} = prevProps;
        const {$inited: currentInited} = this.props;
        // 当 $inited 发生变化时，返回主界面
        if (prevInited !== currentInited) {
            this.setState({$activeMenu: null});
        }
    }

    render() {
        return Ex.yoRender(this, () => {
            const attrPage = Sk.mixEx(UCA_NAME);
            return (
                <div {...attrPage}>
                    {Jsx.renderHeader(this)}
                    {/** Dynamic Regions: $regions **/}
                    {Jsx.renderPage(this)}
                </div>
            )
        }, Ex.parserOfColor(UCA_NAME).component());
    }
}

export default Component