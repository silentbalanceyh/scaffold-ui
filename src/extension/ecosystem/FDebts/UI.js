import React from 'react';
import Ux from "ux";
import {Table} from "antd";
import Sk from 'skin';
import './Cab.norm.scss';
import Ex from "ex";
import Op from './Op';

const UCA_NAME = "FDebts";

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount(){
        Op.yiControl(this);
    }
    render(){
        return Ex.yoRender(this, () => {
            const {data = []} = this.props;
            const {$table = {}} = this.state;
            let dataSource = Ux.clone(data);
            Ux.configScroll($table, dataSource, this);

            dataSource = dataSource.sort(Ux.sorterDescFn('updatedAt'));

            const attrs = Sk.mixF(UCA_NAME);
            return (
                <div {...attrs}>
                    <Table {...$table} dataSource={dataSource}/>
                </div>
            )
        }, Ex.parserOfColor(UCA_NAME).list());
    }
}

export default Component