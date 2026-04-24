import React from 'react';

import Op from './Op';
import Ux from 'ux';

import Sk from 'skin';
import "./Cab.norm.scss";
import Jsx from './Web';

const UCA_NAME = "DocViewer"

class Component extends React.PureComponent {
    componentDidMount() {
        Op.componentInit(this);
    }

    render() {
        return Ux.xtReady(this, () => {
            const attrs = Sk.mixUca(UCA_NAME);
            return (
                <div {...attrs}>
                    {Jsx.renderEditor(this)}
                </div>
            );
        }, {name: UCA_NAME, logger: true})
    }
}

export default Component;