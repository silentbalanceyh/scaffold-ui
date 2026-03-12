import React from 'react';
import {Button, Checkbox, Col, Modal, Row, Space, Tooltip} from 'antd';
import {ArrowLeftOutlined, DownOutlined, EyeOutlined, RightOutlined} from '@ant-design/icons';
import Ux from 'ux';
import Op from './Op.Menu';

/**
 * 从树中递归收集所有节点ID
 */
const collectAllIds = (menu, ids = new Set()) => {
    ids.add(menu.id);
    if (menu.children && menu.children.length > 0) {
        menu.children.forEach(child => collectAllIds(child, ids));
    }
    return ids;
};

/**
 * 从树中递归收集所有 NAV-MENU/NAV_MENU
 */
const collectNavMenus = (menu) => {
    const navMenus = [];
    if (menu.type === 'NAV-MENU' || menu.type === 'NAV_MENU') {
        navMenus.push(menu);
    }
    if (menu.children && menu.children.length > 0) {
        menu.children.forEach(child => {
            navMenus.push(...collectNavMenus(child));
        });
    }
    return navMenus;
};

/**
 * 从树中递归移除所有 NAV-MENU/NAV_MENU
 */
const removeNavMenus = (menu) => {
    if (!menu.children || menu.children.length === 0) {
        return menu.type === 'NAV-MENU' || menu.type === 'NAV_MENU' ? null : menu;
    }

    const filteredChildren = menu.children
        .filter(child => child.type !== 'NAV-MENU' && child.type !== 'NAV_MENU')
        .map(removeNavMenus)
        .filter(Boolean);

    return {
        ...menu,
        children: filteredChildren
    };
};

/**
 * 根据选中状态过滤树（只保留选中的节点及其父节点）
 */
const filterTreeBySelected = (menu, selectedNames) => {
    // 检查当前节点是否被选中
    const isSelected = selectedNames.has(menu.name);

    // 递归处理子节点
    let filteredChildren = [];
    if (menu.children && menu.children.length > 0) {
        filteredChildren = menu.children
            .map(child => filterTreeBySelected(child, selectedNames))
            .filter(Boolean);
    }

    // 如果当前节点被选中，或者有选中的子节点，则保留
    if (isSelected || filteredChildren.length > 0) {
        return {
            ...menu,
            children: filteredChildren.length > 0 ? filteredChildren : undefined
        };
    }

    return null;
};

/**
 * 渲染只读树节点（用于模态窗查看）
 * 普通菜单样式，无上色
 * 支持展开收缩交互
 */
const renderViewItem = (menu, level = 0, expandedKeys = new Set(), onToggle, primaryColor) => {
    const hasChildren = menu.children && menu.children.length > 0;
    const isExpanded = expandedKeys.has(menu.id);

    const expandIcon = hasChildren ? (
        <span
            onClick={() => onToggle && onToggle(menu.id)}
            style={{cursor: 'pointer', marginRight: 4, display: 'inline-block', width: 16}}
        >
            {isExpanded ? <DownOutlined style={{fontSize: 12}}/> : <RightOutlined style={{fontSize: 12}}/>}
        </span>
    ) : <span style={{display: 'inline-block', width: 16, marginRight: 4}}/>;

    // 普通菜单样式
    const textStyle = {
        fontSize: level === 0 ? 14 : 13,
        fontWeight: level === 0 ? 500 : 400,
        color: '#333',
    };

    // 统一缩进单位：每层 24px，与图标宽度（16px + 4px margin）形成视觉和谐
    const indentUnit = 24;

    return (
        <div key={menu.id} style={{padding: '6px 0'}}>
            <span style={{display: 'inline-flex', alignItems: 'center', marginLeft: level * indentUnit}}>
                {expandIcon}
                <span style={textStyle}>{menu.text}</span>
            </span>
            {hasChildren && isExpanded && (
                <div>
                    {menu.children.map(child => renderViewItem(child, level + 1, expandedKeys, onToggle, primaryColor))}
                </div>
            )}
        </div>
    );
};

/**
 * 渲染查看模态窗中的树（只读模式，支持展开收缩，只显示已选中的菜单）
 * 默认全部展开
 */
const renderViewTree = (menuTrees, selectedNames, expandedKeys, onToggle, primaryColor) => {
    if (!menuTrees || menuTrees.length === 0 || !selectedNames || selectedNames.size === 0) {
        return (
            <div style={{padding: 24, textAlign: 'center', color: '#999'}}>
                暂无已选中的菜单权限
            </div>
        );
    }

    // 过滤每棵树，只保留选中的节点
    const filteredTrees = menuTrees
        .map(tree => filterTreeBySelected(tree, selectedNames))
        .filter(Boolean);

    if (filteredTrees.length === 0) {
        return (
            <div style={{padding: 24, textAlign: 'center', color: '#999'}}>
                暂无已选中的菜单权限
            </div>
        );
    }

    return (
        <div>
            {filteredTrees.map(child => renderViewItem(child, 0, expandedKeys, onToggle, primaryColor))}
        </div>
    );
};

