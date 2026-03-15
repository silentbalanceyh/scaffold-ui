import Ux from 'ux';

/**
 * 初始化资源权限数据
 * $loading = true 开始加载
 * $loading = false 加载完成
 */
const $opInit = (reference) => {
    const {$inited = {}} = reference.props;
    const {data = {}} = $inited;
    const roleId = data.key || data.id;

    // 检查 roleId 是否有效
    if (!roleId) {
        reference.setState({$loading: false, $permissions: [], $permTrees: []});
        return;
    }

    // 开始加载
    reference.setState({$loading: true});

    // 并行获取权限列表和角色权限
    Ux.parallel([
        Ux.ajaxGet("/api/permission/by/sigma"),
        Ux.ajaxGet(`/api/permission/role/${roleId}`)
    ]).then(([permissions, rolePerms]) => {
        const state = {};
        // Ux.ajaxGet 已经解包 data，直接使用返回值
        state.$permissions = permissions || [];
        state.$rolePerms = rolePerms || [];
        state.$originalPerms = Ux.clone(rolePerms || []);
        state.$loading = false;

        // 构建选中状态（存储 permId 的 Set）
        const selectedIds = new Set(
            (rolePerms || []).map(p => p.permId)
        );
        state.$selectedIds = selectedIds;

        // 构建权限树
        state.$permTrees = buildPermTrees(permissions || []);

        reference.setState(state);
    }).catch(() => {
        reference.setState({
            $loading: false,
            $permissions: [],
            $permTrees: []
        });
    });
};

/**
 * 构建权限树结构
 * 三级结构：type -> directory -> name（可选中）
 */
const buildPermTrees = (permissions) => {
    // 按 type 分组
    const typeMap = new Map();

    permissions.forEach(perm => {
        const type = perm.type || '其他';
        if (!typeMap.has(type)) {
            typeMap.set(type, new Map());
        }

        // 在每个 type 下按 directory 分组
        const dirMap = typeMap.get(type);
        const directory = perm.directory || '默认';
        if (!dirMap.has(directory)) {
            dirMap.set(directory, []);
        }
        dirMap.get(directory).push(perm);
    });

    // 构建树
    const trees = [];
    const sortedTypes = Array.from(typeMap.keys()).sort();

    sortedTypes.forEach(type => {
        const dirMap = typeMap.get(type);
        const children = [];
        const sortedDirs = Array.from(dirMap.keys()).sort();

        sortedDirs.forEach(directory => {
            const perms = dirMap.get(directory);
            // 按 name 排序
            perms.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

            children.push({
                id: `${type}-${directory}`,
                name: directory,
                type: 'directory',
                children: perms.map(p => ({
                    id: p.id,
                    name: p.name,
                    code: p.code,
                    permId: p.id,
                    type: 'permission',
                    comment: p.comment
                }))
            });
        });

        trees.push({
            id: type,
            name: type,
            type: 'type',
            children
        });
    });

    return trees;
};

/**
 * 处理权限选择变更
 * 只有叶子节点（permission）可以选中
 */
const $opSelect = (reference) => (permId, checked) => {
    const {$selectedIds} = reference.state;
    const newSelected = new Set($selectedIds);

    if (checked) {
        newSelected.add(permId);
    } else {
        newSelected.delete(permId);
    }

    reference.setState({$selectedIds: newSelected});
};

/**
 * 全选/取消全选某个目录下的所有权限
 */
const $opSelectDir = (reference) => (directory, checked) => {
    const {$selectedIds, $permissions} = reference.state;
    const newSelected = new Set($selectedIds);

    // 获取该目录下的所有权限 ID
    const dirPerms = $permissions.filter(p => p.directory === directory.name);
    dirPerms.forEach(p => {
        if (checked) {
            newSelected.add(p.id);
        } else {
            newSelected.delete(p.id);
        }
    });

    reference.setState({$selectedIds: newSelected});
};

/**
 * 全选/取消全选某个类型下的所有权限
 */
const $opSelectType = (reference) => (type, checked) => {
    const {$selectedIds, $permissions} = reference.state;
    const newSelected = new Set($selectedIds);

    // 获取该类型下的所有权限 ID
    const typePerms = $permissions.filter(p => p.type === type.name);
    typePerms.forEach(p => {
        if (checked) {
            newSelected.add(p.id);
        } else {
            newSelected.delete(p.id);
        }
    });

    reference.setState({$selectedIds: newSelected});
};

/**
 * 获取目录的选中状态
 * @returns {string} 'checked' | 'indeterminate' | 'unchecked'
 */
const getDirCheckState = (directory, selectedIds) => {
    const children = directory.children || [];
    if (children.length === 0) return 'unchecked';

    const selectedCount = children.filter(c => selectedIds.has(c.permId)).length;

    if (selectedCount === 0) return 'unchecked';
    if (selectedCount === children.length) return 'checked';
    return 'indeterminate';
};

/**
 * 获取类型的选中状态
 * @returns {string} 'checked' | 'indeterminate' | 'unchecked'
 */
const getTypeCheckState = (type, selectedIds) => {
    const directories = type.children || [];
    if (directories.length === 0) return 'unchecked';

    let allChecked = true;
    let anyChecked = false;

    for (const dir of directories) {
        const state = getDirCheckState(dir, selectedIds);
        if (state !== 'checked') allChecked = false;
        if (state !== 'unchecked') anyChecked = true;
    }

    if (allChecked) return 'checked';
    if (anyChecked) return 'indeterminate';
    return 'unchecked';
};

/**
 * 保存配置
 */
const $opSave = (reference) => {
    const {$inited = {}} = reference.props;
    const {data = {}} = $inited;
    const roleId = data.key || data.id;
    const {$selectedIds} = reference.state;

    // 构建保存数据
    const payload = {
        data: Array.from($selectedIds).map(permId => ({
            permId,
            roleId
        }))
    };

    // 获取i18n资源
    const i18n = Ux.fromHoc(reference, "resourcePerm") || {};

    Ux.ajaxPut(`/api/permission/role/${roleId}`, payload)
        .then(response => {
            const state = {};
            state.$rolePerms = response?.data || [];
            state.$originalPerms = Ux.clone(response?.data || []);
            reference.setState(state);
            // 显示成功提示
            Ux.messageSuccess(i18n.saveSuccess || "资源权限保存成功");
        });
};

/**
 * 重置配置
 */
const $opReset = (reference) => () => {
    const {$originalPerms} = reference.state;
    const selectedIds = new Set(
        ($originalPerms || []).map(p => p.permId)
    );
    reference.setState({
        $selectedIds: selectedIds,
        $rolePerms: Ux.clone($originalPerms)
    });
};

/**
 * 加载权限的操作列表
 */
const $opLoadActions = (permissionId) => {
    return Ux.ajaxGet(`/api/action/by/perm/${permissionId}`);
};

export default {
    $opInit,
    $opSelect,
    $opSelectDir,
    $opSelectType,
    $opSave,
    $opReset,
    buildPermTrees,
    getDirCheckState,
    getTypeCheckState,
    $opLoadActions,
};