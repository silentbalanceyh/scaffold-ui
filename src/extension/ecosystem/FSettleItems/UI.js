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
            const { isEdit = true } = this.props;
            if(isEdit){
                const { $selectedKeys = [], rxCascade = () => false, data = [] } = this.props;
                const $selected = [];
                data.forEach(record => {
                    if(!record.finishedId && $selectedKeys.includes(record.key)){
                        $selected.push(record.key);
                    }
                })
                table.rowSelection = ({
                    selectedRowKeys: $selected,
                    onChange: rxCascade,
                    getCheckboxProps: (record = {}) => {
                        const props = {};
                        if(record.finishedId){
                            props.disabled = true;
                        }
                        return props;
                    }
                })
            }
        }

        const attrs = Sk.mixF(UCA_NAME);

        const { isReport = true } = this.props;
        if(isReport){
            table.footer = (data = []) => Op.reportFooter(this, data);
        }
        return (
            <div {...attrs}>
                <Table {...table} dataSource={dataSource}/>
            </div>
        )
    }
}

export default Component