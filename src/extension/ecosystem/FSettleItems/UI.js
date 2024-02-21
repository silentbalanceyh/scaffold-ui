import React from 'react';
import Ux from "ux";
import {Table} from "antd";
import Sk from 'skin';
import './Cab.norm.scss';
import Op from './Op';

const UCA_NAME = "FSettleItems";

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;

    render() {
        const {data = []} = this.props;
        const table = Ux.fromHoc(this, "table");
        table.columns = Ux.configColumn(this, table.columns);
        let dataSource = Ux.clone(data);
        Ux.configScroll(table, dataSource, this);

        dataSource = dataSource.sort(Ux.sorterDescFn('updatedAt'));

        {
            const { $selectedKeys = [], rxCascade = () => false } = this.props;
            table.rowSelection = ({
                selectedRowKeys: $selectedKeys,
                onChange: rxCascade
            })
        }

        const attrs = Sk.mixF(UCA_NAME);
        return (
            <div {...attrs}>
                <Table {...table} dataSource={dataSource}
                       footer={(data = []) => Op.reportFooter(this, data)}/>
            </div>
        )
    }
}

export default Component