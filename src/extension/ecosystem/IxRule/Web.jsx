import Ux from "ux";
import {Button, Checkbox, Col, Collapse, Row, Table, Tag, Space} from "antd";
import Op from "./Op";
import React from "react";
import {LoadingAlert} from "web";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    renderColumn: (reference, columns = [], target = {}) => {
        const {config = {}} = reference.props;
        let $columns = Ux.clone(columns);
        if (config.sort) {
            $columns = $columns.concat([target.column]);
        }
        $columns.forEach(column => {
            if ("key" === column.dataIndex) {
                column.render = (text, record, index) => {
                    return (
                        // FIX: Warning: [antd: Button.Group] `Button.Group` is deprecated. Please use `Space.Compact` instead. Error Component Stack
                        <Space.Compact>
                            <Button icon={Ux.v4Icon("plus")} type={"primary"}
                                    onClick={Ux.xtRowAdd(reference, record, index)}/>
                            <Button icon={Ux.v4Icon("delete")}
                                    onClick={event => Ux.xtRowDel(reference, record, index)(event)
                                        .then(merged => {
                                            if (merged) {
                                                // 清空当前
                                                Op.doClean(reference, record);
                                            }
                                        })
                                    }/>
                        </Space.Compact>
                    );
                }
            }
            if ("ruleName" === column.dataIndex) {
                column.render = (text, record = {}, index) => {
                    const {rules = []} = record;
                    const pending = Ux.fromHoc(reference, "pending");
                    return (
                        <span>
                        {`${pending.name}${index + 1}`}&nbsp;
                            {0 === rules.length ? Ux.v4Icon("close-circle", {
                                theme: "Filled",
                                style: {color: "#ff3b1a"}
                            }) : Ux.v4Icon("check-circle", {
                                theme: "Filled",
                                style: {color: "#33af43"}
                            })}
                    </span>
                    );
                }
            }
            if ("rules" === column.dataIndex) {
                column.render = (text, record = {}) => {
                    let rules = [];
                    if (text) {
                        rules = text;
                    }
                    return (
                        <span>
                        {rules.map(rule => {
                            return (
                                <Tag key={rule} closable
                                     onClose={Op.onClose(reference, record, rule)}>{rule}</Tag>
                            )
                        })}
                    </span>
                    )
                }
            }
            if ("sorter" === column.dataIndex) {
                column.render = (text, record, index) => {
                    const {data = []} = reference.state;
                    return (
                        // FIX: Warning: [antd: Button.Group] `Button.Group` is deprecated. Please use `Space.Compact` instead. Error Component Stack
                        <Space.Compact>
                            <Button icon={Ux.v4Icon("arrow-up")} size={"small"}
                                    shape={"circle"} disabled={0 === index}
                                    onClick={Op.onSort(reference, index)}/>
                            <Button icon={Ux.v4Icon("arrow-down")} size={"small"}
                                    shape={"circle"} disabled={(data.length - 1) === index}
                                    onClick={Op.onSort(reference, index, false)}/>
                        </Space.Compact>
                    );
                }
            }
        });
        return $columns;
    },
    renderTitle: (reference, target = {}) => {
        const {title, sort = {}} = target;
        const {config = {}} = reference.props;
        const isSort = !!config.sort;
        return () => (
            <Row>
                <Col span={20}>
                    {title}
                </Col>
                <Col span={4} className={"ix-sort"}>
                    <Tag color={`${isSort ? "#f50" : "#87d068"}`} style={{
                        fontSize: 14
                    }}>
                        {sort[`${isSort}`]}
                    </Tag>
                </Col>
            </Row>
        );
    },
    renderTable: (reference) => {
        const {$table = {}, data = []} = reference.state;
        return (
            <Table {...$table} dataSource={data}/>
        )
    },
    renderSelection: (reference) => {
        const attrs = {};
        attrs.key = "selection";
        attrs.showArrow = false;
        const {$source = []} = reference.props;
        const {$selectedKeys, $selectedFields = [], data = []} = reference.state;

        const pending = Ux.fromHoc(reference, "pending");
        const {source = {}} = pending;

        let selectedKey = $selectedKeys ? $selectedKeys[0] : undefined;
        const index = Ux.elementIndex(data, selectedKey, 'key');
        return (
            <Collapse activeKey={["selection"]}>
                <Collapse.Panel {...attrs} header={
                    <span>
                    <Row>
                        <Col span={12}>
                            {source.title}
                        </Col>
                        <Col span={12} style={{
                            textAlign: "right"
                        }}>
                            {0 <= index ? (
                                <span>
                                    {source.selected}
                                    <Tag color={"orange"} style={{
                                        fontSize: 14
                                    }}>
                                        {source.rule}{index + 1}
                                    </Tag>
                                </span>
                            ) : false}
                        </Col>
                    </Row>
                </span>
                }>
                    <div className={"content"}>
                        {(() => {
                            if (0 < $source.length) {
                                return (
                                    <Checkbox.Group options={$source} className={"content-check"}
                                                    value={$selectedFields}
                                                    onChange={Op.onChecked(reference)}
                                                    disabled={undefined === $selectedKeys}/>
                                )
                            } else {
                                const {config = {}} = reference.props;
                                const {sourceEmpty} = config;
                                if (sourceEmpty) {
                                    return (
                                        <LoadingAlert $alert={sourceEmpty}/>
                                    )
                                } else return false;
                            }
                        })()}
                    </div>
                </Collapse.Panel>
            </Collapse>
        )
    }
}