import Ux from 'ux';

/**
 * 初始化菜单权限数据
 * $loading = true 开始加载
 * $loading = false 加载完成
 */
const $opInit = (reference) => {
    const {$inited = {}} = reference.props;
    const {data = {}} = $inited;
    const roleId = data.key || data.id;

    // 检查 roleId 是否有效
    if (!roleId) {
        reference.setState({$loading: false, $menus: [], $menuTrees: []});
        return;
    }

    // 开始加载
    reference.setState({$loading: true});

    // Step 1: 获取资源ID
    Ux.ajaxPost("/api/resource/by-action", {
        method: "GET",
        uri: "/api/menus"
    }).then(resource => {
        if (!resource || !resource.resourceId) {
            reference.setState({$loading: false, $menus: [], $menuTrees: []});
            return;
        }

        const resourceId = resource.resourceId;

        // Step 2 & 3: 并行获取菜单和角色配置
        return Ux.parallel([
            Ux.ajaxGet("/api/acl-menus"),
            Ux.ajaxGet(`/api/acl/role-view/${roleId}/${resourceId}`)
        ]).then(([menus, roleConfig]) => {
            const state = {};
            state.$resourceId = resourceId;
            state.$menus = menus || [];
            state.$roleConfig = roleConfig || {};
            state.$originalConfig = Ux.clone(roleConfig);
            state.$loading = false;

            // 构建选中状态
            const selectedNames = new Set(
                (roleConfig && roleConfig.rows && roleConfig.rows.name) || []
            );
            state.$selectedNames = selectedNames;

            // 构建菜单树
            state.$menuTrees = buildMenuTrees(menus || []);
            reference.setState(state);
        });
    }).catch(() => {
        reference.setState({
            $loading: false,
            $menus: [],
            $menuTrees: []
        });
    });
};

/**
 * 构建菜单树结构（按type分组）
 * EXTRA-MENU 忽略 parentId，所有 EXTRA-MENU 合并成一颗树（虚拟根节点）
 * TOP-MENU 忽略 parentId，所有 TOP-MENU 合并成一颗树（虚拟根节点）
 * BAG-MENU 作为根节点（parentId = null）
 * SIDE-MENU / NAV-MENU 等按 parentId 挂载
 */
const buildMenuTrees = (menus) => {
    // 按 parentId 分组
    const childrenMap = new Map();

    // BAG-MENU 作为根节点
    const bagMenus = [];

    // EXTRA-MENU 和 TOP-MENU 忽略 parentId
    const extraMenus = [];
    const topMenus = [];

    menus.forEach(menu => {
        const type = menu.type;
        const parentId = menu.parentId;

        if (type === 'EXTRA-MENU') {
            extraMenus.push(menu);
        } else if (type === 'TOP-MENU') {
            topMenus.push(menu);
        } else if (type === 'BAG-MENU') {
            // BAG-MENU 作为根节点（parentId = null）
            if (!parentId) {
                bagMenus.push(menu);
            }
        } else {
            // 所有其他类型按 parentId 分组
            if (!childrenMap.has(parentId)) {
                childrenMap.set(parentId, []);
            }
            childrenMap.get(parentId).push(menu);
        }
    });

    // 递归构建树
    const buildTree = (menu) => {
        const children = childrenMap.get(menu.id) || [];
        return {
            ...menu,
            children: children.map(buildTree).sort((a, b) => (a.order || 0) - (b.order || 0))
        };
    };

    // 按type顺序构建树列表
    const trees = [];

    // EXTRA-MENU 忽略 parentId，合并成一颗树（虚拟根节点）
    if (extraMenus.length > 0) {
        extraMenus.sort((a, b) => (a.order || 0) - (b.order || 0));
        trees.push({
            id: 'extra-menu-root',
            type: 'EXTRA-MENU',
            text: '扩展菜单',
            name: 'EXTRA-MENU-ROOT',
            virtual: true,
            children: extraMenus.map(menu => ({...menu, children: []}))
        });
    }

    // TOP-MENU 忽略 parentId，合并成一颗树（虚拟根节点）
    if (topMenus.length > 0) {
        topMenus.sort((a, b) => (a.order || 0) - (b.order || 0));
        trees.push({
            id: 'top-menu-root',
            type: 'TOP-MENU',
            text: '顶部菜单',
            name: 'TOP-MENU-ROOT',
            virtual: true,
            children: topMenus.map(menu => ({...menu, children: []}))
        });
    }

    // BAG-MENU 作为根节点
    bagMenus.sort((a, b) => (a.order || 0) - (b.order || 0)).forEach(menu => {
        trees.push(buildTree(menu));
    });

    return trees;
};

