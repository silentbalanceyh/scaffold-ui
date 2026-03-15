import React from 'react';
import {Button, Checkbox, Modal, Space, Spin, Table, Tag, Tooltip} from 'antd';
import {ArrowLeftOutlined, EyeOutlined, SearchOutlined} from '@ant-design/icons';
import Ux from 'ux';
import Op from './Op.Resource';

/**
 * HTTP 方法颜色映射
 */
const METHOD_COLORS = {
    GET: 'green',
    POST: 'blue',
    PUT: 'orange',
    DELETE: 'red',
    PATCH: 'purple',
};

/**
 * 构建表格数据源
 * 计算每个 type 和 directory 的 rowSpan
 */
const buildTableData = (permTrees) => {
    const tableData = [];
    let key = 0;

    permTrees.forEach(typeNode => {
        const type = typeNode.name;
        const directories = typeNode.children || [];

        const typeRowCount = directories.reduce((sum, dir) => {
            return sum + (dir.children?.length || 0);
        }, 0);

        directories.forEach((dirNode, dirIndex) => {
            const directory = dirNode.name;
            const permissions = dirNode.children || [];

            permissions.forEach((permNode, permIndex) => {
                tableData.push({
                    key: key++,
                    type,
                    typeRowSpan: (dirIndex === 0 && permIndex === 0) ? typeRowCount : 0,
                    directory,
                    dirRowSpan: permIndex === 0 ? permissions.length : 0,
                    permission: permNode,
                });
            });
        });
    });

    return tableData;
};

/**
 * 获取操作列表表格列配置
 */
const getActionColumns = (i18n) => [
    {
        title: i18n.actionName || '操作名称',
        dataIndex: 'name',
        key: 'name',
        width: 150,
    },
    {
        title: i18n.actionCode || '操作编码',
        dataIndex: 'code',
        key: 'code',
        width: 300,
    },
    {
        title: i18n.httpMethod || 'HTTP方法',
        dataIndex: 'method',
        key: 'method',
        width: 100,
        render: (method) => (
            <Tag color={METHOD_COLORS[method] || 'default'}>
                {method}
            </Tag>
        ),
    },
    {
        title: i18n.uri || '请求路径',
        dataIndex: 'uri',
        key: 'uri',
        width: 400,
    },
];

/**
 * 渲染权限表格
 */
