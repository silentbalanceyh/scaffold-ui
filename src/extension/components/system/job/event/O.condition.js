import Ux from 'ux';

const normalizeType = (type) => "PLAN" === type ? "FORMULA" : type;
const normalizeTypes = (types = []) => types.map(normalizeType);

const onSearch = (reference) => (searchText) => {
    const {$query = {}} = reference.state;
    if (searchText) {
        $query.criteria["$1"] = {
            "name,c": searchText,
            "comment,c": searchText
        };
    } else {
        delete $query.criteria["$1"];
    }
    Ux.of(reference).in({
        $query,
        $condText: searchText,
    }).loading().done();
    // reference.?etState({$query, $condText: searchText, $loading: true});
}
const onRefresh = (reference) => () => {
    const {$query = {}} = reference.state;
    if ($query.criteria) {
        delete $query.criteria['type,i'];
    }
    Ux.of(reference).in({
        $query,
        $condChecked: []
    }).loading().done();
};
// reference.?etState({$loading: true});
const onClean = (reference) => (event) => {
    Ux.prevent(event);
    const {$query = {}, $pagination = {}} = reference.state;
    $query.criteria = {};
    $pagination.current = 1;
    Ux.of(reference).in({

        $query,
        /* 选中控制专用 */
        $condMenu: [], $condText: "", $condChecked: [],
    }).loading().done();
    // reference.?etState({
    //     $query,
    //     /* 选中控制专用 */
    //     $condMenu: [], $condText: "", $condChecked: [],
    //     $loading: true
    // });
}
const onChecked = (reference) => (checked) => {
    const {$query = {}} = reference.state;
    const normalized = normalizeTypes(checked);
    if (0 === normalized.length) {
        // 所有任务
        delete $query.criteria['type,i'];
    } else {
        $query.criteria['type,i'] = normalized;
    }
    Ux.of(reference).in({
        $query,
        $condChecked: normalized
    }).loading().done();
    // reference.?etState({$query, $condChecked: checked, $loading: true});
}
const onSelected = (reference) => (item) => {
    const {$query = {}, $pagination = {}} = reference.state;
    const {criteria = {}} = $query;
    criteria.group = item.key;
    {
        $pagination.current = 1;
        if ($query.pager) {
            $query.pager.page = 1;
        }
    }
    Ux.of(reference).in({
        $query, $condMenu: [item.key], // $loading: true,
        $pagination,
    }).loading().done()
    // reference.?etState({
    //     $query, $condMenu: [item.key], $loading: true,
    //     $pagination,
    // });
}
const onSearchChange = (reference) => (event) => {
    Ux.prevent(event);
    const $condText = event.target.value;
    Ux.of(reference).in({$condText}).done();
    // reference.?etState({$condText});
}
export default {
    onSearch,
    onSearchChange,
    onRefresh,
    onClean,
    onChecked,
    onSelected,
}
