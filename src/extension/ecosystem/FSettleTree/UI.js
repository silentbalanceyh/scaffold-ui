import React from 'react';
import Ux from "ux";
import {Table} from "antd";
import Sk from 'skin';
import './Cab.norm.scss';
import FSettleItems from '../FSettleItems/UI';

import Ex from "ex";

const UCA_NAME = "FSettleTree";

const yoExpand = ($table = {}, reference) => {
    const expandKeys = reference.state?.$expandKey ? reference.state.$expandKey : [];
    $table.onExpand = (expand, record) => {
        Ux.of(reference).loading().handle(() => {
            let {$expandKey = []} = reference.state;
            $expandKey = Ux.clone($expandKey);
            if(expand){
                if(!$expandKey.includes(record.key)){
                    $expandKey.push(record.key);
                }
            }else{
                if($expandKey.includes(record.key)){
                    $expandKey = $expandKey.filter(item => item !== record.key);
                }
            }
            Ux.of(reference).in({$expandKey: Ux.clone($expandKey)})
                .load().done();
        })
    }
    $table.expandedRowKeys = expandKeys;
}

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        const table = Ux.fromHoc(this, "table");
        const columns = Ux.configColumn(this, table.columns);
        const {data = [], dataItems = []} = this.props;
        const state = {};
        Ux.ajaxEager(this, columns, data).then($lazy => {
            state.$lazy = $lazy;
            const $data = Ux.clone(data);
            $data.forEach(item => {
                item.items = Ux.clone(dataItems.filter(each => each.settlementId === item.key));
            })
            state.$data = $data;
            Ux.of(this).in(state).ready().done();
        })
    }
    render() {
        return Ex.yoRender(this, () => {
            const {$data = []} = this.state;
            const table = Ux.fromHoc(this, "table");
            const $table = Ux.clone(table);
            $table.columns = Ux.configColumn(this, table.columns);
            let dataSource = Ux.clone($data);
            Ux.configScroll($table, dataSource, this);

            dataSource = dataSource.sort(Ux.sorterDescFn('updatedAt'));

            const attrs = Sk.mixF(UCA_NAME);

            yoExpand($table, this);
            return (
                <div {...attrs}>
                    <Table {...$table} dataSource={dataSource}
                           expandable={{
                               expandedRowRender:record => {
                                   const inherit = Ex.yoAmbient(this);
                                   return (<FSettleItems {...inherit} data={record.items}
                                                         isEdit={false}     // 是否查看模式
                                                         isReport={false}   // 是否统计
                                   />)
                               }
                           }}/>
                </div>
            )
        }, Ex.parserOfColor(UCA_NAME).list());
    }
}

export default Component