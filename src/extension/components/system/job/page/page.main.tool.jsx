import {Button, Checkbox, Col, Input, Row, Space} from 'antd';
import React from 'react';
import Ux from 'ux';
import Event from '../event';

const renderSearch = (reference, tool = {}) => {
    const {search} = tool;
    const {$condText} = reference.state;
    if (search) {
        return (
            <Input.Search placeholder={search.placeholder} allowClear
                          value={$condText}
                          onChange={Event.onSearchChange(reference)}
                          onSearch={Event.onSearch(reference)}/>
        )
    } else return false;
}

const renderButton = (reference, tool = {}) => {
    const {button = {}} = tool;
    const {$query, $loading = false} = reference.state;
    return (
        // FIX: Warning: [antd: Button.Group] `Button.Group` is deprecated. Please use `Space.Compact` instead. Error Component Stack
        <Space.Compact>
            <Button icon={Ux.v4Icon("redo")}
                    className={"uc_red"}
                    loading={$loading}
                    onClick={Event.onRefresh(reference)}>
                {button.refresh}
            </Button>
            <Button icon={Ux.v4Icon("filter")}
                    loading={$loading}
                    disabled={Ux.isEmpty($query.criteria)}
                    onClick={Event.onClean(reference)}>
                {button.clean}
            </Button>
        </Space.Compact>
    );
}

const renderChecked = (reference, tool = {}) => {
    const {checked = {}} = tool;
    const {$condChecked = []} = reference.state;
    const normalizedChecked = $condChecked.map(item => "PLAN" === item ? "FORMULA" : item);
    const normalizedOptions = Object.keys(checked).reduce((options, key) => {
        const normalizedKey = "PLAN" === key ? "FORMULA" : key;
        const normalizedText = "轮询任务" === checked[key] ? "周期任务" : checked[key];
        options[normalizedKey] = normalizedText;
        return options;
    }, {});
    return (
        <Checkbox.Group onChange={Event.onChecked(reference)}
                        value={normalizedChecked}>
            {Object.keys(normalizedOptions).map(key => {
                const text = normalizedOptions[key];
                return (
                    <Checkbox value={key} key={key} children={text}/>
                )
            })}
        </Checkbox.Group>
    )
}

export default (reference) => {
    let tool = Ux.fromHoc(reference, "tool");
    if (!tool) tool = {};
    return (
        <Row className={"job-tool"}>
            <Col span={4}>
                {renderButton(reference, tool)}
            </Col>
            <Col span={8} className={"check-group"}>
                {renderChecked(reference, tool)}
            </Col>
            <Col span={5} offset={7}>
                {renderSearch(reference, tool)}
            </Col>
        </Row>
    )
}
