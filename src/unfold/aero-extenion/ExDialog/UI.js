import React from 'react';
import Op from './Op';
import renderJsx from './Web.jsx'
import __Zn from '../zero.aero.dependency';

const UCA_NAME = "ExDialog";
/**
 * ## 「组件」`ExDialog`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * ### 2. 基础信息
 *
 * React中的props属性
 *
 * ```js
 * {
 *      $app: DataObject - X_APP 应用程序数据,
 *      $router: DataRouter - （react-router）构造对象,
 *      $user: DataArray - 登录的用户基本数据,
 *      fnOut: 专用 redux 写树函数,
 *      config = {
 *          窗口专用配置
 *      },
 *      children = 子组件（直接外层放到子组件中的内容）
 *      $visible = false：当前窗口的显示和隐藏
 *      $submitting = false：当前窗口是否处于提交过程
 * }
 * ```
 *
 *
 * React属性state：
 *
 * ```js
 * {
 *      $visible: "窗口是否隐藏"
 * }
 * ```
 *
 * ### 3.核心
 *
 * 窗口支持两种模式：
 *
 * 1. WINDOW：弹出对话框专用`<Modal/>`
 * 2. POPOVER：浮游对话框专用`<Popover/>`
 *
 *
 * @memberOf module:uca/extension
 * @method *ExDialog
 */
// =====================================================
// componentInit/componentUp
// =====================================================
// const componentInit = (reference) => {
//     const {config = {}} = reference.props;
//     /*
//      * 当前窗口专用配置
//      */
//     const state = {};
//     state.config = config.dialog;
//     Ux.of(reference).in(state).ready().done();
//     // reference.?etState(state);
//     // state.$ready = true;
// };

const componentState = (reference) => {

    const {config = {}} = reference.props;
    /*
     * 当前窗口专用配置
     */
    const state = {};
    state.config = config.dialog;
    state.$ready = true;
    state.$visible = false;
    return state;
}

class Component extends React.PureComponent {
    displayName = UCA_NAME;

    constructor(props) {
        super(props);
        this.state = componentState(this);
    }

    render() {
        return __Zn.yoRender(this, () => {
            const attributes = __Zn.yoAmbient(this);
            /*
             * 按钮形态：按钮或链接
             * 禁用 / 启用 连接
             */
            const {$category = "BUTTON"} = this.props;
            attributes.$category = $category;
            /*
             * 按钮
             */
            const button = Op.yoButton(this);
            /*
             * 窗口
             */
            const dialog = Op.yoDialog(this);
            return renderJsx(this, {
                button,
                dialog,
                attributes
            });
        }, __Zn.parserOfColor(UCA_NAME).type({off: true}));
    }
}

export default Component;