const renderPermTable = (reference, permTrees, i18n, selectedIds, onViewActions) => {
    if (!permTrees || permTrees.length === 0) {
        return (
            <div style={{padding: 24, textAlign: 'center', color: '#999'}}>
                {i18n.noData}
            </div>
        );
    }

    const tableData = buildTableData(permTrees);
    const primaryColor = Ux.Env.CSS_COLOR || '#1890ff';

    const columns = [
        {
            title: i18n.type || '类型',
            dataIndex: 'type',
            key: 'type',
            width: 150,
            onCell: (record) => ({
                rowSpan: record.typeRowSpan,
            }),
            render: (text) => <span style={{fontWeight: 600}}>{text}</span>,
        },
        {
            title: i18n.directory || '目录',
            dataIndex: 'directory',
            key: 'directory',
            width: 150,
            onCell: (record) => ({
                rowSpan: record.dirRowSpan,
            }),
            render: (text) => <span style={{fontWeight: 500, color: '#555'}}>{text}</span>,
        },
        {
            title: i18n.name || '权限名称',
            dataIndex: 'permission',
            key: 'permission',
            render: (perm) => {
                const isChecked = selectedIds.has(perm.permId);

                const tooltipContent = (
                    <div>
                        <div><strong>{i18n.name}:</strong> {perm.name}</div>
                        <div><strong>{i18n.code}:</strong> {perm.code}</div>
                        {perm.comment && <div><strong>{i18n.comment}:</strong> {perm.comment}</div>}
                    </div>
                );

                return (
                    <Tooltip title={tooltipContent} placement="right">
                        <Checkbox
                            checked={isChecked}
                            onChange={(e) => Op.$opSelect(reference)(perm.permId, e.target.checked)}
                        >
                            <span style={{fontSize: 13}}>{perm.name}</span>
                        </Checkbox>
                    </Tooltip>
                );
            },
        },
        {
            title: i18n.action || '操作',
            key: 'action',
            width: 100,
            render: (_, record) => {
                const perm = record.permission;
                return (
                    <Button
                        type="primary"
                        size="small"
                        icon={<SearchOutlined />}
                        style={{backgroundColor: primaryColor, borderColor: primaryColor}}
                        onClick={() => onViewActions(perm)}
                    >
                        {i18n.view || '查看'}
                    </Button>
                );
            },
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            bordered
            size="middle"
        />
    );
};

/**
 * 过滤树，只保留选中的节点
 */
const filterTreesBySelected = (trees, selectedIds) => {
    return trees.map(tree => filterNodeBySelected(tree, selectedIds)).filter(Boolean);
};

/**
 * 过滤单个节点
 */
const filterNodeBySelected = (node, selectedIds) => {
    if (node.type === 'permission') {
        return selectedIds.has(node.permId) ? node : null;
    }

    if (node.children && node.children.length > 0) {
        const filteredChildren = node.children
            .map(child => filterNodeBySelected(child, selectedIds))
            .filter(Boolean);

        if (filteredChildren.length > 0) {
            return {...node, children: filteredChildren};
        }
    }

    return null;
};

/**
 * 渲染查看模态窗中的树
 */
const renderViewTree = (permTrees, selectedIds, i18n) => {
    if (!permTrees || permTrees.length === 0 || !selectedIds || selectedIds.size === 0) {
        return (
            <div style={{padding: 24, textAlign: 'center', color: '#999'}}>
                {i18n.noSelected || '暂无已选中的资源权限'}
            </div>
        );
    }

    const filteredTrees = filterTreesBySelected(permTrees, selectedIds);

    if (filteredTrees.length === 0) {
        return (
            <div style={{padding: 24, textAlign: 'center', color: '#999'}}>
                {i18n.noSelected || '暂无已选中的资源权限'}
            </div>
        );
    }

    const renderNode = (node, level = 0) => {
        const hasChildren = node.children && node.children.length > 0;
        const indent = level * 24;

        return (
            <div key={node.id} style={{padding: '4px 0'}}>
                <div style={{marginLeft: indent}}>
                    <span style={{
                        fontSize: level === 0 ? 14 : (level === 1 ? 13 : 12),
                        fontWeight: level === 0 ? 600 : (level === 1 ? 500 : 400),
                        color: level === 2 ? '#666' : '#333',
                    }}>
                        {node.name}
                    </span>
                </div>
                {hasChildren && (
                    <div>
                        {node.children.map(child => renderNode(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div>
            {filteredTrees.map(tree => renderNode(tree))}
        </div>
    );
};

/**
 * 资源权限子组件
 */
class WebResource extends React.PureComponent {
    state = {
        $viewVisible: false,
        $actionVisible: false,
        $actionLoading: false,
        $actionData: [],
        $currentPerm: null,
    };

    componentDidMount() {
        this.checkAndInit();
    }

    componentDidUpdate() {
        this.checkAndInit();
    }

    checkAndInit() {
        const {$ready, $loading} = this.props;

        if (!$ready) {
            return;
        }

        if ($loading !== undefined) {
            return;
        }

        const {reference} = this.props;
        Op.$opInit(reference);
    }

    handleViewOpen = () => {
        this.setState({$viewVisible: true});
    };

    handleViewActions = (perm) => {
        this.setState({$actionVisible: true, $actionLoading: true, $currentPerm: perm, $actionData: []});

        Op.$opLoadActions(perm.permId).then(actions => {
            this.setState({
                $actionData: actions || [],
                $actionLoading: false,
            });
        }).catch(() => {
            this.setState({
                $actionData: [],
                $actionLoading: false,
            });
        });
    };

    render() {
        const {reference, $ready = false, $loading, $selectedIds, $permTrees = [], $onBack} = this.props;
        const {$viewVisible, $actionVisible, $actionLoading, $actionData, $currentPerm} = this.state;

        const i18n = Ux.fromHoc(reference, "resourcePerm") || {};
        const button = Ux.fromHoc(reference, "button") || {};

        if (!$ready || $loading === true || $loading === undefined) {
            // 高度计算：视口高度 - 头部区域(约80px) - 按钮区(约60px) - 内边距
            const spinHeight = 'calc(100vh - 200px)';
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: spinHeight,
                    minHeight: 300
                }}>
                    <Spin size="large" tip={i18n.loading || '加载中...'}>
                        <div style={{width: 300, height: spinHeight}}/>
                    </Spin>
                </div>
            );
        }

        const primaryColor = Ux.Env.CSS_COLOR || '#1890ff';
        const selectedCount = $selectedIds ? $selectedIds.size : 0;

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
                        {i18n.perms}
                    </span>
                </div>

                {/* 权限表格 */}
                {renderPermTable(reference, $permTrees, i18n, $selectedIds, this.handleViewActions)}

                {/* 查看已选权限模态窗 */}
                <Modal
                    title={i18n.viewTitle || '资源权限树型结构'}
                    open={$viewVisible}
                    onCancel={() => this.setState({$viewVisible: false})}
                    width={600}
                    styles={{
                        body: {maxHeight: 500, overflowY: 'auto', padding: '4px 8px'}
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
                                onClick={() => this.setState({$viewVisible: false})}
                            >
                                {button.close || '关闭'}
                            </Button>
                        </div>
                    }
                >
                    {renderViewTree($permTrees, $selectedIds, i18n)}
                </Modal>

                {/* 操作列表模态窗 */}
                <Modal
                    title={$currentPerm ? `${$currentPerm.name} - ${i18n.actionTitle || '操作列表'}` : (i18n.actionTitle || '操作列表')}
                    open={$actionVisible}
                    onCancel={() => this.setState({$actionVisible: false, $actionData: [], $currentPerm: null})}
                    width={1100}
                    styles={{
                        body: {padding: '4px 8px'}
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
                                onClick={() => this.setState({$actionVisible: false, $actionData: [], $currentPerm: null})}
                            >
                                {button.close || '关闭'}
                            </Button>
                        </div>
                    }
                >
                    {$currentPerm && (
                        <div style={{marginBottom: 16, padding: '8px 12px', backgroundColor: '#f5f5f5', borderRadius: 4}}>
                            <span style={{fontWeight: 500}}>{i18n.permissionLabel || '权限：'}</span>
                            <span style={{color: primaryColor}}>{$currentPerm.name}</span>
                            <span style={{marginLeft: 16, color: '#999'}}>{$currentPerm.code}</span>
                        </div>
                    )}
                    <Table
                        columns={getActionColumns(i18n)}
                        dataSource={$actionData}
                        loading={$actionLoading}
                        pagination={false}
                        size="small"
                        rowKey="id"
                        locale={{emptyText: i18n.noActionData || '暂无操作数据'}}
                    />
                </Modal>
            </div>
        );
    }
}

export default WebResource;