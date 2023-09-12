import React from 'react';
import Sk from 'skin';
import "./Cab.norm.scss";
import Op from './Op';
import Ux from 'ux';

const UCA_NAME = "DocViewer"

class Component extends React.PureComponent {
    componentDidMount() {
        Op.componentInit(this);
    }

    render() {
        return Ux.xtReady(this, () => {

            const attrs = Sk.mixUca(UCA_NAME)
            return (
                <div {...attrs}>
                    <h1>Doc Viewer</h1>
                </div>
            );
        }, {name: UCA_NAME, logger: true})
    }
}

export default Component;