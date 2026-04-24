import React from 'react';
import Ux from "ux";
import {Table} from "antd";
import Sk from 'skin';
import './Cab.norm.scss';
import Ex from "ex";

const UCA_NAME = "FSettles";

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        const table = Ux.fromHoc(this, "table");
        const columns = Ux.configColumn(this, table.columns);
        const {data = []} = this.props;
        const state = {};
        Ux.ajaxEager(this, columns, data).then($lazy => {
            state.$lazy = $lazy;
            Ux.of(this).in(state).ready().done();
        })
    }
    render() {
        return Ex.yoRender(this, () => {
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
                    <Table {...table} dataSource={dataSource}/>
                </div>
            )
        }, Ex.parserOfColor(UCA_NAME).list());
    }
}

export default Component