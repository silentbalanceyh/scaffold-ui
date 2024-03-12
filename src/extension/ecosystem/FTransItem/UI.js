import React from 'react';
import Ux from 'ux';
import {Table} from "antd";

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)

class Component extends React.PureComponent{
    render(){
        const table = Ux.inHoc(this, "table");
        const $table = Ux.clone(table);
        $table.columns = Ux.configColumn(this, $table.columns);
        const { data = []} = this.props;
        return (
            <Table {...$table} dataSource={data}/>
        )
    }
}

export default Component;