/**
 * 获取菜单类型的emoji标记（用于Card标题）
 */
const getTypeEmoji = (type) => {
    const emojiMap = {
        'EXTRA-MENU': '🔧',
        'TOP-MENU': '🔝',
        'SC-MENU': '⚙️',
        'SIDE-MENU': '📋',
        'BAG-MENU': '📦',
        'NAV-MENU': '⚡',
        'NAV_MENU': '⚡',
        'MENU': '📁',
    };
    return emojiMap[type] || '📄';
};

/**
 * 获取菜单类型的显示名称（作为备选标题）
 */
const getTypeTitle = (type) => {
    const titleMap = {
        'EXTRA-MENU': '扩展菜单',
        'TOP-MENU': '顶部菜单',
        'SC-MENU': '服务台',
        'SIDE-MENU': '侧边菜单',
        'BAG-MENU': '收纳菜单',
        'NAV-MENU': '快捷方式',
        'NAV_MENU': '快捷方式',
        'MENU': '菜单',
    };
    return titleMap[type] || '其他菜单';
};

/**
 * 递归获取所有子菜单name
 */
const getAllChildNames = (menu) => {
    const names = [menu.name];
    if (menu.children && menu.children.length > 0) {
        menu.children.forEach(child => {
            names.push(...getAllChildNames(child));
        });
    }
    return names;
};

/**
 * 检查菜单的选中状态
 * @returns {boolean} 'checked' | 'indeterminate' | 'unchecked'
 */
const getCheckState = (menu, selectedNames) => {
    const childNames = getAllChildNames(menu);
    const selectedCount = childNames.filter(name => selectedNames.has(name)).length;

    if (selectedCount === 0) {
        // @ts-ignore
        return 'unchecked';
    } else if (selectedCount === childNames.length) {
        // @ts-ignore
        return 'checked';
    } else {
        // @ts-ignore
        return 'indeterminate';
    }
};

/**
 * 处理菜单选择变更
 */
const $opSelect = (reference) => (menu, checked) => {
    const {$selectedNames} = reference.state;
    const newSelected = new Set($selectedNames);
    const childNames = getAllChildNames(menu);

    if (checked) {
        // 选中菜单及其所有子菜单
        childNames.forEach(name => newSelected.add(name));
        // 同时选中所有祖先菜单
        selectAncestors(reference, menu, newSelected, true);
    } else {
        // 取消选中菜单及其所有子菜单
        childNames.forEach(name => newSelected.delete(name));
        // 更新祖先菜单状态
        selectAncestors(reference, menu, newSelected, false);
    }

    reference.setState({$selectedNames: newSelected});
};

/**
 * 选择/更新祖先菜单状态
 * BAG-MENU 特殊处理：只要子节点有一个被选中，就包含 BAG-MENU
 */
const selectAncestors = (reference, menu, selectedNames, isChecked) => {
    const {$menus} = reference.state;
    const menuMap = new Map($menus.map(m => [m.id, m]));

    const updateParent = (currentMenu) => {
        const parent = menuMap.get(currentMenu.parentId);
        if (parent) {
            if (isChecked) {
                // BAG-MENU 特殊处理：只要有一个子节点被选中，就选中 BAG-MENU
                if (parent.type === 'BAG-MENU') {
                    selectedNames.add(parent.name);
                } else {
                    // 其他类型：检查是否所有兄弟都被选中
                    const siblings = $menus.filter(m => m.parentId === parent.id);
                    const siblingNames = siblings.flatMap(s => getAllChildNames(s));
                    const allSiblingsSelected = siblingNames.every(name => selectedNames.has(name));
                    if (allSiblingsSelected) {
                        selectedNames.add(parent.name);
                    }
                }
            } else {
                // 取消选中父菜单
                selectedNames.delete(parent.name);
            }
            updateParent(parent);
        }
    };

    updateParent(menu);
};