/**
 * 渲染单个菜单树节点（无emoji前缀，只有文字）
 * 虚拟节点不渲染 checkbox，只作为分组容器
 * BAG-MENU 在 level=0 时不渲染 checkbox，只渲染 children
 * NAV-MENU/NAV_MENU 不可选择，不渲染 checkbox
 * 默认不展开，点击箭头展开/折叠
 */
const renderMenuItem = (reference, menu, level = 0, i18n, expandedKeys = new Set(), selectedNames = new Set()) => {
    const checkState = Op.getCheckState(menu, selectedNames);

    // @ts-ignore
    const isChecked = checkState === 'checked';
    // @ts-ignore
    const isIndeterminate = checkState === 'indeterminate';
    const hasChildren = menu.children && menu.children.length > 0;
    const isExpanded = expandedKeys.has(menu.id);

    // 虚拟节点渲染标题和 children（快捷方式分组），支持展开/收缩
    if (menu.virtual) {
        const hasChildren = menu.children && menu.children.length > 0;
        const isExpanded = expandedKeys.has(menu.id);

        return (
            <div key={menu.id} style={{marginBottom: 8}}>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: 4}}>
                    {/* 展开/折叠箭头 */}
                    {hasChildren ? (
                        <span
                            onClick={() => {
                                const {$expandedKeys = new Set()} = reference.state;
                                const newExpanded = new Set($expandedKeys);
                                if (newExpanded.has(menu.id)) {
                                    newExpanded.delete(menu.id);
                                } else {
                                    newExpanded.add(menu.id);
                                }
                                reference.setState({$expandedKeys: newExpanded});
                            }}
                            style={{cursor: 'pointer', marginRight: 4, display: 'inline-block', width: 16}}
                        >
                            {isExpanded ? <DownOutlined style={{fontSize: 12}}/> : <RightOutlined style={{fontSize: 12}}/>}
                        </span>
                    ) : <span style={{display: 'inline-block', width: 16, marginRight: 4}}/>}
                    <span style={{fontWeight: 500, color: '#666'}}>{menu.text}</span>
                </div>
                {hasChildren && isExpanded && (
                    <div>
                        {menu.children.map(child => renderMenuItem(reference, child, 1, i18n, expandedKeys, selectedNames))}
                    </div>
                )}
            </div>
        );
    }

    // BAG-MENU 在 level=0 时只渲染 children
    if (menu.type === 'BAG-MENU' && level === 0) {
        return (
            <div key={menu.id}>
                {menu.children && menu.children.map(child => renderMenuItem(reference, child, level + 1, i18n, expandedKeys, selectedNames))}
            </div>
        );
    }

    // Tooltip内容
    const tooltipContent = (
        <div>
            <div><strong>{i18n.name}:</strong> {menu.name}</div>
            <div><strong>{i18n.text}:</strong> {menu.text}</div>
            {menu.icon && <div><strong>{i18n.icon}:</strong> {menu.icon}</div>}
            {menu.uri && <div><strong>{i18n.path}:</strong> {menu.uri}</div>}
        </div>
    );

    // 展开/折叠箭头
    const expandIcon = hasChildren ? (
        <span
            onClick={() => {
                const {$expandedKeys = new Set()} = reference.state;
                const newExpanded = new Set($expandedKeys);
                if (newExpanded.has(menu.id)) {
                    newExpanded.delete(menu.id);
                } else {
                    newExpanded.add(menu.id);
                }
                reference.setState({$expandedKeys: newExpanded});
            }}
            style={{cursor: 'pointer', marginRight: 4, display: 'inline-block', width: 16}}
        >
            {isExpanded ? <DownOutlined style={{fontSize: 12}}/> : <RightOutlined style={{fontSize: 12}}/>}
        </span>
    ) : <span style={{display: 'inline-block', width: 16, marginRight: 4}}/>;

    const checkbox = (
        <Checkbox
            checked={isChecked}
            indeterminate={isIndeterminate}
            onChange={(e) => Op.$opSelect(reference)(menu, e.target.checked)}
        >
            <span>{menu.text}</span>
        </Checkbox>
    );

    // 统一缩进单位：每层 24px，与图标宽度（16px + 4px margin）形成视觉和谐
    const indentUnit = 24;

    return (
        <div key={menu.id} style={{padding: '4px 0'}}>
            <Tooltip title={tooltipContent} placement="right">
                <span style={{display: 'inline-flex', alignItems: 'center', marginLeft: level * indentUnit}}>
                    {expandIcon}
                    {checkbox}
                </span>
            </Tooltip>
            {hasChildren && isExpanded && (
                <div>
                    {menu.children.map(child => renderMenuItem(reference, child, level + 1, i18n, expandedKeys, selectedNames))}
                </div>
            )}
        </div>
    );
};

