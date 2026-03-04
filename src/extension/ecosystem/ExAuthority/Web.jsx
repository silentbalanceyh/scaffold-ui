import Ux from "ux";
import Ex from 'ex';
import {Col, Row, Spin, Tabs} from 'antd';
import {SafetyOutlined, TagOutlined, UserOutlined} from '@ant-design/icons';
import React from 'react';

import Op from './Op';

const HI = {}

const renderHeader = (reference) => {
    const title = Ux.fromHoc(reference, "title");
    const {$inited = {}} = reference.props;
    const {data = {}} = $inited;
    return (
        <Row className={"role-header"}>
            <Col span={3} className={"role-title"}>
                <UserOutlined style={{marginRight: 6}}/> {title.name}
            </Col>
            <Col span={3}>
                {data.name}
            </Col>
            <Col span={3} className={"role-title"}>
                <TagOutlined style={{marginRight: 6}}/> {title.code}
            </Col>
            <Col span={3}>
                {data.code}
            </Col>
            <Col span={3} className={"role-title"}>
                <SafetyOutlined style={{marginRight: 6}}/> {title['admit']}
            </Col>
            <Col span={3}>
                {Ux.aiYN(data['power'])}
            </Col>
        </Row>
    )
}
const renderPage = (reference) => {
    const {
        $regionData = {},
        $activeKey, $paging = true,
        $regions = []
    } = reference.state;
    if ($regionData.hasOwnProperty($activeKey)) {
        const tabAttrs = {};
        tabAttrs.className = "role-tab";
        tabAttrs.type = "card";
        tabAttrs.onTabClick = Op.rxTabClick(reference);

        // webAction for connecting here
        const regionActive = $regionData[$activeKey];
        const {config: {webAction}} = regionActive;
        // webAction
        tabAttrs.tabBarExtraContent = Ex.webAction(reference, webAction, {});
        tabAttrs.activeKey = $activeKey;
        // v4
        const items = Ux.v4Items($regions, {
            // itemFn: 取默认
            // childFn
            childFn: (region, ref) => {
                // Branch for different component for Performance
                const {ui = {}} = region;
                const Component = HI[ui];
                if (!Component) {
                    return (<span>{ui} 找不到！</span>)
                } else {
                    // 属性处理
                    const regionData = $regionData[region.key];
                    const inherit = Ex.yoAmbient(ref);
                    Object.assign(inherit, Ex.aclRegion(ref, regionData));
                    inherit.rxSwitch = Op.rxWindow(ref);
                    return (<Component {...inherit}/>)
                }
            }
        }, reference);
        return (
            <div className={"role-content"}>
                <Spin spinning={$paging}>
                    {/* @ts-ignore */}
                    <Tabs {...tabAttrs} items={items}/>
                </Spin>
            </div>
        )
    } else return false;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    renderHeader,
    renderPage,
}