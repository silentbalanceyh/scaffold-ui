import Ux from "ux";
import {Col, Row} from 'antd';
import {SafetyOutlined, TagOutlined, UserOutlined} from '@ant-design/icons';
import React from 'react';

import Op from './Op';
import WebMenu from './Web.Menu';
import WebWorkflow from './Web.Workflow';
import WebResource from './Web.Resource';

const COMPONENT_MAP = {
    menu: WebMenu,
    workflow: WebWorkflow,
    resource: WebResource,
};

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
    const menu = Ux.fromHoc(reference, "menu") || [];
    const {$activeMenu} = reference.state;
    const primaryColor = Ux.Env.CSS_COLOR || '#1890ff';

    // 如果已选中菜单，渲染对应子组件
    if ($activeMenu && COMPONENT_MAP[$activeMenu]) {
        const Component = COMPONENT_MAP[$activeMenu];
        const activeItem = menu.find(item => item.key === $activeMenu);
        return (
            <div className={"authority-content"}>
                <div style={{
                    marginBottom: 16,
                    borderBottom: '1px solid #e8e8e8',
                    paddingBottom: 16
                }}>
                    {activeItem && (
                        <span style={{fontSize: 18, fontWeight: 600, marginLeft: 12}}>
                            {activeItem.title}
                        </span>
                    )}
                </div>
                <div style={{padding: '0 0'}}>
                    {/* 传递具体状态值触发重新渲染 */}
                    <Component
                        key={$activeMenu}
                        reference={reference}
                        $ready={reference.state.$ready}
                        $loading={reference.state.$loading}
                        $menuTrees={reference.state.$menuTrees}
                        $selectedNames={reference.state.$selectedNames}
                        $expandedKeys={reference.state.$expandedKeys}
                        $onBack={() => Op.rxMenuClick(reference)(null)}
                    />
                </div>
            </div>
        );
    }

    // 否则渲染控制面板图标菜单
    return (
        <div className={"authority-panel"}>
            <Row gutter={[12, 12]}>
                {menu.map((item) => {
                    const icon = Ux.v4Icon(item.icon, {
                        style: {fontSize: 32}
                    });
                    return (
                        <Col key={item.key}>
                            <div
                                className={"authority-panel-item"}
                                onClick={() => Op.rxMenuClick(reference)(item.key)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 100,
                                    height: 100,
                                    cursor: 'pointer',
                                    borderRadius: 8,
                                    transition: 'all 0.2s ease',
                                    backgroundColor: 'transparent',
                                    border: '1px solid #e8e8e8',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                                    e.currentTarget.style.borderColor = primaryColor;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.borderColor = '#e8e8e8';
                                }}
                            >
                                <div style={{
                                    marginBottom: 8,
                                    color: primaryColor
                                }}>
                                    {icon}
                                </div>
                                <div style={{
                                    fontSize: 14,
                                    color: '#262626',
                                    textAlign: 'center',
                                    lineHeight: '1.3'
                                }}>
                                    {item.title}
                                </div>
                            </div>
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    renderHeader,
    renderPage,
}