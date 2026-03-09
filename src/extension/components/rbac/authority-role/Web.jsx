import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {Avatar, Card, List} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {ExAuthority} from "ei";
import Op from './Op';
import './Cab.norm.scss';

const renderMenu = (reference) => {
    const {$roles = [], $selected = {}} = reference.state;
    const primaryColor = Ux.Env.CSS_COLOR || '#1890ff';

    return (
        <div>
            <List
                dataSource={$roles}
                renderItem={(role) => {
                    const isSelected = $selected.key === role.key;
                    const cardStyle = {
                        marginBottom: 8,
                        cursor: 'pointer',
                        border: isSelected ? `1px solid ${primaryColor}` : '1px solid #d9d9d9',
                        borderRadius: 4,
                        backgroundColor: isSelected ? `rgba(${parseInt(primaryColor.slice(1, 3), 16)},${parseInt(primaryColor.slice(3, 5), 16)},${parseInt(primaryColor.slice(5, 7), 16)},0.05)` : '#fff',
                        boxShadow: isSelected ? `0 2px 12px rgba(${parseInt(primaryColor.slice(1, 3), 16)},${parseInt(primaryColor.slice(3, 5), 16)},${parseInt(primaryColor.slice(5, 7), 16)},0.2)` : undefined,
                        transition: 'all 0.3s ease',
                    };
                    return (
                        <Card
                            hoverable
                            onClick={() => Op.rxSelected(reference)([role.key])}
                            style={cardStyle}
                            styles={{body: {padding: '12px 16px'}}}
                        >
                            <Card.Meta
                                style={{alignItems: 'center'}}
                                avatar={
                                    <Avatar
                                        size={40}
                                        icon={<UserOutlined/>}
                                        style={{
                                            backgroundColor: isSelected ? primaryColor : '#f0f0f0',
                                            color: isSelected ? '#fff' : '#8c8c8c',
                                        }}
                                    />
                                }
                                title={
                                    <span style={{
                                        color: isSelected ? primaryColor : '#262626',
                                        fontWeight: isSelected ? 600 : 400,
                                        marginBottom: 4,
                                        lineHeight: '1.5',
                                        display: 'block',
                                    }}>
                                        {role.name}
                                    </span>
                                }
                                description={
                                    <span style={{fontSize: 12, color: '#8c8c8c'}}>
                                        {role.code}
                                    </span>
                                }
                            />
                        </Card>
                    );
                }}
            />
        </div>
    )
}
const renderContent = (reference) => {
    const {$selected = {}} = reference.state;
    const inherit = Ex.yoAmbient(reference);
    inherit.$inited = $selected;
    return (
        <ExAuthority {...inherit}/>
    )
}
export default {
    renderMenu,
    renderContent,
}