/**
 * 渲染单个菜单树（Card样式标题，使用根菜单的text）
 * 渲染前收集所有 NAV-MENU，创建"快捷方式"虚拟节点
 */
const renderMenuTree = (reference, tree, i18n, expandedKeys, selectedNames) => {
    const typeEmoji = Op.getTypeEmoji(tree.type);
    // 标题使用根菜单的text，如果没有才显示类型
    const title = tree.text || Op.getTypeTitle(tree.type);

    // 只对 BAG-MENU 处理 NAV-MENU
    const isBagMenu = tree.type === 'BAG-MENU';

    // 收集所有 NAV-MENU
    const navMenus = isBagMenu ? collectNavMenus(tree) : [];
    // 移除 NAV-MENU 后的树
    const treeWithoutNav = isBagMenu ? removeNavMenus(tree) : tree;

    // 构建子节点列表
    const childrenToRender = [];

    // 如果有 NAV-MENU，先添加"快捷方式"虚拟节点
    if (navMenus.length > 0) {
        childrenToRender.push({
            id: `${tree.id}-nav-shortcut`,
            type: 'NAV-MENU',
            text: '快捷方式',
            name: `${tree.name}-NAV-SHORTCUT`,
            virtual: true,
            children: navMenus.sort((a, b) => (a.order || 0) - (b.order || 0))
        });
    }

    // 添加移除 NAV-MENU 后的树的子节点
    if (treeWithoutNav && treeWithoutNav.children) {
        childrenToRender.push(...treeWithoutNav.children);
    }

    return (
        <div
            key={tree.id}
            style={{
                border: '1px solid #e8e8e8',
                borderRadius: 8,
                backgroundColor: '#fff',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Card标题区域 */}
            <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid #e8e8e8',
                backgroundColor: '#fafafa',
                borderRadius: '8px 8px 0 0'
            }}>
                <span style={{fontSize: 16, fontWeight: 600}}>
                    {typeEmoji} {title}
                </span>
            </div>
            {/* Card内容区域（可滚动） */}
            <div style={{
                padding: 12,
                overflow: 'auto',
                maxHeight: 340,
                flex: 1
            }}>
                {childrenToRender.map(child => renderMenuItem(reference, child, 0, i18n, expandedKeys, selectedNames))}
            </div>
        </div>
    );
};

/**
 * 渲染菜单树网格
 */
const renderMenuGrid = (reference, i18n, expandedKeys, selectedNames) => {
    const {$menuTrees = []} = reference.state;

    if ($menuTrees.length === 0) {
        return (
            <div style={{padding: 24, textAlign: 'center', color: '#999'}}>
                {i18n.noData}
            </div>
        );
    }

    // 每3个树一行
    const rows = [];
    for (let i = 0; i < $menuTrees.length; i += 3) {
        rows.push($menuTrees.slice(i, i + 3));
    }

    return (
        <div>
            {rows.map((row, rowIndex) => (
                <Row key={rowIndex} gutter={[16, 16]} style={{marginBottom: 16}}>
                    {row.map((tree) => (
                        <Col key={tree.id} span={8}>
                            {renderMenuTree(reference, tree, i18n, expandedKeys, selectedNames)}
                        </Col>
                    ))}
                    {/* 补齐空列 */}
                    {row.length < 3 && Array.from({length: 3 - row.length}, (_, i) => (
                        <Col key={`empty-${i}`} span={8}/>
                    ))}
                </Row>
            ))}
        </div>
    );
};

/**
 * 菜单权限子组件
 * $ready = true (配置完成)
 * $loading = false (数据加载完成)
 * 两者满足才渲染
 */
class WebMenu extends React.PureComponent {
    state = {
        $viewVisible: false,
        $viewExpandedKeys: new Set()
    };

    componentDidMount() {
        this.checkAndInit();
    }

    componentDidUpdate() {
        this.checkAndInit();
    }

