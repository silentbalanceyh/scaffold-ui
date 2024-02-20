import React from 'react';
import Ux from "ux";
import {Col, Row, Table} from "antd";
import Sk from 'skin';
import './Cab.norm.scss';

const UCA_NAME = "FSettleItems";

const renderFooter = (reference) => (data = []) => {
    const params = {};
    params.count = data.length;

    let amount = 0;
    data.forEach(item => {
        if(item.income){
            amount += item.amount;
        }else{
            amount -= item.amount;
        }
    })
    // const amount = data.map(item => item.amount).reduce((left, right) => left + right, 0);
    params.amount = Ux.formatCurrency(amount);

    const report = Ux.inHoc(reference, "report");
    return (
        <Row>
            <Col span={5}>
                {Ux.formatExpr(report.count, params)}
            </Col>
            <Col span={5}>
                {Ux.formatExpr(report.amount, params)}
            </Col>
        </Row>
    )
}

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
                <Table {...table} dataSource={dataSource} footer={renderFooter(this)}/>
            </div>
        )
    }
}

export default Component