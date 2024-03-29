import Ui from "ui";
import {FTransView} from 'ei';
import Ex from 'ex';
import Ux from "ux";
export default Ui.smartList({
    ns: require("./Cab.json"),
    name: "PxTransaction",
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
        name: "FTransView",
        FormEdit: FTransView
    },

    componentInit: (reference) => {
        Ex.yiAssist(reference)
            .then(Ux.ready)
            .then(Ux.pipe(reference));
    }
})