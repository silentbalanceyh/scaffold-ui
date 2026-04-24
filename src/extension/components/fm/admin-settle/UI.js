import Ui from "ui";
import {FSettleForm} from 'ei';
import Ex from 'ex';
import Ux from "ux";


const rxOpen = (reference, keys = []) => {
    // 打开加载效果
    Ux.of(reference).spinning()
        .future(() => Ux.ajaxPost("/api/settlement/batch", {
            $body: keys
            /*
             * debts: [],
             * items: [],
             * settlements: [],
             * transactions: []
             */
        }))
        .then(response => {
            const key = keys[0];
            // Ex.rxTabOpen
            Ex.rxTabOpen(reference)(key, {
                ...response,
                key
            });
        })
}
export default Ui.smartList({
    ns: require("./Cab.json"),
    name: "PxSettlement",
    Options: {
        rm: [
            "form.add",         // 关闭添加表单
            "form.filter",        // 关闭高级搜索表单
            "op.open.add",      // 按钮：添加
            "op.extra.export",  // 按钮：导出
            "op.extra.import",  // 按钮：导入
            "op.batch.edit",      // 按钮：批量编辑
            "op.batch.delete",    // 按钮：批量删除
            "op.submit.add",    // 内页：添加提交
            "op.submit.delete", // 内页：删除提交
            "op.submit.reset",  // 内页：重置
        ]
    },

    Form: {
        name: "FSettleForm",
        FormEdit: FSettleForm
    },

    componentInit: (reference) => {
        Ex.yiAssist(reference).then(state => {
            // 解析 data 字段中的 JSON 字符串
            if (state.$a_fm_term.data) {
                let fmTerm = typeof state.$a_fm_term.data === 'string' ? JSON.parse(state.$a_fm_term.data) : state.$a_fm_term.data;
                // 过滤 fm.term 数据，只保留 P01 的子类（leaf=true 且 code 以 P01. 开头）
                fmTerm = fmTerm.filter(item =>
                    item.leaf && item.code && item.code.startsWith('P01.')
                );
                state.$a_fm_term.data = JSON.stringify(fmTerm);
            }
            return Ux.ready(state);
        }).then(Ux.pipe(reference))
    },
    yoRx: () => ({
        // TODO: 此处要重写
        rxHoriz: (data = {}) => Ex.inSettlement(data)
    }),
    yoOp: () => ({
        // 批量处理
        rxSettleBatch: (ref, config) => (event) => {
            const { $selected = []} = ref.state;
            rxOpen(ref, $selected);
        }
    }),
    yoExecutor: () => ({
        // 行处理
        rxSettle: (key = {},data = {}, metadata = {}) => {
            const ref = metadata.reference;
            rxOpen(ref, [key]);
        }
    })
})