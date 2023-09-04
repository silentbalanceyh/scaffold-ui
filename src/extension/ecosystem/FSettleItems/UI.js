import React from 'react';
import Ux from "ux";
import {Table, Row, Col} from "antd";

const UCA_NAME = "FSettleItems";

const renderFooter = (reference) => (data = []) => {
    const params = {};
    params.count = data.length;
    const amount = data.map(item => item.amount).reduce((left, right) => left + right, 0);
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
    .cab(UCA_NAME)
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

        dataSource = dataSource.sort(Ux.sorterDescFn('updatedAt'))
        return (
            <Table {...table} dataSource={dataSource} footer={renderFooter(this)}/>
        )
    }
}

export default Component