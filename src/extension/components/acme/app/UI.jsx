import React from 'react';

/*
 * 多应用模式下的新版入口，路径为
 * /acme/app?appId=xxx
 * 直接根据 appId 提取应用配置相关信息，实现应用级别的配置加载，此处对接 B_BLOCK 中的应用设置
 */
class Component extends React.PureComponent {
    render() {
        return (
            <div>UI</div>
        )
    }
}

export default Component;