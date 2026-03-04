import Ux from 'ux';
import __Rv from './allocation.__.fn.resolve.navigation';
import __Zk from "./allocation.__.fn.seek.uri";
/*
 * 状态管理器，用于管理核心页面位置专用
 */

const yiOpenState = (menuData: any, reference: any) => {
    const {$router} = reference.props;
    const state: any = {};
    state.$keyOpen = __Rv.resolveOpen($router.path(), menuData, reference);
    const side = __Rv.resolveSide($router.path(), menuData, reference);
    if (side) {
        state.$keyActive = side.key;
    }
    return state;
}

const goPageAfter = (item: any = {}, reference: any) => {
    const {$menuData = []} = reference.state ? reference.state : {};
    const menuTop = $menuData
        .filter(each => each.parentId === item.key)
        .filter(each => Ux.Env.MENU_TYPE.SIDE === each.type)
        .sort(Ux.sorterAscTFn("order"));
    if (0 < menuTop.length) {
        const menuActive = menuTop[0];
        return menuActive.key;
    }
}

const goPagePre = (item: any = {}) => {
    Ux.Session.putDirect(Ux.Env.PAGE_AT, item.key);

    Ux.Session.putDirect(Ux.Env.PAGE_APP, item.appId);
}

export class _Locator {
    private readonly _reference: any;
    private readonly _refState: any;
    private readonly _refProp: any;

    static create(reference: any): _Locator {
        return new _Locator(reference);
    }

    private constructor(reference: any) {
        this._reference = reference;
        this._refState = reference.state ? reference.state : {};
        this._refProp = reference.props ? reference.props : {};
    }

    // ----------------- 初始化 ------------------
    public yiOpen(menuData = []) {
        /*
         * 初始化时只处理 $keyOpen 即可
         * 1）非内页，$keyOpen 只包含顶部菜单（刷新会消失）
         * 2）内页，$keyOpen 包含顶部和左侧打开菜单
         */
        return yiOpenState(menuData, this._reference);
    }

    // ----------------- 路由执行 ------------------
    public goOpen(keys = []) {
        Ux.of(this._reference).in({
            $keyOpen: keys
        }).done();
        // this._reference.?etState({$keyOpen: keys});
    }

    public goActive(item) {
        Ux.of(this._reference).in({
            $keyActive: item.key
        }).done();
    }

    public goPage(data: any = {}, state: any = {}) {
        // Ux.Session.putDirect(Ux.Env.LOCATE_PAGE, data.key);
        if (Ux.Env.VALUE.MENU_EXPAND !== data.uri) {
            goPagePre(data);
            // 设置路由对应页信息
            const {$keyOpen = []} = this._reference.state ? this._reference.state : {};
            state._opens = $keyOpen;
            // 此处根据 data.uri 执行计算
            Ux.toRoute(this._reference, data.uri, state);
        }
    }

    public goApp(item: any = {}) {
        /*
         * 选择应用防止二义性方法发生，在执行时做后期保证，
         * resolveSide 的最终结果会检索查询到的 APP 方法是否匹配
         * 如果不匹配则执行另外的方法
         * 1）点击 App 生成 App Key
         * 2）然后点击 Item 时检查 App Key是否符合，如果不符合则重新检索
         */
        goPagePre(item);

        Ux.toRoute(this._reference, item.uri);
    }

    public goHome() {
        const {$menuData} = this._refState;

        const page = __Zk.seekUri(Ux.Env.ENTRY_ADMIN, $menuData, this._reference);

        if (page) {
            goPagePre(page);

            Ux.toRoute(this._reference, Ux.Env.ENTRY_ADMIN);

            const $keyActive = goPageAfter(page, this._reference);

            Ux.of(this._reference).in({$keyActive}).done();
        } else {
            console.error(`[TS-VI] 不满足跳转主页的条件`);
        }
    }

    // ----------------- 渲染用 ------------------

    public keyPage(): String {
        const {$menuData} = this._refState;
        const {$router} = this._refProp;
        return __Rv.resolvePage($router.path(), $menuData, this._reference).key;
    }

    public keyOpen(): Array<String> {
        // 加载和读取
        const {$setting} = this._refState;
        if ("mix" === $setting.layout) {
            const {$keyOpen = [], $keyActive = false} = this._reference.state ? this._reference.state : {};
            return $keyOpen.concat($keyActive).filter(item => !!item);
        }
        return [];
    }

    // @Resolve
    public yoSider(): Array<any> {
        const menus = this.yoRoutes();
        const {$menuData} = this._refState;
        const {$router} = this._refProp;

        const menuTop = __Rv.resolveSide($router.path(), $menuData, this._reference);

        // 提取子菜单（menus为主菜单）
        const menuSider: any = Ux.elementUnique(menus, 'key', menuTop.key);

        return menuSider && menuSider.children ? menuSider.children : [];
    }

    public yoNav(): Array<any> {
        const keyPage = this.keyPage();
        const {$menuData = []} = this._reference.state ? this._reference.state : {};
        return Ux.elementBranch($menuData, keyPage, 'parentId');
    }

    public yoBag(): any {
        const {$keyActive, $menuData} = this._refState;
        const {$router} = this._refProp;
        // 1. 先检查 menuSide
        const menuTop = __Rv.resolveSide($router.path(), $menuData, this._reference);
        if (!!menuTop) {
            let found = Ux.elementUnique($menuData, 'key', menuTop.parentId);
            if (!!found) {
                return found;
            }
        }
        // 2. 原流程
        // 未选中区域
        if (!$keyActive) {
            return null;
        }
        const menuActive = Ux.elementUnique($menuData, 'key', $keyActive);
        if (!menuActive) {
            return null;
        }
        let found = Ux.elementUnique($menuData, 'key', menuActive.parentId);
        if (!found) {
            return null;
        }
        // 菜单标识首页
        if (Ux.Env.PAGE_HOME === found.name) {
            return null;
        }
        return found;
    }

    // @Resolve
    public yoRoutes(): Array<any> {
        const {$route, $menuData} = this._refState;
        const {$router} = this._refProp;
        const page = __Rv.resolveApp($router.path(), $menuData, this._reference);
        const menuData = $route[page.key];
        // 应用
        return menuData && Ux.isArray(menuData.children)
            ? menuData.children : [];
    }
}