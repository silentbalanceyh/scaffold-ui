// -------------- 更新专用方法 -----------------
import Ux from "ux";
import __Yi from './channel.cm.fn.yi.container.atom';

const yuRouter = (reference, virtualRef, callbackFn) => {
    if (Ux.isFunction(callbackFn)) {
        /*
         * 当前和原始属性
         */
        const prevProps = virtualRef.props;
        const props = reference.props;
        /*
         * 检查 $router 中的数据（特殊点在于 $router 不是 Object类型）
         */
        const $prevRouter = prevProps.$router;
        const $router = props.$router;
        /*
         * 变化 params 时属于 $router 中的变化
         */
        const current = $router.params();
        const original = $prevRouter.params();
        if (Ux.isDiff(current, original)) {
            /*
             * 执行 callback
             */
            Ux.of(reference).readying().handle(() => {

                callbackFn();
            })
            // reference.?etState({$ready: false});
            // callbackFn();
        }
    } else {
        throw new Error("[ ExR ] 请传入 callback 第三参数，第三参数必须是一个合法的函数。");
    }
}
const yuContainer = (reference, virtualRef = {}) => {
    if (Ux.isRoute(reference.props, virtualRef.props)) {
        /*
         * 优化闪屏问题：
         * 当前路由格式为 /:app/:module/:page，所有页面都是静态页面
         * 静态页面之间切换时，不需要重建 Container
         * 页面组件通过自己的 yuRouter 处理路由参数变化
         * 
         * 注：动态页面（/ui/module/page 格式）已废弃，如需恢复请重新添加判断逻辑
         */
        // 不重建 Container，避免闪屏
    }
};
export default {
    yuRouter,
    yuContainer,
}