/**
 * 收集所有父菜单的 name（递归向上）
 */
const collectParentNames = (menu, $menus) => {
    const parentNames = [];
    const menuMap = new Map($menus.map(m => [m.id, m]));

    const findParent = (currentMenu) => {
        const parent = menuMap.get(currentMenu.parentId);
        if (parent) {
            parentNames.push(parent.name);
            findParent(parent);
        }
    };

    findParent(menu);
    return parentNames;
};

/**
 * 检查父菜单是否应该被移除（所有子节点都未选中）
 */
const shouldRemoveParent = (parent, $menus, selectedNames) => {
    const children = $menus.filter(m => m.parentId === parent.id);
    if (children.length === 0) {
        return !selectedNames.has(parent.name);
    }
    // 检查是否所有子节点都未选中
    const allChildrenUnselected = children.every(child => {
        return !selectedNames.has(child.name) && shouldRemoveParent(child, $menus, selectedNames);
    });
    return allChildrenUnselected;
};

/**
 * 清理无效的父菜单（子节点都未选中的父菜单）
 */
const cleanInvalidParents = (selectedNames, $menus) => {
    const cleanedNames = new Set(selectedNames);

    // 找出所有父菜单
    const parentMenus = $menus.filter(m => m.parentId);

    parentMenus.forEach(menu => {
        if (cleanedNames.has(menu.name)) {
            // 检查该菜单的子节点是否有被选中的
            const children = $menus.filter(m => m.parentId === menu.id);
            const hasSelectedChild = children.some(child => cleanedNames.has(child.name));

            // 如果没有子节点被选中，移除该父菜单
            if (!hasSelectedChild && children.length > 0) {
                cleanedNames.delete(menu.name);
            }
        }
    });

    return cleanedNames;
};

/**
 * 保存配置
 * 提交前收集所有父菜单的 name
 */
const $opSave = (reference) => {
    const {$inited = {}} = reference.props;
    const {data = {}} = $inited;
    const roleId = data.key || data.id;
    const {$resourceId, $selectedNames, $roleConfig, $menus} = reference.state;

    // 收集所有父菜单的 name
    const finalNames = new Set($selectedNames);
    $selectedNames.forEach(name => {
        const menu = $menus.find(m => m.name === name);
        if (menu) {
            const parentNames = collectParentNames(menu, $menus);
            parentNames.forEach(pName => finalNames.add(pName));
        }
    });

    // 清理无效的父菜单（子节点都未选中）
    const cleanedNames = cleanInvalidParents(finalNames, $menus);

    const payload = {
        ...$roleConfig,
        rows: {
            name: Array.from(cleanedNames)
        }
    };

    // 获取i18n资源
    const i18n = Ux.fromHoc(reference, "menuPerm") || {};

    Ux.ajaxPut(`/api/acl/role-view/${roleId}/${$resourceId}`, payload)
        .then(response => {
            const state = {};
            state.$roleConfig = response;
            state.$originalConfig = Ux.clone(response);
            state.$selectedNames = cleanedNames; // 更新选中状态
            reference.setState(state);
            // 显示成功提示
            Ux.messageSuccess(i18n.saveSuccess || "菜单权限保存成功");
        });
};

/**
 * 重置配置
 */
const $opReset = (reference) => () => {
    const {$originalConfig} = reference.state;
    const selectedNames = new Set(
        ($originalConfig.rows && $originalConfig.rows.name) || []
    );
    reference.setState({
        $selectedNames: selectedNames,
        $roleConfig: Ux.clone($originalConfig)
    });
};

export default {
    $opInit,
    $opSelect,
    $opSave,
    $opReset,
    buildMenuTrees,
    getTypeEmoji,
    getTypeTitle,
    getCheckState,
    getAllChildNames
};