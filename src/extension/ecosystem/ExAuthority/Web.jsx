import Ux from "ux";
import {Col, Row} from 'antd';
import {SafetyOutlined, TagOutlined, UserOutlined} from '@ant-design/icons';
import React from 'react';

import Op from './Op';
import WebMenu from './Web.Menu';
import WebResource from './Web.Resource';

const COMPONENT_MAP = {
    menu: WebMenu,
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
                        <span style={{fontSize: 18, fontWeight: 600, marginLeft: 12, color: '#333'}}>
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
                        $permTrees={reference.state.$permTrees}
                        $selectedIds={reference.state.$selectedIds}
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
            <Row gutter={[24, 24]}>
                {menu.map((item) => {
                    const itemColor = item.color || primaryColor;
                    const icon = Ux.v4Icon(item.icon, {
                        style: {fontSize: 36}
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
                                    width: 140,
                                    height: 140,
                                    cursor: 'pointer',
                                    borderRadius: 12,
                                    transition: 'all 0.2s ease',
                                    backgroundColor: 'transparent',
                                    border: `2px solid ${itemColor}20`,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = `${itemColor}10`;
                                    e.currentTarget.style.borderColor = itemColor;
                                    e.currentTarget.style.boxShadow = `0 4px 12px ${itemColor}30`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.borderColor = `${itemColor}20`;
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{
                                    marginBottom: 12,
                                    color: itemColor
                                }}>
                                    {icon}
                                </div>
                                <div style={{
                                    fontSize: 16,
                                    fontWeight: 500,
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