import Ux from 'ux';
import React from 'react';
import {Tooltip} from 'antd';
import __Zn from './zero.module.dependency';

export default async (reference, menuData = [], config = {}) => {
    // Promise for Build extra
    const dataSource = __Zn.a4MenuWeb(menuData, Ux.Env.MENU_TYPE.EXTRA);
    return (props) => dataSource.map(item => {
        const {data = {}} = item;
        const {metadata = {}} = data;
        /*
         * metadata.plugin 可提取插件基础配置，然后结合对应的菜单定义配置
         * 形成完成的处理配置相关信息
         */
        const plugins = config.plugins;
        const { plugin } = metadata;
        if(plugin && plugins[plugin]){
            const Component = plugins[plugin];
            const metaConfig = metadata.config ? metadata.config: {};
            Object.assign(metaConfig, item);
            return (
                <Component config={metaConfig}/>
            )
        } else if (metadata.confirm) {
            return (
                <Tooltip title={item.label} key={item.key}>
                    {item.icon}
                </Tooltip>
            )
        } else {
            return item.icon;
        }
    });
}