import Ux from 'ux';
import Ex from 'ex';
import FormAdd from "./form/UI.Add";
import FormEdit from "./form/UI.Edit";
import FormFilter from "./form/UI.Filter";

const rxSelect = (reference) => (selected = {}) => {
    /*
     * 设置 $query 专用
     */
    if (!Ux.isEmpty(selected)) {
        const {$query = {}} = reference.state;
        if (!$query.criteria) $query.criteria = {};
        /*
         * 双条件合并，大于0的时候需要取新条件
         */
        if (0 < Object.keys($query.criteria).length) {
            $query.criteria[''] = true;
        }
        $query.criteria['type,='] = selected.code;
        /*
         * 更新
         */
        Ux.activeSearch();
        // reference.?etState({
        //     $query: Ux.clone($query),   // 拷贝触发条件的变更
        //     $type: selected.code,       // 类型选择
        //     $selected: true
        // })
        Ux.of(reference).in({
            $query: Ux.clone($query),   // 拷贝触发条件的变更
            $type: selected.code,       // 类型选择
            $selected: true
        }).done();
    }
};
const yiPage = (reference) => {
    const state = {};
    const config = Ux.fromHoc(reference, "grid");
    const $query = Ux.cabQuery(reference);
    if ($query) {
        state.$query = $query;
    }
    state.$selected = false;
    state.$config = Ux.clone(config);
    Ex.yiStandard(reference, state).then(Ux.pipe(reference))
};
const yoSider = (reference) => {
    const siderAttrs = Ex.yoAmbient(reference);
    siderAttrs.rxSelect = rxSelect(reference);
    return siderAttrs;
};
const yoList = (reference) => {
    const listAttrs = Ex.yoAmbient(reference);
    const {$query = {}, $config = {}} = reference.state;
    /*
     * 查询条件：重要
     */
    listAttrs.$query = Ux.clone($query);
    listAttrs.config = $config;
    listAttrs.$form = {
        FormAdd,    // 添加表单
        FormEdit,   // 更新表单
        FormFilter  // 搜索表单
    };
    listAttrs.rxPostOpen = Ex.rxPostOpen(reference);
    listAttrs.rxPostClose = Ex.rxPostClose(reference);
    const $options = {};
    const module = Ux.fromHoc(reference, "module");
    if (module && module.options) {
        Object.assign($options, module.options);
    }
    listAttrs.$options = $options;
    return listAttrs;
};
export default {
    yiPage,
    yoSider,
    yoList,
}