import __Zn from '../zero.uca.dependency';

/**
 * 此处要更改算法
 * 1）追加一个新的源：source 作为第二参数放到事件中
 * 2）如果搜索，树会变化，那么已经选中的选项必须在树内计算，树外的选项保留
 * 3）如此会形成一个堆积的模式来执行整体效果
 *
 * 内置状态会追加一个状态变量保存上一次的结果 $keySelected = []
 * 计算流程如下：
 * 1）提取 $keySelected 中原始的选中数据
 * 2）从当前树中排除掉 $keySelected 中没有的数据，若当前树中操作时已经存在，可能是反选（点掉选项）
 * 3）将第二步排除（不计算的）的项和操作中选中的项合并
 */
export default (reference, source = []) => ($keySet = []) => {
    const {data = [], config = {}, value = []} = reference.props;
    /*
     * 旧问题，FIX: https://github.com/silentbalanceyh/hotel/issues/391
     * 先计算 items
     * 1）先计算不在当前的树中的：value - source = original
     * 2）再计算计算范围中的：$keySet
     * 3）合并：original + items
     * 新算法解决问题
     * FIX: https://e.gitee.com/wei-code/issues/table?issue=I7NLNB
     */
    const keyTree = source.map(item => item.key);
    const itemKeep = value.filter(item => !keyTree.includes(item.key));
    const itemOp = data.filter(item => $keySet.includes(item.key));
    const items = itemKeep.concat(itemOp);

    const {initialize = {}} = config;
    items.forEach(item => {
        const found = __Zn.elementUnique(value, 'key', item.key);
        if (found) {
            Object.assign(item, found);
        } else {
            Object.keys(initialize).forEach(from => {
                if (!item[from]) {
                    const to = initialize[from];
                    if (to.startsWith("NUMBER")) {
                        item[from] = __Zn.valueInt(to.split(":")[1], 0);
                    } else {
                        item[from] = item[to];
                    }
                }
            })
        }
    });
    __Zn.fn(reference).onChange(items);

}