import Ux from 'ux';
import __Zn from './zero.module.dependency';

/**
 * ## 「扩展」 `Ex.buildApps`
 *
 * ### 1. 基本介绍
 * 根据应用列表构造首页应用清单，此应用清单主要用于渲染首页应用列表。ExApps 组件专用，新版本中引入了租户信息，此处会直接根据租户ID（登录账号）
 * 返回对应的应用列表：`GET /api/apps/usable` 提取完整应用清单。
 *
 * ### 2. 可用应用计算法则
 * 可用应用计算法则有几处来源：
 *
 * - 从远程的 X_APP 中提取应用列表：`GET /api/apps/usable`，读取到一个完整的 Array，作为参数传入。
 * - 根据配置信息的提取，读取 bags，`B_BAG` 中的基础数据信息，有多少 Bag 表示有多少应用基础配置，无 `B_BAG` 记录的直接略。
 * - 根据上述条件计算入口菜单，若没有入口菜单则证明没有安装此应用，也直接过滤。
 *
 * 三合一的方式计算出最终的应用清单放在首页的应用列表中，且可以直接跳转，跳转的效果和左上角的跳转维持一致。
 *
 * @memberOf module:yi/unfold
 * @param reference 当前组件引用
 * @param apps 从远程读取的可用应用列表
 */
const buildApps = (apps = [], reference) => {
    const {$menus} = reference.props;
    const menuData = $menus.to();
    // 先根据 entryId 以及 apps 中的 entry 计算菜单信息
    const menuEntry = menuData.filter(item => {
        const found = Ux.elementUnique(apps, 'entry', item.name);
        return !!found;
    });
    const menuWith = __Zn.a4MenuData(menuEntry);
    const appRet = [];
    apps.forEach(app => {
        const found = Ux.elementUnique(menuWith, 'name', app.entry);
        if (found) {
            // 拷贝 app
            const appItem = Ux.clone(found);
            // 设置 menu
            appItem.app = Ux.clone(app);
            appItem.appName = app.name;
            appRet.push(appItem);
        }
    })
    return appRet.sort(Ux.sorterAscTFn('order'));
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    buildApps
}