    checkAndInit() {
        const {reference} = this.props;
        const {$ready, $loading} = this.props;

        // 父组件配置未就绪，等待
        if (!$ready) {
            return;
        }

        // 数据正在加载或已加载完成，不重复加载
        if ($loading !== undefined) {
            return;
        }

        // 开始加载数据
        Op.$opInit(reference);
    }

    handleViewToggle = (nodeId) => {
        const {$viewExpandedKeys} = this.state;
        const newExpanded = new Set($viewExpandedKeys);
        if (newExpanded.has(nodeId)) {
            newExpanded.delete(nodeId);
        } else {
            newExpanded.add(nodeId);
        }
        this.setState({$viewExpandedKeys: newExpanded});
    };

    handleViewOpen = () => {
        const {$menuTrees = [], $selectedNames} = this.props;
        // 过滤每棵树，只保留选中的节点
        const filteredTrees = ($menuTrees || [])
            .map(tree => filterTreeBySelected(tree, $selectedNames))
            .filter(Boolean);

        // 收集所有节点ID，默认全部展开
        const allIds = new Set();
        filteredTrees.forEach(tree => collectAllIds(tree, allIds));

        this.setState({
            $viewVisible: true,
            $viewExpandedKeys: allIds
        });
    };

    render() {
        const {reference, $ready = false, $loading, $selectedNames, $menuTrees = [], $expandedKeys = new Set(), $onBack} = this.props;
        const {$viewVisible, $viewExpandedKeys} = this.state;

        // 获取i18n资源
        const i18n = Ux.fromHoc(reference, "menuPerm") || {};
        const button = Ux.fromHoc(reference, "button") || {};

        // $ready = true 且 $loading = false 才渲染数据
        // $loading 初始为 undefined，加载中为 true，完成为 false
        if (!$ready || $loading === true || $loading === undefined) {
            return (
                <div style={{padding: 24, textAlign: 'center', color: '#999'}}>
                    {i18n.loading || '加载中...'}
                </div>
            );
        }

        const primaryColor = Ux.Env.CSS_COLOR || '#1890ff';
        const selectedCount = $selectedNames ? $selectedNames.size : 0;

        return (
            <div style={{padding: 0}}>
                {/* 操作按钮区 */}
                <div style={{marginBottom: 16, display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Button
                        icon={<ArrowLeftOutlined/>}
                        onClick={$onBack}
                        style={{
                            backgroundColor: '#f50',
                            borderColor: '#f50',
                            color: '#fff',
                            marginRight: 8
                        }}
                    >
                        {button.back}
                    </Button>
                    <Space.Compact>
                        <Button
                            type="primary"
                            onClick={() => Op.$opSave(reference)}
                        >
                            {button.save}
                        </Button>
                        <Button
                            onClick={Op.$opReset(reference)}
                        >
                            {button.reset}
                        </Button>
                    </Space.Compact>
                    <Button
                        icon={<EyeOutlined/>}
                        style={{marginLeft: 8}}
                        onClick={this.handleViewOpen}
                    >
                        {button.view}
                    </Button>
                    <span style={{marginLeft: 24, color: '#666', fontSize: 15}}>
                        {i18n.selected}
                        <span style={{color: primaryColor, fontWeight: 'bold', margin: '0 4px'}}>{selectedCount}</span>
                        {i18n.menus}
                    </span>
                </div>

                {/* 菜单树网格 */}
                {$menuTrees.length > 0 ? renderMenuGrid(reference, i18n, $expandedKeys, $selectedNames) : (
                    <div style={{padding: 24, textAlign: 'center', color: '#999'}}>
                        {i18n.noData || '暂无数据'}
                    </div>
                )}

                {/* 查看模态窗 */}
                <Modal
                    title={i18n.viewTitle || '菜单权限树型结构'}
                    open={$viewVisible}
                    onCancel={() => this.setState({$viewVisible: false, $viewExpandedKeys: new Set()})}
                    width={600}
                    styles={{
                        body: {maxHeight: 500, overflowY: 'auto', padding: 16}
                    }}
                    footer={
                        <div style={{
                            backgroundColor: primaryColor,
                            margin: '-12px -24px -24px',
                            padding: '12px 24px',
                            textAlign: 'right'
                        }}>
                            <Button
                                style={{backgroundColor: '#fff', borderColor: '#fff', color: primaryColor}}
                                onClick={() => this.setState({$viewVisible: false, $viewExpandedKeys: new Set()})}
                            >
                                {button.close || '关闭'}
                            </Button>
                        </div>
                    }
                >
                    {/* 权限树 */}
                    {renderViewTree($menuTrees, $selectedNames, $viewExpandedKeys, this.handleViewToggle, primaryColor)}
                </Modal>
            </div>
        );
    }
}

export default WebMenu;