import __Zn from './zero.module.dependency';
import __Pre from './form.__.fn.pre.process';
const toForm = (staticForm = {}, dynamicForm = {}) => {
    /*
     * form：输入的 form
     * dynamicForm：动态输入的 form
     * 1）执行 ui 的合并
     * 2）执行 hidden 的合并
     * 3）执行 initial 的合并
     * 4）执行 op 的合并
     * 5）执行 mapping 的合并
     * 6）执行 io 的合并
     * 7）执行 modal 的合并
     * 8）执行 assist 的合并
     *
     * 唯一不执行合并的是 as / segment
     * 最新版本中引入了 io 部分的合并，io包括：
     * 1）reader：读取数据时执行的转换，修改 $inited 数据
     * 2）writer：提交数据（验证之前）的转换，修改 request 数据
     */
    // 先执行拷贝
    const form = staticForm ? __Zn.clone(staticForm) : {};
    /*
     * 动态中的属性优先
     */
    const {
        ui = [],
        hidden = [],
        initial = {},
        mapping = {},
        io = {},
        modal = {},
        assist = {},
        combiner = {},
        ...rest
    } = dynamicForm;
    if (!__Zn.isEmpty(rest)) {
        Object.assign(form, rest);
    }
    /*
     * 合并 ui 项
     */
    if (__Zn.isArray(ui) && 0 < ui.length) {
        if (!form.ui) form.ui = [];
        form.ui = [].concat(form.ui, ui);
    }
    if (__Zn.isArray(hidden) && 0 < hidden.length) {
        if (!form.hidden) form.hidden = [];      // 防止原生未配置
        form.hidden = [].concat(form.hidden, hidden);
    }
    /*
     * - assist
     * - initial
     * - mapping
     * - io
     * - modal
     */
    if (__Zn.isNotEmpty(assist)) {
        if (!form.assist) form.assist = {};
        Object.assign(form.assist, assist);
    }
    if (__Zn.isNotEmpty(initial)) {
        if (!form.initial) form.initial = {};
        Object.assign(form.initial, initial);
    }
    if (__Zn.isNotEmpty(mapping)) {
        if (!form.mapping) form.mapping = {};
        Object.assign(form.mapping, mapping);
    }
    if (__Zn.isNotEmpty(io)) {
        if (!form.io) form.io = {};
        Object.assign(form.io, io);
    }
    if (__Zn.isNotEmpty(modal)) {
        if (!form.modal) form.modal = {};
        // Assign 必须这样处理
        form.modal = __Zn.assign(form.modal, modal, 2);
    }
    if (__Zn.isNotEmpty(combiner)){
        if (!form.combiner) form.combiner = {};
        Object.assign(form.combiner, combiner);
    }
    return form;
};
const toFormUi = (ui = [], configuration = {}) => {
    // ui迭代
    if (__Zn.isArray(ui)) {
        const uiNorm = __Pre.preToUi(ui, configuration);
        const uiAfter = [];
        uiNorm.forEach(row => {
            const uiRow = [];
            if (__Zn.isArray(row)) {
                // row 必须也是数组
                row.forEach((cell, cellIndex) => {
                    // 查看 cell 是否 complex 类型
                    if (cell.complex) {
                        // 复杂表单处理流程
                        const cellAdd = __Pre.preToComplex(cell, configuration, toFormUi);
                        if(cellAdd) {
                            uiRow.push(cellAdd);
                        }
                    } else {
                        // 直接执行 segment 部分注入
                        const uiPending = __Pre.preToSegment(cell, configuration);
                        if(__Zn.isArray(uiPending)) {
                            uiPending.forEach(row => uiAfter.push(row));
                        }else{
                            uiRow.push(uiPending)
                        }
                    }
                })
            } else if ("string" === typeof row) {
                // Row 行连接
                const uiPending = __Pre.preToSegment(row, configuration);
                if(__Zn.isArray(uiPending)) {
                    uiPending.forEach(row => uiAfter.push(row));
                }else{
                    uiRow.push(uiPending)
                }
            }
            if(0 < uiRow.length){
                uiAfter.push(uiRow);
            }
        });
        return uiAfter;
    } else {
        console.error("数据格式非法", ui)
        return [];
    }
}
export default {
    toForm,
    toFormUi,
}