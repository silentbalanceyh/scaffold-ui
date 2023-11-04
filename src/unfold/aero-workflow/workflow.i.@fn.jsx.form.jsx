import phaseFn from './cell.form.__.@fn.phase';
import monitorHistoryFn from './cell.form.__.@fn.monitor.history';
import monitorBpmnFn from './cell.form.__.@fn.monitor.bpmn';

import monitorApprFn from './cell.form.__.@fn.monitor.appr';
import monitorFileFn from './cell.form.__.@fn.monitor.file';

import __JSX from './cell.__.fn.jsx.fn.same';
import linkageAttachmentFn from './cell.form.__.@fn.linkage.attachment';
// eslint-disable-next-line import/no-anonymous-default-export
export default (reference) => {
    /*
     * 将原始的代码改成动态扩展 renders，直接提取工作流配置
     * state 中的 $workflow.config.linkage /
     * 构造对应的 $renders
     */
    const configW = reference.state?.$workflow;
    if(!configW){
        // 工作流未加载完成，直接不配置任何渲染器
        return {};
    }
    const renders = {
        __children: {
            phase: phaseFn(reference),


            // 操作历史专用字段
            monitorHistory: monitorHistoryFn(reference),
            // 流程图专用字段
            monitorBpmn: monitorBpmnFn(reference),


            // 意见流 / 文件流
            monitorAppr: monitorApprFn(reference),
            monitorFile: monitorFileFn(reference),

            /*
             * 旧代码：
             * 关联工单：linkageTicket: linkageTicketFn(reference),
             * 关联资产：linkageAsset: linkageAssetFn(reference),
             * 关联员工：linkageEmployee: linkageEmployeeFn(reference),
             */
            linkageAttachment: linkageAttachmentFn(reference),
        }
    }


    // 动态扩展关联面板
    const { linkage = {}, ui = {}} = configW.config ? configW.config : {};
    const linkageFields = ui.linkage ? ui.linkage : [];
    Object.keys(linkage)
        .filter(field => linkageFields.includes(field))
        /**
         * 新版本关联设置修改成动态注入 $renders 的模式修订成动态模式
         * 1. 基础配置来自于 $workflow.config.linkage
         * 2. 表单可用关联配置来自于 $workflow.ui.linkage
         *
         * 基本数据结构
         * {
         *     "linkageAsset": {} // 资产管理
         *     "linkageTicket": {} // 工单管理
         *     "linkageEmployee": {} // 员工管理
         * }
         * 过滤条件 -> $workflow.ui.linkage = []
         * 直接根据 $workflow.ui.linkage 字段中的值执行过滤，完成动态注入过程
         */
        .forEach(field => renders.__children[field] = __JSX.jsxLinkageFn(reference, field))
    return renders;
}