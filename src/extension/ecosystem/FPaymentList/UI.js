import React from 'react';
import Ux from "ux";
import {Popconfirm, Table, Row, Col, Tag} from "antd";
import Ex from "ex";

const UCA_NAME = "FPaymentList";
const mountOp = (reference, columns = []) => {
    let $columns = Ux.configColumn(reference, columns);
    const {rxPayment} = reference.props;
    if (Ux.isFunction(rxPayment)) {
        $columns.forEach(column => {
            if ("key" === column.dataIndex) {
                column.render = (key) => {
                    const {config = {}} = column;
                    const {confirm, text} = config;
                    return (
                        <Popconfirm title={confirm} onConfirm={event => {
                            Ux.prevent(event);
                            Ux.ajaxDelete("/api/payment/cascade/:key", {key})
                                .then(() => rxPayment([key]))
                        }}>
                            {/* eslint-disable-next-line */}
                            <a href={""}>
                                {Ux.v4Icon("delete")}
                                &nbsp;
                                {text}
                            </a>
                        </Popconfirm>
                    );
                }
            }
        })
    } else {
        $columns = $columns.filter(item => "key" !== item.dataIndex);
    }
    return $columns;
}

const renderFooter = (reference) => (data = []) => {
    const params = {};
    params.count = data.length;

    const { $amount = 0 } = reference.props;
    params.amount = Ux.formatCurrency($amount);
    const amountPayed = data.map(item => item.amount).reduce((left, right) => left + right, 0);
    params.amountPayed = Ux.formatCurrency(amountPayed);
    params.amountWait = Ux.formatCurrency($amount - amountPayed);

    const report = Ux.inHoc(reference, "report");
    return (
        <Row>
            <Col span={5}>
                {Ux.formatExpr(report.amount, params)}
            </Col>
            <Col span={5}>
                {Ux.formatExpr(report.count, params)}
            </Col>
            <Col span={5}>
                {Ux.formatExpr(report.payed, params)}
            </Col>
            <Col span={5}>
                {Ux.formatExpr(report.waiting, params)}
            </Col>
            <Col span={4}>
                {(() => {
                    const { result = {}} = report;
                    if(amountPayed >= $amount){
                        return (
                            <Tag color={"green"}>
                                {result.finished}
                            </Tag>
                        )
                    }else{
                        return (
                            <Tag color={"red"}>
                                {result.waiting}
                            </Tag>
                        )
                    }
                })()}
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
    componentDidMount() {
        const {$assist = true} = this.props;
        if ($assist) {
            Ex.yiAssist(this)
                .then(Ux.ready)
                .then(Ux.pipe(this));
        } else {
            // 表单级处理
            Ux.of(this).ready().done();
            // this.?etState({$ready: true});
        }
    }

    render() {
        return Ex.yoRender(this, () => {
            const {data = []} = this.props;
            const table = Ux.fromHoc(this, "table");
            table.columns = mountOp(this, table.columns);

            let dataSource = Ux.clone(data);
            dataSource.forEach(each => each.amount = Math.abs(each.amount))
            Ux.configScroll(table, dataSource, this);

            dataSource = dataSource.sort(Ux.sorterDescFn('updatedAt'))
            return (
                <Table {...table} dataSource={dataSource} footer={renderFooter(this)}/>
            )
        }, Ex.parserOfColor(UCA_NAME).control())
    }
}

export default Component