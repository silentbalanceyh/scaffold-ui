import React from 'react';
import {Table} from 'antd';

import {uca} from 'zi';
import __Zn from "../zero.uca.dependency.table.UNLOCK";

import Sk from 'skin';
import './Cab.norm.scss';

import renderColumn from './Web'
// =====================================================
// componentInit/componentUp
// =====================================================
const UCA_NAME = "TableEditor";
const yiTable = (reference, table = {}) => {
    const $table = __Zn.clone(table);
    $table.columns = [renderColumn(reference)].concat(__Zn.configColumn(reference, $table.columns));
    $table.className = $table.className ? `ux_table_editor ${table.className}` : "ux_table_editor";
    $table.pagination = false;
    return $table;
}
const componentInit = (reference) => {
    const state = {};
    /* 表格配置连接专用处理 */
    const {config = {}} = reference.props;
    const {table = {}} = config;
    state.$table = yiTable(reference, table);
    // state.$ready = true;
    /* 数据信息 */
    const {data = []} = reference.state;
    const $data = __Zn.clone(data);
    if (0 === data.length) {
        /* 新数据记录 */
        $data.push({key: __Zn.randomUUID()});
        state.data = $data;
    }
    __Zn.of(reference).in(state).ready().done();
    // reference.?etState(state);
    // state.$ready = true;
    // reference.?etState(state);
}

@uca({
    "i18n.cab": require("./Cab.json"),
    "i18n.name": "UI"
})
class Component extends React.PureComponent {
    displayName = UCA_NAME;

    constructor(props) {
        super(props);
        this.state = __Zn.xtInitFormat(props);
    }

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return __Zn.xtReady(this, () => {
            const {$table = {}, data = []} = this.state;
            const {value = []} = this.props;

            const attrs = Sk.mixUca(UCA_NAME);

            const dataSource = 0 === value.length ? data: value;
            return (
                <div {...attrs}>
                    <Table {...$table} dataSource={dataSource}/>
                </div>
            );
        }, {name: UCA_NAME, logger: true})
    }
}

export default Component