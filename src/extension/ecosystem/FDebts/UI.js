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
            const {data = [], isView = false } = this.props;
            let {$table = {}} = this.state;
            $table = Ux.clone($table);
            let dataSource = Ux.clone(data);

            dataSource = dataSource.sort(Ux.sorterDescFn('updatedAt'));

            const attrs = Sk.mixF(UCA_NAME);
            if(isView){
                $table.columns = $table.columns
                    .filter(column => !["amountBalance", "finished", "finishedAmount"]
                        .includes(column.dataIndex));
            }
            Ux.configScroll($table, dataSource, this);
            return (
                <div {...attrs}>
                    <Table {...$table} dataSource={dataSource}/>
                </div>
            )
        }, Ex.parserOfColor(UCA_NAME).list());
    }
}

export default Component