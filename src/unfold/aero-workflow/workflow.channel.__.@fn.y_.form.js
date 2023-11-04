import Ux from "ux";
import __Zn from './zero.workflow.dependency';
import __CFG from './workflow.__.fn.config.norm';
import ioSegment from './workflow.channel.__.@fn.y_.form.segment';

const ioForm = (reference, response = {}, cab = {}) => {
    const {$workflow = {}} = reference.props;
    const formCab = Ux.fromHoc(reference, "form");
    // 全局 io 配置
    const io = __CFG.configUi($workflow, "io");
    // form 中优先级更高
    let form = response.form;
    if (!form.io) {
        form.io = {};
    }
    form.io = Object.assign(io, form.io);
    if (formCab.segment) {
        const segment = Ux.clone(formCab.segment);
        form.segment = Object.assign(segment, form.segment);
    }
    // ioSegment
    form = ioSegment(reference, form, cab);
    // 替换原始的 form
    response.form = form;
    return response;
}

const ioAction = (state = {}) => {
    const params = {};
    const {$workflow = {}} = state;
    params.workflow = $workflow['definitionKey'];
    params.type = "FLOW";
    params.node = $workflow.task;
    return Ux.ajaxPost(`/api/ui/ops?view=${Ux.toVis(params.node, params.workflow)}`, params).then(processed => {
        state.$permit = __Zn.Flow.DEFAULT.concat(processed.map(op => op.clientId));
        return Ux.promise(state);
    })
}

export default (reference) => ({
    /*
         * 「表单」初始化表单专用，表单组成：
         * 1. 前端基本表单
         * 2. 后端 formW（核心业务部分）
         * 3. 前端分派部分
         * 4. 图 / 执行详情
         */
    yiForm: (state = {}, pre = false, cab = {}) => {
        const {$workflow = {}} = reference.props;
        const request = Ux.clone($workflow);
        request.pre = pre;
        if (!pre) {
            // 按实例读取数据
            const {$inited = {}} = reference.props;
            request.instanceId = $inited['flowInstanceId'];
        }
        return Ux.ajaxPost("/api/up/flow-form/:pre", request).then(response => {

            // 响应拷贝
            let $response = Ux.clone(response);

            // 修改 form
            /*
             * Form 配置处理
             * 1. ioResource中读取 segment
             * 2. 合并全局的 io 和表单中的 io
             * -- writer
             * -- reader
             */
            $response = ioForm(reference, $response, cab);
            const {$hoc} = reference.state;
            if ($hoc) {
                $hoc.formSave($response.form);
                state.$hoc = $hoc;
            }

            // 修改 workflow
            {
                const {$workflow = {}} = reference.props;

                const workflow = Ux.clone($workflow);
                if ($response.workflow) {
                    Object.assign(workflow, $response.workflow);
                }
                $response.workflow = workflow;
            }
            state.$workflow = $response.workflow;
            return Ux.promise(state);
        }).then(processed => ioAction(processed)).then(processed => {
            const {$workflow = {}} = processed;

            Ux.of(reference).in(state).ready().handle(() => {

                const {rxTaskActive} = reference.props;
                const taskName = $workflow['taskName'];
                if (Ux.isFunction(rxTaskActive)) {
                    // 任务名称换行符
                    rxTaskActive(taskName.replace(/\n/g, ""));
                } else {
                    console.warn("任务名称丢失：", taskName);
                }
            })
            // state.$ready = true;
            // reference.?etState(state);
            //
            // // 修改标题处理
            // const {rxTaskActive} = reference.props;
            // if (Ux.isFunction(rxTaskActive)) {
            //     const taskName = $workflow['taskName'];
            //     rxTaskActive(taskName);
            // }
        })
    },
    /*
     * 「表单」添加，提供默认值
     * {
     *     "type": "流程类型",
     *     "openAt": "开单时间"
     * }
     */
    yoFormOpen: ($workflow = {}) => {
        const $inited = {};


        // 特殊参数
        $inited.type = $workflow.type;
        $inited.openAt = Ux.valueNow();


        // 表单配置
        const form = __Zn.yoForm(reference, null, $inited);
        form.$mode = Ux.Env.FORM_MODE.ADD;


        // 修改显示标签
        const synonym = __CFG.configUi($workflow, "synonym");
        if (Ux.isNotEmpty(synonym)) {
            form.$synonym = synonym;
        }
        return form;
    },
    /*
     * 「表单」编辑，提供值处理，主要处理 record 字段
     * {
     *      "record": {
     *          "field1": "v1",
     *          "field2": "v2"
     *      }
     * }
     * 转换成：
     * {
     *      "record@field1": "v1",
     *      "record@field2": "v2"
     * }
     */
    yoFormObserve: ($workflow = {}) => {
        const {$inited = {}} = reference.props;
        let initialized = Ux.clone($inited);
        if ($inited.record) {
            // 先执行 record 的 initial
            const {record} = $workflow;
            let normalized = Ux.clone($inited.record);
            if (record && record.initial) {
                const executor = reference.props[record.initial];
                if (Ux.isFunction(executor)) {
                    normalized = executor(normalized);
                }
            }
            Ux.remove(initialized, "record");
            Object.keys(normalized).forEach(field => initialized[`record@${field}`] = normalized[field])
        }
        const form = __Zn.yoForm(reference, null, initialized);
        form.$mode = Ux.Env.FORM_MODE.EDIT;
        return form;
    },
})