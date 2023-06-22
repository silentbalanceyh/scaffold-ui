import Ui from "ui";
import Ex from 'ex';
import Ux from 'ux';
/*
 * 配置全格式
 * {
 *      "ns": "名空间对应Cab.json文件"
 * }
 */
export default Ui.smartList({
    ns: require("./Cab.json"),
    name: "Integration.SMS",
    logger: "toolkit",
    Options: {
        rm: [
            "form.filter",      // 关闭高级搜索表单
            "op.extra.export",  // 按钮：导出
            "op.extra.import",  // 按钮：导入
            "op.batch.delete",  // 按钮：批量删除
            "op.batch.edit",    // 按钮：批量编辑
        ]
    },
    Form: {
        name: "FormSms",
        yoOp: {
            A: "/api/i-integration",
            S: "/api/i-integration/:key",
            D: "/api/i-integration/:key"
        }
    },
    componentInit: (reference) => {
        Ex.yiAssist(reference, {})
            .then(Ux.ready).then(Ux.pipe(reference))
    }
})