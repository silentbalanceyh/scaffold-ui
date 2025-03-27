import React from 'react';
import Ux from "ux";
import {Col, Row, Switch, Table} from 'antd';

const UCA_NAME = "FBillList";
const renderItem = (reference, data = []) => {
    const table = Ux.fromHoc(reference, "table");
    const tableConfig = table['items'];
    tableConfig.columns = Ux.configColumn(reference, tableConfig.columns);
    const dataSource = Ux.clone(data);
    Ux.configScroll(tableConfig, dataSource, reference);
    return (
        <Table {...tableConfig} dataSource={dataSource}/>
    )
}

const renderBill = (reference, data = []) => {
    const table = Ux.fromHoc(reference, "table");
    const tableConfig = table['bills'];
    tableConfig.columns = Ux.configColumn(reference, tableConfig.columns);

    // 处理数据和子项
    const dataSource = [];
    const treeMap = {};
    data.forEach(item => {
        const clonedItem = Ux.clone(item);
        if (clonedItem.children) {
            treeMap[clonedItem.key] = Ux.clone(clonedItem.children);
            const { children, ...rest } = clonedItem;
            dataSource.push(rest);
        } else {
            dataSource.push(clonedItem);
        }
    });

    // 设置固定的表格高度和滚动属性
    tableConfig.scroll = {
        x: true,
        y: 300
    };

    // 确保子表格也有固定高度
    const itemTableConfig = table['items'];
    itemTableConfig.scroll = {
        x: true,
        y: 100
    };

    Ux.configScroll(tableConfig, dataSource, reference);

    return (
        <div className="bill-table-container">
            <Table
                {...tableConfig}
                dataSource={dataSource}
                rowKey={record => record.key}
                expandable={{
                    expandedRowRender: record => {
                        const childConfig = {
                            ...itemTableConfig,
                            columns: Ux.configColumn(reference, itemTableConfig.columns)
                        };
                        const itemDataSource = treeMap[record.key] || [];

                        return (
                            <div className="expanded-table-container">
                                <Table
                                    {...childConfig}
                                    dataSource={itemDataSource}
                                    pagination={false}
                                    rowKey={item => item.key}
                                />
                            </div>
                        );
                    },
                    expandRowByClick: true,
                    defaultExpandAllRows: false
                }}
            />
        </div>
    );
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;

    render() {
        const {data = []} = this.props;
        data.filter(each => Ux.isArray(each.children)).forEach(each => {
            each.itemCount = each.children.length;
            each.children.forEach(item => {
                item.modelKey = each.modelKey;
            });
        })
        const config = Ux.fromHoc(this, "switcher")
        const {$isBill} = this.state;
        return (
            <div className={"ex-bill-list"}>
                <Row className={"row"}>
                    <Col span={8}>
                        <Switch {...config} checked={$isBill}
                                onChange={$isBill => Ux.of(this).in({$isBill}).done()}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {(() => {
                            if ($isBill) {
                                return renderBill(this, data);
                            } else {
                                const normalized = [];
                                data.filter(each => Ux.isArray(each.children))
                                    .forEach(each => each.children.forEach(item => normalized.push(item)))
                                return renderItem(this, normalized);
                            }
                        })()}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Component