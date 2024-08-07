declare module "ei" {
    export {default as ExAccount} from './ExAccount/UI';                    /* （账号信息）用户数据（左边专用的用户基本信息） */
    export {default as ExAdmin} from './ExAdmin/UI';                        /* （管理员模板） ----- ExAdmin 模板专用 */
    export {default as ExAuthority} from './ExAuthority/UI';                /*  权限管理主界面 */
    export {default as ExApps} from './ExApps/UI';                          /* （Dashboard专用）*/
    export {default as ExArbor} from './ExArbor/UI';                        /* （通用树）左边的树形结构 */
    export {default as ExCategory} from './ExCategory/UI';                  /* （Category专用）分类管理 */
    export {default as ExDeploy} from './ExDeploy/UI';
    export {default as ExForm} from './ExForm/UI';                          /* （通用表单）*/
    export {default as ExGraphicEditor} from './ExGraphicEditor/UI';        /* 拓扑图编辑器 */
    export {default as ExGraphicViewer} from './ExGraphicViewer/UI';        /* 拓扑图查看器 */
    export {default as ExHistory} from './ExHistory/UI';                    /* （通用历史记录）X_ACTIVITY / X_ACTIVITY_CHANGE */
    export {default as ExListComplex} from './ExListComplex/UI';            // 复杂列表
    export {default as ExListFast} from './ExListFast/UI';                  // 全窗口操作列表
    // export {default as ExListQuery} from './ExListQuery/UI';                // 简单结果呈现列表
    export {default as ExRecord} from './ExRecord/UI';                      /*  UI_FORM / Record 合并到一起（动态表单） */
    export {default as ExRegiment} from './ExRegiment/UI';                  /* （通用选择器）搜索、选择、多选、反选专用面板 */
    export {default as ExRelation} from './ExRelation/UI';
    export {default as ExService} from './ExService/UI';                    /* SubForm 专用组件（子表单，本身不带表单结构） */
    export {default as ExSubmit} from './ExSubmit/UI';
    export {default as ExTab} from './ExTab/UI';                            /* （通用页签）原始版本的 auiTab */
    export {default as ExTag} from './ExTag/UI';
    export {default as ExTabular} from './ExTabular/UI';                    /* （Tabular专用）字典管理 */
    export {default as ExTrackField} from './ExTrackField/UI';
    export {default as ExWizard} from './ExWizard/UI';                      /* 双表单依赖搜索专用 */
    export {default as ExAnnounce} from './ExAnnounce/UI';                  /* 公告 */
    export {default as ExAnnounceView} from './ExAnnounceView/UI';          /* 公告详情 */
    
    // 登录专用
    export {default as ExLogin} from './ExLogin/UI';                        /* 无验证码登录入口 */
    export {default as ExLoginBuiltIn} from './ExLoginBuiltIn/UI';          /* 验证码登录 */
    export {default as ExLoginWechat} from './ExLoginWechat/UI';            /* 微信登录 */
    export {default as ExLoginSms} from './ExLoginSms/UI';                  /* 短信登录 */
    export {default as ExLoginComplex} from './ExLoginComplex/UI';          /* 3合一入口，根据配置提取 */

    // 模板专用方法
    export {default as ExLogged} from './ExLogged/UI';

    // 工作流专用（标准化）
    export {default as TxPortal} from './TxPortal/UI';                      /* 流程入口（服务目录）*/
    export {default as TxPage} from './TxPage/UI';                          /* 流程专用页面容器 */

    export {default as TxQRun} from './TxQRun/UI';                          /* 待办队列 */
    export {default as TxQDone} from './TxQDone/UI';                        /* 完成队列 */

    export {default as TxOpen} from './TxOpen/UI';                          /* 开单页面 */
    export {default as TxObserve} from './TxObserve/UI';                    /* 审批页面 */
    export {default as TxOverview} from './TxOverview/UI';                  /* 历史页面 */


    // 个人界面
    export {default as MyMenu} from './MyMenu/UI';
    export {default as MyTodo} from './MyTodo/UI';                          /* 首页：我的待办 */


    // G2图
    export {default as G2Bar} from './G2Bar/UI';
    export {default as G2Pie} from './G2Pie/UI';
    export {default as G2Line} from './G2Line/UI';
    export {default as G2Broken} from './G2Broken/UI';
    export {default as G2MoreLine} from './G2MoreLine/UI';


    // 账务部分
    export {default as FBookView} from './FBookView/UI';                // 账本详情，带账单明细
    export {default as FBookList} from './FBookList/UI';                // 账本列表（订单中查看）
    export {default as FSettleForm} from './FSettleForm/UI';            // 待结算单
    export {default as FDebtForm} from './FDebtForm/UI';                // 待处理应收
    export {default as FTransView} from './FTransView/UI';              // 交易历史详情


    // 开发中心
    export {default as DxAdmin} from './DxAdmin/UI';                      // 开发专用模板


    // 内置交互式开发
    export {default as IxDatabase} from './IxDatabase/UI';              // 数据库配置
}
